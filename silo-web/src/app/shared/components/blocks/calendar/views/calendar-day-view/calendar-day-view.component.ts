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
import { addMinutes, formatHourLabel, isToday } from '../../utils/calendar-date';
import {
  getAllDayEventsForDate,
  positionDayEvents,
  PositionedEvent
} from '../../utils/calendar-layout';

@Component({
  selector: 'app-calendar-day-view',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './calendar-day-view.component.html',
  styleUrl: './calendar-day-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarDayViewComponent<TMeta = unknown> {
  @Input({ required: true }) date!: Date;
  @Input() events: CalendarEvent<TMeta>[] = [];
  @Input({ required: true }) config!: CalendarConfig;
  @Input() eventTemplate?: TemplateRef<CalendarTemplateContext<TMeta>>;
  @Input() cellTemplate?: TemplateRef<DayCellContext<TMeta>>;

  @Output() slotClick = new EventEmitter<CalendarSlotClick>();
  @Output() eventClick = new EventEmitter<CalendarEventClick<TMeta>>();

  readonly pxPerMinute = 1.5;

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

  get positionedEvents(): PositionedEvent<TMeta>[] {
    return positionDayEvents(this.events, this.date, this.config, this.pxPerMinute);
  }

  get allDayEvents(): CalendarEvent<TMeta>[] {
    return getAllDayEventsForDate(this.events, this.date);
  }

  get nowIndicatorTop(): number {
    const now = new Date();
    return (now.getHours() * 60 + now.getMinutes() - this.config.startHour * 60) * this.pxPerMinute;
  }

  get showNowIndicator(): boolean {
    return this.config.showNowIndicator && isToday(this.date);
  }

  isBusinessHour(slot: Date): boolean {
    return slot.getHours() >= this.config.businessHoursStart
      && slot.getHours() < this.config.businessHoursEnd;
  }

  // formatTimeLabel(slot: Date): string {
  //   return formatHourLabel(slot.getHours(), this.config.use24Hour);
  // }

  formatTimeLabel(slot: Date): string {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !this.config.use24Hour
    }).format(slot);
  }

  onSlotClick(slot: Date, nativeEvent: MouseEvent): void {
    this.slotClick.emit({
      date: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), slot.getHours(), slot.getMinutes()),
      view: 'day',
      hour: slot.getHours(),
      minute: slot.getMinutes(),
      nativeEvent
    });
  }

  onAllDayClick(nativeEvent: MouseEvent): void {
    this.slotClick.emit({
      date: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 0, 0),
      view: 'day',
      nativeEvent
    });
  }

  onEventClick(event: CalendarEvent<TMeta>, nativeEvent: MouseEvent): void {
    nativeEvent.stopPropagation();
    this.eventClick.emit({ calendarEvent: event, view: 'day', nativeEvent });
  }
}