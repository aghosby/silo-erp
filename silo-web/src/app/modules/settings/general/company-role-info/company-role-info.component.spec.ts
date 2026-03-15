import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRoleInfoComponent } from './company-role-info.component';

describe('CompanyRoleInfoComponent', () => {
  let component: CompanyRoleInfoComponent;
  let fixture: ComponentFixture<CompanyRoleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRoleInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRoleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
