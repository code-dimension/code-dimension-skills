# Installments Negotiation (Negociações) - Hotmart API v1

## Domain: Negotiation

This reference provides endpoints related to managing installment and billing negotiations, useful for recovering overdue payments or subscription fees.

---

### 1. Gerar uma Negociação (Generate a Negotiation)
- **Description:** Generates a payment negotiation proposal for overdue subscription installments or recurring fees, enabling automated customer recovery workflows.
- **Endpoint:** `POST /payments/api/v1/negotiations`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer :access_token`
- **Parameters (Body):**
  - `subscriber_code` (string, required): The unique subscription code containing overdue or unpaid billing installments.
  - `installments` (int, required): The chosen number of installments for the negotiation agreement (e.g., between 1 and 5).
  - `discount_value` (double, optional): Optional discount to be offered as an incentive for renegotiation.
  - `discount_type` (string, optional): Type of the discount applied (e.g., `PERCENTAGE` or `FIXED_VALUE`).
- **How to use:** Call this endpoint in your support center portal, automated customer success chat, or email recovery sequence to programmatically generate an installment renegotiation proposal.
- **Success Return (200 OK):**
  ```json
  {
    "negotiation_id": 98765,
    "subscriber_code": "S12345",
    "negotiation_status": "PENDING",
    "installments": 3,
    "discount": {
      "value": 10.00,
      "type": "PERCENTAGE"
    },
    "payment_url": "https://pay.hotmart.com/renegotiate?code=S12345&negId=98765",
    "expires_at": 1690500000000
  }
  ```
- **Error Return:**
  - `400 Bad Request` (missing/invalid fields, subscription not eligible, e.g. already paid or fully cancelled).
  - `401 Unauthorized`.
  - `404 Not Found` (subscriber code does not exist).
