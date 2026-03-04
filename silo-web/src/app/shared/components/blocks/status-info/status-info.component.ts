import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-status-info',
  templateUrl: './status-info.component.html',
  styleUrl: './status-info.component.scss'
})
export class StatusInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  employees:any[] = [];
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
        controlName: 'statusName',
        controlType: 'text',
        controlLabel: 'Status Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.statusName : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'order',
        controlType: 'number',
        controlLabel: 'Status Hierarchy',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.order : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'theme',
        controlType: 'select',
        controlLabel: 'Color theme',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.colorTheme : null,
        selectOptions: {
          blue: 'blue',
          green: 'green',
          orange: 'orange',
          purple: 'purple',
          red: 'red',
          yellow: 'yellow',
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: null,
        order: 4
      }
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ?  this.emitResponse(payload, false) : this.emitResponse(payload, true);
    // this.hrService.updateDepartment(payload, this.data.data._id).subscribe({
    //   next: res => {
    //     //console.log('Update Response', res)
    //     if(res.success) this.notify.showSuccess('Department was updated successfully');
    //     this.isLoading = false;
    //     this.emitResponse(payload, false);
    //   },
    //   error: err => {
    //     this.isLoading = false;
    //   }
    // }) 
    // :
    // this.hrService.createDepartment(payload).subscribe({
    //   next: res => {
    //     console.log('Create Response', res)
    //     if(res.success) this.notify.showSuccess('Department was created successfully');
    //     this.isLoading = false;
    //     this.emitResponse();
    //   },
    //   error: err => {
    //     this.isLoading = false;
    //   }
    // })
  }

  emitResponse(formValue:any, newEntry:boolean) {
    this.submit.emit({
      action: 'submit',
      value: formValue,
      existing: !newEntry,
      dirty: true
    });
  }
}
