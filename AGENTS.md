# AGENTS.md

The single entry point for an agent working in this repository. Read this first; it points at
everything else rather than repeating it.

## Altitude

This is the **stack layer** of Repository Standards - the Node and TypeScript picks and a
reference implementation that a CI run boots. It is decisions and files. Nothing here has a
version another project resolves, and nothing here decides method: how work is specified,
recorded and verified is Layer 1's business, adopted here by reference.

Two audiences, and they want opposite things. A reader is comparing these picks against their
own and will adopt nothing if the reasoning is missing. An adopting repository wants the
ordered path from what it has to what this ships. Writing for one at the other's expense is
the failure mode.

| Where | What lives there |
|---|---|
| [`DECISIONS.md`](DECISIONS.md) | the picks - each with what it was chosen against and its escape hatch |
| [`starter/`](starter) | the boot-verified application: Next.js and Fastify behind one proxy, three test tiers |
| [`ADAPTING.md`](ADAPTING.md) | per-entry path for a repository that already exists |
| [`stack.manifest.json`](stack.manifest.json) | the stack contract the align engine reads |
| [`specs/`](specs) | what each capability of *this repository* is for, and what must stay true |
| [`docs/decision-records/`](docs/decision-records) | decisions about this repository, as opposed to picks about Node |
| [`backlog.md`](backlog.md) | the work ledger - open items with their evidence |

The distinction that trips people: `DECISIONS.md` holds **technology picks this stack
publishes**; `docs/decision-records/` holds **decisions about how this repository itself
works**. A change to Fastify's role goes in the first. A change to how this repository
verifies itself goes in the second.

## The loop runs itself (unprompted)

Do not wait to be told to keep the record straight. When work here changes something a
document asserts, the document changes in the same change:

- A pick changes in `DECISIONS.md` and the thing in `starter/` that embodies it disagrees -
  both move together, or the argument stops being evidence.
- A capability's files change and its spec in `specs/` no longer describes them - update the
  spec in the same change. The coupling guard enforces this and it is not a formality.
- Something learned that the next reader would need and no document holds - write it down
  where it belongs before closing the work, not in a summary that disappears.
- A decision made in passing that a future reader would otherwise have to re-derive from the
  files - record it, with what it was chosen against.

The reference implementation has a heartbeat. A red weekly boot is a claim this repository
can no longer make, not a flaky run to retry.

## Volunteer, don't wait to be asked

Finish the whole task rather than the part that was named. If a change leaves something
adjacent broken, stale or newly wrong, say so - and fix it when it is in scope, or write it
into `backlog.md` with the evidence when it is not. A finding recorded with its reproduction
is worth more than a finding mentioned once in conversation.

Two specific habits this repository depends on:

- **Report the number you measured, not the number you expected.** Drift, boot status and
  coverage are claims this repository makes in public. A guess that happens to be right is
  indistinguishable from one that is wrong.
- **Say when something did not reproduce.** A defect that turns out not to exist is a real
  result and belongs in the record as one, rather than being quietly fixed anyway.

## Say where you are, every minute or two

Long work is silent by default: a run of tool calls, a subagent working in the background,
and nothing in the chat until it is finished. From the outside that is indistinguishable
from a hung session, and the only move left to the human is to interrupt the work that was
going fine.

So while work is running, post **one or two sentences every 60-120 seconds**: what you are
doing now, and what you are waiting on. Not a recap, not the plan again, not a menu of
options.

- **Waiting is an update.** Say what you are waiting on and for how long. "Still running,
  about 8 minutes" is a complete answer.
- **Never invent progress, and never report a result that has not come back.** Do not
  present a subagent's findings before the subagent has returned them, and do not guess what
  it will find. Silence is bad; fabricated progress is worse.
- **A countable total earns a measured percentage** (`N/M`); an open-ended one earns a
  labelled estimate (`~Z% (estimate)`), never a bare number dressed up as measured.
- **It does not replace the answer, and it is not a ceremony.** Work that takes thirty
  seconds has nothing to report - do not pad it.

## Conventions

Adopted from the core standard by reference, resolved at `main`:
<https://github.com/repository-standards/core/blob/main/docs/conventions.md>

The two that most often catch people here: a pull request writes under `## Unreleased` in
`CHANGELOG.md` and never bumps a version, and every pull request is based on the mainline.
