import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-rounting.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RubyAuthenticationFailedComponenet } from './ruby.authentication.failed.component';
import { RegistrationComponent } from "../account/registration.component";
import { HomeComponent } from "../account/home.comonent";
import { SharedModule } from '../_common/shared';
import { IConfig, NgxMaskModule } from 'ngx-mask'
import { PatientLoginComponent } from './Patientlogin.component';
import { PartnerSignupComponent } from '../patient/partner-signup.component';
import { CreatePasswordComponent } from './createpassword.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(),

  ],
  declarations: [
    LayoutComponent,
    LoginComponent,
    RubyAuthenticationFailedComponenet,
    RegistrationComponent,
    HomeComponent,
    PatientLoginComponent,
    PartnerSignupComponent,
    CreatePasswordComponent
  ]
})
export class LoginModule { }
