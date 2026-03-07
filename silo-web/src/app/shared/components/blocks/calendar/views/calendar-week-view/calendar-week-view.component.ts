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
  CalendarTemplateContext
} from '@models/general/calendar';
import {
  addDays,
  addMinutes,
  formatHourLabel,
  isSameDay,
  isToday,
  startOfWeek
} from '../../utils/calendar-date';
import {
  getAllDayEventsForDate,
  positionDayEvents,
  PositionedEvent
} from '../../utils/calendar-layout';

@Component({
  selector: 'app-calendar-week-view',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './calendar-week-view.component.html',
  styleUrl: './calendar-week-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarWeekViewComponent<TMeta = unknown> {
  @Input({ required: true }) date!: Date;
  @Input() events: CalendarEvent<TMeta>[] = [];
  @Input({ required: true }) config!: CalendarConfig;
  @Input() eventTemplate?: TemplateRef<CalendarTemplateContext<TMeta>>;
  @Input() slotTemplate?: TemplateRef<any>;

  @Output() slotClick = new EventEmitter<CalendarSlotClick>();
  @Output() eventClick = new EventEmitter<CalendarEventClick<TMeta>>();

  readonly pxPerMinute = 1.5;

  get days(): Date[] {
    const start = startOfWeek(this.date, this.config.weekStartsOn);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  get timeSlots(): Date[] {
    const slots: Date[] = [];
    const base = new Date(this.date);
    base.setHours(this.config.startHour, 0, 0, 0);

    const totalMinutes = (this.config.endHour - this.config.startHour) * 60;
    for (let m = 0; m < totalMinutes; m += this.config.slotMinutes) {
      slots.push(addMinutes(base, m));
    }
    return slots;
  }

  positionedEvents(day: Date): PositionedEvent<TMeta>[] {
    return positionDayEvents(this.events, day, this.config, this.pxPerMinute);
  }

  allDayEvents(day: Date): CalendarEvent<TMeta>[] {
    return getAllDayEventsForDate(this.events, day);
  }

  isToday(day: Date): boolean {
    return isToday(day);
  }

  showNowIndicator(day: Date): boolean {
    return this.config.showNowIndicator && isToday(day);
  }

  get nowIndicatorTop(): number {
    const now = new Date();
    return (now.getHours() * 60 + now.getMinutes() - this.config.startHour * 60) * this.pxPerMinute;
  }

  isBusinessHour(slot: Date): boolean {
    return slot.getHours() >= this.config.businessHoursStart
      && slot.getHours() < this.config.businessHoursEnd;
  }

  formatTimeLabel(slot: Date): string {
    return formatHourLabel(slot.getHours(), this.config.use24Hour);
  }

  onSlotClick(day: Date, slot: Date, nativeEvent: MouseEvent): void {
    this.slotClick.emit({
      date: new Date(day.getFullYear(), day.getMonth(), day.getDate(), slot.getHours(), slot.getMinutes()),
      view: 'week',
      hour: slot.getHours(),
      minute: slot.getMinutes(),
      nativeEvent
    });
  }

  onAllDayClick(day: Date, nativeEvent: MouseEvent): void {
    this.slotClick.emit({
      date: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0),
      view: 'week',
      nativeEvent
    });
  }

  onEventClick(event: CalendarEvent<TMeta>, nativeEvent: MouseEvent): void {
    nativeEvent.stopPropagation();
    this.eventClick.emit({ calendarEvent: event, view: 'week', nativeEvent });
  }

  trackByDate = (_: number, day: Date) => day.toISOString();
  trackByEvent = (_: number, item: PositionedEvent<TMeta>) => item.event.id;
}