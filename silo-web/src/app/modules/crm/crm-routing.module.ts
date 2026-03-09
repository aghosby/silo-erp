import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadsOverviewComponent } from './leads/leads-overview/leads-overview.component';
import { ContactsOverviewComponent } from './contacts/contacts-overview/contacts-overview.component';
import { SalesPipelineComponent } from './deals/sales-pipeline/sales-pipeline.component';
import { SupportOverviewComponent } from './support/support-overview/support-overview.component';
import { AgentsOverviewComponent } from './agents/agents-overview/agents-overview.component';
import { ReportsPortalComponent } from './reports/reports-portal/reports-portal.component';
import { LeadsReportComponent } from './reports/leads-report/leads-report.component';
import { ContactsReportComponent } from './reports/contacts-report/contacts-report.component';
import { DealsReportComponent } from './reports/deals-report/deals-report.component';
import { SalesReportComponent } from './reports/sales-report/sales-report.component';
import { AgentsReportComponent } from './reports/agents-report/agents-report.component';
import { CalendarEventsComponent } from './calendar/calendar-events/calendar-events.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'contacts',
    component: ContactsOverviewComponent,
  },
  {
    path: 'leads',
    component: LeadsOverviewComponent,
  },
  {
    path: 'deals-pipeline',
    component: SalesPipelineComponent,
  },
  {
    path: 'support',
    component: SupportOverviewComponent
  },
  {
    path: 'calendar',
    component: CalendarEventsComponent
  },
  {
    path: 'agents',
    component: AgentsOverviewComponent,
  },
  {
    path: 'reports',
    component: ReportsPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'leads',
        pathMatch: 'full'
      },
      {
        path : 'leads',
        component: LeadsReportComponent
      },
      {
        path : 'contacts',
        component: ContactsReportComponent
      },
      {
        path : 'deals',
        component: DealsReportComponent
      },
      {
        path : 'sales',
        component: SalesReportComponent
      },
      {
        path : 'agents',
        component: AgentsReportComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
