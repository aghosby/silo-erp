import { Component, OnInit } from '@angular/core';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { AppraisalKpiInfoComponent } from '../appraisal-kpi-info/appraisal-kpi-info.component';
import { UtilityService } from '@services/utils/utility.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { TableColumn } from '@models/general/table-data';

@Component({
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrl: './appraisal-form.component.scss'
})
export class AppraisalFormComponent implements OnInit {
  periodName: any;
  periodOptions:any;
  periodInView: any;
  appraisalPeriods!: any[];
  currentPeriodId!: string;
  showBackBtn:boolean = false;
  keepOrder = () => 0;

  departmentList:any[] = [];
  employees:any[] = [];
  employeeInViewId!: string;

  activeTab:number = -1;
  appraisalPending: boolean = true;
  employeeDetails: any;

  appraisalForm!: FormGroup;
  kpiRatingForm!: FormGroup;
  matrixSelectOptions: any;

  appraisalFormFields: DynamicField[];
  kpiRatingFormFields: DynamicField[];
  kpiCriteria: any[] = [];
  ratingScale!: any;

  //KPI Ratings Table Column Names
  tableColumns: TableColumn[] = [
    // {
    //   key: "kpiName",
    //   label: "KPI Name",
    //   order: 1,
    //   columnWidth: "16%",
    //   cellStyle: "width: 100%",
    //   sortable: false
    // },
    {
      key: "kpiDescription",
      label: "KPI Description",
      order: 2,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employeeRating",
      label: "Employee Rating",
      order: 3,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "employeeComments",
      label: "Employee Comments",
      order: 4,
      columnWidth: "22%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "managerRating",
      label: "Manager Rating",
      order: 5,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "managerComments",
      label: "Manager Comments",
      order: 6,
      columnWidth: "22%",
      cellStyle: "width: 100%",
      sortable: true
    },

  ]

  constructor(
    private route: ActivatedRoute,
    private utils: UtilityService,
    private modalService: ModalService,
    private authService: AuthService,
    private hrService: HrService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.appraisalForm = this.fb.group({});

    this.matrixSelectOptions = {
      0: 'Low',
      1: 'Moderate',
      2: 'High'
    }

    this.appraisalFormFields = [
      {
        controlName: 'employeeName',
        controlType: 'text',
        controlLabel: 'Employee Name',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeSignature',
        controlType: 'text',
        controlLabel: 'Employee Signature',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeSignDate',
        controlType: 'text',
        controlLabel: 'Employee Signature Date',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 2
      },
      {
        controlName: 'employeePotential',
        controlType: 'select',
        controlLabel: 'Employee Potential',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          0: 'Low',
          1: 'Moderate',
          2: 'High'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'employeePerformance',
        controlType: 'select',
        controlLabel: 'Employee Performance',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          0: 'Low',
          1: 'Moderate',
          2: 'High'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'managerSummary',
        controlType: 'text',
        controlLabel: 'Manager Summary',
        controlWidth: '100%',
        initialValue: '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'managerName',
        controlType: 'text',
        controlLabel: 'Manager Name',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 4
      },
      {
        controlName: 'managerSignature',
        controlType: 'text',
        controlLabel: 'Manager Signature',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 5
      },
      {
        controlName: 'managerSignDate',
        controlType: 'text',
        controlLabel: 'Manager Signature Date',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 6
      }
    ]

    this.kpiRatingFormFields = [
      {
        controlName: 'employeeRating',
        controlType: 'text',
        controlLabel: 'Employee Rating',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeComments',
        controlType: 'text',
        controlLabel: 'Employee Comments',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 2
      },
      {
        controlName: 'managerRating',
        controlType: 'text',
        controlLabel: 'Manager Rating',
        controlWidth: '100%',
        initialValue: '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'managerComments',
        controlType: 'text',
        controlLabel: 'Manager Comments',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 4
      },
    ]

    //Final form details fields generation
    this.appraisalFormFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.appraisalForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
    this.getInitialData();
  }

