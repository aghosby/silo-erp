import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notice-board-preview',
  templateUrl: './notice-board-preview.component.html',
  styleUrl: './notice-board-preview.component.scss'
})
export class NoticeBoardPreviewComponent {
  @Input() data!:any;
}
