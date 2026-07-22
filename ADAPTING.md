# Adapting a brownfield repo to this stack

Per-entry migration notes the core's stack-adaptation phase reads. Each note
answers one question: the target repo already has something in this spot - how
do we get from theirs to ours without breaking their build? The why behind
every pick is in [DECISIONS.md](DECISIONS.md); this file is only the how.

| Entry | The repo probably has | The move |
|---|---|---|
| `biome.json` | ESLint + Prettier | Two-step, never big-bang: install Biome alongside, port rule intents (`biome migrate eslint --write` gets most), run both until the diff stabilizes, then remove ESLint/Prettier in their own PR. Keep Prettier only if SCSS stays (Biome does not format SCSS - that is the pick's own escape hatch). |
| `pnpm-workspace.yaml` | npm or yarn, maybe no workspace | `pnpm import` converts the existing lockfile; workspaces map 1:1. The policy block (release-age cooldown, allowed build scripts) is the point of the entry - merge it even if the workspace globs differ. On npm/yarn WITHOUT migration appetite: record the exception; the cooldown has no npm/yarn equivalent, name that trade-off. |
| `tsconfig.base.json` | a looser tsconfig | Stage strictness: `strict` first, then `noUncheckedIndexedAccess` and friends one flag per PR - each flag surfaces real findings; a hundred errors at once teaches nothing. Extend, do not replace: their paths/aliases stay theirs. |
| `vitest.config.ts` | Jest, or tests mixed in one pile | Vitest reads most Jest suites as-is (`vitest run` first, fix the stragglers). The entry's real content is the tier split - unit vs integration as separate projects; introduce the naming convention (`*.test.ts` / `*.integration.test.ts`) before touching any test body. |
| `playwright.config.ts` | Cypress, or nothing | Nothing: start with the starter's two journeys (auth, home) adapted to their routes. Cypress: do not port wholesale - write the 3-5 journeys that matter in Playwright, retire Cypress when they cover the old suite's intent. |
| `docker-compose.test.yml` | mocks, or a shared dev database | The move is philosophical (DECISIONS: real dependencies, not mocks) - land it with the integration tier, non-default ports so it never collides with their dev stack. |
| `.github/workflows/*` | existing CI | Merge jobs into their workflow, never replace it: the hardened permissions block and the cooldown-respecting install are the substance; their job names and triggers stay theirs. |
| `.nvmrc` | none, or an older pin | Copy; if their runtime is older, the Node major bump is its own migration - route it through the modernize pass in the core's adoption guide, not through this phase. |
