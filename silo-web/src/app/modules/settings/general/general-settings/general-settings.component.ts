import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { AdminService } from '@services/admin/admin.service';
import { HrService } from '@services/hr/hr.service';
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
    private hrService: HrService,
    private notify: NotificationService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
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

    this.companyInfoForm = new FormGroup({
      companyLogo: new FormControl(this.loggedInUser.companyLogo),
      companyName: new FormControl({value: this.loggedInUser.companyName, disabled:true}),
      industry: new FormControl({value: this.loggedInUser.industry, disabled:false}),
      companySize: new FormControl({value: this.loggedInUser.companySize, disabled:false}),
      companyWebsite: new FormControl(this.loggedInUser?.companyWebsite),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      zipCode: new FormControl(''),
      region: new FormControl('nigeria'),
      language: new FormControl('english'),
      currency: new FormControl('')
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

  handleCompanyInfoFormAction(value:any) {

  }
}
