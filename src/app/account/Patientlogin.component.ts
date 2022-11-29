
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { PatientSecurityQuestionDialogComponent } from 'src/app/dialogs/patient.login.options/patient.securequestion.dialog'
import Swal from 'sweetalert2';
import { PlatformLocation } from '@angular/common';
import { Accountservice } from '../_services/account.service';



@Component({
  selector: 'app-patientlogin',
  templateUrl: './patientlogin.component.html',
  styleUrls: ['./patientlogin.component.scss']
})
export class PatientLoginComponent implements OnInit {
  loginForm: any;
  showspinner: boolean;
  message: string = '';
  authfailedmessage; string = '';
  isdefaultEdit: boolean = false;
  isdefault: boolean = true;
  showPassword: boolean = false;
  userIP: string;
  SQDialog = PatientSecurityQuestionDialogComponent;
  url: string;
  constructor(private fb: FormBuilder,
    private plaformLocation: PlatformLocation,
    private authenticationService: AuthenticationService,
    private accountservice: Accountservice,
    private dialog: MatDialog,) {
    this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
    if (plaformLocation.href.indexOf('?') > -1)
      this.url = plaformLocation.href.substring(0, plaformLocation.href.indexOf('?')).replace(plaformLocation.pathname, '/');
  }

  ngOnInit() {
    this.buildForm();
    this.UserIP();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      EmailId: [''],
      Password: ['']
    });
  }

  OnLoginSubmit() {
    this.showspinner = true;
    this.message = 'Please wait while verifying your Email Id and Password';

    if (this.loginForm.Invalid) {
      return
    };
    var data = this.loginForm.value;
    var creds = {
      "EmailId": data.EmailId,
      "Password": data.Password,
      "UserIP": this.userIP
    };

    this.authenticationService.patientLoginWithFormCredentials(creds)
    // .subscribe(resp => {
    //   if (!resp.IsSuccess) {
    //     this.showspinner = false;
    //     this.message = '';
    //     this.authfailedmessage = "Enter valid Email Id and Password";
    //   }
    // });
  }
  public hidePassword(){
    this.showPassword = false;
  }
  openChangePasswordDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'app-change-password-dialog';
    dialogConfig.data = {};

    let dialogRef = this.dialog.open(this.SQDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {


    });


  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  openResetPasswordOptions() {
    Swal.fire({
      title: 'Password Reset Options',
      customClass: {
        container: 'round-container',
        title: 'swal2-title-patient-login',
        input: 'swal-input',
        cancelButton: 'cancel-button-patient-login',
        confirmButton: 'confirm-button-patient-login'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Answer Security Question',
      confirmButtonText: 'Enter Your Recovery Email',
      backdrop: true,
      width: '500px'
    }).then((result) => {

      if (result.dismiss == Swal.DismissReason.cancel) {
        this.openChangePasswordDialog();
      }
      else if (result.isConfirmed) {
        this.openResetPassword();
      }

      // if (result.isCan) {
      //   Swal.fire({
      //     title: `${result.value.login}'s avatar`,
      //     imageUrl: result.value.avatar_url
      //   })
      // }
    })

  }

 async userNameForResetPassword()  {

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
    });

    if (email) {
      // this.accountservice.ResendValidationMail({Email:email,URL:this.url}).subscribe((resp)=>{
      //   this.openErrorDialog(resp.EndUserMessage);
      // })
    }
  }

  openErrorDialog(message: string) {
    Swal.fire({
      title: message,
      padding: '1px !important',
      customClass: {
        cancelButton: 'login-cancel-button'
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


