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
import { SupportOverviewComponent } from './support/support-overview/support-overview.component';
import { TicketInfoComponent } from './support/ticket-info/ticket-info.component';
import { AgentsOverviewComponent } from './agents/agents-overview/agents-overview.component';
import { AgentsInfoComponent } from './agents/agents-info/agents-info.component';


@NgModule({
  declarations: [
    AgentsInfoComponent,
    AgentsOverviewComponent,
    ContactsInfoComponent,
    ContactsOverviewComponent,
    DashboardComponent,
    DealsCardComponent,
    DealInfoComponent,
    LeadsInfoComponent,
    LeadsOverviewComponent,
    SalesPipelineComponent,
    SupportOverviewComponent,
    TicketInfoComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule
  ]
})
export class CrmModule { }
