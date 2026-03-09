import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalPortalComponent } from './appraisal-portal.component';

describe('AppraisalPortalComponent', () => {
  let component: AppraisalPortalComponent;
  let fixture: ComponentFixture<AppraisalPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
