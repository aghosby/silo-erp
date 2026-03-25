import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-loading',
  templateUrl: './data-loading.component.html',
  styleUrl: './data-loading.component.scss'
})
export class DataLoadingComponent {
  @Input() height:string = '4rem';
}
