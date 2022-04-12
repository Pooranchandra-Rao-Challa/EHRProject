import { getLocaleDateTimeFormat } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';

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
    debugger;
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
      debugger;
      if (!resp.IsSuccess) {
        this.showspinner = false;
        this.message = '';
        if (resp.ShowExceptionMessage)
          this.authfailedmessage = resp.EndUserMessage;
        else
          this.authfailedmessage = "Enter valid Email Id and Password";
        console.log(resp.EndUserMessage);
      }
    });

  }


}
