import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsInfoComponent } from './leads-info.component';

describe('LeadsInfoComponent', () => {
  let component: LeadsInfoComponent;
  let fixture: ComponentFixture<LeadsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
