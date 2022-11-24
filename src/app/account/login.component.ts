
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import Swal from 'sweetalert2';
import { Accountservice } from '../_services/account.service';
import { PlatformLocation } from '@angular/common';

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
  userIP:string;
  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private plaformLocation: PlatformLocation,
    private accountservice: Accountservice,) {
      this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
      if (plaformLocation.href.indexOf('?') > -1)
        this.url = plaformLocation.href.substring(0, plaformLocation.href.indexOf('?')).replace(plaformLocation.pathname, '/');
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
      "UserIP":this.userIP
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
  public hidePassword(){
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
      this.accountservice.RaisePasswordChangeRequest({Email:email,URL:this.url}).subscribe((resp)=>{
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
      this.accountservice.ResendValidationMail({Email:email,URL:this.url}).subscribe((resp)=>{
        this.openErrorDialog(resp.EndUserMessage);
      })
    }
  }

  openErrorDialog( message:string) {
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

  private UserIP(){
    this.authenticationService.UserIp().subscribe((resp:any)=>{this.userIP = resp.ip})
  }
}
