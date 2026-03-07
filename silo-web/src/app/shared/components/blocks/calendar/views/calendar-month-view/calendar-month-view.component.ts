import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  CalendarConfig,
  CalendarEvent,
  CalendarEventClick,
  CalendarSlotClick,
  CalendarTemplateContext,
  DayCellContext
} from '@models/general/calendar';
import {
  addDays,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek
} from '../../utils/calendar-date';

@Component({
  selector: 'app-calendar-month-view',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './calendar-month-view.component.html',
  styleUrl: './calendar-month-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarMonthViewComponent<TMeta = unknown> {
  @Input({ required: true }) date!: Date;
  @Input() events: CalendarEvent<TMeta>[] = [];
  @Input({ required: true }) config!: CalendarConfig;
  @Input() eventTemplate?: TemplateRef<CalendarTemplateContext<TMeta>>;
  @Input() cellTemplate?: TemplateRef<DayCellContext<TMeta>>;

  @Output() slotClick = new EventEmitter<CalendarSlotClick>();
  @Output() eventClick = new EventEmitter<CalendarEventClick<TMeta>>();

  readonly weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  get monthDays(): Date[] {
    const monthStart = startOfMonth(this.date);
    const gridStart = startOfWeek(monthStart, this.config.weekStartsOn);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }

  getEvents(day: Date): CalendarEvent<TMeta>[] {
    return this.events
      .filter(event => {
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const nextDay = addDays(dayStart, 1);
        return event.start < nextDay && event.end > dayStart;
      })
      .sort((a, b) => {
        if (!!a.allDay !== !!b.allDay) {
          return a.allDay ? -1 : 1;
        }
        return a.start.getTime() - b.start.getTime();
      });
  }

  visibleEvents(day: Date): CalendarEvent<TMeta>[] {
    return this.getEvents(day).slice(0, this.config.monthMaxVisibleEvents);
  }

  hiddenCount(day: Date): number {
    return Math.max(0, this.getEvents(day).length - this.config.monthMaxVisibleEvents);
  }

  isCurrentMonth(day: Date): boolean {
    return isSameMonth(day, this.date);
  }

  isToday(day: Date): boolean {
    return isToday(day);
  }

  onDayClick(day: Date, nativeEvent: MouseEvent): void {
    this.slotClick.emit({
      date: day,
      view: 'month',
      nativeEvent
    });
  }

  onEventClick(event: CalendarEvent<TMeta>, nativeEvent: MouseEvent): void {
    nativeEvent.stopPropagation();
    this.eventClick.emit({ calendarEvent: event, view: 'month', nativeEvent });
  }

  onMoreClick(day: Date, nativeEvent: MouseEvent): void {
    nativeEvent.stopPropagation();
    this.slotClick.emit({
      date: day,
      view: 'month',
      nativeEvent
    });
  }
}