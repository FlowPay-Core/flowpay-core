import type { Store, ChargeRecord, ReceiptRecord } from "./store";
import type { ChargeStatus } from "../../rails/railAdapter";

export class MemoryStore implements Store {
    private charges = new Map<string, ChargeRecord>();
    private idempotencyKeys = new Map<string, ChargeRecord>();
    private providerCharges = new Map<string, ChargeRecord>(); // key: `${providerId}:${providerChargeId}`
    private processedEvents = new Set<string>(); // key: `${providerId}:${eventId}`
    private receipts = new Map<string, ReceiptRecord>();

    async getChargeByIdempotencyKey(key: string): Promise<ChargeRecord | null> {
        return this.idempotencyKeys.get(key) || null;
    }

    async createCharge(record: ChargeRecord): Promise<void> {
        this.charges.set(record.chargeId, record);
        this.idempotencyKeys.set(record.idempotencyKey, record);
        const pkey = `${record.providerId}:${record.providerChargeId}`;
        this.providerCharges.set(pkey, record);
    }

    async getChargeByProviderChargeId(providerId: string, providerChargeId: string): Promise<ChargeRecord | null> {
        const pkey = `${providerId}:${providerChargeId}`;
        return this.providerCharges.get(pkey) || null;
    }

    async updateChargeStatus(chargeId: string, status: ChargeStatus, paidAt?: string): Promise<void> {
        const charge = this.charges.get(chargeId);
        if (!charge) return;
        charge.status = status;
        charge.updatedAt = new Date().toISOString();
        if (paidAt) charge.paidAt = paidAt;
    }

    async hasEventProcessed(providerId: string, eventId: string): Promise<boolean> {
        const ekey = `${providerId}:${eventId}`;
        return this.processedEvents.has(ekey);
    }

    async markEventProcessed(providerId: string, eventId: string): Promise<void> {
        const ekey = `${providerId}:${eventId}`;
        this.processedEvents.add(ekey);
    }

    async createReceipt(record: ReceiptRecord): Promise<void> {
        this.receipts.set(record.receiptId, record);
    }

    async getReceipt(receiptId: string): Promise<ReceiptRecord | null> {
        return this.receipts.get(receiptId) || null;
    }
}
