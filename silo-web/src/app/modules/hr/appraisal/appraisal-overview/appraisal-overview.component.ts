import { Component, OnInit } from '@angular/core';
import { HrService } from '@services/hr/hr.service';
import { ModalService } from '@services/utils/modal.service';
import { AppraisalPeriodInfoComponent } from '../appraisal-period-info/appraisal-period-info.component';
import { forkJoin } from 'rxjs';
import { UtilityService } from '@services/utils/utility.service';
import { NotificationService } from '@services/utils/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appraisal-overview',
  templateUrl: './appraisal-overview.component.html',
  styleUrl: './appraisal-overview.component.scss'
})
export class AppraisalOverviewComponent implements OnInit {
  appraisalRequests!:any[];
  appraisalPeriods!:any[];

  periodInView:any;
  periodName: any;
  periodOptions:any;
  matrixItems:any[] = [];
  matrixSlots = Array(9).fill(0);

  periodStatus:any;
  periodStatusOptions:any = {
    'Set KPIs': 'Set KPIs',
    'Review KPIs': 'Review KPIs',
    'Employee Appraisal': 'Employee Appraisal',
    'Manager Appraisal': 'Manager Appraisal',
    'CLose Period': 'Close Period'
  }

  payrollCredits:any;
  payrollDebits:any;
  isLoading:boolean = false;
  keepOrder = () => 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private hrService: HrService,
    private utils: UtilityService,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAppraisalPeriods();
  }

  getAppraisalPeriods() {
    this.isLoading = true;
    this.hrService.getAppraisalPeriods().subscribe(res => {
      this.appraisalPeriods = res.data;
      console.log('Periods', this.appraisalPeriods);
      this.periodInView = this.appraisalPeriods[0];
      this.getCurrentPeriodDetails();
    });
  }

  getAppraisalRequests(periodId:string) {
    this.isLoading = true;
    this.hrService.getAppraisalRequests(periodId).subscribe({
      next: res => {
        this.appraisalRequests = res.data;
        this.isLoading = false;
      },
      error: err => {
        this.appraisalRequests = [];
        this.isLoading = false;
      }
    });
  }

  onPeriodChange(newPeriod: string) {
    // Call your function to update chart data
    this.getAppraisalRequests(newPeriod);
  }

  openPeriodModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
    }
    this.modalService.open(
      AppraisalPeriodInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }

  getCurrentPeriodDetails() {
    this.hrService.getAppraisalDetails(this.periodInView._id).subscribe(res => {
      this.periodInView = res.data[0];
      this.getAppraisalRequests(this.periodInView._id);
      this.periodOptions = this.utils.arrayToObject(this.appraisalPeriods, 'appraisalPeriodName');
      this.periodName = this.periodInView._id;
      this.periodStatus = this.periodInView.status;
      this.generateMatrix(this.periodInView.appraisalData);
    })
  }

  viewAppraisalInfo(info:any) {
    //console.log('View', row);
    this.router.navigate([`../${info.employeeId}`], { relativeTo: this.route });
    //this.router.navigate(['/app/hr/employees', row._id]);
  }

  //Delete appraisal period
  deleteAppraisalPeriod(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.appraisalPeriodName + ' Period',
      message: 'Are you sure you want to remove this appraisal period?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteAppraisalPeriod(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.success) {
              this.notifyService.showInfo('This appraisal period has been deleted successfully');
              this.getAppraisalPeriods();
            }
          },
          error: err => {
          } 
        })
      }
    });
  }

  generateMatrix(info: any) {
    console.log(info);
    // info.forEach(x => {
    //   console.log(x);
    //   x.matrixScore = [0, 1];
    // })
    this.matrixItems = [
      {
        id: 3,
        label: "Star",
        order: 3,
        staff: []
      },
      {
        id: 2,
        label: "High Potential",
        order: 2,
        staff: []
      },
      {
        id: 1,
        label: "Potential Gem",
        order: 1,
        staff: []
      },
      {
        id: 6,
        label: "High Performer",
        order: 6,
        staff: []
      },
      {
        id: 5,
        label: "Core Player",
        order: 5,
        staff: []
      },
      {
        id: 4,
        label: "Inconsistent Player",
        order: 4,
        staff: []
      },
      {
        id: 9,
        label: "Solid Performer",
        order: 9,
        staff: []
      },
      {
        id: 8,
        label: "Average Performer",
        order: 8,
        staff: []
      },
      {
        id: 7,
        label: "Risk",
        order: 7,
        staff: []
      }
    ]

    this.matrixItems.sort((a,b) => (a.order - b.order));

    info.map((detail:any) => {
      if(detail.matrixScore[0] == 0 && detail.matrixScore[1] == 2) {
        this.matrixItems.find(x => {
          if(x.order == 1) {
            x.staff.push(detail);
            alert('yeah')
          };
          // if(x.order == 1) ;

        })
      }
      else if(detail.matrixScore[0] == 1 && detail.matrixScore[1] == 2) {
        this.matrixItems.find(x => {
          if(x.order == 2) x.staff.push(detail);
        })
      }
      else if(detail.matrixScore[0] == 2 && detail.matrixScore[1] == 2) {
        this.matrixItems.find(x => {
          if(x.order == 3) x.staff.push(detail);
        })
      }
      else if(detail.matrixScore[0] == 0 && detail.matrixScore[1] == 1) {
        this.matrixItems.find(x => {
          if(x.order == 4) x.staff.push(detail);
        })
      }
      else if(detail.matrixScore[0] == 1 && detail.matrixScore[1] == 1) {
        this.matrixItems.find(x => {
          if(x.order == 5) x.staff.push(detail);
        })
      }
      else if(detail.matrixScore[0] == 2 && detail.matrixScore[1] == 1) {
        this.matrixItems.find(x => {
          if(x.order == 6) x.staff.push(detail);
        })
      }
      else if(detail.matrixScore[0] == 0 && detail.matrixScore[1] == 0) {
        this.matrixItems.find(x => {
          if(x.order == 7) x.staff.push(detail);
        })
      }
      else if(detail.matrixScore[0] == 0 && detail.matrixScore[1] == 1) {
        this.matrixItems.find(x => {
          if(x.order == 8) x.staff.push(detail);
        })
      }
      else if(detail.matrixScore[0] == 0 && detail.matrixScore[1] == 2) {
        this.matrixItems.find(x => {
          if(x.order == 9) x.staff.push(detail);
        })
      }
    })

  }

  //Delete appraisal period
  onPeriodStatusChange(periodStatus:string) {
    if(this.periodInView.status === periodStatus) {
      return;
    }
    this.notifyService.confirmAction({
      title: 'Change ' + this.periodInView.appraisalPeriodName + ' Period Status',
      message: 'Are you sure you want to change this period status?',
      confirmText: 'Yes, Change',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
          let payload = {
            status: periodStatus,
            progress: Object.keys(this.periodStatusOptions).indexOf(periodStatus)
          }
          this.hrService.updateAppraisalPeriodStatus(payload, this.periodInView._id).subscribe({
            next: res => {
              if(res.success) {
                this.notifyService.showSuccess('This Appraisal period has been updated successfully');
                this.getCurrentPeriodDetails();
              }
            },
            error: err => {
              console.log(err)
            } 
          })
        }
    });
  }
}
