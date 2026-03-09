import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalKpisComponent } from './appraisal-kpis.component';

describe('AppraisalKpisComponent', () => {
  let component: AppraisalKpisComponent;
  let fixture: ComponentFixture<AppraisalKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalKpisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
