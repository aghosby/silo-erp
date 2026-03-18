import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentJobInfoComponent } from './recruitment-job-info.component';

describe('RecruitmentJobInfoComponent', () => {
  let component: RecruitmentJobInfoComponent;
  let fixture: ComponentFixture<RecruitmentJobInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentJobInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentJobInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
