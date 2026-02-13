# UNLOCK_RECEIPT.md — Schema & Signature

The Unlock Receipt is the primary product of FlowPay. It acts as a portable, cryptographically signed proof of purchase that can be verified by any service sharing the `RECEIPT_SECRET`.

## Schema (JSON Payload)

```json
{
  "receipt_id": "rcpt_Kx0D2gH8nJ9mL4p3",
  "charge_id": "ch_7v8B9n0M1p2Q3r4S",
  "product_ref": "MEMBERSHIP_BASIC",
  "customer_ref": "cust_h4sh3d_1d",
  "permissions": ["ACCESS:MEMBERS_AREA"],
  "issued_at": "2026-02-12T23:35:00Z",
  "expires_at": null
}
```

## Signature

The signature is an HMAC-SHA256 hash of the JSON string, encoded in hexadecimal.

### Verification Formula

```
signature = HMAC-SHA256(RECEIPT_SECRET, JSON_PAYLOAD)
```

## Grant Types

### A) Membership (Subscription/Access)
Grants access to digital content or areas based on the `permissions` array.

### D) Event Pass (Ticketing)
Grants permission for a one-time check-in. The `permissions` array includes `CHECKIN:ALLOWED`.

## Usage in Clients

1. Client receives `{ receipt, signature }`.
2. Client sends `receipt_id` to `/unlock/verify/:receiptId` (or verifies locally if it has the secret).
3. System confirms validity and returns permissions.
