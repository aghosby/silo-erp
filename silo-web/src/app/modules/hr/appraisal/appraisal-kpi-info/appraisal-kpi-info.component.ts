import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-appraisal-kpi-info',
  templateUrl: './appraisal-kpi-info.component.html',
  styleUrl: './appraisal-kpi-info.component.scss'
})
export class AppraisalKpiInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  isLoading:boolean = false;
  loggedInUser: any;

  constructor(
    private authService: AuthService,
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.loggedInUser = this.authService.loggedInUser;
    this.formFields = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.kpiName : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'type',
        controlType: 'select',
        controlLabel: 'Measure',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.type : 'percentage',
        selectOptions: {
          percentage: 'Percentage',
          exact: 'Exact'
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'weight',
        controlType: 'number',
        controlLabel: 'Weight (%)',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.weight : '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'target',
        controlType: 'number',
        controlLabel: 'Target',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.target : '',
        validators: [],
        order: 5
      },
      {
        controlName: 'max',
        controlType: 'number',
        controlLabel: 'Max',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.max : '',
        validators: [],
        order: 6
      },
      {
        controlName: 'threshold',
        controlType: 'number',
        controlLabel: 'Threshold',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.threshold : '',
        validators: [],
        order: 7
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.kpiDescription : null,
        validators: null,
        order: 8
      }
    ];

    if(!this.data.isExisting && this.data.data.accessLevel == 'Employee' && (this.loggedInUser.isSuperAdmin || this.loggedInUser.isManager)) this.formFields.push(
      {
        controlName: 'employeeIds',
        controlType: 'mutipleSelect',
        controlLabel: 'Employees',
        controlWidth: '100%',
        initialValue: this.data.isExisting && this.data.data.employeeIds.length > 0  ? this.data.modalInfo.employeeIds.map((x:any) => x._id) : [],
        selectOptions: this.utils.arrayToObject(this.loggedInUser.isManager ? this.data.employees.filter((x:any) => x.departmentId == this.loggedInUser.departmentId) : this.data.employees, 'fullName'),
        validators: [],
        order: 3
      }
    )
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    let payload = event.value;
    console.log("Default submit:", payload, this.data);
    payload = {
      ...payload,
      group: this.data.data._id,
    }
    this.data.isExisting ? 
    this.hrService.updateKpi(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('KPI was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createKpi(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('KPI was created successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    })
    
  }

  emitResponse() {
    this.submit.emit({
      action: 'submit',
      dirty: true
    });
  }

}
