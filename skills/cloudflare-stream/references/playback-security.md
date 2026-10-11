# Playback, privacy, and derived assets

## Player choice

- Prefer the [Stream built-in player](https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/) for the smallest integration and automatic adaptive playback.
- Use [HLS or DASH with an existing player](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/) only when required by native apps, custom controls, telemetry, or UX. Test autoplay, captions, keyboard access, fullscreen, picture-in-picture, mobile behavior, and error states.
- Use the customer playback hostname and video UID/token returned for the account. Do not construct API hosts and playback hosts interchangeably.

## Private playback

Public videos are viewable by anyone with the UID. Set `requireSignedURLs` for authenticated, paid, embargoed, or otherwise private media.

Authorize playback on the backend, then issue a short-lived token:

- The `/token` endpoint is appropriate for testing or low volume; official guidance says fewer than 1,000 tokens/day and its default token lifetime is one hour. It makes one rate-limited API call per token and does not support Live WebRTC.
- A Stream signing key avoids a Cloudflare API call per viewer and supports custom claims; use it for scale or advanced restrictions. Protect and rotate the private key.
- A Workers Stream binding is the smallest option when playback authorization already runs in Workers; use a signing key when custom claims exceed binding capabilities.

Use the signed token in place of the video/input ID in iframe, manifest, thumbnail, and authorized download URLs. Set only needed claims, such as `exp`, `nbf`, `downloadable`, and verified access rules. Keep expiry proportional to a viewing session; handle refresh without turning tokens into permanent links.

`allowedOrigins` limits where playback can be embedded. It does not identify the viewer, prevent copied credentials, provide DRM, or prevent screen recording. Combine it with signed URLs when content is private.

## Captions, thumbnails, watermarks, and downloads

- Captions/subtitles may be uploaded or generated where the current account/product supports it. Preserve language labels and review generated captions for accuracy and accessibility.
- Use Stream thumbnail endpoints and supported query parameters rather than downloading a video to generate ordinary thumbnails locally.
- Watermark profiles are configured and then applied during supported upload flows. Current docs state live video does not support watermarks; verify before promising it.
- HLS/DASH is the default playback delivery. MP4 and M4A downloads require an explicit generation request and asynchronous polling until `ready`.
- A private video's download token needs `downloadable: true`. Public videos create public downloads.
- Downloads are billed as delivered minutes; partial MP4 delivery is billed proportionally according to current pricing docs.

Do not enable downloadable copies unless the product requires offline/export behavior. They broaden redistribution risk even when access is signed.

Official sources: [secure Stream](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/), [captions](https://developers.cloudflare.com/stream/edit-videos/adding-captions/), [thumbnails](https://developers.cloudflare.com/stream/viewing-videos/displaying-thumbnails/), [watermarks](https://developers.cloudflare.com/stream/edit-videos/applying-watermarks/), and [video/audio downloads](https://developers.cloudflare.com/stream/viewing-videos/download-videos/).
