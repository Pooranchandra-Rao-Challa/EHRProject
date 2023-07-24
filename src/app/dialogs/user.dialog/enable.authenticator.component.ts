import { BehaviorSubject } from 'rxjs';
import { SettingsService } from 'src/app/_services/settings.service';

import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
// import { QRCode,toDataURL, toCanvas,toBuffer } from 'qrcode';
// import { QRCodeErrorCorrectionLevel } from "qrcode"
// import { QRCodeElementType } from "angularx-qrcode"
import { SafeUrl } from '@angular/platform-browser';
import { QrCodeProps, TwofactorAuthParams } from 'src/app/_models';

@Component({
  selector: 'enable-authenticator-dialog',
  templateUrl: './enable.authenticator.component.html',
  styleUrls: ['./enable.authenticator.component.scss']
})
export class EnableAuthenticatorComponent {
  qrCodeProps: QrCodeProps = {DataUrl:"Loading Text"};
  qrCodeUrl:BehaviorSubject<string> = new BehaviorSubject<string>("");
  qrCodeDownloadLink:any;
  verficationCode: number;
  Result: TwofactorAuthParams = {};
  constructor(private dialogRef: EHROverlayRef,
    private authService: AuthenticationService,
    private settingsService: SettingsService,
    private fb: FormBuilder) {
      authService.Get2FAQrCode('provider',authService.userValue.UserId,authService.userValue.ProviderId).subscribe(resp =>
      {
        if(resp.IsSuccess)
        {
          this.qrCodeProps = resp.Result as QrCodeProps;
          this.qrCodeUrl.next(this.qrCodeProps.DataUrl);
          this.qrCodeProps.SecretKey = (this.qrCodeProps.SecretKey.match(/[\s\S]{6}/g) || []).join(' ');
        }
      })
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  verifyToken(){
    this.authService.ValidateTotp(this.verficationCode,this.authService.userValue.UserId).subscribe(resp=>{
      this.Result = resp.Result as TwofactorAuthParams;
      if(resp.IsSuccess && this.Result.Verified){
        this.close();
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
