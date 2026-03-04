import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsOverviewComponent } from './agents-overview.component';

describe('AgentsOverviewComponent', () => {
  let component: AgentsOverviewComponent;
  let fixture: ComponentFixture<AgentsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
