# Authentication (Hotmart API v1)

## Domain: Auth

The Hotmart API uses the OAuth 2.0 protocol with the `client_credentials` grant type to authenticate integrations.

### 1. Generate Access Token
- **Description:** Obtains an access token required to authenticate requests to all other Hotmart API endpoints.
- **Endpoint:** `POST https://api-sec-vlc.hotmart.com/security/oauth/token`
- **Parameters (Query):**
  - `grant_type` (string): Must be exactly `client_credentials`.
- **Headers:**
  - `Content-Type`: `application/json`
  - `Authorization`: `Basic {Base64(client_id:client_secret)}` 
    *(Note: You must concatenate your Client ID and Client Secret with a colon `:` and encode the result in Base64).*
- **How to use:** Call this endpoint before making business requests. It is highly recommended to **cache the token** in memory or Redis until it expires (using the `expires_in` property) to avoid hitting rate limits on the authentication endpoint itself.
- **Success Return (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "expires_in": 1024341
  }
  ```
- **Error Return:** `400 Bad Request` (missing grant_type), `401 Unauthorized` (invalid client_id or client_secret).
