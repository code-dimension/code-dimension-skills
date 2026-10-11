# API, authentication, and lifecycle

## Credentials and identifiers

- Prefer scoped Cloudflare API tokens over Global API Keys. Grant only the account and Stream read/edit permissions required by the process.
- Load credentials from the repository's existing secret mechanism. Do not commit, expose, echo, or send privileged credentials to clients.
- Keep these concepts distinct: Cloudflare account ID, customer playback code/subdomain, video UID, live input UID, API token, signing-key ID/private key, webhook secret, and live broadcast key.
- API examples commonly use `https://api.cloudflare.com/client/v4/accounts/{account_id}/stream/...` and wrap REST results in `success`, `errors`, `messages`, and `result`. Verify the exact operation in the current [API reference](https://developers.cloudflare.com/api/resources/stream/).

## Lifecycle

Use an explicit asynchronous boundary:

1. Authorize the application operation.
2. Create an upload grant or server-side upload and persist the returned UID immediately.
3. Mark the local asset `pending`.
4. Receive and verify the processing webhook, or reconcile by fetching video details.
5. Mark it `ready` only when Stream reports it playable; record a bounded error reason on failure.
6. Publish it only if the application's separate publication rules pass.

`readyToStream`/`status` describes media processing, not application publication. A `ready` video may still be encoding some quality levels until `pctComplete` reaches 100. Do not block normal playback on 100% unless the product requires every rendition.

## Reliability

- Give each local asset one stable Stream UID and enforce uniqueness locally.
- Make create/upload callbacks and webhook transitions idempotent. Duplicate delivery or retries must not duplicate lessons, notifications, or jobs.
- Preserve the raw response error details in secure operational logs, but return a stable application error to clients.
- Retry only transient failures (`429`, timeouts, and eligible `5xx`) with bounded exponential backoff and jitter. Honor `Retry-After` when present. Do not retry validation/authentication failures blindly.
- Reconcile assets stuck in `pending`; webhooks are the fast path, not the only recovery mechanism.
- On replace, upload the new asset first, switch the local pointer only after it is ready, then delete the old asset. This avoids destructive partial failure.

## Mutations and authorization

Creating upload URLs, changing privacy, generating downloads, adding captions, deleting videos, and rotating live keys are privileged mutations. Check the local user's authority before calling Stream. Never infer authorization from possession of a video UID.

Official sources: [Stream API](https://developers.cloudflare.com/api/resources/stream/), [manage the video library](https://developers.cloudflare.com/stream/manage-video-library/), and [Stream FAQ](https://developers.cloudflare.com/stream/faq/).
