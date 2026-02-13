import type { RailAdapter, CreateChargeInput, CreateChargeOutput, ChargeStatus, VerifiedEvent } from "../railAdapter";
import { hmacSha256, timingSafeEqual } from "../../core/security/signatures";

export class EfiAdapter implements RailAdapter {
    readonly providerId = "efi" as const;

    constructor(private cfg: { clientId: string; clientSecret: string; webhookSecret: string; baseUrl: string }) { }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        // 1) auth token
        // 2) create pix charge (cob)
        // 3) return providerChargeId + pix payload/qr
        return {
            providerId: this.providerId,
            providerChargeId: "efi_charge_id_here",
            status: "CREATED",
            checkoutUrl: undefined,
            pixCopyPaste: "pix_payload_here",
            pixQrCodeBase64: undefined,
        };
    }

    async getChargeStatus(providerChargeId: string): Promise<ChargeStatus> {
        // call efí: consult cob by txid
        return "PENDING";
    }

    async verifyWebhook(req: any, bodyRaw: Buffer): Promise<VerifiedEvent> {
        // Efí tem seu formato de assinatura/headers; aqui é skeleton.
        // Exemplo genérico HMAC:
        const headerSig = String(req.headers["x-webhook-signature"] ?? "");
        const expected = hmacSha256(this.cfg.webhookSecret, bodyRaw).toString("hex");
        const ok = timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(headerSig, "hex"));
        if (!ok) throw new Error("Invalid webhook signature");

        const parsed = JSON.parse(bodyRaw.toString("utf8"));
        // map parsed → event
        return {
            providerId: this.providerId,
            eventId: parsed?.evento?.id ?? parsed?.id ?? `efi_${Date.now()}`,
            providerChargeId: parsed?.txid ?? parsed?.cob?.txid ?? "unknown",
            status: "PAID",
            paidAt: new Date().toISOString(),
            raw: parsed,
        };
    }
}
