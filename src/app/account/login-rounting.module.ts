import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RubyAuthenticationFailedComponenet } from './ruby.authentication.failed.component';
import { RegistrationComponent } from "../account/registration.component";
import { HomeComponent } from "../account/home.comonent";
import { PatientLoginComponent } from './Patientlogin.component';
import { PartnerSignupComponent } from '../patient/partner-signup.component';
import { CreatePasswordComponent } from './createpassword.component'


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'rubyloginfailed', component: RubyAuthenticationFailedComponenet },
      { path: 'registration', component: RegistrationComponent },
      { path: 'home', component: HomeComponent },
      { path: 'patientlogin', component: PatientLoginComponent },
      { path: 'partnersignup', component: PartnerSignupComponent },
      { path: 'createpassword', component: CreatePasswordComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoginRoutingModule { }
