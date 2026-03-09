import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-appraisal-kpi-group-info',
  templateUrl: './appraisal-kpi-group-info.component.html',
  styleUrl: './appraisal-kpi-group-info.component.scss'
})
export class AppraisalKpiGroupInfoComponent implements OnInit {
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
        controlName: 'groupName',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.groupName : null,
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
        controlName: 'accessLevel',
        controlType: 'select',
        controlLabel: 'Access Level',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.accessLevel : 'Admin',
        selectOptions: this.loggedInUser.isSuperAdmin ? 
        {
          Admin: 'Admin',
          Manager: 'Manager',
          Employee: 'Employee'
        } : {
          Manager: 'Manager',
          Employee: 'Employee'
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'departments',
        controlType: 'mutipleSelect',
        controlLabel: 'Departments',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.assignedDepartments.filter((x:any) => x.department_name).map((y:any) => y.department_id) : null,
        selectOptions: this.utils.arrayToObject(this.data.departments, 'departmentName'),
        validators: [],
        order: 3
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
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: null,
        order: 8
      }
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updateKpiGroup(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('KPI group was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createKpiGroup(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('KPI group was created successfully');
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
