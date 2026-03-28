import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ZeraCopilotComponent } from './zera-copilot.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ZeraCopilotComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  exports: [ZeraCopilotComponent],
})
export class ZeraCopilotModule { }