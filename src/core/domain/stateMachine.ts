import type { ChargeStatus } from "../../rails/railAdapter";

const allowed: Record<ChargeStatus, ChargeStatus[]> = {
    CREATED: ["PENDING", "PAID", "EXPIRED", "CANCELED"],
    PENDING: ["PAID", "EXPIRED", "CANCELED"],
    PAID: [],
    EXPIRED: [],
    CANCELED: [],
    UNKNOWN: ["CREATED", "PENDING", "PAID", "EXPIRED", "CANCELED"],
};

export function canTransition(from: ChargeStatus, to: ChargeStatus): boolean {
    return allowed[from]?.includes(to) ?? false;
}
