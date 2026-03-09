import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BirthdayDto,
  CalendarApiResponse,
  CalendarConfig,
  CalendarEventClick,
  CalendarFilterItem,
  CalendarSlotClick,
  HolidayDto,
  LeaveRecordDto,
  MeetingDto
} from '@models/general/calendar';
import { CalendarEventPopupComponent } from '@sharedWeb/components/blocks/calendar/views/calendar-event-popup/calendar-event-popup.component';
import { ModalService } from '@services/utils/modal.service';
import { HrService } from '@services/hr/hr.service';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs';
import { addDays, addHours, endOfDay, isSameDay, toDate } from '@helpers/datetime.helper';
import { ActivityInfoComponent } from '../activity-info/activity-info.component';
import { CrmService } from '@services/crm/crm.service';

type EventType = 'meeting' | 'interview' | 'focus' | 'support' | 'travel' | 'all-day';
type CalendarCategory =
  | 'meetings'
  | 'holidays'
  | 'leaveRecords'
  | 'birthdays';

// interface EventMeta {
//   type: EventType;
//   owner?: string;
//   location?: string;
//   candidate?: string;
//   description?: string;
// }

interface EventMeta {
  category: CalendarCategory;
  type: string;
  description?: string | null;
  owner?: string;
  location?: string;
  companyId?: string;
  companyName?: string;
  employeeName?: string;
  profilePic?: string;
  source?: any;
}

interface CalendarEvent<TMeta = EventMeta> {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  meta: TMeta;
}

@Component({
  selector: 'app-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrl: './calendar-events.component.scss'
})
export class CalendarEventsComponent implements OnInit {
  calendarEvents:any;
  calendarView: 'day' | 'week' | 'month' = 'month';
  activeDate = new Date(2026, 2, 9);
  agents:any[] = [];
  contacts:any[] = [];
  leads:any[] = [];
  private fb = inject(NonNullableFormBuilder);

  config: CalendarConfig = {
    startHour: 6,
    endHour: 22,
    slotMinutes: 30,
    weekStartsOn: 1,
    showNowIndicator: true,
    minEventHeightPx: 28,
    monthMaxVisibleEvents: 3,
    businessHoursStart: 9,
    businessHoursEnd: 17,
    use24Hour: true
  };

  calendarFilterItems: CalendarFilterItem[] = [
    {
      _id: 'call',
      key: 'calls',
      label: 'Calls',
      theme: 'yellow',
      icon: 'phoneCall',
      defaultValue: true
    },
    {
      _id: 'meeting',
      key: 'meetings',
      label: 'Meetings',
      theme: 'blue',
      icon: 'calendarClock',
      defaultValue: true
    },
    {
      _id: 'followUp',
      key: 'followUps',
      label: 'Follow-ups',
      theme: 'green',
      icon: 'users',
      defaultValue: true
    },
    {
      _id: 'task',
      key: 'tasks',
      label: 'Tasks',
      theme: 'red',
      icon: 'clipboardCheck',
      defaultValue: true
    }
  ];
  filterForm = this.createFilterForm(this.calendarFilterItems);

