// Angular modules
import { CommonModule }               from '@angular/common';
import { NgModule }                   from '@angular/core';
import { FormsModule }                from '@angular/forms';
import { ReactiveFormsModule }        from '@angular/forms';
import { RouterModule }               from '@angular/router';

// External modules
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
// Components
import { ToastComponent }             from './components/blocks/toast/toast.component';
import { ProgressBarComponent }       from './components/blocks/progress-bar/progress-bar.component';

// Forms
import { FormConfirmComponent }      from './components/forms/form-confirm/form-confirm.component';

// Modals
import { ModalWrapperComponent }     from './components/modals/modal-wrapper/modal-wrapper.component';

// Layouts
import { LayoutHeaderComponent }     from './components/layouts/layout-header/layout-header.component';
import { PageLayoutComponent }       from './components/layouts/page-layout/page-layout.component';

// Pipes

// Directives
import { ModalWrapperDirective }     from './directives/modal-wrapper.directive';
import { LayoutFooterComponent } from './components/layouts/layout-footer/layout-footer.component';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { HasRoleDirective } from './directives/has-role.directive';

const SHARED_COMP = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatMenuModule,
  MatNativeDateModule,
  MatButtonModule,
  MatDialogModule,
  MatCheckboxModule,
];


@NgModule({
  imports: [
    // Angular modules
    ...SHARED_COMP,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // External modules
    TranslateModule,
    AngularSvgIconModule,
    NgbModule,
  ],
  declarations: [
    // Components
    ToastComponent,
    ProgressBarComponent,

    // Forms
    FormConfirmComponent,

    // Modals
    ModalWrapperComponent,

    // Layouts
    LayoutHeaderComponent,
    PageLayoutComponent,

    // Pipes

    // Directives
    ModalWrapperDirective,
    HasPermissionDirective,
    HasRoleDirective,

    LayoutFooterComponent
  ],
  exports: [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...SHARED_COMP,

    // External modules
    TranslateModule,
    AngularSvgIconModule,
    NgbModule,

    // Components
    ToastComponent,
    ProgressBarComponent,

    // Forms
    FormConfirmComponent,

    // Modals
    ModalWrapperComponent,

    // Layouts
    LayoutHeaderComponent,
    PageLayoutComponent,

    // Pipes

    // Directives
    ModalWrapperDirective,
    HasPermissionDirective,
    HasRoleDirective
  ],
  providers:[]
})
export class SharedModule {}
