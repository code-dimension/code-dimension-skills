# Uploads and media preparation

## Select one upload path

| Path                  | Use it when                                        | Important behavior                                                                                              |
| --------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Dashboard             | An operator performs occasional manual uploads     | No application integration                                                                                      |
| Basic file upload     | A trusted server uploads a file under 200 MB       | Simple multipart request; avoid proxying end-user video through the app                                         |
| Resumable `tus`       | The file is over 200 MB or networks are unreliable | Supports resumption; follow current chunk-size and `Tus-Resumable` requirements                                 |
| Upload by URL         | Stream can fetch an existing reachable source      | Validate ownership/access and URL trust; account for expiring URLs and SSRF-style input risk in the application |
| Direct Creator Upload | A browser/mobile user supplies media               | Backend creates a one-time constrained URL; client sends bytes directly to Stream                               |

For Direct Creator Uploads, set the tightest practical `maxDurationSeconds` and `expiry`. Apply `creator`, `requireSignedURLs`, `allowedOrigins`, watermark, and thumbnail options only when the product needs them. Reserved `maxDurationSeconds` consumes storage capacity until the upload finishes or the grant expires, so do not over-allocate it.

For `tus` direct uploads, the backend forwards the required creation headers and returns the `Location` header. Retain the UID. Do not expose the API token. Use a mature existing `tus` client if present; do not hand-roll the protocol.

## Current media constraints

These values were verified against official docs on 2026-09-25 and must be rechecked before production decisions:

- Maximum uploaded file size is 30 GB by default.
- Basic uploads are for files under 200 MB; larger files require `tus`.
- Accepted containers include MP4, MKV, MOV, AVI, FLV, MPEG-2 TS/PS, MXF, LXF, GXF, 3GP, WebM, MPG, and QuickTime.
- Recommended VOD input is MP4 with H.264 video, AAC audio, 60 FPS or less, and the original recorded frame rate. Stream currently encodes playback up to 90 FPS.
- More than two audio channels are mixed down to stereo.
- The default simultaneous upload/encoding queue limit is documented as 120; `ready` videos do not count even if some renditions continue encoding. Verify account-specific limits.

Reject clearly invalid size/type/duration early for user experience, but treat server-side inspection and Stream's processing result as authoritative. Browser MIME type and file extension are untrusted hints.

## Abuse and cleanup

- Authenticate the creator before issuing a grant.
- Apply per-user/course quotas and request rate limits in the application.
- Make grants short-lived and duration-bounded; do not create them speculatively.
- Track abandoned `pendingupload` assets and local pending records for cleanup.
- Never mark a lesson usable merely because the client says upload completed.

Official sources: [upload methods and formats](https://developers.cloudflare.com/stream/uploading-videos/), [Direct Creator Uploads](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/), [resumable uploads](https://developers.cloudflare.com/stream/uploading-videos/resumable-uploads/), and [upload by link](https://developers.cloudflare.com/stream/uploading-videos/upload-via-link/).
