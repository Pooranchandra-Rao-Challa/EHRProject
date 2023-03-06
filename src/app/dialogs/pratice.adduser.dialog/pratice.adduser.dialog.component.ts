import { DOCUMENT, PlatformLocation } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import {   User } from '../../_models';
import {NewUser} from 'src/app/_models/';
import { LocationSelectService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-pratice.adduser.dialog',
  templateUrl: './pratice.adduser.dialog.component.html',
  styleUrls: ['./pratice.adduser.dialog.component.scss']
})
export class PraticeAdduserDialogComponent implements OnInit {
  providerRoles: {}[];
  NewUserData?: NewUser ={};
  user:User;
  url: string;
  hideSaveButton : boolean = false;
  constructor(  private authService: AuthenticationService,
    private settingsService: SettingsService,
    private utilityService: UtilityService,
    public overlayService: OverlayService,
    private locationSelectService: LocationSelectService,
    private plaformLocation: PlatformLocation,
    private alertmsg: AlertMessage, private ref: EHROverlayRef,
    @Inject(DOCUMENT) private _document: Document) {
      this.user = authService.userValue
      this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');

     }

  ngOnInit(): void {
    this.loadFormDefaults();
  }
  loadFormDefaults() {
    this.utilityService.ProviderRoles().subscribe(resp => {
      if (resp.IsSuccess) {
        this.providerRoles = JSON.parse(resp.Result);
      }
    });
  }
  updateUser() {
    this.hideSaveButton = true;
    this.NewUserData.ClinicId = this.user.ClinicId;
    this.NewUserData.LocationId = this.user.CurrentLocation;
    if (this.NewUserData.PracticeName == null)
      this.NewUserData.PracticeName = this.user.BusinessName;
    this.NewUserData.URL = this.url;

    this.settingsService.AddUpdateUser(this.NewUserData).subscribe(resp => {
      this.hideSaveButton = false;
      if (resp.IsSuccess) {
        // this.getProviderDetails();
        this.NewUserData = new NewUser;
        this.alertmsg.userCreateConfirm(resp.Result["Code"], resp.Result["ProviderName"]);
        this.cancel();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP007"])
      }
    });
  }
  cancel() {
    this.ref.close(null);
  }
  emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;
  EnableSave() {
    var emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return !(this.NewUserData.FirstName != null && this.NewUserData.FirstName != "" && this.NewUserData.LastName != null && this.NewUserData.LastName != ""
      && this.NewUserData.Email != null && this.NewUserData.Email != ""
      && this.emailPattern.test(this.NewUserData.Email)
      && this.NewUserData.PracticeRole != null && this.NewUserData.PracticeRole != "");
  }

}
