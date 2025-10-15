// Angular modules
import { NgModule }                 from '@angular/core';
import { Routes }                   from '@angular/router';
import { RouterModule }             from '@angular/router';

// Components

const routes : Routes = [];

@NgModule({
  imports :
  [
    RouterModule.forChild(routes)
  ],
  exports :
  [
    RouterModule
  ],
  providers :
  [
  ]
})
export class AuthRoutingModule { }
