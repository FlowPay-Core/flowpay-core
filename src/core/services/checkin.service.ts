import type { Store } from "../store/store";

export class CheckinService {
    constructor(private store: Store) { }

    async checkin(receiptId: string) {
        // Aqui você criaria tabela checkins:
        // receipt_id unique + checked_in_at
        // Para MVP: você pode implementar no Store e garantir uniqueness.
        return { ok: true, receiptId, checkedInAt: new Date().toISOString() };
    }
}
