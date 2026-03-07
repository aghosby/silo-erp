import { TemplateRef } from '@angular/core';

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent<TMeta = unknown> {
    id: string;
    title?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    cssClass?: string;
    color?: string;
    meta?: TMeta;
}

export interface CalendarDateRange {
    start: Date;
    end: Date;
}

export interface CalendarSlotClick {
    date: Date;
    view: CalendarView;
    hour?: number;
    minute?: number;
    dayIndex?: number;
    nativeEvent: MouseEvent;
}

export interface CalendarEventClick<TMeta = unknown> {
    calendarEvent: CalendarEvent<TMeta>;
    view: CalendarView;
    nativeEvent: MouseEvent;
}

export interface CalendarTemplateContext<TMeta = unknown> {
    $implicit: CalendarEvent<TMeta>;
    event: CalendarEvent<TMeta>;
    view: CalendarView;
    date: Date;
    range?: CalendarDateRange;
    top?: number;
    height?: number;
    left?: number;
    width?: number;
    isStart?: boolean;
    isEnd?: boolean;
}

export interface DayCellContext<TMeta = unknown> {
    $implicit: Date;
    date: Date;
    view: CalendarView;
    events: CalendarEvent<TMeta>[];
    isToday: boolean;
    isCurrentMonth?: boolean;
    isSelected?: boolean;
}

export interface CalendarConfig {
    startHour: number;
    endHour: number;
    slotMinutes: number;
    weekStartsOn: 0 | 1 | 6;
    showNowIndicator: boolean;
    minEventHeightPx: number;
    monthMaxVisibleEvents: number;
    businessHoursStart: number;
    businessHoursEnd: number;
    use24Hour: boolean;
}

export interface CalendarFilterItem {
    key: string;
    label: string;
    theme: string;
    icon: any;
    defaultValue?: boolean;
}

export interface MeetingDto {
    _id: string;
    title?: string;
    start?: string;
    end?: string;
    description?: string | null;
    owner?: string;
    location?: string;
    [key: string]: any;
}

export interface HolidayDto {
    _id: string;
    holidayName: string;
    date: string;
    description: string | null;
    companyId: string;
    companyName: string;
    __v?: number;
}

export interface LeaveRecordDto {
    _id: string;
    employeeName?: string;
    startDate?: string;
    endDate?: string;
    leaveType?: string;
    description?: string | null;
    [key: string]: any;
}

export interface BirthdayDto {
    _id: string;
    employeeName: string;
    employeeBirthday: string;
    profilePic?: string;
}

export interface CalendarApiResponse {
    meetings: MeetingDto[];
    holidays: HolidayDto[];
    leaveRecords: LeaveRecordDto[];
    birthdays: BirthdayDto[];
}