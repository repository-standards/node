#!/usr/bin/env node
// check-pnpm-workspace-policy - the supply-chain policy block in pnpm-workspace.yaml
// (DECISIONS#8) is the point of that manifest entry, not the workspace globs around it.
// stack.manifest.json's "files" entry for pnpm-workspace.yaml only asserts the path
// exists - a merge-class file check has no content awareness, so deleting the entire
// policy block (minimumReleaseAge/saveExact/enablePrePostScripts, all becoming
// undefined) still reports compliant.
//
// This guard reads the three keys directly instead of shelling out to pnpm: no pnpm on
// PATH, no install, no network - it runs the same on a repo that has never seen
// `pnpm install`. It is deliberately not a YAML parser: these three keys are always
// top-level scalars in the reference copy, so a line-anchored read covers them without
// a dependency.
//
// Usage: node scripts/check-pnpm-workspace-policy.mjs [path]   # default pnpm-workspace.yaml
//
// No dependencies (Node built-ins only). Place at scripts/check-pnpm-workspace-policy.mjs.

import { existsSync, readFileSync } from "node:fs";

const path = process.argv[2] || "pnpm-workspace.yaml";

if (!existsSync(path)) {
  console.error(`check-pnpm-workspace-policy: ${path} not found`);
  process.exit(1);
}

const body = readFileSync(path, "utf8");

// Top-level only ("^key:") on purpose - these three keys are never nested, and
// anchoring at column 0 keeps a commented-out example ("# saveExact: true") from
// counting as present.
const readKey = (name) => {
  const m = body.match(new RegExp(`^${name}:\\s*(.+?)\\s*(#.*)?$`, "m"));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, "") : undefined;
};

const failures = [];
const require = (name, value, ok, why) => {
  if (!ok) failures.push(`${name}: ${value === undefined ? "missing" : `"${value}"`} - ${why}`);
};

const enablePrePostScripts = readKey("enablePrePostScripts");
require(
  "enablePrePostScripts",
  enablePrePostScripts,
  enablePrePostScripts === "false",
  'must be exactly "false" (DECISIONS#8 - no unreviewed lifecycle script runs on install)',
);

const saveExact = readKey("saveExact");
require(
  "saveExact",
  saveExact,
  saveExact === "true",
  'must be exactly "true" (DECISIONS#8 - no ^/~ ranges added by pnpm on install)',
);

const minimumReleaseAge = readKey("minimumReleaseAge");
const ageMinutes = Number(minimumReleaseAge);
require(
  "minimumReleaseAge",
  minimumReleaseAge,
  minimumReleaseAge !== undefined && Number.isFinite(ageMinutes) && ageMinutes >= 10080,
  "must be a number >= 10080 minutes / 7 days (DECISIONS#8 - a floor against fresh-release supply-chain attacks, never lowered globally)",
);

if (failures.length) {
  console.error(`check-pnpm-workspace-policy: FAIL - the supply-chain policy block in ${path} is missing or weakened\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`check-pnpm-workspace-policy: OK - ${path} carries the supply-chain policy (DECISIONS#8)`);
