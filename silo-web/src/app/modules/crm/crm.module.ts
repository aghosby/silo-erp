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
import { ReportsPortalComponent } from './reports/reports-portal/reports-portal.component';
import { LeadsReportComponent } from './reports/leads-report/leads-report.component';
import { ContactsReportComponent } from './reports/contacts-report/contacts-report.component';
import { DealsReportComponent } from './reports/deals-report/deals-report.component';
import { ActivityInfoComponent } from './calendar/activity-info/activity-info.component';
import { CalendarEventsComponent } from './calendar/calendar-events/calendar-events.component';
import { CalendarComponent } from '@sharedWeb/components/blocks/calendar/calendar/calendar.component';
import { SalesOverviewComponent } from './sales/sales-overview/sales-overview.component';
import { QuotationInfoComponent } from './sales/quotation-info/quotation-info.component';
import { InvoiceInfoComponent } from './sales/invoice-info/invoice-info.component';
import { PurchaseOrderInfoComponent } from './sales/purchase-order-info/purchase-order-info.component';


@NgModule({
  declarations: [
    ActivityInfoComponent,
    AgentsInfoComponent,
    AgentsOverviewComponent,
    CalendarEventsComponent,
    ContactsInfoComponent,
    ContactsOverviewComponent,
    ContactsReportComponent,
    DashboardComponent,
    DealsCardComponent,
    DealInfoComponent,
    DealsReportComponent,
    InvoiceInfoComponent,
    LeadsInfoComponent,
    LeadsOverviewComponent,
    LeadsReportComponent,
    PurchaseOrderInfoComponent,
    QuotationInfoComponent,
    ReportsPortalComponent,
    SalesOverviewComponent,
    SalesPipelineComponent,
    SupportOverviewComponent,
    TicketInfoComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    CalendarComponent,
    SharedModule
  ]
})
export class CrmModule { }
