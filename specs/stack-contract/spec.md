# Stack contract

**Spec tier:** buildable
**Serves:** `Adoption agent`, `Stack maintainer`
**Success metric:** an adopting repository's drift number counts this layer's entries in the
same total as the core's, with no second compliance story to run.
**Status:** in-refinement

## Purpose

Publish this stack in the one machine-readable form the core's align and verify machinery
already reads, so that adopting a technology layer costs no new engine, no new vocabulary and
no second drift number.

## Scope

[`stack.manifest.json`](../../stack.manifest.json) - the technology name, the registry
back-pointer, and the file and guard entries the engine classifies a repository against.
[`SHIPPED.md`](../../SHIPPED.md) - what those entries mean for a repository that adopts them,
and what each check actually needs to run.

## Out of scope

- **The registry itself.** `stacks.json` lives in the core repository and is what makes a
  stack official; this repository points at it and cannot list itself.
- **A compatibility range.** The link to the core is a pointer, never a version range - the
  standard is living and latest is the only target.

## Core concepts

- **Same schema, second file** - the stack manifest uses the core manifest's schema plus
  `technology`. The engine reads both files and merges them, which is why there is one drift
  number rather than two reports.
- **`requiredKeys`** - what a `merge`-class entry must still contain after an adopter merges
  it into their own file. Presence is worthless for an entry whose whole point is a block
  inside a file the adopter also edits.
- **The guard** - a live command whose verdict is part of the drift number, as distinct from a
  declarative entry describing layout.

## Data contracts

`stack.manifest.json`, top level:

| Key | Type | Meaning |
|---|---|---|
| `technology` | string | the single technology this stack covers; one stack per technology is policy |
| `version` | string | this stack's own version, independent of the core's |
| `registry` | string | back-pointer to the core's `stacks.json`, which is what confers official status |
| `files` | array | entries in the core manifest's file-entry schema (`path`, `adapt`, `required`, `purpose`, and `requiredKeys` where the entry is a merge) |
| `guards` | array | entries in the core manifest's guard schema (`id`, `run`) |

## Rules

- A `merge`-class entry whose point is a policy block declares `requiredKeys` naming the keys
  that must survive the merge. Without them the entry checks that a file exists, which for a
  merged file is close to no check at all.
- A guard's failure is drift. It cannot be waived by a manifest exception - waiving a live
  check removes it rather than recording a deviation from it.
- The manifest carries no version range against the core.

## Acceptance criteria

- Given an adopting repository carrying both manifests, when the verifier runs, then it
  reports one drift number covering both layers and names the technology layer explicitly.
- Given a repository that merged `pnpm-workspace.yaml` but dropped the supply-chain policy
  block, when the verifier runs, then the entry fails on its `requiredKeys` rather than
  passing on the file's existence.
- Given a manifest exception targeting a guard, when the verifier runs, then the exception is
  rejected as drift rather than silently honoured.

## Open questions

- **This repository cannot satisfy its own stack manifest, and that is not yet decided
  either way.** The entries describe a repository that *consumes* the stack - `biome.json`,
  `tsconfig.base.json`, `pnpm-workspace.yaml` and `vitest.config.ts` at the repository root -
  while this repository *publishes* it and ships those files inside
  [`starter/`](../../starter). Measured: with both manifests present, the four entries fail
  and the `stack-check-all` guard fails with `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`, because
  the guard runs `pnpm check:all` at a root that has no `package.json`. The manifest schema
  has no notion of publisher versus consumer, and the guard cannot be excepted by design. The
  options are recorded in the backlog rather than guessed at here.
