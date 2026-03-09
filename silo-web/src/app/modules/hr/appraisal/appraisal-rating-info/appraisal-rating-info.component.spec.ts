import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalRatingInfoComponent } from './appraisal-rating-info.component';

describe('AppraisalRatingInfoComponent', () => {
  let component: AppraisalRatingInfoComponent;
  let fixture: ComponentFixture<AppraisalRatingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalRatingInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalRatingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
