// Better Auth - product auth for the starter (DECISIONS.md #10). One instance, one
// config, imported by BOTH the Next.js proxy gate and the Fastify service, so the same
// session cookie is validated at both gates against the same database.
//
// Sessions are DB-BACKED and revocable (Better Auth's default: every getSession() hits
// the database - no cookie cache, no JWT-blind gate). Short-lived with silent refresh:
// `updateAge` rolls the expiry on activity, `expiresIn` is the cap.
//
// Storage: SQLite via node:sqlite for a zero-infra `pnpm i && pnpm dev` boot - no
// native build step, no Docker required. PRODUCTION SWAPS THIS TO POSTGRES: pass a
// `pg` Pool as `database` (the docker-compose.test.yml test-stack at the repo root is
// the local Postgres to develop that against) and set BETTER_AUTH_SECRET.

import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { betterAuth } from "better-auth";

// Opened on FIRST USE, not on import. A module that opens a database as a side effect
// opens it for anyone who so much as imports it - a test, a script, and in particular a
// production build, where Next imports every route to collect its metadata and turbo runs
// two package builds at once. That is how two processes ended up racing to switch the same
// file to WAL, and no pragma ordering fixes a database that should never have been opened.
// Taken from open() rather than from betterAuth: the factory's own return type is the
// generic one, and the instance is the concrete configuration - assignable in neither
// direction, which is TypeScript being right about them not being the same thing.
type AuthInstance = ReturnType<typeof open>;
let instance: AuthInstance | undefined;

function open() {
  // Every workspace package sits two levels below the repo root, so the default resolves
  // to <repo root>/data/starter.db no matter which app opened it. Override with
  // AUTH_DB_PATH when running from anywhere else (or in a container).
  const dbFile = process.env.AUTH_DB_PATH ?? path.resolve(process.cwd(), "../../data/starter.db");
  mkdirSync(path.dirname(dbFile), { recursive: true });

  const database = new DatabaseSync(dbFile);
  // The web app and the API service open this file concurrently, so both pragmas matter -
  // and the ORDER matters: switching to WAL takes an exclusive lock, so busy_timeout has to
  // already be in force or that one statement is the one with nothing to wait on.
  database.exec("PRAGMA busy_timeout = 5000;");
  database.exec("PRAGMA journal_mode = WAL;");

  return betterAuth({
    appName: "starter",
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    // Dev-only fallback so the starter boots with zero setup. Set BETTER_AUTH_SECRET in
    // every deployed environment - session cookies are signed with it.
    secret: process.env.BETTER_AUTH_SECRET ?? "starter-dev-only-secret-do-not-deploy-me",
    trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
    database,
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // absolute cap: 7 days
      updateAge: 60 * 60 * 24, // silent server-side refresh once a day of activity
    },
  });
}

// Reads like the instance it stands in for, so nothing downstream changes shape.
export const auth = new Proxy({} as AuthInstance, {
  get(_target, prop) {
    // Bound through the instance, not the proxy: a getter reaching for `this` must find
    // the real object, or it reads properties off an empty target.
    if (!instance) instance = open();
    return Reflect.get(instance, prop, instance);
  },
});

// The one session shape both gates share.
export type Session = typeof auth.$Infer.Session;
