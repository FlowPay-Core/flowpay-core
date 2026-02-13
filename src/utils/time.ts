export function now(): string {
    return new Date().toISOString();
}

export function addSeconds(date: Date, seconds: number): Date {
    const d = new Date(date);
    d.setSeconds(d.getSeconds() + seconds);
    return d;
}

export function isExpired(isoTimestamp: string): boolean {
    return new Date(isoTimestamp) < new Date();
}
