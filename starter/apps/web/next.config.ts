// Next.js App Router config - typed, standalone output for lean container images, and
// security headers on by default (see ../../DECISIONS.md #7). Never set
// typescript.ignoreBuildErrors.

import path from "node:path";
import type { NextConfig } from "next";

// Where the Fastify service listens. In dev and single-origin deploys the web app is
// the only public origin - the browser talks to :3000 and Next proxies /api/* through.
const API_ORIGIN = process.env.API_ORIGIN ?? "http://127.0.0.1:4000";

// CSP ships REPORT-ONLY: it observes without ever breaking the app, and the report
// is your worklist for enforcement. Enforcing needs per-request nonces plumbed
// through the proxy (proxy.ts runs per request on the Node runtime - generate a
// nonce there, set the enforced CSP header, and Next picks the nonce up for its own
// inline scripts). 'unsafe-inline' below covers Next's style handling until then.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // @starter/auth ships TypeScript source (monorepo-internal package) - Next transpiles it.
  transpilePackages: ["@starter/auth"],
  // This app is the workspace member of a monorepo - anchor Turbopack at the repo root
  // (two levels up) so it does not infer one from a lockfile further up the tree.
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  // Dev-only: Next blocks its dev resources (HMR, hydration assets) for origins other
  // than localhost. The e2e suite drives the app via 127.0.0.1, so allow it; without
  // this the page never hydrates there and forms fall back to native GET submits.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    // App-to-API wiring (DECISIONS.md #10): /api/* proxies to the Fastify service -
    // EXCEPT the /api/auth segment, which Better Auth's catch-all route handler serves
    // in this app. The exclusion must live in the source pattern: a [...all] handler is
    // a DYNAMIC route, and afterFiles rewrites are matched before dynamic routes, so a
    // plain /api/:path* rewrite would swallow /api/auth/* too.
    return [
      {
        source: "/api/:path((?!auth(?:/|$)).*)",
        destination: `${API_ORIGIN}/api/:path`,
      },
    ];
  },
};

export default nextConfig;
