import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-rounting.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RegistrationComponent } from "../account/registration.component";
import { HomeComponent } from "../account/home.comonent";
import { SharedModule } from '../_common/shared';
import { IConfig, NgxMaskModule } from 'ngx-mask'
import { PatientLoginComponent } from './Patientlogin.component';
import { PartnerSignupComponent } from '../patient/partner-signup.component';
import { CreatePasswordComponent } from './createpassword.component';
import { ErrorMessageComponent } from '../_components/error.message.component';
import { ProviderConfirmationComponent } from './provider.confirmation.component'
// import { EmailedUrlsComponent } from 'src/app/account/emailedurls/emailed.url.component'
import { ChangePasswordComponent } from './change.password.component'
import { AlertMessage } from '../_alerts/alertMessage';
import { PatientService } from '../_services/patient.service';
import { OverlayService } from '../overlay.service';
import { SecurityQuestion } from 'src/app/account/firsttimepatientlogin/security.question.component';
import { ResetPassword } from 'src/app/account/firsttimepatientlogin/reset.password.component';
import { PatientRelationsComponent } from 'src/app/account/firsttimepatientlogin/patient.relations.component';
import { ResetPatientPasswordComponent } from 'src/app/dialogs/patient.login.options/patient.reset.password.component';
import { Enablge2FAAuthenticatorComponent } from 'src/app/account/enable.2fa.authenticator';
import { Verify2FATokenComponent } from 'src/app/account/verify2fa.token.component';


import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    SharedModule,
    QRCodeModule,
    OverlayModule,
    NgxMaskModule.forRoot(),

  ],
  declarations: [
    LayoutComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    PatientLoginComponent,
    PartnerSignupComponent,
    CreatePasswordComponent,
    ErrorMessageComponent,
    ProviderConfirmationComponent,
    ChangePasswordComponent,
    SecurityQuestion,
    ResetPassword,
    PatientRelationsComponent,
    ResetPatientPasswordComponent,
    Enablge2FAAuthenticatorComponent,
    Verify2FATokenComponent
  ],
  providers:[
    OverlayService,
    AlertMessage,
    PatientService
  ],
})
export class LoginModule {  }
