import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarConfig,
  CalendarDateRange,
  CalendarEvent,
  CalendarEventClick,
  CalendarSlotClick,
  CalendarTemplateContext,
  CalendarView,
  DayCellContext
} from '@models/general/calendar';
import { CalendarDayViewComponent } from '../views/calendar-day-view/calendar-day-view.component';
import { CalendarWeekViewComponent } from '../views/calendar-week-view/calendar-week-view.component';
import { CalendarMonthViewComponent } from '../views/calendar-month-view/calendar-month-view.component';
import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek
} from '../utils/calendar-date';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarDayViewComponent,
    CalendarWeekViewComponent,
    CalendarMonthViewComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent<TMeta = unknown> {
  @Input({ required: true }) events: CalendarEvent<TMeta>[] = [];
  @Input() view: CalendarView = 'week';
  @Input() activeDate: Date = new Date();

  @Input() config: CalendarConfig = {
    startHour: 6,
    endHour: 22,
    slotMinutes: 30,
    weekStartsOn: 1,
    showNowIndicator: true,
    minEventHeightPx: 24,
    monthMaxVisibleEvents: 3,
    businessHoursStart: 9,
    businessHoursEnd: 17,
    use24Hour: true
  };

  @Input() dayEventTemplate?: TemplateRef<CalendarTemplateContext<TMeta>>;
  @Input() weekEventTemplate?: TemplateRef<CalendarTemplateContext<TMeta>>;
  @Input() monthEventTemplate?: TemplateRef<CalendarTemplateContext<TMeta>>;

  @Input() dayCellTemplate?: TemplateRef<DayCellContext<TMeta>>;
  @Input() weekSlotTemplate?: TemplateRef<any>;
  @Input() monthCellTemplate?: TemplateRef<DayCellContext<TMeta>>;

  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() activeDateChange = new EventEmitter<Date>();
  @Output() slotClick = new EventEmitter<CalendarSlotClick>();
  @Output() eventClick = new EventEmitter<CalendarEventClick<TMeta>>();
  @Output() rangeChange = new EventEmitter<CalendarDateRange>();

  readonly currentView = signal<CalendarView>('week');
  readonly currentDate = signal(new Date());

  ngOnInit(): void {
    this.syncInputs();
  }

  ngOnChanges(): void {
    this.syncInputs();
  }

  setView(view: CalendarView): void {
    this.currentView.set(view);
    this.viewChange.emit(view);
    this.emitRange();
  }

  setDate(date: Date): void {
    this.currentDate.set(new Date(date));
    this.activeDateChange.emit(new Date(date));
    this.emitRange();
  }

  previous(): void {
    const date = new Date(this.currentDate());
    const view = this.currentView();

    if (view === 'day') {
      date.setDate(date.getDate() - 1);
    } else if (view === 'week') {
      date.setDate(date.getDate() - 7);
    } else {
      date.setMonth(date.getMonth() - 1);
    }

    this.setDate(date);
  }

  next(): void {
    const date = new Date(this.currentDate());
    const view = this.currentView();

    if (view === 'day') {
      date.setDate(date.getDate() + 1);
    } else if (view === 'week') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    this.setDate(date);
  }

  today(): void {
    this.setDate(new Date());
  }

  get title(): string {
    const date = this.currentDate();
    const view = this.currentView();

    if (view === 'month') {
      return new Intl.DateTimeFormat(undefined, {
        month: 'long',
        year: 'numeric'
      }).format(date);
    }

    if (view === 'day') {
      return new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }

    const weekStart = startOfWeek(date, this.config.weekStartsOn);
    const weekEnd = addDays(weekStart, 6);

    const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
    const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();

    if (sameMonth && sameYear) {
      return `${new Intl.DateTimeFormat(undefined, { month: 'long' }).format(weekStart)} ${weekStart.getDate()}–${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }

    return `${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(weekStart)} – ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(weekEnd)}`;
  }

  private syncInputs(): void {
    this.currentView.set(this.view);
    this.currentDate.set(new Date(this.activeDate));
    this.emitRange();
  }

  private emitRange(): void {
    const date = this.currentDate();
    const view = this.currentView();
    let range: CalendarDateRange;

    if (view === 'day') {
      range = {
        start: startOfDay(date),
        end: addDays(startOfDay(date), 1)
      };
    } else if (view === 'week') {
      range = {
        start: startOfWeek(date, this.config.weekStartsOn),
        end: addDays(startOfWeek(date, this.config.weekStartsOn), 7)
      };
    } else {
      range = {
        start: startOfMonth(date),
        end: addDays(endOfMonth(date), 1)
      };
    }

    this.rangeChange.emit(range);
  }
}