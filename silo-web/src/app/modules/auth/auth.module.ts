// Angular modules
import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';

// Internal modules
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { SiloOnboardingAdminComponent } from './silo-onboarding-admin/silo-onboarding-admin.component';
import { SiloOnboardingEmployeeComponent } from './silo-onboarding-employee/silo-onboarding-employee.component';

// Components

@NgModule({
  declarations: [
    SiloOnboardingAdminComponent,
    SiloOnboardingEmployeeComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
  exports: [
    SiloOnboardingAdminComponent,
  ]
})
export class AuthModule { }
