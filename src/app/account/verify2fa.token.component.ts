
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TwofactorAuthParams } from 'src/app/_models';
import { PlatformLocation } from '@angular/common';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';

@Component({
  selector: 'verify-2fa-authenticator',
  templateUrl: './verify2fa.token.component.html',
  styleUrls: ['./verify2fa.token.component.scss']
})
export class Verify2FATokenComponent {
  verficationCode: number;
  Result: TwofactorAuthParams = {};
  @ViewChild('VerificationCode',{static:true})  VerificationCode: ElementRef

  constructor(private dialogRef: MatDialogRef<Verify2FATokenComponent>,
    @Inject(MAT_DIALOG_DATA) reqdata,
    private authService: AuthenticationService,
    private plaformLocation: PlatformLocation,
    private router: Router,
    private fb: FormBuilder) {

  }


  verifyToken() {
    this.authService.ValidateTotp(this.verficationCode, this.authService.userValue.UserId).subscribe(resp => {
      this.Result = resp.Result as TwofactorAuthParams;
      if (resp.IsSuccess && this.Result.Verified) {
        this.authService.startRefreshTokenTimer();
        if (this.authService.isProvider) {
          let url = `${this.plaformLocation.protocol}//${this.plaformLocation.hostname}:${this.plaformLocation.port}${environment.VirtualHost}/provider/smartschedule?name=${encodeURIComponent('Smart Schedule')}&key=${(new Date()).getTime()}`;
          window.location.replace(url);
          this.close();
        } else if (this.authService.isAdmin) {
          this.router.navigate(
            ['admin/dashboard'],
            { queryParams: { name: 'Providers', key: (new Date()).getTime() } }
          )
          this.close();
        }
      }else {
        this.VerificationCode.nativeElement.value = '';
        this.VerificationCode.nativeElement.focus();
      }
    })
  }
  close() {
    this.dialogRef.close();
  }

  get loginAttemptsMessage(): string {
    if (this.Result.LoginAttempts > 0)
      return `No of login attempts: ${this.Result.LoginAttempts}`;
  }

  checkLength2(e, input, max, min) {
    const functionalKeys = ['Backspace', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'Tab', 'Delete','Enter'];
    console.log(e.key);

    if(e.key == 'Enter') this.verifyToken();

    if (functionalKeys.indexOf(e.key) !== -1) {
      return;
    }



    const keyValue = +e.key;
    if (isNaN(keyValue)) {
      e.preventDefault();
      return;
    }

    const hasSelection = input.selectionStart !== input.selectionEnd && input.selectionStart !== null;
    let newValue;
    if (hasSelection) {
      newValue = this.replaceSelection(input, e.key, min)
    } else {
      newValue = input.value + keyValue.toString();
    }
    if (+newValue > max || newValue.length > 6) {
      e.preventDefault();
    }
  }

  private replaceSelection(input, key, min) {
    const inputValue = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd || input.selectionStart;
    return inputValue.substring(0, start) + key + inputValue.substring(end + 1);
  }

}
