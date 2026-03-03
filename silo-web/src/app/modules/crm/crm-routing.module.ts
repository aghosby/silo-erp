import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadsOverviewComponent } from './leads/leads-overview/leads-overview.component';
import { ContactsOverviewComponent } from './contacts/contacts-overview/contacts-overview.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
