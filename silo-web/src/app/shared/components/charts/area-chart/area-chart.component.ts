import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UtilityService } from '@services/utils/utility.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss'
})
export class AreaChartComponent implements OnInit {
  AreaHighcharts: typeof Highcharts = Highcharts;

  // 👇 Make chart options reusable with Input
  @Input() chartTitle: string = '';
  @Input() chartDataYAxis: number[] = [7.9, 10.2, 13.7, 16.5, 17.9, 15.2, 17.0, 20.6, 22.2, 26.3, 29.6, 27.8];
  @Input() chartDataXAxis: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  @Input() height: string = '250px';

  chartOptions: Highcharts.Options = {};

  constructor(
    private utils: UtilityService,
  ) {}

  ngOnInit(): void {
    const currency = this.utils.currency;
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartDataYAxis'] && this.chartDataYAxis) {
      this.updateChart();
    }
  }

  updateChart() {
    const adjustedData = this.chartDataYAxis.map(val => val === 0 ? 0 : val);
    const maxVal = Math.max(...adjustedData) || 100;

    const currency = this.utils.currency; // capture in closure for formatter

    this.chartOptions = {
      chart: { type: 'areaspline' },
      credits: { enabled: false },
      title: { text: this.chartTitle },
      xAxis: {
        categories: this.chartDataXAxis,
        labels: { enabled: true }
      },
      yAxis: {
        min: 0,
        max: maxVal * 1.2,
        title: { text: '' },
        labels: {
          formatter: function () {
            return currency + this.axis.defaultLabelFormatter.call(this);
          }
        }
      },
      colors: ['#4db1ff'],
      series: [{
        type: 'areaspline',
        name: this.chartTitle,
        showInLegend: false,
        data: adjustedData,
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#4db1ff'],
            [1, Highcharts.color('#4db1ff').setOpacity(0).get('rgba') as string]
          ]
        },
        marker: {
          enabled: true,
          radius: 4,
          fillColor: '#4db1ff',
          lineWidth: 1,
          lineColor: '#4db1ff'
        }
      }]
    };
  }
}
