import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentOnboardingComponent } from './recruitment-onboarding.component';

describe('RecruitmentOnboardingComponent', () => {
  let component: RecruitmentOnboardingComponent;
  let fixture: ComponentFixture<RecruitmentOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentOnboardingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
