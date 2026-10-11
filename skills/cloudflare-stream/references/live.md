# Live streaming

## Architecture

A Live Input has stable ingest credentials and can accept RTMPS or SRT broadcasts. The application creates/manages the input; broadcasting software such as OBS sends the feed; viewers use Stream playback. Recording must be enabled deliberately if the broadcast should be playable live and retained as VOD.

Prefer SRT when its resilience, newer codec transport, captions, or multiple audio track support is required. Use RTMPS for broad encoder compatibility. Current Stream documentation says SRT supports caller mode only.

## Input configuration

- `enabled` controls whether the input accepts broadcasts; disabling can terminate/reject connections.
- `recording.mode: automatic` enables playback/recording; the documented default is `off`.
- Apply `recording.requireSignedURLs`, `recording.allowedOrigins`, and `hideLiveViewerCount` according to the product's privacy model.
- `timeoutSeconds` controls how long a disconnect may last before a later connection creates a new video. Choose it from real encoder/network behavior.
- `deleteRecordingAfterDays` applies retention to future recordings. Current documented range is 30–1096 days; verify before use.
- `preferLowLatency` enables the current Low-Latency HLS mode and may be beta. Verify current status and player/recording requirements rather than enabling it by default.

Treat stream keys like passwords. Show them only to authorized broadcasters, never log them, and rotate them after exposure or handoff. Rotation disconnects publishers using old credentials.

## Encoder contract

Current RTMPS/SRT input requirements and recommendations, to revalidate before production:

- H.264 video and AAC audio input; closed GOP required.
- Stable CBR is preferred to VBR.
- Typical bitrate should remain well below 12 Mbps.
- GOP/keyframe interval of 2–8 seconds; 2–4 seconds for lower latency.
- Clients must reconnect after disconnection.
- Low-Latency HLS guidance currently requires B-frames off and favors RTMP when possible.
- A recording longer than seven days is truncated to the first seven days.
- Watermarks are not currently available for live video.

Lower GOP improves latency but reduces compression efficiency. Do not claim a fixed end-to-end latency without measuring the selected ingest protocol, LL-HLS mode, player, geography, and encoder settings.

## Operations

- Monitor connect, disconnect, and error events with the dedicated Live Webhooks flow; VOD processing webhooks are different.
- Distinguish input UID, current/recorded video UID, and stream key in the data model.
- Define operator behavior for pre-live, live, reconnecting, ended, errored, and replay states.
- Test encoder disconnect/reconnect, key rotation, disabled input, viewer authorization, recording creation, and scheduled deletion.
- Simulcasting to other platforms adds delivery usage and another failure surface; enable only when required.

Official sources: [start Stream Live](https://developers.cloudflare.com/stream/stream-live/start-stream-live/), [live webhooks](https://developers.cloudflare.com/stream/stream-live/webhooks/), [live troubleshooting](https://developers.cloudflare.com/stream/stream-live/troubleshooting/), and [simulcasting](https://developers.cloudflare.com/stream/stream-live/simulcasting/).
