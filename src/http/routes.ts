import type { FastifyInstance } from "fastify";
import type { CheckoutService } from "../core/services/checkout.service";
import type { WebhookService } from "../core/services/webhook.service";
import type { UnlockService } from "../core/services/unlock.service";
import { makeCheckoutController } from "./controllers/checkout.controller";
import { makeWebhookController } from "./controllers/webhook.controller";
import { makeUnlockController } from "./controllers/unlock.controller";

export async function routes(
    fastify: FastifyInstance,
    services: { checkout: CheckoutService; webhook: WebhookService; unlock: UnlockService }
) {
    fastify.post("/checkout", makeCheckoutController(services.checkout));
    fastify.post("/webhook/:providerId", makeWebhookController(services.webhook));
    fastify.get("/unlock/verify/:receiptId", makeUnlockController(services.unlock));

    fastify.get("/status/:chargeId", async (req: any, res) => {
        // Placeholder for status check
        return { ok: true, status: "PENDING" };
    });

    fastify.post("/checkin", async (req: any, res) => {
        // Placeholder for checkin
        return { ok: true, checkedIn: true };
    });
}
