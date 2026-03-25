import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-recruitment-overview',
  templateUrl: './recruitment-overview.component.html',
  styleUrl: './recruitment-overview.component.scss'
})
export class RecruitmentOverviewComponent implements OnInit {
  chartData:any = [];
  chartColorScheme = {
    domain: ['rgba(235, 87, 87, 0.7)', 'rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(255, 150, 85, 0.7)']
  };

  tableData!:any[];
  tableFilters!: FilterConfig[];
  isLoading = false;
  selectedRows:any[] = [];

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

  tableColumns: TableColumn[] = [
    {
      key: "jobTitle",
      label: "Job Title",
      order: 1,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "departmentName",
      label: "Department",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "jobType",
      label: "Job Type",
      order: 3,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "openingDate",
      label: "Date Posted",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "applicants",
      label: "Applicants",
      order: 5,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "closingDate",
      label: "Deadline",
      order: 6,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "hiringManager",
      label: "Hiring Manager",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 8,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'status',
      statusMap: this.utils.statusMap,
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
        { icon: 'briefcase', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.viewRow(row) },
        { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ]
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private utils: UtilityService,
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  openJobInfoForm() {
    this.router.navigate(['../jobs/new'], { relativeTo: this.route });
  }

  ngOnInit(): void {
    this.getDepartments();
    
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
        this.hrService.getJobRoles(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      console.log('Requests', res)
      this.tableData = res.data;
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    this.search$.next('');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getDepartments() {
    this.hrService.getDepartments().subscribe(res => {
      const departments = res.data.slice(0, 5);
      if(res) this.chartData = this.generateDepartmentData(departments);
    })
  }

  generateDepartmentData(items:any[]) {
    return items.map(item => {
      const randomNo = Math.floor(Math.random() * 500) + 1;

      return {
        name: item.departmentName,
        value: randomNo,
        status: "active"
      };
    });
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
    this.router.navigate([row._id], { relativeTo: this.route });
    //this.router.navigate(['/app/hr/employees', row._id]);
  }

  //Delete a job post
  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Job Post',
      message: 'Are you sure you want to remove this job post?',
      confirmText: 'Remove Job Post',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteEmployee(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('The job post has been deleted successfully');
            }
            this.search$.next('');
          },
          error: err => {
            //console.log(err)
          } 
        })
      }
    });
  }

  buildFilters() {
    this.tableFilters = [];
  }
}
