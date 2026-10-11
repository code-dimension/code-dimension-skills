# Product fit and architecture

## When Stream fits

Choose Cloudflare Stream when the product benefits from one managed service for upload, encoding, adaptive-bitrate packaging, storage, global playback, live inputs, and usage analytics. It is strongest when engineering time and predictable operations matter more than low-level codec, rendition, packaging, or CDN control.

Typical fit:

- User-generated or editorial video-on-demand.
- Authenticated courses, communities, and SaaS video.
- Live broadcasts that should become recordings.
- Teams that do not want to operate transcoders, queues, origin storage, manifests, and a video CDN.

## Trade-offs

| Decision             | Stream advantage                                                               | Cost or constraint                                                                                           |
| -------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Managed pipeline     | No transcoder/CDN fleet; encoding and ingress are included in Stream pricing   | Less control over codec ladder, segmenting, packaging, and encoding knobs                                    |
| Minute-based billing | Simple storage and delivery model; file size does not drive stored-minute cost | Long, rarely watched content still consumes stored minutes; aggressive preload can consume delivered minutes |
| Direct uploads       | Media bypasses the application server                                          | Requires an asynchronous state model, expiring upload grants, cleanup, and abuse controls                    |
| Built-in player      | Fastest accessible adaptive playback path                                      | Custom UX, telemetry, or native-player needs may require HLS/DASH integration                                |
| Signed playback      | Short-lived application-authorized access without proxying video bytes         | Token issuance and key rotation become security-critical; it is access control, not DRM                      |
| Live plus recording  | One input can serve live playback and later VOD                                | Input codec/GOP requirements, latency trade-offs, recording storage, and reconnect behavior must be managed  |
| Provider analytics   | Server-side views and creator/content trends without a new pipeline            | Product-specific engagement funnels and client QoE events still need application analytics                   |

## When to choose another design

Evaluate object storage plus a transcoding/packaging/CDN pipeline when hard requirements include custom renditions/codecs, deterministic source retention, uncommon containers, per-title encoding control, specialized DRM, bespoke low-latency protocols, or economics proven better at sustained large scale. Include engineering, observability, queueing, retry, security, and egress costs in that comparison—not storage alone.

Use a general meeting/WebRTC platform when the core requirement is interactive multi-party calls. Stream Live is primarily broadcast video; verify current WebRTC capabilities separately before selecting it for interactivity.

Do not add R2 merely to mirror every upload. Add a source archive only when retention, reprocessing, legal, portability, or disaster-recovery requirements justify the extra storage and lifecycle work.

## Minimal domain boundary

The application normally needs:

- A local media/course/lesson entity.
- A Stream video UID or live input UID.
- A small product state such as `pending`, `ready`, `failed`, `deleted`.
- Optional duration, thumbnail, captions, and error metadata used by the product.

Keep user authorization, ownership, publication, entitlements, ordering, and audit data local. Cloudflare metadata can aid search or operations but is not the authority for business rules.
