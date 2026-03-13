import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SiloCompaniesComponent } from './pages/silo-companies/silo-companies.component';
import { SiloModulesComponent } from './pages/silo-modules/silo-modules.component';


@NgModule({
  declarations: [
    SiloCompaniesComponent,
    SiloModulesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
