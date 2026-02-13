import type { CheckoutService } from "../../core/services/checkout.service";

export function makeCheckoutController(svc: CheckoutService) {
    return async function checkoutHandler(req: any, res: any) {
        const { providerId, ...input } = req.body;

        if (!providerId) {
            return res.code(400).send({ error: "providerId is required" });
        }

        try {
            const charge = await svc.checkout(providerId, input);
            return res.code(201).send(charge);
        } catch (error: any) {
            return res.code(400).send({ error: error.message });
        }
    };
}
