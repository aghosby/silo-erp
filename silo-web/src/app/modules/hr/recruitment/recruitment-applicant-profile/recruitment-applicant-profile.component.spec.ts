import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentApplicantProfileComponent } from './recruitment-applicant-profile.component';

describe('RecruitmentApplicantProfileComponent', () => {
  let component: RecruitmentApplicantProfileComponent;
  let fixture: ComponentFixture<RecruitmentApplicantProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentApplicantProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentApplicantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
