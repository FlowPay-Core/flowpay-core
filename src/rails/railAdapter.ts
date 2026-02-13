import type { IncomingMessage } from "node:http";

export type ProviderId = "efi" | "mercadopago" | "woovi" | "starkbank" | string;

export type ChargeStatus = "CREATED" | "PENDING" | "PAID" | "EXPIRED" | "CANCELED" | "UNKNOWN";

export type CreateChargeInput = {
    amountCents: number;
    currency: "BRL";
    customerRef: string;     // handle/phone hash, never raw PII in receipts
    productRef: string;      // membership / event-pass
    idempotencyKey: string;  // required
    expiresInSec?: number;
    metadata?: Record<string, string>;
};

export type CreateChargeOutput = {
    providerId: ProviderId;
    providerChargeId: string;
    status: ChargeStatus;
    expiresAt?: string;
    checkoutUrl?: string;
    pixCopyPaste?: string;
    pixQrCodeBase64?: string;
};

export type VerifiedEvent = {
    providerId: ProviderId;
    eventId: string;              // unique for replay protection
    providerChargeId: string;
    status: ChargeStatus;         // usually PAID
    paidAt?: string;
    raw: unknown;                 // for auditing
};

export interface RailAdapter {
    readonly providerId: ProviderId;
    createCharge(input: CreateChargeInput): Promise<CreateChargeOutput>;
    getChargeStatus(providerChargeId: string): Promise<ChargeStatus>;
    verifyWebhook(req: IncomingMessage, bodyRaw: Buffer): Promise<VerifiedEvent>;
}
