# Adapting a brownfield repo to this stack

## Start it

You do not walk this table yourself. Say it to your coding agent:

```
> take this repo onto repositorystandards.com with the node stack
```

It measures the repository first - what is here, what technology, how much you want done -
and comes back with a plan naming who has to act on each item. Nothing is touched before
you have seen it.

Want the plan without the work?

```
> score this repo against repositorystandards.com with the node stack - count the work, do not do it
```

## What the agent is reading

This table. Each note answers one question: the repository already has something in this
spot - how do we get from theirs to ours without breaking the build? The reasoning behind
every pick is in [the decisions](DECISIONS.md); this file is only the how, per entry, and
it is here for you as much as for the agent - a plan you cannot check is a plan you have to
take on trust.

Two things worth knowing before you read it. **Nothing here is all-or-nothing**: an entry
that does not fit gets an exception recorded rather than forced, and the drift number counts
what you took, not what you skipped. And the order matters more than the speed - every note
is written as a move that leaves the build green, because a migration that goes red in the
middle is a migration that gets reverted.

| Entry | The repo probably has | The move |
|---|---|---|
| `biome.json` | ESLint + Prettier | Two-step, never big-bang: install Biome alongside, port rule intents (`biome migrate eslint --write` gets most), run both until the diff stabilizes, then remove ESLint/Prettier in their own PR. Keep Prettier only if SCSS stays (Biome does not format SCSS - that is the pick's own escape hatch). |
| `pnpm-workspace.yaml` | npm or yarn, maybe no workspace | `pnpm import` converts the existing lockfile; workspaces map 1:1. The policy block (release-age cooldown, allowed build scripts) is the point of the entry - merge it even if the workspace globs differ. On npm/yarn WITHOUT migration appetite: record the exception; the cooldown has no npm/yarn equivalent, name that trade-off. |
| `tsconfig.base.json` | a looser tsconfig | Stage strictness: `strict` first, then `noUncheckedIndexedAccess` and friends one flag per PR - each flag surfaces real findings; a hundred errors at once teaches nothing. Extend, do not replace: their paths/aliases stay theirs. |
| `vitest.config.ts` | Jest, or tests mixed in one pile | Vitest reads most Jest suites as-is (`vitest run` first, fix the stragglers). The entry's real content is the tier split - unit vs integration as separate projects; introduce the naming convention (`*.test.ts` / `*.integration.test.ts`) before touching any test body. |
| `playwright.config.ts` | Cypress, or nothing | Nothing: start with the starter's two journeys (auth, home) adapted to their routes. Cypress: do not port wholesale - write the 3-5 journeys that matter in Playwright, retire Cypress when they cover the old suite's intent. |
| `docker-compose.test.yml` | mocks, or a shared dev database | The move is philosophical (DECISIONS: real dependencies, not mocks) - land it with the integration tier, non-default ports so it never collides with their dev stack. |
| `perf/` + `scripts/perf-budget.sh` | nothing, or another perf tool | Run it once against the built app before changing a number: the first run writes the baseline, and a baseline nobody argued about is worth more than a target somebody guessed. It is deliberately not a CI gate - a budget that blocks a merge on day one gets disabled by the end of the week. Adapt the script's seed/build/start hooks to their stack, keep the committed history so a regression is a diff rather than an opinion. If a perf tool already exists, keep one, not both. |
| `.github/workflows/*` | existing CI | Merge jobs into their workflow, never replace it: the hardened permissions block and the cooldown-respecting install are the substance; their job names and triggers stay theirs. |
| `renovate.json` | Dependabot, or nothing | Keep Dependabot if the org already lives in it - the substance is the 7-day cooldown and the grouped minor/patch, both expressible there. On nothing: start with the grouping only, add the cooldown once somebody has seen a week of PRs; turning both on at once produces a wall nobody triages. |
| `.github/workflows/ci.yml` | an existing pipeline | Merge jobs into theirs, never replace it. The substance is the hardened permissions block and the cooldown-respecting install; their job names, triggers and matrix stay theirs. A replaced pipeline is a pipeline the team stops recognising, and they will fork it back within a month. |
| `.github/workflows/e2e.yml` | nothing, or e2e mixed into the main pipeline | Land it as its own workflow even if their e2e currently rides the fast gate: this tier boots a Docker stack and the app, so mixing it in makes every commit pay for a check most commits do not need. It is the one you gate a release on. |
| `.nvmrc` | none, or an older pin | Copy; if their runtime is older, the Node major bump is its own migration - route it through the modernize pass in the core's adoption guide, not through this phase. |

## The app shell - picks, not table rows

The manifest's config entries migrate via the table above. The app-shell picks
(DECISIONS #10 - auth, proxy, styling) and the deferred forks (#15, #16) are
architecture moves, not config merges: an existing auth system, Express/Koa API or
Tailwind setup is not "drifted config", it is a standing decision. Record the repo's
own superseding ADR (the core standard's deviation mechanism) or plan a real migration
with its own ADR. The three hard cases:

**Existing auth vs Better Auth.** Migrating means a session-store migration, a
password-hash migration and a cutover window - none of it incidental. The superseding
ADR is usually the honest first move: record why the incumbent stays, revisit when the
product forces it.

**Existing Express/Koa vs Fastify.** The shape transfers even when the framework
stays - plugins/hooks and the default-deny session gate map onto their middleware
chain. Adopt the boundary pattern (one error contract, default-deny, config validated
at boot), defer the rewrite.

**Existing styling vs CSS Modules + tokens.** Tokens first - they are stack-agnostic
and pay off regardless of the component layer; the component migration to CSS Modules
follows the repo's own tempo.