  goBack() {
    this.utils.goBack();
  }

  getInitialData = async () => {
    this.employeeInViewId = this.route.snapshot.params["id"];
    this.employeeDetails = this.authService.loggedInUser;

    if(this.employeeInViewId) {
      this.showBackBtn = true;
      this.appraisalPending = false;
    }
    else {
      this.employeeInViewId = this.employeeDetails._id;
    }
    console.log(this.employeeInViewId);
    const appraisalPeriods$ = this.hrService.getAppraisalPeriods().subscribe(res => {
      this.appraisalPeriods = res.data;
      if(this.appraisalPeriods.length > 0) {
        this.currentPeriodId = this.appraisalPeriods[0]._id;
        if(this.currentPeriodId) this.getPageData();
      } 
    }) 
  }

  getPageData = async () => {
    // KPI Rating Form Declaration
    this.kpiRatingForm = this.fb.group({
      kpiGroups: this.fb.array([])
    });

    const periodinView$ = this.hrService.getEmployeeAppraisalDetails(this.employeeInViewId, this.currentPeriodId).subscribe(res => {
      this.periodInView = res.data;
      console.log(this.periodInView)
      this.appraisalPending = this.periodInView?.status == 'Pending';
      this.kpiCriteria = this.periodInView.kpiGroups;

      if(this.periodInView.appraisalPeriodProgress > 1) {
        this.displayKpiRatings();
        this.populateGrps();
      }

      if(this.periodInView.status !== 'Pending') {
        this.appraisalForm.get('employeeName')?.setValue(this.periodInView.fullName);
        this.appraisalForm.get('employeeSignature')?.setValue(this.periodInView.fullName);
        this.appraisalForm.get('employeeSignDate')?.setValue(this.periodInView.employeeSubmissionDate);
      }
      if(this.periodInView.status == 'Manager reviewed') {
        this.appraisalForm.get('managerName')?.setValue(this.periodInView.managerName);
        this.appraisalForm.get('managerSignature')?.setValue(this.periodInView.managerName);
        this.appraisalForm.get('managerSignDate')?.setValue(this.periodInView.managerSubmissionDate);
        this.appraisalForm.get('managerSummary')?.setValue(this.periodInView.managerOverallComment);
        this.appraisalForm.get('employeePerformance')?.setValue(String(this.periodInView.matrixScore[0]));
        this.appraisalForm.get('employeePotential')?.setValue(String(this.periodInView.matrixScore[1]));
      }
    })
    
  }

  populateGrps() {
    this.kpiCriteria.forEach((item, index) => {
      item.groupKpis.forEach((kpi:any) => {
        this.createKpis(item.groupName, index, kpi);
      })
    })
  }

  groups(): FormArray {
    return <FormArray>this.kpiRatingForm.get('kpiGroups');
    // return this.kpiRatingForm.get("kpiGroups") as FormArray
  }

  // Generate form view with initial values from KPI Group array
  displayKpiRatings() {
    let kpiInfo = this.kpiCriteria.map((grp: any, grpIndex: number) =>
      this.initKpiGroups(grp, grpIndex)
    );
    this.kpiRatingForm.setControl('kpiGroups', this.fb.array(kpiInfo));
  }

  // Initialize form group for each KPI Group
  initKpiGroups(kpiGroup: any, grpIndex:number): FormGroup {
    return this.fb.group({
      [kpiGroup.groupName]: this.fb.array([])
    })
  }

  // Set kpi rating controls after form group generation
  grpKpis(grpIndex:number, grpName: string,) : FormArray {
    return this.groups().at(grpIndex).get(grpName) as FormArray
  }

  // Initialize form group of each KPI entry
  initKpis(kpi: any) {
    return this.fb.group({
      [kpi.kpiName]: this.fb.group({
        employeeRating: [kpi.remarks?.employeeRating, this.appraisalPending ? Validators.required : ''],
        employeeComments: [kpi.remarks?.employeeComment],
        managerRating: [kpi.remarks?.managerRating, this.appraisalPending ? '' : Validators.required],
        managerComments: [kpi.remarks?.managerComment]
      })
    })
  }

