import { BehaviorSubject, Observable, fromEvent, } from 'rxjs';
import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ProviderList } from 'src/app/_models/_admin/providerList';
import { NewUser } from 'src/app/_models';
import { SettingsService } from 'src/app/_services/settings.service';


@Component({
  selector: 'user-status-toggle',
  templateUrl: './user.activate.component.html',
  styleUrls: ['./user.activate.component.scss']
})
export class UserStatusToggleComponent implements OnInit {
  provider: ProviderList
  constructor(
    private adminservice: AdminService,
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private settingsService: SettingsService,
    private alertmsg: AlertMessage,) { }


  ngOnInit(): void {
    this.updateLocalModel(this.ref.RequestData);
  }
  updateLocalModel(data: ProviderList) {
    this.provider = {};
    if (data == null) return;
    else this.provider = data;

  }
  toggleService(): Observable<any>{
    if(this.provider.Status) return this.adminservice.DisableMFA(this.provider.UserId);
    else return this.adminservice.EnableMFA(this.provider.UserId);
  }

  toggleUserStatus() {
    let user: NewUser = new NewUser();
    user.UserId = this.provider.UserId;
    user.Active = !this.provider.Status;
    this.updateToggleUserFieldValues("Active", user)
  }

  updateToggleUserFieldValues(fieldToUpdate: string, user: NewUser) {
    var reqparams = {
      fieldToUpdate: fieldToUpdate,
      user: user
    }
    this.settingsService.ToggleUserFieldValues(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        //User, #{@user.provider.full_name} - Has been activated!

        if (resp.IsSuccess) {
          this.alertmsg.displayMessageDailogForAdmin(`User, ${this.provider.ProviderName}  - Has been ${this.provider.Status ? "suspended" : "activated"}!`)
        } else {
          this.alertmsg.displayErrorDailogForAdmin(`Error while ${this.provider.Status ? "suspending" : "activated"} user ${this.provider.ProviderName}.`)
        }
        this.close();
      }
    });
  }

  close(){
    this.ref.close();
  }

  get buttonText():string{
    return !this.provider.Status ? "Activate" : "Suspend";
  }
}
