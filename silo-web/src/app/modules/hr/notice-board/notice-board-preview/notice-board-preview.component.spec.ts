import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeBoardPreviewComponent } from './notice-board-preview.component';

describe('NoticeBoardPreviewComponent', () => {
  let component: NoticeBoardPreviewComponent;
  let fixture: ComponentFixture<NoticeBoardPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeBoardPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeBoardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
