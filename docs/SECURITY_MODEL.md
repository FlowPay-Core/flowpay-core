# SECURITY_MODEL.md — Secure by Default

FlowPay Core is designed with a security-first mindset, focusing on immutability, cryptographic verification, and strict state transitions.

## Invariants

1.  **Strict State Transitions**: Transitions only occur from `CREATED`/`PENDING` to final states. `PAID` is final.
2.  **Webhook Authentication**: All webhooks must be cryptographically verified (HMAC) using provider-specific secrets.
3.  **Idempotency**: All charge creations require an `idempotency_key` to prevent duplicate charges.
4.  **Anti-Replay**: Each webhook event ID is stored and checked before processing to prevent replay attacks.
5.  **PII-Free Receipts**: Unlock receipts contain opaque references (`customerRef`, `productRef`) rather than raw PII.
6.  **Cryptographic Proof of Purchase**: Unlock receipts are signed server-side using HMAC-SHA256.

## Verification Workflow

1.  **Provider Webhook** arrives at `/webhook/:providerId`.
2.  **Signature Check**: Core verifies the signature using the adapter's `verifyWebhook` method.
3.  **Replay Check**: Core ensures `eventId` hasn't been processed.
4.  **State Machine Check**: Core ensures the charge can transition to the new status.
5.  **State Update**: Local store is updated.
6.  **Unlock Event**: If state becomes `PAID`, the Unlock Engine issues a signed receipt.

## Key Management

*   **Provider Secrets**: Managed via environment variables.
*   **Receipt Secret**: Rotating server-side secret used to sign purchase proofs.
