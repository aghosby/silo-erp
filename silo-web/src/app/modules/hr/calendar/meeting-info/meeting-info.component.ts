import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';


@Component({
  selector: 'app-meeting-info',
  templateUrl: './meeting-info.component.html',
  styleUrl: './meeting-info.component.scss'
})
export class MeetingInfoComponent implements OnInit {
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
    //console.log(this.data);
    this.employees = this.data.employees;
    this.formFields = [
      {
        controlName: 'title',
        controlType: 'text',
        controlLabel: 'Meeting Title',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.title : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'invitedGuests',
        controlType: 'mutipleSelect',
        controlLabel: 'Invited Guests',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.invitedGuests.map((item: any) => item.employeeId) : null,
        selectOptions: this.utils.arrayToObject(this.employees, 'fullName'),
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'location',
        controlType: 'select',
        controlLabel: 'Meeting Location',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.location : 'Location',
        selectOptions: {
          Online: 'Online',
          Office: 'Office Premises',
          External: 'External Location',
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'meetingDate',
        controlType: 'date',
        controlLabel: 'Meeting Date',
        controlWidth: '48%',
        initialValue: this.data?.data?.meetingStartTime ? new Date(this.data.data.meetingStartTime): null,        
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'meetingStartTime',
        controlType: 'time',
        controlLabel: 'Start Time',
        controlWidth: '48%',
        initialValue: this.data?.data?.meetingStartTime ? this.utils.formatTimeFromISO(this.data.data.meetingStartTime) : null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'meetingEndTime',
        controlType: 'time',
        controlLabel: 'End Time',
        controlWidth: '48%',
        initialValue: this.data?.data?.meetingEndTime ? this.utils.formatTimeFromISO(this.data.data.meetingEndTime) : null,
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'meetingDescription',
        controlType: 'textarea',
        controlLabel: 'Meeting Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: [],
        order: 7
      },
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const formValue = event.value;
    const payload = {
      ...formValue,
      meetingStartTime: this.utils.combineDateTime(formValue.meetingDate, formValue.meetingStartTime),
      meetingEndTime: this.utils.combineDateTime(formValue.meetingDate, formValue.meetingEndTime),
      invitedGuests: formValue.invitedGuests.map((x:any) => x = this.employees.find(y => y._id == x).email)
    }
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updateMeeting(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Meeting was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createMeeting(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Meeting was created successfully');
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
