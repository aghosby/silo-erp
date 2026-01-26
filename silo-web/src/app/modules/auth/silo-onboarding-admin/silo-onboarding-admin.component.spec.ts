import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiloOnboardingAdminComponent } from './silo-onboarding-admin.component';

describe('SiloOnboardingAdminComponent', () => {
  let component: SiloOnboardingAdminComponent;
  let fixture: ComponentFixture<SiloOnboardingAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiloOnboardingAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiloOnboardingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