  // events: CalendarEvent<EventMeta>[] = [
  //   {
  //     id: 'ev-001',
  //     title: 'Product Planning',
  //     start: new Date(2026, 2, 9, 9, 0),
  //     end: new Date(2026, 2, 9, 10, 30),
  //     meta: {
  //       type: 'meeting',
  //       owner: 'Sarah',
  //       location: 'Room A',
  //       description: 'Quarterly planning and prioritisation'
  //     }
  //   },
  //   {
  //     id: 'ev-002',
  //     title: 'Frontend Interview',
  //     start: new Date(2026, 2, 9, 10, 0),
  //     end: new Date(2026, 2, 9, 11, 0),
  //     meta: {
  //       type: 'interview',
  //       candidate: 'Jane Foster',
  //       owner: 'Michael',
  //       location: 'Google Meet'
  //     }
  //   },
  //   {
  //     id: 'ev-003',
  //     title: 'Deep Work Block',
  //     start: new Date(2026, 2, 9, 13, 0),
  //     end: new Date(2026, 2, 9, 15, 0),
  //     meta: {
  //       type: 'focus',
  //       owner: 'Alex',
  //       description: 'Calendar component implementation'
  //     }
  //   },
  //   {
  //     id: 'ev-004',
  //     title: 'Customer Support Review',
  //     start: new Date(2026, 2, 10, 11, 0),
  //     end: new Date(2026, 2, 10, 12, 30),
  //     meta: {
  //       type: 'support',
  //       owner: 'Operations',
  //       location: 'Room C'
  //     }
  //   },
  //   {
  //     id: 'ev-005',
  //     title: 'Stakeholder Demo',
  //     start: new Date(2026, 2, 12, 14, 0),
  //     end: new Date(2026, 2, 12, 15, 30),
  //     meta: {
  //       type: 'meeting',
  //       owner: 'Design Team',
  //       location: 'Zoom'
  //     }
  //   },
  //   {
  //     id: 'ev-006',
  //     title: 'Travel to Client Office',
  //     start: new Date(2026, 2, 13, 8, 30),
  //     end: new Date(2026, 2, 13, 10, 0),
  //     meta: {
  //       type: 'travel',
  //       location: 'Canary Wharf'
  //     }
  //   },
  //   {
  //     id: 'ev-007',
  //     title: 'Architecture Review',
  //     start: new Date(2026, 2, 13, 10, 30),
  //     end: new Date(2026, 2, 13, 12, 0),
  //     meta: {
  //       type: 'meeting',
  //       owner: 'Platform Team',
  //       location: 'Board Room'
  //     }
  //   },
  //   {
  //     id: 'ev-008',
  //     title: 'Design QA',
  //     start: new Date(2026, 2, 14, 15, 0),
  //     end: new Date(2026, 2, 14, 16, 0),
  //     meta: {
  //       type: 'meeting',
  //       owner: 'UI Team'
  //     }
  //   },
  //   {
  //     id: 'ev-009',
  //     title: 'Company Offsite',
  //     start: new Date(2026, 2, 11, 0, 0),
  //     end: new Date(2026, 2, 12, 0, 0),
  //     allDay: true,
  //     meta: {
  //       type: 'all-day',
  //       description: 'All-day internal event'
  //     }
  //   },
  //   {
  //     id: 'ev-010',
  //     title: 'Leadership Sync',
  //     start: new Date(2026, 2, 11, 9, 30),
  //     end: new Date(2026, 2, 11, 10, 15),
  //     meta: {
  //       type: 'meeting',
  //       owner: 'Leadership',
  //       location: 'Room B'
  //     }
  //   },
  //   {
  //     id: 'ev-011',
  //     title: '1:1 Catch-up',
  //     start: new Date(2026, 2, 11, 9, 45),
  //     end: new Date(2026, 2, 11, 10, 30),
  //     meta: {
  //       type: 'meeting',
  //       owner: 'Chris',
  //       location: 'Meet'
  //     }
  //   }
  // ];

