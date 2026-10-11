# Products (Hotmart API v1)

## Domain: Products

### 1. Get Products
- **Description:** Lists the Creator's product catalog. Excellent for synchronizing data with the database or building dashboards.
- **Endpoint:** `GET /products/api/v1/products`
- **Parameters (Query):**
  - `max_results` (int): Items per page (default is usually 50).
  - `page_token` (string): Pagination cursor.
  - `id` (int): Filter by specific product ID.
  - `status` (string): Filter by status (e.g., `ACTIVE`, `DRAFT`, `PAUSED`).
  - `format` (string): Filter by format (e.g., `ONLINE_COURSE`, `EBOOK`).
- **How to use:** Call this endpoint to fetch all products for a Creator, handling pagination via `page_token` to retrieve the entire catalog.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "id": 698441,
        "name": "Product A",
        "ucode": "f2b3be1f-313f-4a2d-b5b7-1c39d67dd3ee",
        "status": "DRAFT",
        "created_at": 1586459699000,
        "format": "EBOOK",
        "is_subscription": false,
        "warranty_period": 7
      }
    ],
    "page_info": {
      "next_page_token": "...",
      "prev_page_token": "...",
      "results_per_page": 50
    }
  }
  ```
- **Error Return:** `400 Bad Request` (invalid payload), `401 Unauthorized` (token expired/invalid), `429 Too Many Requests`.

### 2. Get Product Offers
- **Description:** Returns the pricing configurations and payment plans available for a given product.
- **Endpoint:** `GET /products/api/v1/products/{ucode}/offers`
- **Parameters (Path):**
  - `ucode` (string): The product's UUID.
- **How to use:** Use this to dynamically display the correct values and checkout links tied to specific campaigns or offers for a product.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "is_currency_conversion_enabled": true,
        "is_main_offer": true,
        "price": {
          "value": 10,
          "currency_code": "BRL"
        },
        "code": "02mhofjd",
        "payment_mode": "PAY_IN_FULL"
      }
    ],
    "page_info": {
      "next_page_token": "...",
      "results_per_page": 50
    }
  }
  ```
- **Error Return:** `401 Unauthorized`, `404 Not Found`.

---

### 3. Get Product Plans (Obter Planos do Produto)
- **Description:** Returns the subscription plan configurations available for a given product (using the product's UUID).
- **Endpoint:** `GET /products/api/v1/products/{ucode}/plans`
- **Parameters (Path):**
  - `ucode` (string): The product's UUID.
- **How to use:** Use this to retrieve details for active subscription plans, billing frequencies, trial configurations, and installment options.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "id": 234567,
        "name": "Plano Mensal Premium",
        "status": "ACTIVE",
        "billing_type": "RECURRING",
        "frequency": "MONTHLY",
        "price": {
          "value": 97.00,
          "currency_code": "BRL"
        },
        "trial_period_days": 7
      }
    ],
    "page_info": {
      "results_per_page": 10
    }
  }
  ```
- **Error Return:** `401 Unauthorized`, `404 Not Found`.

