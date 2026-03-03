import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmRoutingModule } from './crm-routing.module';
import { SharedModule } from '@sharedWeb/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsOverviewComponent } from './contacts/contacts-overview/contacts-overview.component';
import { LeadsOverviewComponent } from './leads/leads-overview/leads-overview.component';
import { LeadsInfoComponent } from './leads/leads-info/leads-info.component';


@NgModule({
  declarations: [
    ContactsOverviewComponent,
    DashboardComponent,
    LeadsInfoComponent,
    LeadsOverviewComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule
  ]
})
export class CrmModule { }
