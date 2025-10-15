// Angular modules
import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';

// Internal modules
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';

// Components

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
})
export class AuthModule { }
