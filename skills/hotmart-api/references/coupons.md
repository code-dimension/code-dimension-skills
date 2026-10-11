# Coupons (Hotmart API v1)

## Domain: Coupons

### 1. Create Coupon
- **Description:** Automates the generation of promotional codes based on value, percentage, validity, and specific offers.
- **Endpoint:** `POST /products/api/v1/product/{product_id}/coupon`
- **Parameters:**
  - `product_id` (int): Path parameter for the product ID.
  - Body: Requires coupon configuration (code, discount percentage/value, validity period).
- **How to use:** Call when creating scarcity campaigns or dynamic discounts for users.
- **Success Return (200 OK):** `{}`
- **Error Return:** `400 Bad Request` (invalid body format), `401 Unauthorized`.

### 2. Get Coupon
- **Description:** Queries the rules and current state of a coupon.
- **Endpoint:** `GET /products/api/v1/coupon/product/{product_id}`
- **Parameters (Query/Path):**
  - `product_id` (int): The ID of the product.
- **How to use:** Can be used on a custom checkout page to validate in real-time if a code entered by the user is still active.
- **Success Return (200 OK):**
  ```json
  {
    "items": [
      {
        "coupon_code": "couponCode",
        "active": true,
        "start_date": 16806975000,
        "discount": 0.1,
        "status": "valid",
        "id": 123456
      }
    ],
    "page_info": { "results_per_page": 20 }
  }
  ```
- **Error Return:** `401 Unauthorized`.

### 3. Delete Coupon
- **Description:** Immediately invalidates a discount coupon using its ID.
- **Endpoint:** `DELETE /products/api/v1/coupon/{coupon_id}`
- **Parameters (Path):**
  - `coupon_id` (int): The ID of the coupon to delete.
- **How to use:** Call to programmatically end a campaign or invalidate a compromised coupon.
- **Success Return (200 OK):** `{}`
- **Error Return:** `401 Unauthorized`, `404 Not Found`.
