import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentPortalComponent } from './recruitment-portal.component';

describe('RecruitmentPortalComponent', () => {
  let component: RecruitmentPortalComponent;
  let fixture: ComponentFixture<RecruitmentPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
