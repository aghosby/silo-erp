import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentHireChecklistComponent } from './recruitment-hire-checklist.component';

describe('RecruitmentHireChecklistComponent', () => {
  let component: RecruitmentHireChecklistComponent;
  let fixture: ComponentFixture<RecruitmentHireChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentHireChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentHireChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
