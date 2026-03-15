import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiloModulesComponent } from './pages/silo-modules/silo-modules.component';
import { SiloCompaniesComponent } from './pages/silo-companies/silo-companies.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },
  {
    path: 'modules',
    component: SiloModulesComponent
  },
  {
    path: 'companies',
    component: SiloCompaniesComponent
  },
  // {
  //   path: 'companies/:id',
  //   component: SiloCompanyDetailsComponent
  // },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
