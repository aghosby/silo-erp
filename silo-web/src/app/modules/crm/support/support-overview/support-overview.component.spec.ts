import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportOverviewComponent } from './support-overview.component';

describe('SupportOverviewComponent', () => {
  let component: SupportOverviewComponent;
  let fixture: ComponentFixture<SupportOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
