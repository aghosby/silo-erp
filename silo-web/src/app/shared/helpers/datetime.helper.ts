export function toDate(value: string | Date): Date {
    const date = value instanceof Date ? value : new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
}

export function addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

export function addHours(date: Date, hours: number): Date {
    const next = new Date(date);
    next.setHours(next.getHours() + hours);
    return next;
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}