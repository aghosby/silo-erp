import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsReportComponent } from './deals-report.component';

describe('DealsReportComponent', () => {
  let component: DealsReportComponent;
  let fixture: ComponentFixture<DealsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
