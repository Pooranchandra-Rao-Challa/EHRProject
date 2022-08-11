
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import Swal from 'sweetalert2';

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
  ruby_session_id: any = '';
  showPassword: boolean = false;
  constructor(private fb: FormBuilder,
    protected http: HttpClient,
    private authenticationService: AuthenticationService) { }


  ngOnInit() {
    this.showspinner = false;
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.ruby_session_id = httpParams.get('s_id');
      if (this.ruby_session_id != '' && this.ruby_session_id != null) {
        this.showspinner = true;
        this.message = 'Please wait while navigating to reports page';
        //this.authenticationService.loginWithRubyCredentials(this.ruby_session_id);
      }
    }
    this.buildForm();
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
    };

    this.authenticationService.loginWithFormCredentials(creds).subscribe(resp => {
      if (!resp.IsSuccess) {
        this.showspinner = false;
        this.message = '';
        if (resp.ShowExceptionMessage)
          this.authfailedmessage = resp.EndUserMessage;
        else
          this.authfailedmessage = "Enter valid Email Id and Password";
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
      Swal.fire(`Entered email: ${email}`)
    }
  }

  openErrorDialog() {

    Swal.fire({

      text: 'Wrong Email Or Password',

      padding: '1px !important',
      customClass: {
        cancelButton: 'login-cancel-button login-cancel-button1'
      },

      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      backdrop: true,
      showConfirmButton: false,
    });
  }
}
