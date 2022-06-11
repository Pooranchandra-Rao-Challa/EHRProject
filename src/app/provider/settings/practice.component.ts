
import { Component, OnInit, TemplateRef,HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { User } from '../../_models';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import { Accountservice } from '../../_services/account.service';
import { NewUser } from '../../_models/settings';
import { Actions } from 'src/app/_models/smart.scheduler.data';
import { UserDialogComponent } from 'src/app/dialogs/user.dialog/user.dialog.component';
import { OverlayService } from '../../overlay.service';
import { AlertMessage,ERROR_CODES } from './../../_alerts/alertMessage';
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
  displayuser:"none" ;
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

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private settingsService: SettingsService,
    private accountservice: Accountservice,
    private utilityService: UtilityService,
    public overlayService: OverlayService,
    private locationSelectService: LocationSelectService,
    private alertmsg: AlertMessage) {
    this.user = authService.userValue;

    this.changedLocationId = this.user.CurrentLocation;
    this.locationsubscription = this.locationSelectService.getData().subscribe(locationId => {
      this.changedLocationId = locationId;
      this.getProviderDetails();
    });
    this.NewUserData = {
    }
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
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
    this.settingsService.PracticeLocations(this.user.ProviderId).subscribe(resp => {
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
  timeChangeHandler(event: Event) {
    console.log(event);
  }

  invalidInputHandler() {
    // some error handling
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
        // show update message;
        message = resp.Message;
      }
    });

  }
  updateUser(activity) {
    this.NewUserData.ClinicId = this.user.ClinicId;
    this.NewUserData.LocationId = this.user.CurrentLocation;
    if (this.NewUserData.PracticeName == null)
      this.NewUserData.PracticeName = this.user.BusinessName;

    this.settingsService.AddUpdateUser(this.NewUserData).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getProviderDetails();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JP007"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP002"])
      }
    });
  }

  closePopupAddress() {
    //this.displayAddress = "none";
  }
  getUserDataforEdit(u: NewUser) {
    var reqparams = {
      UserId: u.UserId,
      LoginProviderId: this.user.ProviderId,
      ClinicId: this.user.ClinicId
    }

    this.settingsService.UserInfoWithPraceticeLocations(reqparams).subscribe(resp => {
      this.NewUserData = resp.Result as NewUser;
      this.NewUserData.LocationInfo = JSON.parse(resp.Result.LocationInfo);
    });
  }

  userInfoForEdit(data, action: Actions) {
    //console.log(data);
    return data;
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.userDialogComponent && action == Actions.view) {
      dialogData = this.userInfoForEdit(data, action);
    }else if(content === this.locationDialogComponent && action == Actions.view){
      //dialogData = this.editPracticeLocation(data);

      dialogData = data;
      console.log(dialogData);
    }
    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.userDialogComponent) {
        this.userDialogResponse = res.data;
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

}
