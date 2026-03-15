import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { AdminService } from '@services/admin/admin.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-permission-info',
  templateUrl: './permission-info.component.html',
  styleUrl: './permission-info.component.scss'
})
export class PermissionInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  employees:any[] = [];
  isLoading:boolean = false;

  constructor(
    private utils: UtilityService,
    private adminService: AdminService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.formFields = [
      {
        controlName: 'permissionName',
        controlType: 'text',
        controlLabel: 'Permission Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.permissionName : null,
        validators: null,
        order: 1
      },
      {
        controlName: 'permissionKey',
        controlType: 'text',
        controlLabel: 'Permission Key',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.permissionKey : null,
        validators: null,
        order: 2
      }, 
      {
        controlName: 'permissionType',
        controlType: 'select',
        controlLabel: 'Permission Type',
        controlWidth: '48%',
        selectOptions: {
          create: 'Create',
          view: 'View',
          update: 'Update',
          delete: 'Delete'
        },
        initialValue: this.data.isExisting ? this.data.data.permissionType : null,
        validators: null,
        order: 3
      },      
      {
        controlName: 'moduleId',
        controlType: 'select',
        controlLabel: 'Module',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.data.modules, 'moduleName'),
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'featureId',
        controlType: 'select',
        controlLabel: 'Feature',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.data.features, 'featureName'),
        validators: [Validators.required],
        order: 5
      },
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.adminService.updatePermission(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Permission was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.adminService.createPermission(payload).subscribe({
      next: res => {
        console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('Permission was created successfully');
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
