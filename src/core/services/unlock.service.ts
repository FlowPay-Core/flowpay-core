import { nanoid } from "../../utils/nanoid";
import type { Store, ReceiptRecord } from "../store/store";
import { CATALOG } from "../../products/catalog";
import { signReceipt, verifyReceiptSignature } from "../security/signatures";

export class UnlockService {
    constructor(private store: Store, private receiptSecret: string) { }

    async issueReceipt(chargeId: string, productRef: string, customerRef: string) {
        const product = CATALOG[productRef];
        if (!product) throw new Error("Unknown product_ref");

        const payload = {
            receipt_id: `rcpt_${nanoid(18)}`,
            charge_id: chargeId,
            product_ref: productRef,
            customer_ref: customerRef,
            permissions: product.permissions,
            issued_at: new Date().toISOString(),
            // expires_at: optional
        };

        const payloadJson = JSON.stringify(payload);
        const signature = signReceipt(this.receiptSecret, payloadJson);

        const record: ReceiptRecord = {
            receiptId: payload.receipt_id,
            chargeId,
            productRef,
            customerRef,
            permissions: product.permissions,
            issuedAt: payload.issued_at,
            signature,
            payloadJson,
        };

        await this.store.createReceipt(record);

        return {
            receipt: payload,
            signature,
        };
    }

    async verifyReceipt(receiptId: string) {
        const rec = await this.store.getReceipt(receiptId);
        if (!rec) return { valid: false };

        const ok = verifyReceiptSignature(this.receiptSecret, rec.payloadJson, rec.signature);
        return { valid: ok, receipt: JSON.parse(rec.payloadJson), signature: rec.signature };
    }
}
