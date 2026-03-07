import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventPopupComponent } from './calendar-event-popup.component';

describe('CalendarEventPopupComponent', () => {
  let component: CalendarEventPopupComponent;
  let fixture: ComponentFixture<CalendarEventPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEventPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarEventPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
