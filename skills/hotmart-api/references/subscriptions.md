# Subscriptions (Assinaturas) - Hotmart API v1

## Domain: Subscriptions

This reference provides endpoints related to managing and querying subscriptions.

### 1. Recuperar todos (Get Subscribers)
- **Description:** Recovers a list of all subscriptions/subscribers for the authenticated account.
- **Endpoint:** `GET /payments/api/v1/subscriptions`
- **Parameters (Query):**
  - `subscriber_code` (string): Filter by a specific subscription code.
  - `product_id` (int): Filter by a specific product.
  - `status` (string): Filter by status (e.g., `ACTIVE`, `INACTIVE`, `DELAYED`, `CANCELLED`).
  - `max_results` (int): Items per page (pagination).
  - `page_token` (string): Cursor token for pagination.
- **How to use:** Use this endpoint to sync subscription statuses with your database or find a specific subscriber by their code.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "subscriber_code": "S12345",
        "status": "ACTIVE",
        "plan": { "name": "Plano Mensal" },
        "date_next_charge": 1690000000000
      }
    ],
    "page_info": {
      "next_page_token": "...",
      "results_per_page": 50
    }
  }
  ```
- **Error Return:** `400 Bad Request`, `401 Unauthorized`.

### 2. Sumário (Subscription Summary)
- **Description:** Gets a summarized count of subscriptions grouped by their current status.
- **Endpoint:** `GET /payments/api/v1/subscriptions/summary`
- **Parameters (Query):**
  - `product_id` (int): Filter summary by a specific product.
- **How to use:** Fetch aggregate metrics for dashboards (e.g., how many active vs cancelled subscriptions).
- **Success Return (200 OK):**
  ```json
  {
    "active": 1500,
    "delayed": 25,
    "cancelled": 300,
    "inactive": 50
  }
  ```
- **Error Return:** `401 Unauthorized`.

### 3. Transações (Transactions)
- **Description:** Lists all recurring billing transactions generated for a specific subscription.
- **Endpoint:** `GET /payments/api/v1/subscriptions/{subscriber_code}/transactions`
- **Parameters (Path):**
  - `subscriber_code` (string): The unique subscription code.
- **How to use:** Use to show billing history for a specific subscriber.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "transaction": "HP123456789",
        "status": "APPROVED",
        "price": { "value": 97.00, "currency_code": "BRL" },
        "payment_date": 1690000000000
      }
    ],
    "page_info": { "results_per_page": 50 }
  }
  ```
- **Error Return:** `401 Unauthorized`, `404 Not Found`.

### 4. Cancelar Assinatura (Cancel Subscription)
- **Description:** Cancels an active subscription to prevent future billings.
- **Endpoint:** `POST /payments/api/v1/subscriptions/{subscriber_code}/cancel`
- **Parameters (Path / Query):**
  - `subscriber_code` (string): The unique subscription code.
  - `send_mail` (boolean): Optional query parameter indicating if Hotmart should email the user about the cancellation.
- **How to use:** Implement in your system's billing portal to allow users to self-cancel or for admins to cancel access.
- **Success Return (200 OK):** `{}` (Empty object or success confirmation)
- **Error Return:** `400 Bad Request` (already cancelled), `401 Unauthorized`, `404 Not Found`.

### 5. Reativar Assinatura (Reactivate Subscription)
- **Description:** Reactivates a cancelled or suspended subscription.
- **Endpoint:** `POST /payments/api/v1/subscriptions/{subscriber_code}/reactivate`
- **Parameters (Path):**
  - `subscriber_code` (string): The unique subscription code.
- **How to use:** Use when a user decides to resume their plan after cancelling.
- **Success Return (200 OK):** `{}`
- **Error Return:** `400 Bad Request` (e.g., cannot reactivate this specific subscription state), `401 Unauthorized`, `404 Not Found`.

### 6. Alterar Dia de Vencimento (Change Due Day)
- **Description:** Changes the monthly billing/due date for a subscription.
- **Endpoint:** `PUT /payments/api/v1/subscriptions/{subscriber_code}/due-day`
- **Parameters:**
  - `subscriber_code` (string): Path param.
  - Body: JSON object containing the new `due_day` (int).
- **How to use:** Provide as an option in a customer support portal or billing section for users to align billing with their payday.
- **Success Return (200 OK):** `{}`
- **Error Return:** `400 Bad Request` (invalid due day), `401 Unauthorized`, `404 Not Found`.

### 7. Cancelar lista de assinaturas (Cancel Subscriptions Batch)
- **Description:** Cancels multiple active subscriptions in a single request (batch operation).
- **Endpoint:** `POST /payments/api/v1/subscriptions/cancel-subscriptions`
- **Parameters (Body):**
  - JSON payload containing an array/list of `subscriber_code`s.
  - `send_mail` (boolean): Optional flag to notify users.
- **How to use:** Use when you need to perform bulk cancellations (e.g., closing down a cohort or removing access for a large group of users).
- **Success Return (200 OK):** `{}` (Empty object or a batch result summary)
- **Error Return:** `400 Bad Request` (invalid body format), `401 Unauthorized`.

### 8. Reativar e cobrar lista de assinaturas (Reactivate and Charge Subscriptions Batch)
- **Description:** Reactivates and immediately attempts to charge a list of cancelled or suspended subscriptions in a single batch request.
- **Endpoint:** `POST /payments/api/v1/subscriptions/reactivate-subscriptions`
- **Parameters (Body):**
  - JSON payload containing an array/list of `subscriber_code`s to be reactivated and charged.
- **How to use:** Use for bulk recovery campaigns where users have agreed to resume their access.
- **Success Return (200 OK):** `{}` (Empty object or a batch result summary)
- **Error Return:** `400 Bad Request`, `401 Unauthorized`.
