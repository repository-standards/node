// Sink endpoint for Web Vitals beacons (see lib/web-vitals-sink.ts). Public + unauthenticated
// on purpose - metrics fire for logged-out visitors too (it is allow-listed in lib/routes.ts).
//
// Default: accept and drop. Replace with a write to your store - a Prometheus histogram
// labelled { name, rating, path } (read p75 via histogram_quantile), or Loki for raw
// per-event detail - then aggregate at p75/p95, segmented by route/device (DECISIONS.md #9).
//
// Adopter TODO before production: rate-limit and validate this endpoint - it is an open,
// unauthenticated POST, so treat the body as untrusted and never let it amplify work.

export async function POST(request: Request): Promise<Response> {
  // Drain and parse the beacon (swallow malformed); wire your store in place of this line.
  await request.json().catch(() => null);
  // 204: nothing to return, and the beacon does not read the response.
  return new Response(null, { status: 204 });
}
