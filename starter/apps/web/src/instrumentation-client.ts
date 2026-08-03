// Runs on client startup (Next.js instrumentation-client). Real User Monitoring of Web
// Vitals: measure with the `web-vitals` primitive and hand each metric to the swappable
// sink. The attribution build carries the cause of a bad metric (the LCP element, the INP
// interaction target, the shifting node) so a regression is diagnosable and fixable against
// web.dev's living guidance - not a frozen checklist. See DECISIONS.md #9, "Pick (RUM)".

import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals/attribution";
import { reportWebVital } from "@/lib/web-vitals-sink";

onCLS(reportWebVital);
onINP(reportWebVital);
onLCP(reportWebVital);
onFCP(reportWebVital);
onTTFB(reportWebVital);
