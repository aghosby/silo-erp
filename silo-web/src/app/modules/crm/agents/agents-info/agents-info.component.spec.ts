import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsInfoComponent } from './agents-info.component';

describe('AgentsInfoComponent', () => {
  let component: AgentsInfoComponent;
  let fixture: ComponentFixture<AgentsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
