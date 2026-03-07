import { CalendarConfig, CalendarEvent } from '@models/general/calendar';
import {
    clampDate,
    endOfDay,
    minutesSinceStartOfDay,
    overlapsRange,
    startOfDay
} from './calendar-date';

export interface PositionedEvent<TMeta = unknown> {
    event: CalendarEvent<TMeta>;
    top: number;
    height: number;
    left: number;
    width: number;
    startClamped: Date;
    endClamped: Date;
    isStart: boolean;
    isEnd: boolean;
}

export function getEventsForDate<TMeta>(
    events: CalendarEvent<TMeta>[],
    date: Date
): CalendarEvent<TMeta>[] {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    return events.filter(event =>
        overlapsRange(event.start, event.end, dayStart, new Date(dayEnd.getTime() + 1))
    );
}

export function getAllDayEventsForDate<TMeta>(
    events: CalendarEvent<TMeta>[],
    date: Date
): CalendarEvent<TMeta>[] {
    const dayStart = startOfDay(date);
    const dayEndPlus = new Date(endOfDay(date).getTime() + 1);

    return events.filter(event =>
        !!event.allDay && overlapsRange(event.start, event.end, dayStart, dayEndPlus)
    );
}

export function getTimedEventsForDate<TMeta>(
    events: CalendarEvent<TMeta>[],
    date: Date
): CalendarEvent<TMeta>[] {
    return getEventsForDate(events, date).filter(e => !e.allDay);
}

export function positionDayEvents<TMeta>(
    events: CalendarEvent<TMeta>[],
    date: Date,
    config: CalendarConfig,
    pxPerMinute: number
): PositionedEvent<TMeta>[] {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const visibleEvents = getTimedEventsForDate(events, date).map(event => ({
        event,
        startClamped: clampDate(event.start, dayStart, dayEnd),
        endClamped: clampDate(event.end, dayStart, dayEnd)
    })).sort((a, b) => a.startClamped.getTime() - b.startClamped.getTime());

    const clusters: Array<typeof visibleEvents> = [];
    let currentCluster: typeof visibleEvents = [];
    let clusterMaxEnd = 0;

    for (const item of visibleEvents) {
        if (currentCluster.length === 0) {
            currentCluster.push(item);
            clusterMaxEnd = item.endClamped.getTime();
            continue;
        }

        if (item.startClamped.getTime() < clusterMaxEnd) {
            currentCluster.push(item);
            clusterMaxEnd = Math.max(clusterMaxEnd, item.endClamped.getTime());
        } 
        else {
            clusters.push(currentCluster);
            currentCluster = [item];
            clusterMaxEnd = item.endClamped.getTime();
        }
    }

    if (currentCluster.length) {
        clusters.push(currentCluster);
    }

    const positioned: PositionedEvent<TMeta>[] = [];

    for (const cluster of clusters) {
        const columns: typeof cluster[] = [];

        for (const item of cluster) {
            let placedIndex = -1;

            for (let i = 0; i < columns.length; i++) {
                const last = columns[i][columns[i].length - 1];
                if (last.endClamped.getTime() <= item.startClamped.getTime()) {
                    columns[i].push(item);
                    placedIndex = i;
                    break;
                }
            }

            if (placedIndex === -1) {
                columns.push([item]);
                placedIndex = columns.length - 1;
            }

            const totalCols = columns.length;

            positioned.push({
                event: item.event,
                startClamped: item.startClamped,
                endClamped: item.endClamped,
                top: minutesSinceStartOfDay(item.startClamped) * pxPerMinute,
                height: Math.max(
                (item.endClamped.getTime() - item.startClamped.getTime()) / 60000 * pxPerMinute,
                config.minEventHeightPx
                ),
                left: (placedIndex / totalCols) * 100,
                width: 100 / totalCols,
                isStart: item.event.start >= dayStart,
                isEnd: item.event.end <= dayEnd
            });
        }

        const clusterEvents = positioned.filter(p => cluster.some(c => c.event.id === p.event.id));

        for (const p of clusterEvents) {
            const overlapping = clusterEvents.filter(other =>
                other.event.id !== p.event.id
                && other.startClamped < p.endClamped
                && other.endClamped > p.startClamped
            );

            let maxCols = Math.max(1, overlapping.length + 1);
            if (maxCols < columns.length) {
                maxCols = columns.length;
            }

            const colIndex = Math.round((p.left / 100) * maxCols);
            p.width = 100 / maxCols;
            p.left = colIndex * p.width;
        }
    }

    return positioned.sort((a, b) => a.top - b.top);
}