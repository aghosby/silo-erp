import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-appraisal-period-info',
  templateUrl: './appraisal-period-info.component.html',
  styleUrl: './appraisal-period-info.component.scss'
})
export class AppraisalPeriodInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  isLoading:boolean = false;

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.formFields = [
      {
        controlName: 'appraisalPeriodName',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.appraisalPeriodName : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? new Date(this.data.data.startDate) : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? new Date(this.data.data.endDate) : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'activeDate',
        controlType: 'date',
        controlLabel: 'Active Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.activeDate : null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'inactiveDate',
        controlType: 'date',
        controlLabel: 'Inactive Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.inactiveDate : null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: null,
        order: 6
      }
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updateAppraisalPeriod(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Appraisal period was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createAppraisalPeriod(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Appraisal period was created successfully');
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