  constructor(
    private hrService: HrService,
    private crmService: CrmService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.crmService.getAgents(1, 100).subscribe(res => this.agents = res.data);
    this.crmService.getLeads(1, 100).subscribe(res => this.leads = res.data);
    this.crmService.getContacts(1, 100).subscribe(res => this.contacts = res.data);

    // const calendar$ = this.hrService.getCalendar().pipe(
    //   shareReplay({ bufferSize: 1, refCount: true })
    // );

    const calendarEvents$ = this.hrService.getCalendar().pipe(
      map((response: any) => this.mapCalendarResponseToEvents(response.data)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    const filterValue$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.getRawValue()),
      debounceTime(100),
      map(value => this.normalizeFilterValue(value)),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    const filteredCalendarEvents$ = combineLatest([
      calendarEvents$,
      filterValue$
    ]).pipe(
      map(([events, filters]) =>
        events.filter((event:any) => filters[event.meta.category])
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    )
    
    filteredCalendarEvents$.subscribe(res => {
      console.log('Filtered Events', res);
      this.calendarEvents = res
    })
  }

  // getCalendarEvents() {

  // }

  private mapCalendarResponseToEvents(
    response: CalendarApiResponse
  ): CalendarEvent<EventMeta>[] {
    return [
      ...this.mapMeetings(response.meetings ?? []),
      ...this.mapHolidays(response.holidays ?? []),
      ...this.mapLeaveRecords(response.leaveRecords ?? []),
      ...this.mapBirthdays(response.birthdays ?? [])
    ].sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  normalizeFilterValue(value: Record<string, boolean | null>): Record<string, boolean> {
    return Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = !!val;
      return acc;
    }, {} as Record<string, boolean>);
  }

  filterCalendarEvents(events: any[], filters: Record<string, boolean>): any[] {
    return events.filter(event => filters[event.type]);
  }

  handleSlotClick(event: CalendarSlotClick): void {
    console.log('Slot clicked', event);
    const modalData = this.createMeetingValues(event.date);
    this.openActivityModal(modalData);
  }

  createMeetingValues(date: Date, allDay: boolean = false): {
    meetingDate: Date;
    meetingStartTime: Date;
    meetingEndTime: Date;
  } {
    const baseDate = new Date(date);

    const meetingDate = new Date(baseDate);
    meetingDate.setHours(0, 0, 0, 0);

    let meetingStartTime = new Date(baseDate);
    let meetingEndTime = new Date(baseDate);

    if (allDay) {
      meetingStartTime.setHours(0, 0, 0, 0);
      meetingEndTime.setHours(23, 59, 59, 999);
    } 
    else {
      meetingEndTime = new Date(meetingStartTime.getTime() + 60 * 60 * 1000);
    }

    return {
      meetingDate,
      meetingStartTime,
      meetingEndTime
    };
  }

  handleEventClick(event: CalendarEventClick<any>): void {
    console.log('Event clicked', event.calendarEvent);
    this.openCalendarEventModal(event);
  }

  openCalendarEventModal(modalData?:any) {
    const modalConfig:any = {
      width: '30%',
      data: modalData,
    }
    this.modalService.open(
      CalendarEventPopupComponent, 
      modalConfig
    )
    // .subscribe(result => {
    //   if (result.action === 'submit' && result.dirty) {
    //     this.updateAccordionList('holidayTypes');
    //     this.form.controls['holidayName'].reset();
    //   }
    // });
  }

  openActivityModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData && modalData.title ? true : false,
      width: '40%',
      data: modalData,
      agents: this.agents,
      contacts: this.contacts,
      leads: this.leads,
      activityTypes: this.calendarFilterItems
    }
    this.modalService.open(
      ActivityInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.getCalendarEvents();
      }
    });
  }

  onRangeChange(range: { start: Date; end: Date }): void {
    //console.log('Visible range changed', range);
  }

  getEventTypeClass(type?: EventType): string {
    return type ? `event-type-${type}` : 'event-type-default';
  }

  createFilterForm(items: CalendarFilterItem[]): FormGroup {
    const controls: Record<string, FormControl<boolean>> = {};

    for (const item of items) {
      controls[item.key] = this.fb.control(item.defaultValue ?? true);
    }

    return new FormGroup(controls);
  }

  trackByKey(_: number, item: CalendarFilterItem): string {
    return item.key;
  }

  private mapBirthdays(items: BirthdayDto[]): CalendarEvent<EventMeta>[] {
    const currentYear = new Date().getFullYear();

    return items.map(item => {
      const rawDate = toDate(item.employeeBirthday);

      const start = new Date(
        currentYear,
        rawDate.getMonth(),
        rawDate.getDate(),
        0,
        0,
        0,
        0
      );

      const end = endOfDay(start);

      return {
        id: item._id,
        title: `${item.employeeName}'s Birthday`,
        start,
        end,
        allDay: true,
        meta: {
          category: 'birthdays',
          type: 'birthday',
          employeeName: item.employeeName,
          profilePic: item.profilePic,
          source: item
        }
      };
    });
  }

  private mapHolidays(items: HolidayDto[]): CalendarEvent<EventMeta>[] {
    return items.map(item => {
      const start = toDate(item.date);
      const end = endOfDay(start);

      return {
        id: item._id,
        title: item.holidayName,
        start,
        end,
        allDay: true,
        meta: {
          category: 'holidays',
          type: 'holiday',
          description: item.description,
          companyId: item.companyId,
          companyName: item.companyName,
          source: item
        }
      };
    });
  }

  private mapLeaveRecords(items: LeaveRecordDto[]): CalendarEvent<EventMeta>[] {
    return items.map(item => {
      const start = toDate(item.startDate ?? item['date'] ?? new Date());
      const end = toDate(item.endDate ?? item.startDate ?? item['date'] ?? start);

      return {
        id: item._id,
        title: item.employeeName
          ? `${item.employeeName} - ${item.leaveType ?? 'Leave'}`
          : (item.leaveType ?? 'Leave'),
        start,
        end: isSameDay(start, end) ? addDays(end, 1) : end,
        allDay: true,
        meta: {
          category: 'leaveRecords',
          type: 'leave',
          employeeName: item.employeeName,
          description: item.description ?? null,
          source: item
        }
      };
    });
  }

  private mapMeetings(items: MeetingDto[]): CalendarEvent<EventMeta>[] {
    return items.map(item => {
      const start = toDate(item.start ?? item['date'] ?? new Date());
      const end = toDate(item.end ?? item.start ?? item['date'] ?? start);

      return {
        id: item._id,
        title: item.title ?? 'Meeting',
        start,
        end: start.getTime() === end.getTime() ? addHours(start, 1) : end,
        meta: {
          category: 'meetings',
          type: 'meeting',
          owner: item.owner,
          location: item.location,
          description: item.description ?? null,
          source: item
        }
      };
    });
  }

}
