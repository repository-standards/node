// Better Auth's HTTP surface (sign-up, sign-in, sign-out, get-session, ...) mounted as a
// Next route handler. Route handlers win over the /api/* rewrite (afterFiles), so
// /api/auth/* is served here while the rest of /api/* proxies to the Fastify service.

import { auth } from "@starter/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Built per request, not at module scope: reaching for auth.handler while this file is
// merely being imported is the build-time database open the auth package now avoids, and
// doing it here would put it straight back.
export const GET = (request: Request) => toNextJsHandler(auth.handler).GET(request);
export const POST = (request: Request) => toNextJsHandler(auth.handler).POST(request);
