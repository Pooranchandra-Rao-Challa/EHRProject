import { BehaviorSubject, Observable, fromEvent, } from 'rxjs';
import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Admins } from 'src/app/_models/_admin/admins';


@Component({
  selector: 'twofa-toggle',
  templateUrl: './twofa.toggle.component.html',
  styleUrls: ['./twofa.toggle.component.scss']
})
export class TwoFAToggleComponent implements OnInit {
  admin: Admins
  constructor(
    private adminservice: AdminService,
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,) { }


  ngOnInit(): void {
    this.updateLocalModel(this.ref.RequestData);
  }
  updateLocalModel(data: Admins) {
    this.admin = {};
    if (data == null) return;
    else this.admin = data;
  }
  toggleService(): Observable<any>{
    if(this.admin.EnableTwofactor) return this.adminservice.DisableMFA(this.admin.UserId);
    else return this.adminservice.EnableMFA(this.admin.UserId);
  }
  resetMFA() {
    this.toggleService().subscribe(resp => {
      this.close();
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailogForAdmin(`Successfully ${this.admin.EnableTwofactor ? "Disabled" : "Enabled"} for ${this.admin.FirstName} ${this.admin.LastName}.`)
      } else {
        this.alertmsg.displayErrorDailogForAdmin(`Error while ${this.admin.EnableTwofactor ? "disabling" : "enabling"} MFA for ${this.admin.FirstName} ${this.admin.LastName}.`)
      }
    })
  }
  close(){
    this.ref.close();
  }

  get buttonText():string{
    return this.admin.EnableTwofactor ? "Disable Duo" : "Enable Duo";
  }
}
