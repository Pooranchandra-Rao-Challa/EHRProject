import { BehaviorSubject, fromEvent, } from 'rxjs';
import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ProviderList } from 'src/app/_models/_admin/providerList';


@Component({
  selector: 'reset-2fa',
  templateUrl: './reset.2fa.component.html',
  styleUrls: ['./reset.2fa.component.scss']
})
export class Reset2FAComponent implements OnInit {
  provider: ProviderList
  constructor(
    private adminservice: AdminService,
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,) { }


  ngOnInit(): void {
    this.updateLocalModel(this.ref.RequestData);
  }
  updateLocalModel(data: ProviderList) {
    this.provider = {};
    if (data == null) return;
    else this.provider = data;
  }
  resetMFA() {
    this.adminservice.ResetMFA(this.provider.UserId).subscribe(resp => {
      this.close();
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailogForAdmin(`Successfully Disabled MFA for ${this.provider.ProviderName}.`)
      } else {
        this.alertmsg.displayErrorDailogForAdmin(`Error while disabling MFA for ${this.provider.ProviderName}.`)
      }
    })
  }
  close(){
    this.ref.close();
  }
}
