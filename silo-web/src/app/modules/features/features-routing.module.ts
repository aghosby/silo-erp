import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'hr',
      },
      {
        path: 'hr',
        loadChildren: () => import('../hr/hr.module').then(m => m.HrModule),
      },
      {
        path: 'crm',
        loadChildren: () => import('../crm/crm.module').then(m => m.CrmModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
      },
      {
        path: 'silo',
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
      },
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
