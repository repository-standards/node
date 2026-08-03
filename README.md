# repository-standards-node

> Part of the repository-standards ecosystem:
> [the standard](https://github.com/repository-standards/core) is the
> engine, this repo is the Node map pack. How it fits:
> [how it fits together](https://repositorystandards.com/docs/ecosystem.html).

Technology best practices for Node/TypeScript, riding on
[repository-standards](https://github.com/repository-standards/core) -
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

## Getting it

Both routes are one sentence to your coding agent, and both go through the standard -
this layer is picks and reference files, not a thing you install.

**A new project:**

```
start a new project on repositorystandards.com with the node stack
```

**A repository you already run:**

```
take this repo onto repositorystandards.com with the node stack
```

The agent reads the standard, works out which of these picks apply to what you are
building, asks you what it cannot work out for itself, and adapts. That last word is the
point: [`ADAPTING.md`](ADAPTING.md) exists because a repository with ESLint, Jest and no
workspace does not want a folder dropped on it - it wants a path, per entry, that does not
break the build on the way.

**Reading it without an agent** is a fair thing to want, and `starter/` is a real
application you can run:

```
npx degit repository-standards/node/starter my-app
cd my-app && pnpm install && pnpm dev
```

Sign-up to dashboard works with no setup, and `pnpm test:all` proves it. But treat that as
reading, not adopting: copying a tree is how a repository ends up carrying decisions nobody
made for it - which is the failure the standard exists to prevent, and it does not stop
being one here.

## Staying current

This repo's own CI boots the starter weekly (`starter-boot.yml`) - "boot-verified"
is a pulse, not a plaque. The link to the core is a pointer, not a version lock
(core ADR-022): this repo depends on the core's manifest contract, which changes
rarely and deliberately - when the core breaks it, chasing that is this repo's
bug, never the core's.
