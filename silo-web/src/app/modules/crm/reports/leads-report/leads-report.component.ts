import { Component, OnInit } from '@angular/core';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '@services/crm/crm.service';

@Component({
  selector: 'app-leads-report',
  templateUrl: './leads-report.component.html',
  styleUrl: './leads-report.component.scss'
})
export class LeadsReportComponent implements OnInit {
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

  //Lead Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "profilePic",
      label: "",
      order: 2,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      type: 'profile',
      sortable: false
    },
    {
      key: "firstName",
      label: "Name",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "email",
      label: "Email",
      order: 6,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "phoneNumber",
    //   label: "Phone Number",
    //   order: 7,
    //   columnWidth: "12%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    // {
    //   key: "dateOfBirth",
    //   label: "Date of Birth",
    //   order: 8,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "industry",
      label: "Industry",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leadOwner",
      label: "Lead Owner",
      order: 9,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "expectedRevenue",
      label: "Expected Revenue",
      order: 6,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'status',
      statusMap: {
        true: 'active',
        false: 'pending'
      },
      sortable: true
    },
    {
      key: "actions",
      label: "",
      order: 11,
      columnWidth: "10%",
      sortable: false,
      type: "actions",
      actions: [
        { icon: 'view', color: 'var(--blue-theme)', tooltip: 'View', callback: (row: any) => this.viewRow(row) },
        // { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ],
      menuActions: [
        {
          icon: 'briefcase',
          label: 'Convert Lead',
          actionKey: 'convertLead'
        },
        // {
        //   icon: 'userCheck',
        //   label: 'Assign Approvers',
        //   actionKey: 'assignApprover'
        // },
        // {
        //   icon: 'layers2',
        //   label: 'Assign Salary Scale',
        //   actionKey: 'assignSalaryScale'
        // },
        // {
        //   icon: 'send',
        //   label: 'Resend Invite',
        //   actionKey: 'invite'
        // },
      ]
    }
  ]

  constructor(
    private modalService: ModalService,
    private crmService: CrmService,
    private utils: UtilityService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    // Reactive pipeline
    const tableData$ = combineLatest([
      this.search$.pipe(
        debounceTime(300)
      ), 
      this.filters$, 
      this.paging$
      ]
    ).pipe(
      takeUntil(this.unsubscribe$),
      tap(() => (this.isLoading = true)),
      switchMap(([search, filters, paging]) =>
        this.crmService.getLeads(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      //console.log('Employees', res)
      this.tableData = res.data;
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    // Trigger initial load
    this.search$.next('');

    forkJoin({
      agents: this.crmService.getAgents(),
    }).subscribe(({ agents }) => {
      this.agentsList = agents.data;
      this.buildFilters();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Search input
  onSearchChange(value: string) {
    this.search$.next(value);
  }

  // Filter changes
  onFilterChange(filters: any) {
    this.filters$.next(filters);
  }

  // Called whenever pagination changes in the table
  onPagingChange(newPaging: { page: number; pageSize: number }) {
    //console.log(newPaging)
    this.paging = {
      ...this.paging,
      ...newPaging
    };
    this.paging$.next(newPaging);
  }

  onSelectionChange(event:any) {
    //console.log(event);
    this.selectedRows = event;
  }

  viewRow(row: any) {
    //console.log('View', row);
    //this.router.navigate([row._id], { relativeTo: this.route });
    //this.router.navigate(['/app/hr/employees', row._id]);
  }

  onTableAction(event: { action: string; row: any }) {
    switch (event.action) {
      case 'invite':
        //this.resendEmployeeInvite([event.row]);
        break;
      case 'assignManager':
        // if(this.selectedRows.length > 0) {
        //   this.selectedRows = []; 
        //   this.selectedRows.push(event.row);
        // }
        // else this.selectedRows.push(event.row);
        // this.openAssignmentModal('manager');
        break;
      case 'delete':
        //this.deleteRow(event.row);
        break;
    }
  }

  buildFilters() {
    this.tableFilters = [
      { 
        key: 'agents', 
        label: 'Agents', 
        type: 'select', 
        options: this.utils.arrayToObject(this.agentsList, 'agentName'), 
        includeIfEmpty: false 
      },
      { 
        key: 'industry', 
        label: 'Industries', 
        type: 'select', 
        options: this.utils.arrayToObject(this.industriesList, 'industryName'), 
        includeIfEmpty: false 
      },
      { 
        key: 'leadStatus', 
        label: 'Lead Status', 
        type: 'select', 
        options: {
          Active: 'Active',
          Inactive: 'Inactive'
        }, 
        includeIfEmpty: false 
      }
    ];
  }

}
