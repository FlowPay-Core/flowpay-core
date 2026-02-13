import type { RailAdapter, CreateChargeInput, CreateChargeOutput, ChargeStatus, VerifiedEvent } from "../railAdapter";
import { hmacSha256, timingSafeEqual } from "../../core/security/signatures";

export class StarkBankAdapter implements RailAdapter {
    readonly providerId = "starkbank" as const;

    constructor(private cfg: { projectId: string; privateKeyPem: string; webhookSecret: string }) { }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        return {
            providerId: this.providerId,
            providerChargeId: "stark_invoice_id_here",
            status: "CREATED",
            pixCopyPaste: "pix_payload_here",
        };
    }

    async getChargeStatus(providerChargeId: string): Promise<ChargeStatus> {
        return "PENDING";
    }

    async verifyWebhook(req: any, bodyRaw: Buffer): Promise<VerifiedEvent> {
        const headerSig = String(req.headers["x-webhook-signature"] ?? "");
        const expected = hmacSha256(this.cfg.webhookSecret, bodyRaw).toString("hex");
        const ok = timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(headerSig, "hex"));
        if (!ok) throw new Error("Invalid webhook signature");

        const parsed = JSON.parse(bodyRaw.toString("utf8"));
        return {
            providerId: this.providerId,
            eventId: parsed?.event?.id ?? `stark_${Date.now()}`,
            providerChargeId: String(parsed?.invoice?.id ?? "unknown"),
            status: "PAID",
            paidAt: new Date().toISOString(),
            raw: parsed,
        };
    }
}
