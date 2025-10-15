// Angular modules
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

// Components
import { NotFoundComponent } from './static/not-found/not-found.component';

const routes : Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'verify',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'set-password',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  { path : '',   redirectTo : '/login', pathMatch : 'full' },
  { path : '**', component : NotFoundComponent }
];

@NgModule({
  imports : [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports : [RouterModule]
})
export class AppRoutingModule { }
