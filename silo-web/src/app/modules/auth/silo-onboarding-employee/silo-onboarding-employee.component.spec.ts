import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiloOnboardingEmployeeComponent } from './silo-onboarding-employee.component';

describe('SiloOnboardingEmployeeComponent', () => {
  let component: SiloOnboardingEmployeeComponent;
  let fixture: ComponentFixture<SiloOnboardingEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiloOnboardingEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiloOnboardingEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
