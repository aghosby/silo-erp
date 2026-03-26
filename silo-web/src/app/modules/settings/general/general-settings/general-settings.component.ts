import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { AdminService } from '@services/admin/admin.service';
import { HrService } from '@services/hr/hr.service';
import { SettingsService } from '@services/settings/settings.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { Regions } from '@sharedWeb/constants/regions';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss'
})
export class GeneralSettingsComponent implements OnInit {
  loggedInUser: any;
  companyInfo:any;
  activeTab:number = -1;
  accordionItems: any[] = [];
  isLoading:boolean = false;
  countriesOptions:any;
  keepOrder = () => 0;

  companyInfoForm!: FormGroup;

  industrySelectOptions =  {
    Technology: 'Technology',
    Software: 'Software & SaaS',
    Finance: 'Finance & Banking',
    Insurance: 'Insurance',
    FinTech: 'FinTech',
    Healthcare: 'Healthcare',
    Pharmaceuticals: 'Pharmaceuticals',
    Biotechnology: 'Biotechnology',
    Education: 'Education',
    ECommerce: 'E-Commerce',
    Retail: 'Retail',
    Manufacturing: 'Manufacturing',
    Construction: 'Construction',
    RealEstate: 'Real Estate',
    Transportation: 'Transportation & Logistics',
    Automotive: 'Automotive',
    Energy: 'Energy & Utilities',
    OilAndGas: 'Oil & Gas',
    Telecommunications: 'Telecommunications',
    Media: 'Media & Entertainment',
    Hospitality: 'Hospitality & Tourism',
    Agriculture: 'Agriculture',
    Government: 'Government & Public Sector',
    NonProfit: 'Non-Profit / NGO',
    ProfessionalServices: 'Professional Services'
  }

  companySizeOptions = {
    1: '1 - 10 Employees',
    2: '11 - 50 Employees',
    3: '51 - 100 Employees',
    4: '101 - 200 Employees',
    5: '200+ Employees'
  }

  regionOptions: any;

  languageOptions = {
    english: 'English',
    french: 'French',
    spanish: 'Spanish',
    german: 'German'
  }

  currencyOptions = {
    'USD': 'Dollars ($)',
    'CAD': 'Canadian Dollars ($)',
    'EUR': 'Euros (€)',
    'GBP': 'Pounds (£)',
    'NGN': 'Naira (₦)',
  }

  constructor(
    private authService: AuthService,
    private utils: UtilityService,
    private settingsService: SettingsService,
    private notify: NotificationService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.getCompanyInfo();
    this.regionOptions = this.utils.createRegionOptions();
    this.countriesOptions = this.utils.createCountryOptions();
    this.accordionItems = [
      {
        label: "Company Information",
        key: "companyInformation",
      },
      {
        label: "Business Address",
        key: "businessAddress",
      },
      {
        label: "Localization",
        key: "localization",
      },
      {
        label: "Security",
        key: "security",
      },
      {
        label: "Legal, Policies & Documents",
        key: "legalPolicies",
      },
    ];
  }

  getCompanyInfo() {
    this.isLoading = true;
    this.settingsService.getCompanyInfo(this.loggedInUser._id).subscribe(res => {
      this.companyInfo = res.data;
      console.log(this.companyInfo);
      this.setupForm();
      this.isLoading = false;
    })
  }

  setupForm() {
    this.companyInfoForm = new FormGroup({
      companyLogo: new FormControl(this.companyInfo.companyLogo),
      companyName: new FormControl({value: this.companyInfo.companyName, disabled:true}),
      industry: new FormControl({value: this.companyInfo.industry, disabled:false}),
      companySize: new FormControl({value: this.companyInfo.companySize, disabled:false}),
      companyWebsite: new FormControl(this.companyInfo?.companyWebsite),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      zipCode: new FormControl(''),
      region: new FormControl('nigeria'),
      language: new FormControl('english'),
      currency: new FormControl(this.companyInfo.currency)
    });

    this.companyInfoForm.controls['region'].valueChanges.subscribe(val => {
      const currency = Regions.find(x => x._id === val)?.currencyCode;
      this.companyInfoForm.controls['currency'].setValue(currency)
    })
  }

  toggleAccordionInfo(index: number) {
    this.activeTab = this.activeTab === index ? -1 : index;
    //const item = this.accordionItems[index];
  }

  updateCompanyInfo() {
    this.isLoading = true;
    this.uploadCompanyLogo();
  }

  submitForm() {
    const payload = this.companyInfoForm.value;
    console.log(payload);
    this.settingsService.updateCompanyInfo(payload).subscribe({
      next: res => {
        this.notify.showSuccess('The company information has been updated successfully');
        this.getCompanyInfo();
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.notify.showError('Your update was not successful. Please try again.');
      }
    })
  }

  uploadCompanyLogo() {
    const logoControl = this.companyInfoForm.get('companyLogo');
    const logoValue = logoControl?.value;

    if (logoValue instanceof File) {
      const formData = new FormData();
      formData.append('companyLogo', logoValue); // 'companyLogo' = key expected by API
      this.settingsService.updateCompanyLogo(formData, this.loggedInUser._id).subscribe({
        next: (res) => {
          // Replace File with uploaded URL or ID returned by backend
          logoControl?.setValue(res.url); // adjust depending on your API response

          // Disable the control so it won’t be included in form.value
          logoControl?.disable();

          // Continue with your main form submission
          this.submitForm();
        },
        error: (err) => {
          console.error('Logo upload failed', err);
        }
      })
    }
    else {
      // Not a file → skip upload
      logoControl?.disable();
      this.submitForm();
    }
    
  }
}
