import type { UnlockService } from "../../core/services/unlock.service";

export function makeUnlockController(svc: UnlockService) {
    return async function verifyReceiptHandler(req: any, res: any) {
        const { receiptId } = req.params;

        if (!receiptId) {
            return res.code(400).send({ error: "receiptId is required" });
        }

        try {
            const result = await svc.verifyReceipt(receiptId);
            return res.code(200).send(result);
        } catch (error: any) {
            return res.code(400).send({ error: error.message });
        }
    };
}
