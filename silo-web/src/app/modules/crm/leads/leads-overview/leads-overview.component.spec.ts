import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsOverviewComponent } from './leads-overview.component';

describe('LeadsOverviewComponent', () => {
  let component: LeadsOverviewComponent;
  let fixture: ComponentFixture<LeadsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
