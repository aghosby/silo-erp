import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-recruitment-job-info',
  templateUrl: './recruitment-job-info.component.html',
  styleUrl: './recruitment-job-info.component.scss'
})
export class RecruitmentJobInfoComponent implements OnInit {
  data!: any;
  formFields!: DynamicField[];
  isLoading:boolean = false;
  employees:any[] = [];
  departments:any[] = [];

  jobInView:any;
  jobId!:string;

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
    this.jobId = this.route.snapshot.params["id"];

    if(this.jobId) {
      this.getJobDetails(this.jobId);
    }
    else {
      this.data = {
        isExisting: false,
      }
    }
    
    forkJoin({
      departments: this.hrService.getDepartments(),
      employees: this.hrService.getEmployees()
    }).subscribe(({ departments, employees }) => {
      this.departments = departments.data;
      this.employees = employees.data;
      if(!this.jobId) this.setUpForm();
    }); 
  }

  goBack() {
    this.utils.goBack();
  }

  getJobDetails(jobId:string) {
    this.hrService.getJobPostdetails(jobId).subscribe(res => {
      this.jobInView = res.data;
      this.data = {
        isExisting: true,
        data: this.jobInView
      }
      console.log('Job Details', this.jobInView)
      this.setUpForm();
    })
  }

  setUpForm() {
    this.formFields = [
      {
        controlName: 'jobTitle',
        controlType: 'text',
        controlLabel: 'Job Title',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data?.data?.jobTitle : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'jobRef',
        controlType: 'text',
        controlLabel: 'Job Reference No',
        controlWidth: '48%',
        initialValue: null,
        validators: [],
        order: 2
      },
      {
        controlName: 'jobType',
        controlType: 'select',
        controlLabel: 'Job Type',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.jobType : null,
        selectOptions: {
          fullTime: 'Full Time',
          partTime: 'Part Time',
          contract: 'Contract',
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'workMode',
        controlType: 'select',
        controlLabel: 'Work Mode',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.workMode : null,
        selectOptions: {
          onsite: 'Onsite',
          remote: 'Remote',
          hybrid: 'Hybrid',
        },
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'jobLocation',
        controlType: 'text',
        controlLabel: 'Job Location',
        controlWidth: '48%',
        initialValue: null,
        validators: [],
        order: 5
      },
      {
        controlName: 'department',
        controlType: 'select',
        controlLabel: 'Department',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.department : null,
        selectOptions: this.utils.arrayToObject(this.departments, 'departmentName'),
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'hiringManager',
        controlType: 'select',
        controlLabel: 'Hiring Manager',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.hiringManager : null,
        selectOptions: this.utils.arrayToObject(this.employees, 'fullName'),
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'noOfOpenings',
        controlType: 'number',
        controlLabel: 'Number of Openings',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.noOfOpenings : null,
        validators: [],
        order: 8
      },
      {
        controlName: 'jobStatus',
        controlType: 'select',
        controlLabel: 'Job Status',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.jobStatus : 'draft',
        selectOptions: {
          draft: 'Draft',
          open: 'Open',
          onHold: 'On Hold',
          closed: 'Closed'
        },
        validators: [Validators.required],
        order: 9
      },
      {
        controlName: 'openingDate',
        controlType: 'date',
        controlLabel: 'Opening Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.openingDate : null,
        validators: [Validators.required],
        order: 10
      },
      {
        controlName: 'closingDate',
        controlType: 'date',
        controlLabel: 'Closing Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.closingDate : null,
        validators: [Validators.required],
        order: 11
      },
      {
        controlName: 'jobSalary',
        controlType: 'rangeSlider',
        controlLabel: 'Job Salary',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.jobSalary : null,
        validators: [Validators.required],
        order: 12,
        rangePrefix: this.utils.currency,
        rangeMin: 0,
        rangeMax: 200000,
        rangeStep: 100
      },
      {
        controlName: 'jobDescription',
        controlType: 'quillEditor',
        controlLabel: 'Job Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.jobDescription : null,
        validators: [Validators.required],
        order: 13
      }
    ]
  }

  handleFormAction(event: any) {
    console.log("Default submit:");
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    // const formData = new FormData();
    // Object.keys(formValue).forEach(k => formData.append(k, formValue[k] ?? ''));
    this.data.isExisting ? 
    this.hrService.updateJobPost(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('This job post was updated successfully');
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createJobPost(payload).subscribe({
      next: res => {
        console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('This job post was created successfully');
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
      }
    })
    
  }

}
