import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentJobDetailsComponent } from './recruitment-job-details.component';

describe('RecruitmentJobDetailsComponent', () => {
  let component: RecruitmentJobDetailsComponent;
  let fixture: ComponentFixture<RecruitmentJobDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentJobDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
