// Integration: the documented SQLite -> Postgres swap actually works (DECISIONS.md #10,
// index.ts "PRODUCTION SWAPS THIS TO POSTGRES"). Runs against the docker-compose test
// stack (non-default port 55432) - `pnpm bootstrap:test-stack` first. This is the
// security path the testing axis calls non-negotiable at the integration tier
// (DECISIONS.md #9), and the worked example of what an integration test looks like on
// this paved road: real backing service, no mocks.

import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const pool = new Pool({
  connectionString: "postgres://test:test@127.0.0.1:55432/test",
  // Fail fast when the test-stack is not up - a hanging pool helps nobody.
  connectionTimeoutMillis: 3000,
});

// A dedicated instance on Postgres - exactly the swap index.ts documents: same
// options, `database` becomes a pg Pool.
const authPg = betterAuth({
  appName: "starter-integration",
  baseURL: "http://localhost:3000",
  secret: "integration-test-secret",
  database: pool,
  emailAndPassword: { enabled: true },
});

const email = `it-${Date.now()}@example.test`;
const password = "correct-horse-battery-staple";

beforeAll(async () => {
  const { runMigrations } = await getMigrations(authPg.options);
  await runMigrations(); // idempotent - same migrator `pnpm db:init` uses on SQLite
});

afterAll(async () => {
  await pool.end();
});

describe("Better Auth on Postgres (the production swap)", () => {
  it("migrates the schema and signs a user up", async () => {
    const res = await authPg.api.signUpEmail({
      body: { email, password, name: "Integration Test" },
    });
    expect(res.user.email).toBe(email);
    const { rows } = await pool.query('SELECT email FROM "user" WHERE email = $1', [email]);
    expect(rows).toHaveLength(1); // the user is really in Postgres, not in a mock
  });

  it("signs in and gets a DB-backed session", async () => {
    const res = await authPg.api.signInEmail({ body: { email, password } });
    expect(res.token).toBeTruthy();
    const { rows } = await pool.query(
      'SELECT s.token FROM "session" s JOIN "user" u ON s."userId" = u.id WHERE u.email = $1',
      [email],
    );
    expect(rows.length).toBeGreaterThan(0); // revocable: the session lives in the DB
  });
});
