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
import { ProviderConfirmationComponent } from './provider.confirmation.component'
import { EmailedUrlsComponent} from 'src/app/account/emailedurls/emailed.url.component'
import { ChangePasswordComponent } from './change.password.component'
import { SecurityQuestion } from './firsttimepatientlogin/security.question.component';
import { ResetPassword } from 'src/app/account/firsttimepatientlogin/reset.password.component';

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
      { path: 'emailedurls', component: EmailedUrlsComponent },
      { path: 'security-question', component: SecurityQuestion },
      { path: 'reset-password', component: ResetPassword },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoginRoutingModule { }
