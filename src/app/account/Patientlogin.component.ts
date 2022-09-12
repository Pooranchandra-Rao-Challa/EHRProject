import { OverlayService } from './../overlay.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
//import { SECURE_QUESTIONS } from 'src/app/_models/_patient/patientprofile';
import { AuthenticationService } from '../_services/authentication.service';
import { PatientPasswordChangeRequestDialogComponent } from 'src/app/dialogs/patient.login.options/patient.securequestion.dialog'
import Swal from 'sweetalert2';


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
  SQDialog = PatientPasswordChangeRequestDialogComponent;
  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,) {
   // console.log(SECURE_QUESTIONS.map((question) => { return question.value }));

  }

  ngOnInit() {
    this.buildForm();

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
    };

    this.authenticationService.patientLoginWithFormCredentials(creds).subscribe(resp => {
      if (!resp.IsSuccess) {
        this.showspinner = false;
        this.message = '';
        this.authfailedmessage = "Enter valid Email Id and Password";
      }
    });
  }

  openChangePasswordDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'app-change-password-dialog';
    dialogConfig.data = {
      id: 2,
      title: 'Change Password',
      Email: '',
      userName: this.userName
    };

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
      console.log(result);
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


    });
    if (email) {
      // this.accountservice.RaisePasswordChangeRequest({Email:email,URL:this.url}).subscribe((resp)=>{
      //   this.openErrorDialog(resp.EndUserMessage);
      // })
    }
  }
  userName: string;
  async openUsername() {
    const { value: text } = await Swal.fire({
      title: 'Reset Your Password',
      text: 'Please Enter your EHR1 Patient portal username and follow the prompts to reset your password.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need enter login username!'
        }
      },
      padding: '1px !important',
      customClass: {
        title: 'login-modal-header login-header-font',
        //container:'pop-contrainer',
        input: 'swal-input',
        cancelButton: 'login-cancel-button login-cancel-button1',
        confirmButton: 'login-confirm-button '
      },
      reverseButtons: true,
      background: '#f9f9f9',
      showCancelButton: false,
      cancelButtonText: 'Go Back',
      confirmButtonText: 'Continue',
      backdrop: true,
      inputPlaceholder: 'Enter user name',
      width: '400px'

    });
    if (text) {
      this.userName = text;
      //this.openSecurityQuestion();
      // this.accountservice.RaisePasswordChangeRequest({Email:email,URL:this.url}).subscribe((resp)=>{
      //   this.openErrorDialog(resp.EndUserMessage);
      // })
    }
  }

  // async openSecurityQuestion() {
  //   const { value: text } = await Swal.fire({
  //     title: 'Answer Security Question',
  //     text: 'Please Answer your security Question to reset your EHR1 patient portal password',
  //     input: 'select',
  //     inputOptions: SECURE_QUESTIONS.map((question) => { return question.value }),
  //     inputAttributes: {
  //       autocapitalize: 'off'
  //     },
  //     padding: '1px !important',
  //     customClass: {
  //       title: 'login-modal-header login-header-font',
  //       //container:'pop-contrainer',
  //       input: 'swal-input',
  //       cancelButton: 'login-cancel-button login-cancel-button1',
  //       confirmButton: 'login-confirm-button login-confirm-button1'
  //     },
  //     reverseButtons: true,
  //     background: '#f9f9f9',
  //     showCancelButton: true,
  //     cancelButtonText: 'Go Back',
  //     confirmButtonText: 'Continue',
  //     backdrop: true,
  //     inputPlaceholder: 'Select Security Question',
  //     width: '500px'

  //   });
  //   if (text) {
  //     // this.accountservice.RaisePasswordChangeRequest({Email:email,URL:this.url}).subscribe((resp)=>{
  //     //   this.openErrorDialog(resp.EndUserMessage);
  //     // })
  //   }
  // }

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

  openErrorDialog() {

    Swal.fire({

      text: 'Wrong Email Or Password',

      padding: '1px !important',
      customClass: {
        cancelButton: 'cancel-button cancel-button1'
      },

      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      backdrop: true,
      showConfirmButton: false,
    });
  }
}


