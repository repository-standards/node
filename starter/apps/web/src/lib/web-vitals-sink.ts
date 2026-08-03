// Where measured Web Vitals go - the ONE swappable adapter (DECISIONS.md #9, "Pick
// (RUM)"). The `web-vitals` library is the fixed measurement primitive; this sink is the
// vendor you can replace without touching the measurement wiring.
//
// Shipped default: a keepalive beacon to /api/vitals - vendor-neutral, ~$0, works with any
// backend once you point that route handler at a store (Prometheus histogram, Loki, ...).
//
// To change vendor, replace the body of `reportWebVital` with one of:
//   - Sentry (recommended low-ops if you already run it for errors): init @sentry/nextjs
//     with browserTracing in instrumentation-client.ts and let its SDK auto-capture these
//     same vitals - then you can drop the web-vitals wiring entirely. Mind the per-span
//     cost caveat in DECISIONS.md #9; keep tracesSampleRate ~0.1.
//   - Grafana Faro self-hosted: initializeFaro(...) reporting into Alloy -> Loki/Tempo.
//   - Keep the beacon and aggregate server-side at p75/p95, segmented by route/device.

import type { Metric } from "web-vitals";

export function reportWebVital(metric: Metric): void {
  // Only anonymous timing data + the route template. Never send query strings or PII.
  const body = JSON.stringify({
    name: metric.name, // LCP | INP | CLS | FCP | TTFB
    value: metric.value,
    rating: metric.rating, // good | needs-improvement | poor
    id: metric.id,
    navigationType: metric.navigationType,
    path: location.pathname,
  });

  // sendBeacon survives page unload (when INP/CLS finalise); fall back to keepalive fetch.
  if (navigator.sendBeacon?.("/api/vitals", body)) return;
  void fetch("/api/vitals", { method: "POST", body, keepalive: true });
}
