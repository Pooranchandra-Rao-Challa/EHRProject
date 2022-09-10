
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { isSetAccessor } from 'typescript';
import { AuthenticationService } from '../_services/authentication.service';
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
  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) { }
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
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
        title: 'modal-header header-font',
        //container:'pop-contrainer',
        input: 'swal-input',
        cancelButton: 'cancel-button cancel-button1',
        confirmButton: 'confirm-button confirm-button1'
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
      Swal.fire(`Entered email: ${email}`)
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
        title: 'modal-header header-font',
        //container:'pop-contrainer',
        input: 'swal-input',
        //cancelButton:'cancel-button cancel-button1',
        confirmButton: 'confirm-button',
        closeButton: 'close-button'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      inputLabel: 'Email Address :',
      //showCancelButton: false,
      //cancelButtonText:'Go Back',
      confirmButtonText: 'Resend Verification',
      backdrop: true,
      inputPlaceholder: 'Enter your email address',


    });

    if (email) {
      Swal.fire(`Entered email: ${email}`)
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


