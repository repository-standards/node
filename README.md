# repository-standards-node

Technology best practices for Node/TypeScript, riding on
[repository-standards](https://github.com/bodurkalukasz/repository-standards) -
the stack layer (Layer 2) of the standard, split out so technology picks can move
at technology speed while the methodology stays still.

One stack per technology, by policy: variation is a profile or an adoption mode
inside this repo, never a sibling repo. Compatibility is one line in
[`stack.json`](stack.json): `standards: ">=0.8 <1"`.

## What is here

| Path | What |
|---|---|
| [`DECISIONS.md`](DECISIONS.md) | the why per axis - pick, rationale, escape hatch; summary table first |
| [`starter/`](starter/) | the boot-verified monorepo: Next.js + Fastify through one proxy, Better Auth, tiered tests |
| [`stack.json`](stack.json) | the stack contract: technology, core-spec range, back-pointer to the registry |

## Greenfield

```
npx degit bodurkalukasz/repository-standards-node/starter my-app
cd my-app && pnpm install && pnpm dev
```

Sign-up -> dashboard works out of the box; `pnpm test:all` proves it. The align
router in the core repo offers this automatically when you pick Node.

## Brownfield

Adopt the picks, not the tree: read the summary table in `DECISIONS.md`, then copy
what you need from `starter/` - `biome.json`, `tsconfig.base.json`, the Vitest and
Playwright configs, the `pnpm-workspace.yaml` supply-chain policy,
`docker-compose.test.yml`, and the workflow templates in `starter/.github/`.
Adapt, never blind-copy - the same rule the core standard runs on.

## Staying current

This repo's own CI boots the starter weekly (`starter-boot.yml`) - "boot-verified"
is a pulse, not a plaque. Core moves, this repo chases: when the core spec range
in `stack.json` falls behind, that is this repo's bug, never the core's.
