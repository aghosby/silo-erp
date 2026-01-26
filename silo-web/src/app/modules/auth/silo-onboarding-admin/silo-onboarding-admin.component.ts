import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { authPageStagger } from '@animations/auth-page-animations';

@Component({
  selector: 'app-silo-onboarding-admin',
  standalone: false,
  templateUrl: './silo-onboarding-admin.component.html',
  styleUrl: './silo-onboarding-admin.component.scss',
  animations: [authPageStagger],
})
export class SiloOnboardingAdminComponent implements OnInit {

  public form !: FormGroup<any>;
  isLoading:boolean = false;
  currentStep:number = 1;
  keepOrder = () => 0;

  industryOptions = {
    Technology: 'Technology',
    Healthcare: 'Healthcare',
    Finance: 'Finance',
    Education: 'Education',
    Retail: 'Retail',
    Manufacturing: 'Manufacturing',
    Other: 'Other'
  }

  companySizeOptions = {
    1: '1 - 10 Employees',
    2: '11 - 50 Employees',
    3: '51 - 100 Employees',
    4: '101 - 200 Employees',
    5: '200+ Employees'
  }

  siloModules = [
    {
      moduleName: 'HR Module',
      icon: 'bi-people-fill',
      moduleFeatures: [
        'Employee Management',
        'Leave Management',
        'Expense Management',
        'Payroll',
        'Appraisal Reviews',
        'Recruitment',
        'Attendance',
        'Meetings & Calendar',
        'Visitor Management',
        'Reports & Analytics'
      ]
    },
    {
      moduleName: 'CRM Module',
      icon: 'bi-headset',
      moduleFeatures: [
        'Dashboard Analytics',
        'Leads Management',
        'Contacts Management',
        'Sales Pipeline',
        'Deals Tracking',
        'Purchase Orders Management',
        'Invoice Management',
        'Agents Management',
        'Reports & Analytics'
      ]
    }
  ]

  constructor() {
    this.initFormGroup();
  }

  ngOnInit(): void {
      this.addEmployee();
  }

  private initFormGroup(): void {
    this.form = new FormGroup(
      {
        companyName: new FormControl('SILO Technologies', Validators.required),
        industry: new FormControl('', Validators.required),
        companySize: new FormControl('', Validators.required),
        modules: new FormControl([], Validators.required),
        employees: new FormArray([]) 
      }
    );
  }

  get formCtrls() {
    return this.form.controls;
  }

  get modulesCtrl(): FormControl<string[]> {
    return this.formCtrls['modules'] as FormControl<string[]>;
  }

  get employeesCtrl(): FormArray<FormControl<string | null>> {
    return this.formCtrls['employees'] as FormArray<FormControl<string | null>>;
  }



  goToStep(stepNo:number) {
    this.currentStep = stepNo;
  }

  goToNextStep() {
    if(this.currentStep == 3 || this.currentStep == 0) {
      //Go to dashboard
      return
    }
    if(this.stepValid(this.currentStep)) this.currentStep = this.currentStep + 1;
  }

  goToPrevStep() {
    this.currentStep = this.currentStep - 1;
  }

  stepValid(stepNo: number): boolean {
    let isValid = false;
    switch (stepNo) {
      case 1:
        this.formCtrls['industry'].markAsTouched();
        this.formCtrls['companySize'].markAsTouched();
        isValid = this.formCtrls['industry'].valid && this.formCtrls['companySize'].valid;
        break;
      case 2:
        isValid = this.formCtrls['modules'].valid
        break;
      case 3:
        isValid = true;
        break;
      default:
        break;
    }
    return isValid
  } 

  isModuleSelected(moduleName: string): boolean {
    return this.modulesCtrl.value.includes(moduleName);
  }

  toggleModule(moduleName: string): void {
    const modules = this.modulesCtrl.value;

    const updatedModules = modules.includes(moduleName)
      ? modules.filter(m => m !== moduleName)
      : [...modules, moduleName];

    this.modulesCtrl.setValue(updatedModules);
    this.modulesCtrl.markAsTouched();
  }

  addEmployee(): void {
    this.employeesCtrl.push(
      new FormControl('', Validators.email)
    );
  }

  removeEmployee(index: number): void {
    this.employeesCtrl.removeAt(index);
  }

}
