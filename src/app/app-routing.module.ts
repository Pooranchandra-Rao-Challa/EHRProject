
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './account/home.comonent';
import { AuthGuard } from './_helpers/auth.guard';
const loginModule = () => import('./account/login.module').then(x => x.LoginModule);
const reportsModule = () => import('./layouts/reports.module').then(x => x.ReportsModule);
const providerModule = () => import('./_navigations/provider.layout/provider.module').then(x => x.ProviderModule);
const adminModule = () => import('./_navigations/admin.layout/admin.module').then(x => x.AdminModule);
const patientModule = () => import('./_navigations/patient.layout/patient.module').then(x => x.PatientModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: loginModule },
  { path: 'reports', loadChildren: reportsModule, canActivate: [AuthGuard]  },
  { path: 'provider', loadChildren: providerModule, canActivate: [AuthGuard]  },
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard]  },
  { path: 'patient', loadChildren: patientModule, canActivate: [AuthGuard]  },
  // otherwise redirect to home
  { path: '**', redirectTo: '/' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
