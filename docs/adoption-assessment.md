# Adoption assessment - repository-standards/node

> Gate 2's artifact: what the eight-pass `repo-assessment` found, before the alignment wave
> changed anything (ADR-048). Updated in place on every re-entry, never recreated.
>
> Gate 0's record is [`adoption-intake.md`](adoption-intake.md); Gate 5's count is the
> alignment scope block in the backlog. This file is the middle one: the evidence the count
> is derived from, and the thing a human reads before saying go or no-go.

## Maturity per pass

One row per pass, and all eight are rated - a pass with no row is a pass nobody ran, which is
what `adoption-gates` fails on. `absent` / `partial` / `solid` only; if the honest answer is
"solid but for one thing", the row is `solid` and the thing is a finding below.

| # | Pass | Maturity | What that rests on |
| --- | --- | --- | --- |
| 1 | Skeleton & docs | solid | `AGENTS.md`, `DECISIONS.md` (17 numbered picks), `README.md`, `WHAT-THIS-IS.md`, `ADAPTING.md`, `SECURITY.md` (24 real lines, no unfilled placeholders) are all authored content, not templates |
| 2 | Decisions in code | partial | 17 numbered picks in `DECISIONS.md`, each with a rationale and an escape hatch, and zero left "undecided" or "reversed" in the text - but the summary table claims 18 while the numbered sections run to 17 (`SELF-6`), so the document that is supposed to be the spine of the decision record disagrees with itself about the count |
| 3 | Capabilities & specs | partial | four capability specs (`stack-decisions`, `reference-implementation`, `adoption-path`, `stack-contract`) coupled through `specs/capability-map.json`; `spec-guard --audit` now passes (184 files claimed or declared unclaimed) after this update added the four new Layer 1 files (`dashboard.yml`, `gitleaks.yml`, `standards-update-watch.yml`, `pull_request_template.md`) to `$unclaimed`, and after `stack-contract/spec.md` gained the `## Interface contracts` section `spec-structure` requires at the buildable tier and did not have until this pass |
| 4 | Quality gates | solid | three real test tiers in `starter/` - 4 unit `*.test.*` files, 1 `*.integration.test.*` file behind `docker-compose.test.yml`, and Playwright e2e (`playwright.config.ts`, `e2e/tests/{auth,home}.spec.ts`); Biome for lint/format, TypeScript `strict: true` in `tsconfig.base.json` |
| 5 | CI/CD | partial | five workflows fire on real triggers, not just exist: `spec-guard` on every PR, `gitleaks` on push and PR, `starter-boot` on a weekly cron (the heartbeat `DECISIONS.md` and `SELF-4` both reference), `dashboard` on push to main, `standards-update-watch` weekly. But `SELF-4` is a real, self-admitted gap: nothing says how long a red `starter-boot` is tolerated, who is told, or who acts - a delisting condition nobody can trigger |
| 6 | Security & supply chain | solid | `.gitleaks.toml` plus a `gitleaks` workflow scanning push and PR, `SECURITY.md` filled with a real reporting path, `starter/renovate.json` for dependency updates riding the 7-day cooldown `DECISIONS.md` pick 8 documents |
| 7 | Dependencies & stack | partial | `starter/package.json` carries no `^`/`~` ranges - exact pins, matching the pick's own stated policy; pnpm is the declared package manager (`DECISIONS.md` pick 1). Whether every pin is actually at latest is not measured here - that needs `pnpm outdated` against a real install, which this pass did not run |
| 8 | Drift & health | partial | measured, not estimated: `self-verify.mjs` on this branch reports `drift 4 - 96% adopted (88/92), 0 excepted` - all four unmet entries trace to `SELF-1` (the four consumer-shaped stack-manifest files), 1 guard (`stack-check-all`) not run here for a missing prerequisite (counted as neither drift nor adoption), and 2 authored files still flagged as template shells - `docs/backlog-archive.md` ships empty until a row first closes (ADR-051), and `docs/adoption-intake.md` records a Gate 0 intake this run never was |

## Top risks

