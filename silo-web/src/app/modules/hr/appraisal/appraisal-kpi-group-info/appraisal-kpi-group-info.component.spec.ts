import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalKpiGroupInfoComponent } from './appraisal-kpi-group-info.component';

describe('AppraisalKpiGroupInfoComponent', () => {
  let component: AppraisalKpiGroupInfoComponent;
  let fixture: ComponentFixture<AppraisalKpiGroupInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalKpiGroupInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalKpiGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
