import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SiloCompaniesComponent } from './pages/silo-companies/silo-companies.component';
import { SiloModulesComponent } from './pages/silo-modules/silo-modules.component';
import { SharedModule } from '@sharedWeb/shared.module';
import { PermissionInfoComponent } from './components/permission-info/permission-info.component';


@NgModule({
  declarations: [
    PermissionInfoComponent,
    SiloCompaniesComponent,
    SiloModulesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
