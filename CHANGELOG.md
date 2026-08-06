# Changelog

Notable changes to this stack. Semver: MAJOR = a pick removed or reversed, MINOR = a new pick
or a new shipped entry, PATCH = fixes and clarifications.

This file starts at the alignment to Layer 1. Everything before it is in the git history: the
repository shipped nine versions, 0.1.0 through 0.3.1, with no changelog at any of them, and
then took five more commits without a bump. Reconstructing those headings now would be a
guess dressed as a record - the unversioned range is `be3eae3..5afd40d`, 25 commits, and
splitting them across nine headings after the fact is exactly the fabrication this file
exists to make unnecessary.

## Unreleased

### The stack layer became an adopter of the standard it belongs to (2026-08-06)

This repository carried a `stack.manifest.json` and nothing else the core standard asks for.
The core's own decision on satellite stacks names this repository as the standard's first
genuinely aligned adopter once it pins a version, and until now it had not.

It now carries the pin, the manifest copy, the shipped guards and skills, an agent entry
point, a persona roster, four capability specs with the map that couples them to what they
describe, a work ledger and a decision log.

Three numbers, all measured rather than estimated. Against the verifier's built-in skeleton -
the fallback for a repository with no manifest - this repository read `drift 5 - 0% adopted
(0/5)`, and the verifier said in the same breath that the number is not the real distance.
With the manifest in place the real number was `drift 18 - 71% adopted (44/62)`: more than
three times the skeleton's count, which is the point of the warning the skeleton prints. It
now reads `drift 5 - 92% adopted (55/60)`, and every one of those five is a Layer 2 entry
described below. Not one core entry is unmet.

**What this alignment cannot reach, and why that is written down rather than worked around.**
Four of the remaining entries and one guard belong to this repository's own stack manifest,
and they describe a repository that *consumes* this stack - `biome.json`,
`tsconfig.base.json`, `pnpm-workspace.yaml` and `vitest.config.ts` at the repository root.
This repository *publishes* the stack and ships those files inside `starter/`, which is where
they belong. The `stack-check-all` guard runs `pnpm check:all` at a root that has no
`package.json` and fails with `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`. The manifest schema has
no word for publisher versus consumer, and a guard cannot be waived by a manifest exception
by design - so there is no configuration of the shipped mechanism under which this repository
reaches an honest drift 0. The four options are in [`backlog.md`](backlog.md) and none was
chosen here; picking one silently would be the kind of quiet redefinition the standard exists
to prevent.

A second finding fell out of the same run: the verifier merges a stack manifest only when a
core manifest is already present. Before this change, this repository's twelve stack file
entries and its guard were read by nothing at all, while the published claim is one drift
number across both layers.
