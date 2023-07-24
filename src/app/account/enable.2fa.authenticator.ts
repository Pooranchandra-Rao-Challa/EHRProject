import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { QrCodeProps, TwofactorAuthParams } from 'src/app/_models';
import { PlatformLocation } from '@angular/common';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';

@Component({
  selector: 'enable-2fa-authenticator',
  templateUrl: './enable.2fa.authenticator.html',
  styleUrls: ['./enable.2fa.authenticator.scss']
})
export class Enablge2FAAuthenticatorComponent {
  qrCodeProps: QrCodeProps = {DataUrl:"Loading Text"};
  qrCodeUrl:BehaviorSubject<string> = new BehaviorSubject<string>("");
  qrCodeDownloadLink:any;
  verficationCode: number;
  Result: TwofactorAuthParams ={};
  constructor(private dialogRef: MatDialogRef<Enablge2FAAuthenticatorComponent>,
    @Inject(MAT_DIALOG_DATA) reqdata,
    private authService: AuthenticationService,
    private plaformLocation: PlatformLocation,
    private router: Router,
    private fb: FormBuilder) {

      console.log(this.qrCodeProps);
      let userType = '';
      let id = '';
      if(authService.isAdmin) {
        userType = 'admin'
        id = authService.userValue.AdminId;
      }
      else if(authService.isPatient) {
        userType = 'patient'
        id = authService.userValue.PatientId;
      }
      else if(authService.isProvider) {
        userType = 'provider'
        id = authService.userValue.ProviderId;
      }
      authService.Get2FAQrCode(userType,authService.userValue.UserId,id).subscribe(resp =>
      {
        console.log(resp);
        if(resp.IsSuccess)
        {
          this.qrCodeProps = resp.Result as QrCodeProps;
          this.qrCodeUrl.next(this.qrCodeProps.DataUrl);
          console.log(this.qrCodeProps.SecretKey.match(/[\s\S]{6}/g) || []);

          this.qrCodeProps.SecretKey = (this.qrCodeProps.SecretKey.match(/[\s\S]{6}/g) || []).join(' ');
        }
      })
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  verifyToken(){
    console.log(this.verficationCode);

    this.authService.ValidateTotp(this.verficationCode,this.authService.userValue.UserId).subscribe(resp=>{
      console.log(resp);
      this.Result = resp.Result as TwofactorAuthParams;
      if(resp.IsSuccess && this.Result.Verified){
        this.authService.startRefreshTokenTimer();
        if(this.authService.isProvider){
          let url = `${this.plaformLocation.protocol}//${this.plaformLocation.hostname}:${this.plaformLocation.port}${environment.VirtualHost}/provider/smartschedule?name=${encodeURIComponent('Smart Schedule')}&key=${(new Date()).getTime()}`;
          window.location.replace(url);
          this.close();
        }else if(this.authService.isAdmin){
          this.router.navigate(
            ['admin/dashboard'],
            { queryParams: { name: 'Providers', key: (new Date()).getTime() } }
          )
          this.close();
        }
      }
    })
  }
  close() {
    this.dialogRef.close();
  }

  get loginAttemptsMessage():string
  {
    if( this.Result.LoginAttempts>0 )
      return `No of login attempts: ${this.Result.LoginAttempts}`;
  }
}
