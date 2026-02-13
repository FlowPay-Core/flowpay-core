export function formatCents(cents: number): string {
    return (cents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
