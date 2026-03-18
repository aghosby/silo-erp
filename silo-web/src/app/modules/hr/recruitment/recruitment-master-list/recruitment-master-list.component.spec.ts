import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentMasterListComponent } from './recruitment-master-list.component';

describe('RecruitmentMasterListComponent', () => {
  let component: RecruitmentMasterListComponent;
  let fixture: ComponentFixture<RecruitmentMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentMasterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
