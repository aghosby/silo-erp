import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-activity-info',
  templateUrl: './activity-info.component.html',
  styleUrl: './activity-info.component.scss'
})
export class ActivityInfoComponent implements OnInit {
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
        controlLabel: 'Activity Title',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.title : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'activity',
        controlType: 'select',
        controlLabel: 'Activity Type',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.activity : null,
        selectOptions: this.utils.arrayToObject(this.data.activityTypes, 'label'),
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'activityFocus',
        controlType: 'select',
        controlLabel: 'Activity Focus',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.activity : null,
        selectOptions: {
          lead: 'Lead',
          contact: 'Contact',
          agent: 'Agent',
          external: 'External'
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'participants',
        controlType: 'mutipleSelect',
        controlLabel: 'Participants',
        controlWidth: '100%',
        initialValue: null,
        selectOptions: {},
        validators: [],
        order: 4
      },
      {
        controlName: 'externalEmails',
        controlType: 'text',
        controlLabel: 'External Email(s)',
        controlWidth: '100%',
        initialValue: null,
        hidden: true,
        validators: [Validators.email],
        order: 4.1
      },
      {
        controlName: 'priority',
        controlType: 'select',
        controlLabel: 'Priority',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.priority : null,
        selectOptions: {
          High: 'High',
          Medium: 'Medium',
          Low: 'Low'
        },
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'activityDate',
        controlType: 'date',
        controlLabel: 'Meeting Date',
        controlWidth: '48%',
        initialValue: this.data?.data?.meetingStartTime ? new Date(this.data.data.meetingStartTime): null,        
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'activityStartTime',
        controlType: 'time',
        controlLabel: 'Start Time',
        controlWidth: '48%',
        initialValue: this.data?.data?.meetingStartTime ? this.utils.formatTimeFromISO(this.data.data.meetingStartTime) : null,
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'activityEndTime',
        controlType: 'time',
        controlLabel: 'End Time',
        controlWidth: '48%',
        initialValue: this.data?.data?.meetingEndTime ? this.utils.formatTimeFromISO(this.data.data.meetingEndTime) : null,
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: [],
        order: 8
      },
    ]
  }

  onFormChanges(value: any) {
    this.toggleParticipantsByFocus(value.activityFocus)
    //this.toggleLeadTypeFields(value.leadType);
  }

  toggleParticipantsByFocus(focus: string) {

    const participantsField = this.formFields.find(f => f.controlName === 'participants');
    const externalField = this.formFields.find(f => f.controlName === 'externalEmails');

    if (!participantsField || !externalField) return;

    // 🔹 External case
    if (focus === 'external') {

      participantsField.hidden = true;
      externalField.hidden = false;

    } 
    else {

      participantsField.hidden = false;
      externalField.hidden = true;

      switch (focus) {
        case 'contact':
          participantsField.controlLabel = 'Contacts';
          participantsField.selectOptions = this.utils.arrayToObject(this.data.contacts, 'name');
          break;

        case 'lead':
          participantsField.controlLabel = 'Leads';
          participantsField.selectOptions = this.utils.arrayToObject(this.data.leads, 'name');
          break;

        case 'agent':
          participantsField.controlLabel = 'Agents';
          participantsField.selectOptions = this.utils.arrayToObject(this.data.agents, 'fullName');
          break;

        default:
          participantsField.selectOptions = {};
          break;
      }
    }

    // trigger change detection
    this.formFields = [...this.formFields];
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
