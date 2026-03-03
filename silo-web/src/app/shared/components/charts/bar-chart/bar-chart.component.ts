import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit {
  @Input() chartSize:any = [280, 280];
  @Input() chart2d:boolean = false;
  @Input() colorScheme:any = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  @Input() chartData!:any;
  @Input() xAxisLabel:string = '';
  @Input() yAxisLabel:string = '';

  ngOnInit(): void {
      
  }
}
