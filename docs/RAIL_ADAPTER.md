# RAIL_ADAPTER.md — Provider Contract

The `RailAdapter` interface defines the mandatory contract that every payment provider (connector) must implement to be compatible with FlowPay Core.

## The Interface

```ts
export interface RailAdapter {
  readonly providerId: ProviderId;
  createCharge(input: CreateChargeInput): Promise<CreateChargeOutput>;
  getChargeStatus(providerChargeId: string): Promise<ChargeStatus>;
  verifyWebhook(req: IncomingMessage, bodyRaw: Buffer): Promise<VerifiedEvent>;
}
```

## Methods

### `createCharge(input)`
Responsible for calling the provider's API to create a new Pix charge (or equivalent). It must return a standardized output containing the `providerChargeId` and the Pix payload (copy-paste or QR code).

### `getChargeStatus(providerChargeId)`
Used for polling or manual sync. It queries the provider's API to get the current state of a charge.

### `verifyWebhook(req, bodyRaw)`
The most critical method. It must:
1. Validate the authenticity of the webhook (Signature/HMAC).
2. Map the provider's raw payload to a `VerifiedEvent` object.
3. Ensure the `eventId` is unique and the `status` is correctly mapped to FlowPay's `ChargeStatus`.

## Developing a New Adapter

1. Create a new directory in `src/rails/`.
2. Implement the `RailAdapter` interface.
3. Register the adapter in the bootstrap process (`app.ts`).
