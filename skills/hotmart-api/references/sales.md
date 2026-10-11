# Sales (Vendas) - Hotmart API v1

## Domain: Sales

This reference provides endpoints related to managing, querying, and auditing sales, transactions, commissions, and refunds.

### 1. Histórico de Vendas (Sales History)
- **Description:** Lists sales and detailed information about each transaction (buyer info, product details, status, dates).
- **Endpoint:** `GET /payments/api/v1/sales/history`
- **Parameters (Query):**
  - `product_id` (long): Unique 7-digit identifier of the product.
  - `start_date` (long): Start date in milliseconds (from 1970-01-01).
  - `end_date` (long): End date in milliseconds.
  - `transaction_status` (string): Filter by status (e.g., `APPROVED`, `REFUNDED`, `PENDING_DEBT`, `BILLET_PRINTED`, `CANCELLED`).
  - `transaction` (string): Specific transaction reference code (e.g., `HP123456789`).
  - `buyer_name` (string): Filter by buyer's name.
  - `buyer_email` (string): Filter by buyer's email.
  - `payment_type` (string): Method of payment (e.g., `CREDIT_CARD`, `PIX`, `BILLET`).
  - `max_results` (int): Maximum items per page (default is 50).
  - `page_token` (string): Cursor token for pagination.
- **How to use:** Call this endpoint to synchronize transactions with your local database or display sales history in dashboards.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "transaction": "HP123456789",
        "purchase_date": 1690000000000,
        "status": "APPROVED",
        "price": {
          "value": 197.00,
          "currency_code": "BRL"
        },
        "buyer": {
          "name": "Jane Doe",
          "email": "jane.doe@example.com"
        },
        "product": {
          "id": 1234567,
          "name": "Online Course Masterclass"
        }
      }
    ],
    "page_info": {
      "next_page_token": "eyJwYWdlIjoyLCJzaXplIjo1MH0=",
      "results_per_page": 50
    }
  }
  ```
- **Error Return:** `400 Bad Request`, `401 Unauthorized`, `429 Too Many Requests`.

---

### 2. Sumário de Vendas (Sales Summary)
- **Description:** Displays consolidated sales summary and total commission values grouped per currency code.
- **Endpoint:** `GET /payments/api/v1/sales/summary`
- **Parameters (Query):**
  - `product_id` (long): Unique 7-digit identifier of the product.
  - `start_date` (long): Start date in milliseconds.
  - `end_date` (long): End date in milliseconds.
  - `transaction_status` (string): Filter by transaction status.
- **How to use:** Use to populate financial dashboards or calculate global performance metrics.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "currency_code": "BRL",
        "total_value": 15000.00,
        "commission_value": 13500.00,
        "quantity": 76
      }
    ],
    "page_info": {
      "results_per_page": 10
    }
  }
  ```
- **Error Return:** `400 Bad Request`, `401 Unauthorized`.

---

### 3. Comissões de Vendas (Sales Commissions)
- **Description:** Recovers details about commissions assigned to the Creator, Co-producers, and Affiliates for specific sales.
- **Endpoint:** `GET /payments/api/v1/sales/commissions`
- **Parameters (Query):**
  - `transaction` (string): The unique transaction reference code (e.g., `HP123456789`).
  - `transaction_status` (string): Filter by transaction status.
  - `max_results` (int): Pagination size.
  - `page_token` (string): Cursor token.
- **How to use:** Audit commissions inside your internal bookkeeping system or show affiliate payments.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "transaction": "HP123456789",
        "role": "CREATOR",
        "commission_value": {
          "value": 118.20,
          "currency_code": "BRL"
        },
        "user": {
          "name": "Course Producer",
          "email": "producer@example.com"
        }
      },
      {
        "transaction": "HP123456789",
        "role": "AFFILIATE",
        "commission_value": {
          "value": 59.10,
          "currency_code": "BRL"
        },
        "user": {
          "name": "Top Affiliate",
          "email": "affiliate@example.com"
        }
      }
    ],
    "page_info": {
      "results_per_page": 20
    }
  }
  ```
- **Error Return:** `401 Unauthorized`, `404 Not Found`.

---

### 4. Detalhamento do Preço de Vendas (Breakdown of Sales Price)
- **Description:** Provides a complete financial breakdown of the transaction pricing, detailing taxes, processing fees, and deductions.
- **Endpoint:** `GET /payments/api/v1/sales/price/details`
- **Parameters (Query):**
  - `transaction` (string): The unique transaction reference code.
  - `transaction_status` (string): Filter by transaction status.
- **How to use:** Audit net payout values, Hotmart tax deductions, or local currency conversion adjustments.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "transaction": "HP123456789",
        "original_price": { "value": 197.00, "currency_code": "BRL" },
        "hotmart_fee": { "value": 19.70, "currency_code": "BRL" },
        "tax": { "value": 0.00, "currency_code": "BRL" },
        "net_price": { "value": 177.30, "currency_code": "BRL" }
      }
    ],
    "page_info": {
      "results_per_page": 1
    }
  }
  ```
- **Error Return:** `401 Unauthorized`, `404 Not Found`.

---

### 5. Participantes das Vendas (Sales Participants / Users)
- **Description:** Lists users involved in the sale transactions (buyer, co-producers, affiliates) and their contact details.
- **Endpoint:** `GET /payments/api/v1/sales/participants`
- **Parameters (Query):**
  - `transaction` (string): Unique transaction reference code.
  - `transaction_status` (string): Filter by transaction status.
  - `max_results` (int): Pagination size.
  - `page_token` (string): Pagination cursor.
- **How to use:** Retrieve customer profile details or verify affiliate mappings to automatically trigger CRM sequences.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "transaction": "HP123456789",
        "buyer": {
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "document": "12345678909"
        },
        "creator": {
          "name": "Course Producer",
          "email": "producer@example.com"
        }
      }
    ],
    "page_info": {
      "results_per_page": 10
    }
  }
  ```
- **Error Return:** `401 Unauthorized`, `404 Not Found`.

---

### 6. Solicitar Reembolso (Request Refund)
- **Description:** Requests a refund for a sale.
- **Endpoint:** `PUT /payments/api/v1/sales/{transaction}/refund`
- **Parameters (Path):**
  - `transaction` (string): The unique transaction reference code to refund (e.g., `HP123456789`).
- **How to use:** Provide self-service refund buttons in your portal for eligible users within the warranty period or automate cancellations.
- **Rules & Limitations:**
  - Transaction status must be `APPROVED` or `COMPLETE`.
  - The transaction must not be in trial mode.
  - Sales made via BACS or SEPA cannot be refunded via this API (they must be refunded directly through the banking institution).
- **Success Return (200 OK):**
  ```json
  {}
  ```
- **Error Return:**
  - `400 Bad Request` (already refunded, outside warranty period, or unsupported payment method).
  - `401 Unauthorized`.
  - `404 Not Found` (transaction does not exist).
