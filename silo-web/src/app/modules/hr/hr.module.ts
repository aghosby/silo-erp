import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@sharedWeb/shared.module';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeInfoComponent } from './employees/employee-info/employee-info.component';
import { EmployeeProfileComponent } from './employees/employee-profile/employee-profile.component';
import { LeaveAssignmentComponent } from './leave-management/leave-assignment/leave-assignment.component';
import { PaymentInfoComponent } from './payroll/payment-info/payment-info.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { WorkLocationComponent } from './attendance/work-location/work-location.component';
import { LeaveManagementOverviewComponent } from './leave-management/leave-management-overview/leave-management-overview.component';
import { LeaveRequestsOverviewComponent } from './leave-management/leave-requests-overview/leave-requests-overview.component';
import { LeaveRequestInfoComponent } from './leave-management/leave-request-info/leave-request-info.component';
import { ExpenseManagementOverviewComponent } from './expense-management/expense-management-overview/expense-management-overview.component';
import { ExpenseRequestsInfoComponent } from './expense-management/expense-requests-info/expense-requests-info.component';
import { ExpenseRequestsOverviewComponent } from './expense-management/expense-requests-overview/expense-requests-overview.component';


@NgModule({
  declarations: [
    DashboardComponent,
    EmployeeListComponent,
    EmployeeInfoComponent,
    EmployeeProfileComponent,
    ExpenseManagementOverviewComponent,
    ExpenseRequestsInfoComponent,
    ExpenseRequestsOverviewComponent,
    LeaveAssignmentComponent,
    LeaveManagementOverviewComponent,
    LeaveRequestInfoComponent,
    LeaveRequestsOverviewComponent,
    PaymentInfoComponent,
    WorkLocationComponent
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    GoogleMapsModule,
    SharedModule,
    DatePipe
  ]
})
export class HrModule { }
