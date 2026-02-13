import type { WebhookService } from "../../core/services/webhook.service";

export function makeWebhookController(svc: WebhookService) {
    return async function webhookHandler(req: any, res: any) {
        const providerId = req.params.providerId;

        // bodyRaw needs to come from the framework without parsing for HMAC to work
        // In Fastify, you might need to use a hook to capture the raw body
        const bodyRaw: Buffer = req.rawBody || Buffer.from(JSON.stringify(req.body));

        try {
            const result = await svc.handle(providerId, req, bodyRaw);
            return res.code(200).send(result);
        } catch (error: any) {
            return res.code(400).send({ ok: false, error: error.message });
        }
    };
}
