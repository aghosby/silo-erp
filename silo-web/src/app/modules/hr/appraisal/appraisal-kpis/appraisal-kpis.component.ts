import { Component, OnInit } from '@angular/core';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { AppraisalKpiGroupInfoComponent } from '../appraisal-kpi-group-info/appraisal-kpi-group-info.component';
import { AppraisalKpiInfoComponent } from '../appraisal-kpi-info/appraisal-kpi-info.component';

@Component({
  selector: 'app-appraisal-kpis',
  templateUrl: './appraisal-kpis.component.html',
  styleUrl: './appraisal-kpis.component.scss'
})
export class AppraisalKpisComponent implements OnInit {
  loggedInUser: any;
  departmentList:any[] = [];
  employees:any[] = [];
  kpiGroups!: any[];
  activeTab:number = -1;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private hrService: HrService,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.getKpiGroups();
    const departments$ = this.hrService.getDepartments().subscribe(res => this.departmentList = res.data);
    const employees$ = this.hrService.getEmployees().subscribe(res => this.employees = res.data)
  }

  getKpiGroups() {
    this.hrService.getKpiGroups().subscribe(res => {
      this.kpiGroups = res.data;
      console.log('KPI Groups', this.kpiGroups)
    })
  }

  openKpiGroupModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      departments: this.departmentList
    }
    this.modalService.open(
      AppraisalKpiGroupInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }
  openKpiModal(modalData?:any, action?:string) {
    const modalConfig:any = {
      isExisting: action === 'edit' ? true : false,
      width: '40%',
      data: modalData,
      departments: this.departmentList,
      employees: this.employees
    }
    this.modalService.open(
      AppraisalKpiInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }

  toggleAccordionInfo(index:number) {
    this.activeTab == index ? this.activeTab = -1 : this.activeTab = index;
  }

  //Delete a KPI Group
  deleteKpiGroup(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.groupName + ' KPI Group',
      message: 'Are you sure you want to remove this kpi group?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpiGroup(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.success) {
              this.getKpiGroups();
              this.notifyService.showInfo('This KPI group has been deleted successfully');
            }
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  //Delete a KPI
  deleteKpi(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.kpiName + ' KPI',
      message: 'Are you sure you want to remove this kpi?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpi(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This KPI has been deleted successfully');
            }
            this.getKpiGroups();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }
}
