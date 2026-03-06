import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsReportComponent } from './contacts-report.component';

describe('ContactsReportComponent', () => {
  let component: ContactsReportComponent;
  let fixture: ComponentFixture<ContactsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
