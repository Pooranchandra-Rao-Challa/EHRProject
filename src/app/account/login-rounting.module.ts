import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RegistrationComponent } from "../account/registration.component";
import { HomeComponent } from "../account/home.comonent";
import { PatientLoginComponent } from './Patientlogin.component';
import { PartnerSignupComponent } from '../patient/partner-signup.component';
import { CreatePasswordComponent } from './createpassword.component'
import { ProviderConfirmationComponent } from './provider.confirmation.component'
import { ChangePasswordComponent } from './change.password.component'
import { SecurityQuestion } from './firsttimepatientlogin/security.question.component';
import { ResetPassword } from 'src/app/account/firsttimepatientlogin/reset.password.component';
import { PatientRelationsComponent } from './firsttimepatientlogin/patient.relations.component';
import { ResetPatientPasswordComponent } from 'src/app/dialogs/patient.login.options/patient.reset.password.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'home', component: HomeComponent },
      { path: 'patientlogin', component: PatientLoginComponent },
      { path: 'partnersignup', component: PartnerSignupComponent },
      { path: 'createpassword', component: CreatePasswordComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'providerconfirmation', component: ProviderConfirmationComponent },
      { path: 'security-question', component: SecurityQuestion },
      { path: 'reset-password', component: ResetPassword },
      { path: 'patient-relations', component: PatientRelationsComponent },
      { path: 'reset-patient-password', component: ResetPatientPasswordComponent },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoginRoutingModule { }
