
import { Component, OnInit, TemplateRef, HostListener, ElementRef, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { LocationDialog, User } from '../../_models';
import { LocationSelectService } from '../../_navigations/provider.layout/view.notification.service';
import { Accountservice } from '../../_services/account.service';
import { Actions, NewUser } from 'src/app/_models/';
import { UserDialogComponent } from 'src/app/dialogs/user.dialog/user.dialog.component';
import { OverlayService } from '../../overlay.service';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { LocationDialogComponent } from 'src/app/dialogs/location.dialog/location.dialog.component';


@Component({
  selector: 'practice-settings',
  templateUrl: './practice.component.html',
  styleUrls: ['./settings.component.scss']
})
export class PracticeComponent implements OnInit {
  TimeZoneForm: FormGroup;
  TimeZoneList: any;
  UTCTime: any;
  CurrentTime: any;
  locationdataSource: any;
  providersDataSource: NewUser[];
  ProviderId: any;
  locationColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];
  providerColumns: string[] = ['Image', 'FullName', 'Email', 'Role', 'Space', 'Status', 'EmergencyAccess']
  providerLocationColumn: string[] = ['LocationName', 'CityState', 'PracticeSchedule', 'ServicedLocation'];
  displayuser: "none";
  providerRoles: {}[];
  locationsubscription: Subscription;
  changedLocationId: string;
  NewUserData: NewUser;
  private updateSubscription: Subscription;
  userDialogComponent = UserDialogComponent;
  locationDialogComponent = LocationDialogComponent;
  userDialogResponse = null;
  ActionsType = Actions;
  user: User;
  url: string;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private settingsService: SettingsService,
    private accountservice: Accountservice,
    private utilityService: UtilityService,
    public overlayService: OverlayService,
    private locationSelectService: LocationSelectService,
    private plaformLocation: PlatformLocation,
    private alertmsg: AlertMessage,
    @Inject(DOCUMENT) private _document: Document) {
    this.user = authService.userValue;
    this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');

    this.changedLocationId = this.user.CurrentLocation;
    this.locationsubscription = this.locationSelectService.getData().subscribe(LocationId => {
      this.changedLocationId = LocationId;
      this.getProviderDetails();
    });
    this.NewUserData = {
    }
  }

  ngOnDestroy() {
    this.locationsubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.getTimeZoneList();
    this.practiceLocations();
    this.getProviderDetails();
    this.loadFormDefaults();
  }

  loadFormDefaults() {
    this.utilityService.ProviderRoles().subscribe(resp => {
      if (resp.IsSuccess) {
        this.providerRoles = JSON.parse(resp.Result);
      }
    });
  }
  // dropdown for TimeZone
  getTimeZoneList() {
    this.settingsService.TimeZones().subscribe(resp => {
      if (resp.IsSuccess) {
        this.TimeZoneList = resp.ListResult;
        this.DisplayDateTimeZone();
      }
    });
  }
  // DatetimeZone data
  DisplayDateTimeZone() {
    this.settingsService.DisplayDateTimeOfZone(this.user.TimeZone).subscribe(resp => {
      if (resp.IsSuccess) {
        var zoneDateTimeWithUTC = JSON.parse(resp.Result);
        this.UTCTime = zoneDateTimeWithUTC.UTC;
        this.CurrentTime = zoneDateTimeWithUTC.ZoneDateTime;
      }
    });
  }
  // get display Location Details
  practiceLocations() {
    this.settingsService.PracticeLocations(this.user.ProviderId, this.user.ClinicId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.locationdataSource = resp.ListResult;
      }
    });
  }
  // get display User Details
  getProviderDetails() {
    var reqparams = {
      provider_Id: this.user.ProviderId,
      location_Id: this.changedLocationId
    }
    this.settingsService.ProviderDetails(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.providersDataSource = resp.ListResult as NewUser[];
      } else this.providersDataSource = [];
    });
  }
  toggleAdmin(user: NewUser) {
    this.updateToggleUserFieldValues("Admin", user);
  }
  toggleEmergencyAccess(user: NewUser) {
    this.updateToggleUserFieldValues("EmergencyAccess", user);
  }
  toggleStatus(user: NewUser) {
    user.Active = user.Active == null ? true : user.Active.valueOf() == false ? true : false;
    this.updateToggleUserFieldValues("Active", user);
  }

  updateToggleUserFieldValues(fieldToUpdate: string, user: NewUser) {
    var reqparams = {
      fieldToUpdate: fieldToUpdate,
      user: user
    }
    this.settingsService.ToggleUserFieldValues(reqparams).subscribe(resp => {
      let message: string;
      if (resp.IsSuccess) {
        message = resp.Message;
      }
    });

  }
  updateUser() {
    this.NewUserData.ClinicId = this.user.ClinicId;
    this.NewUserData.LocationId = this.user.CurrentLocation;
    if (this.NewUserData.PracticeName == null)
      this.NewUserData.PracticeName = this.user.BusinessName;
    this.NewUserData.URL = this.url;

    this.settingsService.AddUpdateUser(this.NewUserData).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getProviderDetails();
        this.NewUserData = new NewUser;
        this.alertmsg.userCreateConfirm(resp.Result["Code"], resp.Result["ProviderName"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP007"])
      }
    });
  }

  getUserDataforEdit(u: NewUser) {
    var reqparams = {
      UserId: u.UserId,
      LoginProviderId: this.user.ProviderId,
      ClinicId: this.user.ClinicId
    }

    this.settingsService.UserInfoWithPracticeLocations(reqparams).subscribe(resp => {
      this.NewUserData = resp.Result as NewUser;
      this.NewUserData.LocationInfo = JSON.parse(resp.Result.LocationInfo);
    });
  }

  userInfoForEdit(data, action: Actions) {
    return data;
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.userDialogComponent && action == Actions.view) {
      dialogData = this.userInfoForEdit(data, action);
    } else if (content === this.locationDialogComponent) {
      let locdig: LocationDialog = {};
      if (action == Actions.view) {
        locdig.ProviderId = this.user.ProviderId;
        locdig.LocationInfo = data;
      }
      else {
        locdig.ProviderId = this.user.ProviderId;
      }
      dialogData = locdig;
    }

    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.userDialogComponent) {
        if (res.data != null && res.data.saved) {
          this.getProviderDetails();
        }
      } else if (content === this.locationDialogComponent) {
        if (res.data != null && (res.data.saved || res.data.deleted)) {
          this.practiceLocations();
        }
      }
    });
  }


  updateTimeZone() {
    this.settingsService.UpdateTimeZone(this.user).subscribe(resp => {
      if (resp.IsSuccess) {
        this.DisplayDateTimeZone();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JP008"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP003"]);
      }
    });
  }

  timeZoneChanged(value) {
    //this.DisplayDateTimeZone();
  }
  OpenMessageDiloag() {
    this.alertmsg.userCreateConfirm('Code', "Provider Name")
  }
  /*  ^[A-Za-z0-9._%-]+@[A-Za-z0-9._-]+\\.[a-z]{2,3}$*/
  emailPattern = "^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$";
  EnableSave() {
    var emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return !(this.NewUserData.FirstName != null && this.NewUserData.FirstName != ""
      && this.NewUserData.Email != null && this.NewUserData.Email != ""
      && emailReg.test(this.NewUserData.Email)
      && this.NewUserData.PracticeRole != null && this.NewUserData.PracticeRole != "");
  }

  Close() {
    this.NewUserData = new NewUser()
  }
}
