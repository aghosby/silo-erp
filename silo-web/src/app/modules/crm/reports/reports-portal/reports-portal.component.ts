import { Component } from '@angular/core';

@Component({
  selector: 'app-reports-portal',
  templateUrl: './reports-portal.component.html',
  styleUrl: './reports-portal.component.scss'
})
export class ReportsPortalComponent {
  tabMenu = [
    {
      routeLink: 'leads',
      label: 'Leads Reports',
    },
    {
      routeLink: 'contacts',
      label: 'Contacts Reports',
    },
    {
      routeLink: 'deals',
      label: 'Deals Reports',
    },
    // {
    //   routeLink: 'sales',
    //   label: 'Sales Reports',
    // }
  ]
}
