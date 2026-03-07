export function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

export function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export function addMinutes(date: Date, minutes: number): Date {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + minutes);
    return d;
}

export function startOfWeek(date: Date, weekStartsOn: number = 1): Date {
    const d = startOfDay(date);
    const day = d.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    return addDays(d, -diff);
}

export function endOfWeek(date: Date, weekStartsOn: number = 1): Date {
    const start = startOfWeek(date, weekStartsOn);
    return endOfDay(addDays(start, 6));
}

export function startOfMonth(date: Date): Date {
    const d = startOfDay(date);
    d.setDate(1);
    return d;
}

export function endOfMonth(date: Date): Date {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return endOfDay(d);
}

export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function clampDate(date: Date, min: Date, max: Date): Date {
    return new Date(Math.min(Math.max(date.getTime(), min.getTime()), max.getTime()));
}

export function minutesSinceStartOfDay(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

export function overlapsRange(
    start: Date,
    end: Date,
    rangeStart: Date,
    rangeEnd: Date
): boolean {
    return start < rangeEnd && end > rangeStart;
}

export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

export function formatHourLabel(hour: number, use24Hour: boolean): string {
    const base = new Date();
    base.setHours(hour, 0, 0, 0);
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !use24Hour
    }).format(base);
}