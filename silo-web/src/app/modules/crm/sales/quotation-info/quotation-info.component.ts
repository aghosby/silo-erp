import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { CrmService } from '@services/crm/crm.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-quotation-info',
  templateUrl: './quotation-info.component.html',
  styleUrl: './quotation-info.component.scss'
})
export class QuotationInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  form!: FormGroup;
  formArrayDetails!: FormArray;
  keepOrder = () => 0;

  constructor(
    private fb: FormBuilder,
    private utils: UtilityService,
    private crmService: CrmService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.formFields = [
      {
        controlName: 'customerType',
        controlType: 'select',
        controlLabel: 'Customer Type',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.customerType : null,
        selectOptions: {
          contact: 'Contact',
          lead: 'Lead'
        },
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'contact',
        controlType: 'select',
        controlLabel: 'Contact',
        controlWidth: '48%',
        initialValue: '',
        hidden: true,
        selectOptions: this.utils.arrayToObject(this.data.contacts, 'name'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'lead',
        controlType: 'select',
        controlLabel: 'Lead',
        controlWidth: '48%',
        initialValue: '',
        hidden: true,
        selectOptions: this.utils.arrayToObject(this.data.leads, 'name'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'refNo',
        controlType: 'text',
        controlLabel: 'Reference Number',
        controlWidth: '48%',
        validators: [Validators.required],
        order: 2,
        initialValue: ''
      },
      {
        controlName: 'agent',
        controlType: 'select',
        controlLabel: 'Assigned Agent',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.data.agents, 'fullName'),
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'issueDate',
        controlType: 'date',
        controlLabel: 'Issue Date',
        controlWidth: '48%',
        initialValue: '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'expiryDate',
        controlType: 'date',
        controlLabel: 'Expiry Date',
        controlWidth: '48%',
        initialValue: '',
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'paymentTerms',
        controlType: 'text',
        controlLabel: 'Payment Terms',
        controlWidth: '100%',
        validators: [],
        order: 6
      },
    ]

    this.formFields.sort((a,b) => (a.order - b.order));
    this.form = this.fb.group({
      orderItemDetails: new FormArray([]),
      orderTotal: new FormControl(0)
    });

    this.formFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.form.addControl(field.controlName, formControl)
    });

    this.form.controls['customerType'].valueChanges.subscribe(val => this.toggleCustomerTypeFields(val));

    this.formArrayDetails = this.form.get("orderItemDetails") as FormArray;
    this.addOrderItem();
    this.calcOrderTotal();
  }

  toggleCustomerTypeFields(type: string) {
    const lead = this.formFields.find(f => f.controlName === 'lead');
    const contact = this.formFields.find(f => f.controlName === 'contact');

    if (!lead || !contact) return;

    if (type === 'contact') {
      lead.hidden = true;
      contact.hidden = false;
    } 
    else {
      lead.hidden = false;
      contact.hidden = true;
    }

    // 🔥 IMPORTANT: trigger change detection
    this.formFields = [...this.formFields];
  }

  addOrderItem() {
    const orderItem = this.fb.group({
      description: new FormControl('', Validators.required),
      quantity: new FormControl(1, Validators.required),
      unitPrice: new FormControl(0, Validators.required),
      tax: new FormControl(0, Validators.required),
      subTotal: new FormControl(0, Validators.required)
    });

    this.formArrayDetails.push(orderItem);
  }

  removeOrderItem(index: number) {
    this.formArrayDetails.removeAt(index);
  }

  calcOrderItemTotal(index: number) {
    let itemVal = this.formArrayDetails.at(index);
    console.log(itemVal.value);
    const baseTotal = itemVal.value.quantity * itemVal.value.unitPrice;
    const subTotal = (baseTotal * itemVal.value.tax/100) + baseTotal;
    this.formArrayDetails.at(index).get('subTotal')?.setValue(subTotal);
    this.calcOrderTotal();
  }

  calcOrderTotal() {
    let order = this.formArrayDetails.value;
    console.log(order);
    const sum = order.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.subTotal, 0);
    this.form.controls['orderTotal'].setValue(sum);
    console.log(this.form.value);
  }

}
