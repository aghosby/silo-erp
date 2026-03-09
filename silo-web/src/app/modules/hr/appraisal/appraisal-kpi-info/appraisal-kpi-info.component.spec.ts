import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalKpiInfoComponent } from './appraisal-kpi-info.component';

describe('AppraisalKpiInfoComponent', () => {
  let component: AppraisalKpiInfoComponent;
  let fixture: ComponentFixture<AppraisalKpiInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalKpiInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalKpiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
