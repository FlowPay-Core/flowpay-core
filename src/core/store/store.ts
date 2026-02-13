import type { ChargeStatus } from "../../rails/railAdapter";

export type ChargeRecord = {
    chargeId: string;            // internal
    providerId: string;
    providerChargeId: string;
    status: ChargeStatus;
    amountCents: number;
    currency: "BRL";
    customerRef: string;
    productRef: string;
    idempotencyKey: string;
    createdAt: string;
    updatedAt: string;
    paidAt?: string;
};

export type ReceiptRecord = {
    receiptId: string;
    chargeId: string;
    productRef: string;
    customerRef: string;
    permissions: string[];
    issuedAt: string;
    expiresAt?: string;
    signature: string;
    payloadJson: string;
};

export interface Store {
    getChargeByIdempotencyKey(key: string): Promise<ChargeRecord | null>;
    createCharge(record: ChargeRecord): Promise<void>;
    getChargeByProviderChargeId(providerId: string, providerChargeId: string): Promise<ChargeRecord | null>;
    updateChargeStatus(chargeId: string, status: ChargeStatus, paidAt?: string): Promise<void>;

    hasEventProcessed(providerId: string, eventId: string): Promise<boolean>;
    markEventProcessed(providerId: string, eventId: string): Promise<void>;

    createReceipt(record: ReceiptRecord): Promise<void>;
    getReceipt(receiptId: string): Promise<ReceiptRecord | null>;
}
