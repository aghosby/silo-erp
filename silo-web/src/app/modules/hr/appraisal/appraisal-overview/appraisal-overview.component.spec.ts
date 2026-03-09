import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalOverviewComponent } from './appraisal-overview.component';

describe('AppraisalOverviewComponent', () => {
  let component: AppraisalOverviewComponent;
  let fixture: ComponentFixture<AppraisalOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
