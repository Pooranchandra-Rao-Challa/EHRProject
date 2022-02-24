
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './account/home.comonent';
import { AuthGuard } from './_helpers/auth.guard';
const loginModule = () => import('./account/login.module').then(x => x.LoginModule);
const reportsModule = () => import('./layouts/reports.module').then(x => x.ReportsModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: loginModule },
  { path: 'reports', loadChildren: reportsModule },
  // otherwise redirect to home
  { path: '**', redirectTo: '/' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
