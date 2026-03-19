import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentJobBoardComponent } from './recruitment-job-board.component';

describe('RecruitmentJobBoardComponent', () => {
  let component: RecruitmentJobBoardComponent;
  let fixture: ComponentFixture<RecruitmentJobBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentJobBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentJobBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