The few things that would hurt, ordered. Not a repeat of the table - a table says where the
repo stands, this says what to be afraid of. Where a risk has nothing to do with the standard
and the standard merely made it visible, say so: that is the most credible thing an assessment
can report.

1. **A guard that can never pass teaches contributors to ignore red** (`SELF-1`). This
   repository is a stack's publisher, not its consumer, and four required file entries plus
   the `stack-check-all` guard describe a consumer's layout. There is no manifest
   configuration that reaches an honest drift 0 today. A permanently-red check that everyone
   already knows to skip is worse than no check, because it also hides a real regression
   sitting next to it.
2. **The declared profile may not match the repository's actual reach** (`SELF-8`). This
   repository is the published Node/TypeScript stack outside repositories are meant to adopt -
   arguably wide reach even though maintained solo (ADR-040 triggers `scale` on reach, not
   headcount) - and `standard.manifest.json` currently declares `core`. Nobody has yet checked
   whether the roughly nine additional entries `scale` would require are already satisfied or
   would surface as a wave of new drift.
3. **A weekly heartbeat with no defined consequence stops meaning anything** (`SELF-4`).
   `starter-boot.yml` runs and is real CI, but a red run this week and a red run for the next
   six months read identically to a reader, because nothing states the threshold or names who
   acts on it.

## Findings by owner role

The role that has to act, not the role that noticed. Every finding lands in exactly one group
and points at the backlog item that carries it, so the count in Gate 5 and this report cannot
disagree about what is outstanding.

### product

| Finding | Where it goes |
| --- | --- |
| No threshold or owner for a red weekly boot | `SELF-4` |
| No stated resting state for a deliberately partial adoption | `SELF-5` |
| Backlog row attribution style was defaulted, not confirmed | `SELF-9` |

### architect

| Finding | Where it goes |
| --- | --- |
| Stack repository cannot satisfy its own stack manifest by construction | `SELF-1` |
| Declared profile (`core`) may not match this repository's actual reach | `SELF-8` |
| Stack manifest is read only inside a branch already guarded by the core manifest's presence | `SELF-2` |
| `stack-contract/spec.md`'s Scope and Acceptance criteria carried forward unconfirmed by a human this run | `SELF-10` |

### dev

| Finding | Where it goes |
| --- | --- |
| This stack's own prerequisites (pnpm install, network) are not named where the core's generic prerequisites page is | `SELF-3` |
| `WHAT-THIS-IS.md`'s pick count (18) disagrees with `DECISIONS.md`'s numbered sections (17) | `SELF-6` |

### agent (mechanical, no human judgment needed)

None outstanding - the two mechanical gaps this pass found (`specs/capability-map.json`
missing four new Layer 1 files, `stack-contract/spec.md` missing a required section) were
fixed in the same change that found them; see below.

## Closed by the alignment wave itself

- Landed the mechanical half of the delta from core's tree at `cef91d6` (recorded as `1.0.13`
  under the old numbering) through `1.0.6`: renamed skills, the elicitation layer, the
  dashboard generator, the backlog archive, `.claude/settings.json` wiring this repository's
  own hooks in for the first time.
- `SELF-7` - the `stack-check-all` guard now declares its `requires` prerequisites, so a
  missing toolchain reads as not-run rather than as the same drift a real lint failure would.
- `specs/capability-map.json` claimed the four new Layer 1 files this update added
  (`dashboard.yml`, `gitleaks.yml`, `standards-update-watch.yml`, `pull_request_template.md`)
  under `$unclaimed`; `spec-guard --audit` was red until this.
- `specs/stack-contract/spec.md` gained the `## Interface contracts` section the buildable
  tier requires; `spec-structure` was red until this.
- `SPEC.md` was a stale `copy` entry - still R1-R25, missing the R26/R27 rules and the
  private-mirror embargo language core shipped since. Content-hash drift on a `copy` entry is
  not a judgment call; it was replaced with core's current copy in the same change that found
  it.
- Filled `docs/adoption-provenance.md`'s six points this update's own writes reached
  (`adopt.tracker`, `adopt.intent`, `adopt.backlog`, `green.stack`, `spec.scope`,
  `spec.acceptance`); `elicitation-provenance` was red until this.