  // Push each created form group into the kpi array
  createKpis(groupName: string, groupIndex:number, kpi: any) {
    this.grpKpis(groupIndex, groupName).push(this.initKpis(kpi));
  }

  rateEmployee(val:any) {
    console.log(val);
  }

  submit() {
    console.log(this.kpiRatingForm.value);
  }

  setAppraisalData = async (details:any) => {
    console.log(details);
    this.periodInView = details;
    this.currentPeriodId = details._id;
    this.getPageData();
  }

  ratingByEmployee(i:number, grpName:string, j:number, kpiName:string, ratingVal:any) {
    let employeeCtrl = this.kpiRatingForm.get(['kpiGroups', i, grpName, j, kpiName]) as FormGroup;
    employeeCtrl.get('employeeRating')?.setValue(ratingVal);
  }

  ratingByManager(i:number, grpName:string, j:number, kpiName:string, ratingVal:any) {
    let employeeCtrl = this.kpiRatingForm.get(['kpiGroups', i, grpName, j, kpiName]) as FormGroup;
    employeeCtrl.get('managerRating')?.setValue(ratingVal);
  }

  submitAppraisalEntry(finished: boolean) {
    console.log(finished);

    if(this.kpiRatingForm.valid) {
      let data = {
        appraisalPeriodId: this.currentPeriodId,
        employeeSignStatus: finished,
        kpiGroups: this.generateKpiGrpValues()
      }
      console.log(data);
      this.hrService.submitAppraisalEntry(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your appraisal entry has been sent successfully');
            this.getPageData();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }

  }

  submitAppraisalReview(finished: boolean) {
    console.log(finished);

    if(this.kpiRatingForm.valid) {
      let data = {
        appraisalPeriodId: this.currentPeriodId,
        managerSignStatus: finished,
        matrixScore: [Number(this.appraisalForm.controls['employeePerformance'].value), Number(this.appraisalForm.controls['employeePotential'].value)],
        managerOverallComment: this.appraisalForm.controls['managerSummary'].value,
        kpiGroups: this.generateKpiGrpValues()
      }
      console.log(data);
      this.hrService.submitAppraisalReview(data, this.periodInView.employeeKpiId).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your appraisal review has been sent successfully');
            this.getPageData();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }

  }

  generateKpiGrpValues() {
    let grpRatings:any = [];
    this.kpiCriteria.map((kpiGrp, i) => {
      let grpValues:any = {};
      let kpiRatings:any = [];

      grpValues['groupId'] = kpiGrp.groupId;
      grpValues['groupName'] = kpiGrp.groupName;
      grpValues['description'] = kpiGrp.description;
      kpiGrp.groupKpis.map((kpi:any, j:number) => {
        let kpiValues:any = {};
        let remarksObj:any = {}
        let formCtrl = this.kpiRatingForm.get(['kpiGroups', i, kpiGrp.groupName, j, kpi.kpiName]) as FormGroup;
        kpiValues['kpiId'] = kpi.kpiId;
        kpiValues['kpiName'] = kpi.kpiName;
        kpiValues['kpiDescription'] = kpi.kpiDescription;
        remarksObj['employeeComment'] = formCtrl.controls['employeeComments'].value;
        remarksObj['employeeRating'] = formCtrl.controls['employeeRating'].value;
        if(!this.appraisalPending) {
          remarksObj['managerComment'] = formCtrl.controls['managerComments'].value;
          remarksObj['managerRating'] = formCtrl.controls['managerRating'].value;
        }
        kpiValues['remarks'] = remarksObj;
        kpiRatings.push(kpiValues);
      })
      grpValues['groupKpis'] = kpiRatings;
      grpRatings.push(grpValues);
    })
    console.log(grpRatings);

    return grpRatings;
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
            //this.getKpiGroups();
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
