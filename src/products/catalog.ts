export type Product = {
    productRef: string;
    permissions: string[];
    kind: "MEMBERSHIP" | "EVENT_PASS";
};

export const CATALOG: Record<string, Product> = {
    "MEMBERSHIP_BASIC": {
        productRef: "MEMBERSHIP_BASIC",
        kind: "MEMBERSHIP",
        permissions: ["ACCESS:MEMBERS_AREA"],
    },
    "EVENT_PASS_PRXP": {
        productRef: "EVENT_PASS_PRXP",
        kind: "EVENT_PASS",
        permissions: ["ACCESS:EVENT", "CHECKIN:ALLOWED"],
    },
};
