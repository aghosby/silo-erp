import { Component, OnInit } from '@angular/core';
import { HrService } from '@services/hr/hr.service';
import { ModalService } from '@services/utils/modal.service';
import { AppraisalPeriodInfoComponent } from '../appraisal-period-info/appraisal-period-info.component';
import { forkJoin } from 'rxjs';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-appraisal-overview',
  templateUrl: './appraisal-overview.component.html',
  styleUrl: './appraisal-overview.component.scss'
})
export class AppraisalOverviewComponent implements OnInit {
  appraisalRequests!:any[];
  periodName: any;
  appraisalPeriods!:any[];
  periodOptions:any;
  matrixItems:any[] = [];
  matrixSlots = Array(9).fill(0);

  payrollCredits:any;
  payrollDebits:any;

  keepOrder = () => 0;


  constructor(
    private modalService: ModalService,
    private hrService: HrService,
    private utils: UtilityService
  ) {}

  ngOnInit(): void {
    this.hrService.getAppraisalPeriods().subscribe(res => {
      this.appraisalPeriods = res.data;
      console.log('Periods', this.appraisalPeriods);
      this.getAppraisalRequests(this.appraisalPeriods[0]._id);
      this.periodOptions = this.utils.arrayToObject(this.appraisalPeriods, 'appraisalPeriodName');
    });
  }

  getAppraisalRequests(periodId:string) {
    this.hrService.getAppraisalRequests(periodId).subscribe({
      next: res => {
        this.appraisalRequests = res.data
      },
      error: err => {
        this.appraisalRequests = [];
      }
    });
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

  viewAppraisalInfo(info:any) {

  }
}
