import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeBoardOverviewComponent } from './notice-board-overview.component';

describe('NoticeBoardOverviewComponent', () => {
  let component: NoticeBoardOverviewComponent;
  let fixture: ComponentFixture<NoticeBoardOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeBoardOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeBoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
