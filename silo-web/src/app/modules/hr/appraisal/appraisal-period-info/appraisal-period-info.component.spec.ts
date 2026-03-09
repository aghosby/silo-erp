import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalPeriodInfoComponent } from './appraisal-period-info.component';

describe('AppraisalPeriodInfoComponent', () => {
  let component: AppraisalPeriodInfoComponent;
  let fixture: ComponentFixture<AppraisalPeriodInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalPeriodInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalPeriodInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
