# Event Tickets (Ingressos) - Hotmart API v1

## Domain: Tickets

This reference provides endpoints related to managing and querying event tickets, ticket buyers, check-ins, and participant details for products formatted as events.

---

### 1. Detalhes do Evento (Get Event Information)
- **Description:** Obtains information and configurations about an event and its ticket batches.
- **Endpoint:** `GET /events/api/v1/{event_id}`
- **Parameters (Path):**
  - `event_id` (long, required): The unique identifier of the event (which is the Product ID).
- **How to use:** Fetch event metadata, name, dates, and active ticket batches for displaying on landing pages or internal dashboards.
- **Success Return (200 OK):**
  ```json
  {
    "id": 1234567,
    "name": "Annual Tech Conference 2026",
    "description": "The largest technology event in Latin America",
    "start_date": 1780000000000,
    "end_date": 1780100000000,
    "location": {
      "address": "Av. Paulista, 1000",
      "city": "São Paulo",
      "state": "SP",
      "country": "Brazil"
    },
    "batches": [
      {
        "id": 5541,
        "name": "1st Batch - Early Bird",
        "price": { "value": 150.00, "currency_code": "BRL" },
        "active": false
      },
      {
        "id": 5542,
        "name": "2nd Batch - Standard",
        "price": { "value": 250.00, "currency_code": "BRL" },
        "active": true
      }
    ]
  }
  ```
- **Error Return:** `401 Unauthorized`, `404 Not Found`.

---

### 2. Listar Participantes e Ingressos (Get Participants List)
- **Description:** Lists all buyers and participants registered for a specific event, including their unique ticket codes, QR Codes, and check-in statuses.
- **Endpoint:** `GET /events/api/v1/{event_id}/participants`
- **Parameters (Path):**
  - `event_id` (long, required): The event's unique identifier (Product ID).
- **Parameters (Query):**
  - `max_results` (int): Maximum items per page (default is 50).
  - `page_token` (string): Cursor token for pagination.
  - `ticket_status` (string): Filter by ticket status (e.g. `ACTIVE`, `CANCELLED`, `USED`).
  - `buyer_email` (string): Filter by participant or buyer email.
- **How to use:** Synchronize participant lists with your check-in app or generate custom tickets with QR Codes for physical badge printing at the event entrance.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "ticket_code": "TCK987654321",
        "status": "ACTIVE",
        "qr_code_url": "https://hotmart.com/qr/TCK987654321",
        "checked_in": false,
        "check_in_date": null,
        "buyer": {
          "name": "Alice Smith",
          "email": "alice.smith@example.com"
        },
        "participant": {
          "name": "Alice Smith",
          "email": "alice.smith@example.com",
          "document": "12345678901"
        },
        "batch": {
          "id": 5542,
          "name": "2nd Batch - Standard"
        }
      }
    ],
    "page_info": {
      "next_page_token": "eyJwYWdlIjoyLCJzaXplIjo1MH0=",
      "results_per_page": 50
    }
  }
  ```
- **Error Return:** `400 Bad Request` (invalid status/filters), `401 Unauthorized`, `404 Not Found`.
