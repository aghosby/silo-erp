import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-event-popup',
  templateUrl: './calendar-event-popup.component.html',
  styleUrl: './calendar-event-popup.component.scss'
})
export class CalendarEventPopupComponent implements OnInit {
  eventDetails: any;
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  ngOnInit(): void {
    console.log(this.data);
    this.eventDetails = this.data.data.calendarEvent;
  }

  // alert(
  //   [
  //     `Title: ${event.calendarEvent.title}`,
  //     `Type: ${event.calendarEvent.meta?.type ?? 'N/A'}`,
  //     `Start: ${event.calendarEvent.start.toLocaleString()}`,
  //     `End: ${event.calendarEvent.end.toLocaleString()}`
  //   ].join('\n')
  // );
}
