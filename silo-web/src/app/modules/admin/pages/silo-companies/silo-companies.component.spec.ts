import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiloCompaniesComponent } from './silo-companies.component';

describe('SiloCompaniesComponent', () => {
  let component: SiloCompaniesComponent;
  let fixture: ComponentFixture<SiloCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiloCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiloCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
