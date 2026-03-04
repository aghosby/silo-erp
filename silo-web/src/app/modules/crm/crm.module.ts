import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmRoutingModule } from './crm-routing.module';
import { SharedModule } from '@sharedWeb/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsOverviewComponent } from './contacts/contacts-overview/contacts-overview.component';
import { LeadsOverviewComponent } from './leads/leads-overview/leads-overview.component';
import { LeadsInfoComponent } from './leads/leads-info/leads-info.component';
import { ContactsInfoComponent } from './contacts/contacts-info/contacts-info.component';
import { SalesPipelineComponent } from './deals/sales-pipeline/sales-pipeline.component';
import { DealInfoComponent } from './deals/deal-info/deal-info.component';
import { DealsCardComponent } from './deals/deals-card/deals-card.component';


@NgModule({
  declarations: [
    ContactsInfoComponent,
    ContactsOverviewComponent,
    DashboardComponent,
    DealsCardComponent,
    DealInfoComponent,
    LeadsInfoComponent,
    LeadsOverviewComponent,
    SalesPipelineComponent,
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule
  ]
})
export class CrmModule { }
