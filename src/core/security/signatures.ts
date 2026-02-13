import crypto from "node:crypto";

export function hmacSha256(secret: string, payload: Buffer): Buffer {
    return crypto.createHmac("sha256", secret).update(payload).digest();
}

export function timingSafeEqual(a: Buffer, b: Buffer): boolean {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

// Receipt signing (server-side)
export function signReceipt(secret: string, receiptPayloadJson: string): string {
    const sig = hmacSha256(secret, Buffer.from(receiptPayloadJson, "utf8"));
    return sig.toString("hex");
}

export function verifyReceiptSignature(secret: string, receiptPayloadJson: string, sigHex: string): boolean {
    const expected = hmacSha256(secret, Buffer.from(receiptPayloadJson, "utf8"));
    const provided = Buffer.from(sigHex, "hex");
    return timingSafeEqual(expected, provided);
}
