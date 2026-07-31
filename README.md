# repository-standards-node

> Part of the repository-standards ecosystem:
> [the standard](https://github.com/bodurkalukasz/repository-standards) is the
> engine, this repo is the Node map pack. How it fits:
> [docs/ecosystem.md](https://github.com/bodurkalukasz/repository-standards/blob/main/docs/ecosystem.md).

Technology best practices for Node/TypeScript, riding on
[repository-standards](https://github.com/bodurkalukasz/repository-standards) -
the stack layer (Layer 2) of the standard, split out so technology picks can move
at technology speed while the methodology stays still.

One stack per technology, by policy: variation is a profile or an adoption mode
inside this repo, never a sibling repo. The linkage to the core is one pointer in
[`stack.manifest.json`](stack.manifest.json) (the registry back-pointer + technology) -
never a version range or requirement: the standard is living and always latest.
It is the same manifest schema the core engine reads, so a brownfield repo is walked
to this stack the way it is walked to the core: entry by entry, waves, one drift number.

## What is here

| Path | What |
|---|---|
| [`DECISIONS.md`](DECISIONS.md) | the why per axis - pick, rationale, escape hatch; summary table first |
| [`starter/`](starter/) | the boot-verified monorepo: Next.js + Fastify through one proxy, Better Auth, tiered tests |
| [`stack.manifest.json`](stack.manifest.json) | the stack contract AND manifest: technology, registry back-pointer, and the file-by-file entries the align engine reads |
| [`ADAPTING.md`](ADAPTING.md) | per-entry migration notes for brownfield repos - from theirs to ours without breaking the build |

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
is a pulse, not a plaque. The link to the core is a pointer, not a version lock
(core ADR-022): this repo depends on the core's manifest contract, which changes
rarely and deliberately - when the core breaks it, chasing that is this repo's
bug, never the core's.
