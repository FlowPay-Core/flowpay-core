import Fastify from "fastify";
import dotenv from "dotenv";
import { ProviderRegistry } from "./rails/registry";
import { MemoryStore } from "./core/store/memory.store";
import { CheckoutService } from "./core/services/checkout.service";
import { WebhookService } from "./core/services/webhook.service";
import { UnlockService } from "./core/services/unlock.service";
import { routes } from "./http/routes";

dotenv.config();

// Setup
const store = new MemoryStore();
const registry = new ProviderRegistry();
const checkoutService = new CheckoutService(store, registry);
const webhookService = new WebhookService(store, registry);
const unlockService = new UnlockService(store, process.env.RECEIPT_SECRET || "default_secret");

const fastify = Fastify({
    logger: true,
});

// Capture raw body for webhook verification
fastify.addContentTypeParser("application/json", { parseAs: "buffer" }, (req, body, done) => {
    try {
        (req as any).rawBody = body;
        const json = JSON.parse(body.toString());
        done(null, json);
    } catch (err: any) {
        err.statusCode = 400;
        done(err, undefined);
    }
});

// Register Routes
fastify.register(routes, {
    checkout: checkoutService,
    webhook: webhookService,
    unlock: unlockService
});

// Bootstrap
const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await fastify.listen({ port, host: "0.0.0.0" });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
