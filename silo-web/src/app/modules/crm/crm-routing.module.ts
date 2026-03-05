import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadsOverviewComponent } from './leads/leads-overview/leads-overview.component';
import { ContactsOverviewComponent } from './contacts/contacts-overview/contacts-overview.component';
import { SalesPipelineComponent } from './deals/sales-pipeline/sales-pipeline.component';
import { SupportOverviewComponent } from './support/support-overview/support-overview.component';
import { AgentsOverviewComponent } from './agents/agents-overview/agents-overview.component';

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
    path: 'agents',
    component: AgentsOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
