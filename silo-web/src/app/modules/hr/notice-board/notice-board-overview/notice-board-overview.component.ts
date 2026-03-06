import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { SharedModule } from "@sharedWeb/shared.module";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-notice-board-overview',
  templateUrl: './notice-board-overview.component.html',
  styleUrl: './notice-board-overview.component.scss'
})
export class NoticeBoardOverviewComponent implements OnInit {
  data!: any;
  loggedInUser:any;
  noticeInview!:any;
  formFields!: DynamicField[];
  employees:any[] = [];
  departments:any[] = [];
  isLoading:boolean = false;
  newNotice:boolean = false;
  
  announcements: any[] = [];

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private hrService: HrService,
    private utils: UtilityService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.data = {
      isExisting: false
    }
    this.getNotices();

    forkJoin({
      departments: this.hrService.getDepartments(),
      employees: this.hrService.getEmployees()
    }).subscribe(({ departments, employees }) => {
      this.departments = departments.data;
      this.employees = employees.data;
      this.setUpForm();
    });   
  }

  onFormChanges(value:any) {
    this.toggleNoticeTypeFields(value.announcementType);
  }

  getNotices() {
    this.hrService.getNotices().subscribe(res => {
      this.announcements = res.data ?? [];
      this.announcements.length ? this.noticeInview = this.announcements[0] : this.newNotice = true;
    });
  }

  setUpForm() {
    this.formFields = [
      {
        controlName: 'title',
        controlType: 'text',
        controlLabel: 'Title',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.departmentName : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'priority',
        controlType: 'select',
        controlLabel: 'Priority',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.priority : null,
        selectOptions: {
          low: "Low",
          medium: "Medium",
          high: "High"
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'announcementType',
        controlType: 'select',
        controlLabel: 'Announcement Type',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.announcementType : 'All',
        selectOptions: {
          all: 'All',
          departments: 'Departments',
          employees: 'Specific Employees'
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'departments',
        controlType: 'mutipleSelect',
        controlLabel: 'Departments',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.departments.filter((x:any) => x.departmentName).map((y:any)=> y._id) : null,
        selectOptions: this.utils.arrayToObject(this.departments, 'departmentName'),
        validators: [],
        hidden: true,
        order: 4
      },
      {
        controlName: 'targetEmployees',
        controlType: 'mutipleSelect',
        controlLabel: 'Employees',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.employees.filter((x:any) => x.fullName).map((y:any)=> y._id) : null,
        selectOptions: this.utils.arrayToObject(this.employees, 'fullName'),
        validators: [],
        hidden: true,
        order: 4
      },
      {
        controlName: 'expiryDate',
        controlType: 'date',
        controlLabel: 'Expiry Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.expiryDate : null,
        validators: [],
        order: 5
      },
      {
        controlName: 'imageType',
        controlType: 'select',
        controlLabel: 'Image Type',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.imageType : null,
        selectOptions: {
          Portrait: "Portrait",
          Landscape: "Landscape"
        },
        validators: [],
        order: 6
      },
      {
        controlName: 'content',
        controlType: 'quillEditor',
        controlLabel: 'Announcement',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.content : null,
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'attachments',
        controlType: 'file',
        controlLabel: '',
        controlWidth: '100%',
        initialValue: null,
        validators: [],
        order: 8
      }
    ]
  }

  handleFormAction(event: any) {
    console.log("Default submit:");
    this.isLoading = true;
    const formValue = event.value;
    console.log("Default submit:", formValue);
    const formData = new FormData();
    Object.keys(formValue).forEach(k => formData.append(k, formValue[k] ?? ''));
    this.data.isExisting ? 
    this.hrService.updateNotice(formData, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('This notice was updated successfully');
        this.isLoading = false;
        this.getNotices();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createNotice(formData).subscribe({
      next: res => {
        console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('This notice was created successfully');
        this.isLoading = false;
        this.getNotices();
      },
      error: err => {
        this.isLoading = false;
      }
    })
    
  }

  toggleNoticeTypeFields(type: string) {
    const departments = this.formFields.find(f => f.controlName === 'departments');
    const employees = this.formFields.find(f => f.controlName === 'targetEmployees');

    if (!departments || !employees) return;

    if (type === 'employees') {
      employees.hidden = false;
      departments.hidden = true;
    } 
    else if(type === 'departments') {
      departments.hidden = false;
      employees.hidden = true;
    }

    // 🔥 IMPORTANT: trigger change detection
    this.formFields = [...this.formFields];
  }

  get isNoticeAuthor() {
    return false;
  }

  editNotice(notice:any) {
    this.newNotice = true;
    this.data = {
      isExisting: true,
      data: notice
    }
  }

  viewNotice(notice:any) {
    this.newNotice = false;
    this.noticeInview = notice;
  }
}
