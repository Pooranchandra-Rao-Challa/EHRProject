
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { Enablge2FAAuthenticatorComponent } from 'src/app/account/enable.2fa.authenticator';
import { Verify2FATokenComponent } from 'src/app/account/verify2fa.token.component';
import Swal from 'sweetalert2';
import { Accountservice } from '../_services/account.service';
import { PlatformLocation } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkOverlayOrigin,
  ScrollStrategy,
  ScrollStrategyOptions,
  CdkConnectedOverlay
} from "@angular/cdk/overlay";
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  message: string = '';
  authfailedmessage: string = '';
  creds: any;
  showspinner: boolean;
  showPassword: boolean = false;
  url: string;
  userIP: string;
  enableAuthenticatorComponent = Enablge2FAAuthenticatorComponent;
  verify2FATokenComponent = Verify2FATokenComponent
  constructor(private fb: FormBuilder,
    private readonly sso: ScrollStrategyOptions,
    private authenticationService: AuthenticationService,
    private plaformLocation: PlatformLocation,
    private accountservice: Accountservice,
    private alertMessage: AlertMessage,
    private dialog: MatDialog,) {
    this.url = `${plaformLocation.protocol}//${plaformLocation.hostname}:${plaformLocation.port}/`;
  }


  ngOnInit() {
    this.showspinner = false;
    this.buildForm();
    this.UserIP();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      UserName: [''],
      Password: ['']
    });
  }

  OnFormSubmit() {
    this.showspinner = true;
    this.message = 'Please wait while verifying your Email Id and Password';

    if (this.loginForm.Invalid) {
      return
    };
    var data = this.loginForm.value;
    var creds = {
      "EmailId": data.UserName,
      "Password": data.Password,
      "UserIP": this.userIP
    };
    this.authenticationService.loginWithFormCredentials(creds).subscribe(resp => {
      console.log(resp);

      if (!resp.IsSuccess) {
        this.showspinner = false;
        this.message = '';
        if (resp.ShowExceptionMessage)
          this.authfailedmessage = resp.EndUserMessage;
        else
          this.authfailedmessage = "Enter valid Email Id and Password";
      } else if (

        this.authenticationService.isEnabledTwofactorAuth &&
        !this.authenticationService.otpRequiredWhileLogin) {
        document.body.scrollBy(0, -document.body.scrollTop);
        document.body.style.overflow = "hidden";
        let dialogRef = this.dialog.open(this.enableAuthenticatorComponent,
          {
            hasBackdrop: false,
            backdropClass: 'backdropClass-2fa',
            scrollStrategy: this.sso.noop(),
          });

        dialogRef.afterClosed().subscribe(result => {
          document.body.style.overflow = "auto"

        });
      }else if (
        this.authenticationService.isEnabledTwofactorAuth &&
        this.authenticationService.otpRequiredWhileLogin) {
        document.body.scrollBy(0, -document.body.scrollTop);
        document.body.style.overflow = "hidden";
        let dialogRef = this.dialog.open(this.verify2FATokenComponent,
          {
            hasBackdrop: false,
            backdropClass: 'backdropClass-2fa',
            scrollStrategy: this.sso.noop(),
          });

        dialogRef.afterClosed().subscribe(result => {
          document.body.style.overflow = "auto"

        });
      }
      else if(this.authenticationService.isProvider) {
        this.openErrorDialog(ERROR_CODES["EL001"]);
      }
    },
      (error) => {
        this.showspinner = false;
        this.message = 'Check with admistartor.';
      },
      () => {
        this.showspinner = false;
      });

  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  public hidePassword() {
    this.showPassword = false;
  }

  async openResetPassword() {
    const { value: email } = await Swal.fire({
      title: 'Reset Your Password',
      text: 'Enter the email address associated with your account and an email with password reset instructions will be sent.',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off'
      },
      padding: '1px !important',
      customClass: {
        title: 'login-modal-header login-header-font',
        //container:'pop-contrainer',
        input: 'swal-input',
        cancelButton: 'login-cancel-button login-cancel-button1',
        confirmButton: 'login-confirm-button login-confirm-button1'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Go Back',
      confirmButtonText: 'Okay-Send it !',
      backdrop: true,
      inputPlaceholder: 'Enter your email address',
      inputValidator: (value) => {
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
          return 'You need to enter valid email!'
        }
      }


    });
    if (email) {
      this.accountservice.RaisePasswordChangeRequest({ Email: email, URL: this.url }).subscribe((resp) => {
        this.openErrorDialog(resp.EndUserMessage);
      })
    }
  }


  async openResendVerification() {
    const { value: email } = await Swal.fire({
      title: 'Email Verification',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCloseButton: true,
      padding: '1px !important',
      customClass: {
        title: 'login-modal-header login-header-font',
        input: 'swal-input',
        confirmButton: 'login-confirm-button',
        closeButton: 'login-close-button'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      inputLabel: 'Email Address :',
      confirmButtonText: 'Resend Verification',
      backdrop: true,
      inputPlaceholder: 'Enter your email address',
      inputValidator: (value) => {
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
          return 'You need to enter valid email!'
        }
      }
    });

    if (email) {
      this.accountservice.ResendValidationMail({ Email: email, URL: this.url }).subscribe((resp) => {
        this.openErrorDialog(resp.EndUserMessage);
      })
    }
  }

  openErrorDialog(message: string) {
    Swal.fire({
      title: message,
      padding: '1px !important',
      customClass: {
        title: 'swal2-title-error',
        cancelButton: 'swal2-error'
      },
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      backdrop: true,
      showConfirmButton: false,
    });
  }

  private UserIP() {
    this.authenticationService.UserIp().subscribe((resp: any) => { this.userIP = resp.ip })
  }
}
