import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentScreeningComponent } from './recruitment-screening.component';

describe('RecruitmentScreeningComponent', () => {
  let component: RecruitmentScreeningComponent;
  let fixture: ComponentFixture<RecruitmentScreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentScreeningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
