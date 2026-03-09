import { Component } from '@angular/core';

@Component({
  selector: 'app-appraisal-portal',
  templateUrl: './appraisal-portal.component.html',
  styleUrl: './appraisal-portal.component.scss'
})
export class AppraisalPortalComponent {
  tabMenu = [
    {
      routeLink: 'overview',
      label: 'Overview',
    },
    {
      routeLink: 'appraisal-kpis',
      label: 'Appraisal KPIs',
    },
  ]
}
