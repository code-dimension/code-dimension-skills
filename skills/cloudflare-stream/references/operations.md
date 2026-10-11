# Webhooks, analytics, costs, limits, and operations

## VOD processing webhooks

Stream sends a VOD webhook after processing completes successfully or fails. Only one VOD webhook subscription is allowed per account, so route it centrally rather than letting each application replace the account subscription. Live connection webhooks use a separate feature.

Verify `Webhook-Signature` before parsing business fields:

1. Parse `time` and `sig1`.
2. Reject timestamps outside a small documented tolerance to reduce replay risk.
3. Build `time + "." + rawRequestBody`, preserving every raw byte and newline.
4. Calculate HMAC-SHA256 with the webhook secret and hex-encode it.
5. Compare signatures in constant time.
6. Deduplicate the resulting transition and acknowledge quickly; move slow side effects to the existing job mechanism.

Do not accept an already JSON-parsed/re-serialized body for verification. A public HTTP(S) endpoint is required; localhost/private addresses are not accepted. Store the signing secret in the existing secret manager and support rotation.

## Analytics

Stream provides server-side analytics in the dashboard and GraphQL Analytics API for content, geography, time, and creator trends; callers need the Analytics permission. Live viewer counts have their own endpoint.

Use Stream analytics for delivery truth and broad consumption. Use application/client telemetry for entitlements, lesson completion, player errors, startup time, buffering/QoE, conversion, and user journeys. Document metric definitions and time windows before comparing systems.

## Pricing model

Pricing was verified on 2026-09-25 and is changeable; recheck [official pricing](https://developers.cloudflare.com/stream/pricing/) before estimates or commitments.

- Storage: prepaid capacity, currently USD 5/month per 1,000 stored video minutes.
- Delivery: currently USD 1 per 1,000 delivered minutes.
- Ingress and encoding are included; Stream delivery pricing includes bandwidth/egress.
- Storage is based on duration, rounded to the second, not file size or generated rendition count.
- Delivery counts requested video segments, MP4 portions, and supported live/simulcast delivery. Browser/client buffering and preload can be billable; client-cached content is not delivered again.
- Direct Creator/`tus` grants reserve their `maxDurationSeconds` until upload completion or expiry.
- Failed/unplayable and deleted videos do not consume stored minutes. Live recordings do; a live broadcast without viewers has no delivered minutes but its recording consumes storage.
- Running out of purchased storage blocks new uploads/live streams for standard accounts.

Estimate separately: stored library minutes, monthly viewer minutes, preload behavior, downloads, live recordings, simulcast, growth, and retention. Add alerts and dashboards around both capacity and delivered usage.

## Current default limits

Revalidate account/plan-specific values in the [FAQ](https://developers.cloudflare.com/stream/faq/) and API docs:

- 30 GB maximum uploaded file size.
- 120 videos simultaneously queued/encoding by default.
- Purchased minute capacity gates uploads.
- Exceeding limits can return `413` or `429`.

Do not copy generic Cloudflare API rate limits into code. Read current response headers/docs, bound concurrency, and back off transient failures.

## Operational checklist

- Metrics: grant creation, upload completion/failure, processing latency, stuck pending assets, webhook invalid/duplicate events, playback authorization failures, live disconnects, storage capacity, and delivered minutes.
- Logs: include request/correlation ID and non-secret Stream UID; redact credentials, signed tokens, webhook secrets, and stream keys.
- Reconciliation: periodically inspect old pending/failed/orphaned assets and compare local references to Stream.
- Retention: schedule application-aware deletion; do not depend on manual dashboard cleanup.
- Incident controls: revoke API tokens, rotate signing/webhook/live keys, disable affected live inputs, and identify exposed grants/tokens by their expiry window.
- Test environments: avoid reusing production credentials or account-wide webhook subscriptions. If separate accounts are unavailable, namespace metadata and protect shared subscription changes.

Official sources: [VOD webhooks](https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/), [analytics](https://developers.cloudflare.com/stream/getting-analytics/), [GraphQL analytics](https://developers.cloudflare.com/stream/getting-analytics/fetching-bulk-analytics/), [pricing](https://developers.cloudflare.com/stream/pricing/), and [FAQ](https://developers.cloudflare.com/stream/faq/).
