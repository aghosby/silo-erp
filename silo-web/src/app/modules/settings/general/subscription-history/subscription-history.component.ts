import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrl: './subscription-history.component.scss'
})
export class SubscriptionHistoryComponent implements OnInit {
  autoRenew: boolean = true;
  noOfUsers:number = 10;
  selectedPlan:any;
  currentPlan:any;
  Math = Math;
  form!: FormGroup;
  subscriptionPlans = [
    {
      id: 1,
      name: "Starter Trial",
      price: 0,
      storage: "5GB",
      users: 5,
      popular: false
    },
    {
      id: 2,
      name: "Starter",
      price: 1667,
      storage: "20GB",
      users: 10,
      popular: false
    },
    {
      id: 3,
      name: "Team",
      price: 3667,
      storage: "40GB",
      users: 25,
      popular: false
    },
    {
      id: 4,
      name: "Growth",
      price: 5667,
      storage: "75GB",
      users: 50,
      popular: true
    },
    {
      id: 5,
      name: "Business",
      price: 8000,
      storage: "120GB",
      users: 70,
      popular: false
    },
    {
      id: 6,
      name: "Professional",
      price: 9667,
      storage: "160GB",
      users: 100,
      popular: false
    },
    {
      id: 7,
      name: "Advanced",
      price: 11667,
      storage: "220GB",
      users: 150,
      popular: false
    },
    {
      id: 8,
      name: "Scale",
      price: 19000,
      storage: "350GB",
      users: 250,
      popular: false
    },
    {
      id: 9,
      name: "Enterprise",
      price: 26667,
      storage: "600GB",
      users: 500,
      popular: false
    },
    {
      id: 10,
      name: "Enterprise Plus",
      price: 33333,
      storage: "1TB",
      users: 1000,
      popular: false
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.currentPlan = this.subscriptionPlans.find(x => x.name === 'Growth');
    this.selectedPlan = this.currentPlan;

    this.form = new FormGroup({
      noOfUsers: new FormControl(this.currentPlan.users)
    });

    this.form.get('noOfUsers')?.valueChanges.subscribe(value => {
      if (value != null) {
        this.updateSelectedPlanFromUsers(value);
      }
    });
  }

  get planDifference() {
    return this.selectedPlan.price - this.currentPlan.price;
  }

  updateSelectedPlanFromUsers(value: number) {
    const plan = this.subscriptionPlans.find(p => value <= p.users);
    if (plan) {
      this.selectedPlan = plan;
    }
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.form.get('noOfUsers')?.setValue(plan.users, { emitEvent: false });
  }
}
