import { Component, OnInit } from '@angular/core';
import { FilterConfig } from '@models/general/table-data';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-deals-report',
  templateUrl: './deals-report.component.html',
  styleUrl: './deals-report.component.scss'
})
export class DealsReportComponent implements OnInit {
  agentsList:any[] = [];
  industriesList:any[] = [];
  selectedRows:any[] = [];
  tableData!: any[];
  isLoading = false;

  tableFilters!: FilterConfig[];
  private search$ = new Subject<string>();
  private filters$ = new BehaviorSubject<any>({});
  private paging$ = new BehaviorSubject<{ page: number; pageSize: number }>({ page: 1, pageSize: 10 });
  private unsubscribe$ = new Subject<void>();

  // Paging object sent to dynamic-table
  paging = {
    page: 1,
    pageSize: 10,
    total: 0
  };

  ngOnInit(): void {
      
  }
}
