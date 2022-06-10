
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { User, UserLocations } from '../../_models';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import { Accountservice } from '../../_services/account.service';
import { PracticeLocation } from '../../_models/_provider/practiceLocation';
import { NewUser } from '../../_models/_provider/_settings/settings';
import { Actions } from 'src/app/_models/smart.scheduler.data';
import { UserDialogComponent } from 'src/app/dialogs/user.dialog/user.dialog.component';
import { OverlayService } from '../../overlay.service';
import { AlertMessage,ERROR_CODES } from './../../_alerts/alertMessage';

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
  user: User;
  locationColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];
  providerColumns: string[] = ['Image', 'FullName', 'Email', 'Role', 'Space', 'Status', 'EmergencyAccess']
  providerLocationColumn: string[] = ['LocationName', 'CityState', 'PracticeSchedule', 'ServicedLocation'];
  //locationsInfo: UserLocations[];
  hover: any;
  hover1: any;
  manuallybtn: boolean = false;
  //sucessdisplay: boolean;
  //addressVerifymsg: any;
  addressdata: any;
  displayAddress = "none";
  displayuser:"none" ;
  splitAddress: any;
  displayforEditLocation: boolean;
  disableaddressverification: boolean = false;
  addressVerfied: boolean = false;
  locationDisplayModel = "none";
  providerRoles: {}[];
  TemptableData: any = [];
  providerLocationDataSource: any;
  locationsubscription: Subscription;
  PracticeLocData: PracticeLocation;
  PhonePattern: any;
  changedLocationId: string;
  NewUserData: NewUser;
  private updateSubscription: Subscription;
  userDialogComponent = UserDialogComponent;
  userDialogResponse = null;
  ActionsType = Actions;


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
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    this.PracticeLocData = new PracticeLocation
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
  // address verification
  AddressVerification() {
    this.accountservice.VerifyAddress(this.PracticeLocData.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        console.log(resp.Result);
        this.PracticeLocData.City = resp.Result.components.city_name
        this.PracticeLocData.State = resp.Result.components.state_abbreviation
        this.PracticeLocData.StreetAddress = resp.Result.delivery_line_1
        this.PracticeLocData.Zipcode = resp.Result.components.zipcode
        this.PracticeLocData.Street = "";
        this.addressVerfied = true;
      }
      else {
        this.manuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP001"])
      }
    });
  }
  enableManualEntry() {
    this.manuallybtn = true;
  }
  updateLocation() {
    this.splitAddress = null;
    this.PracticeLocData.Street = this.PracticeLocData.StreetAddress;

    let data = this.PracticeLocData;

    this.PracticeLocData.ProviderId = this.user.ProviderId;

    this.PracticeLocData.From = data.SunOpenTime + ',' + data.MonOpenTime + ',' + data.TueOpenTime + ',' + data.WedOpenTime +
      ',' + data.ThursOpenTime + ',' + data.FriOpenTime + ',' + data.SatOpenTime;

    this.PracticeLocData.To = data.SunCloseTime + ',' + data.MonCloseTime + ',' + data.TueCloseTime + ',' + data.WedCloseTime +
      ',' + data.ThursCloseTime + ',' + data.FriCloseTime + ',' + data.SatCloseTime;

    this.PracticeLocData.SpecificHours = data.SunDDL + ',' + data.MonDDL + ',' + data.TueDDL + ',' + data.WedDDL + ',' + data.ThursDDL +
      ',' + data.FriDDL + ',' + data.SatDDL;

    this.PracticeLocData.WeekDays = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday";

    this.SaveupateLocation();
  }
  SaveupateLocation() {
    let isAdd = this.PracticeLocData.LocationId == null;
    this.settingsService.AddUpdateLocation(this.PracticeLocData).subscribe(resp => {
      if (resp.IsSuccess) {
        this.addressVerfied = false;
        this.manuallybtn = false;
        this.PracticeLocData = new PracticeLocation;
        this.practiceLocations();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2JP002" : "M2JP001"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2JP004"]);
      }
    });
  }
  closePopup() {
    this.displayforEditLocation = false;
    this.locationDisplayModel = "none";
  }

  editPracticeLocation(reqparam) {
    this.displayforEditLocation = true;
    //Location_Name,Location_Street_Address,Location_Phone,providers,Location_Id
    this.settingsService.EditProviderLocation(reqparam.Location_Id).subscribe(resp => {
      if (resp.IsSuccess) {
        let location = resp.ListResult[0];
        let weekdata = resp.ListResult[1];
        let sunday = weekdata[0];
        let monday = weekdata[1];
        let tuesday = weekdata[2];
        let wednesday = weekdata[3];
        let thursday = weekdata[4];
        let friday = weekdata[5];
        let saturday = weekdata[6];
        console.log(location[0]);

        this.PracticeLocData.LocationId = location[0]._id;
        this.PracticeLocData.ProviderId = this.user.ProviderId;
        this.PracticeLocData.LocationName = location[0].name;
        this.PracticeLocData.Fax = location[0].fax;
        this.PracticeLocData.LocationPhone = location[0].phone;
        this.PracticeLocData.NPI = location[0].npi;
        this.PracticeLocData.RenderNPI = location[0].render_npi;
        this.PracticeLocData.Tin = location[0].tin_en;
        // this.PracticeLocData.Street = location[0].street_address;
        this.PracticeLocData.StreetAddress = location[0].street_address;
        this.PracticeLocData.City = location[0].city;
        this.PracticeLocData.State = location[0].state;
        this.PracticeLocData.Zipcode = location[0].zip;
        this.PracticeLocData.locationprimary = location[0].location_primary;

        this.PracticeLocData.SunOpenTime = sunday.from;
        this.PracticeLocData.SunCloseTime = sunday.to;
        this.PracticeLocData.SunDDL = sunday.specific_hour;
        this.PracticeLocData.MonOpenTime = monday.from;
        this.PracticeLocData.MonCloseTime = monday.to;
        this.PracticeLocData.MonDDL = monday.specific_hour;
        this.PracticeLocData.TueOpenTime = tuesday.from;
        this.PracticeLocData.TueCloseTime = tuesday.to;
        this.PracticeLocData.TueDDL = tuesday.specific_hour;

        this.PracticeLocData.WedOpenTime = wednesday.from;
        this.PracticeLocData.WedCloseTime = wednesday.to;
        this.PracticeLocData.WedDDL = wednesday.specific_hour;

        this.PracticeLocData.ThursOpenTime = thursday.from;
        this.PracticeLocData.ThursCloseTime = thursday.to;
        this.PracticeLocData.ThursDDL = thursday.specific_hour;

        this.PracticeLocData.FriOpenTime = friday.from;
        this.PracticeLocData.FriCloseTime = friday.to;
        this.PracticeLocData.FriDDL = friday.specific_hour;

        this.PracticeLocData.SatOpenTime = saturday.from;
        this.PracticeLocData.SatCloseTime = saturday.to;
        this.PracticeLocData.SatDDL = saturday.specific_hour;


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
  splitAddresses() {
    var street = this.PracticeLocData.Street;
    if (street != null) {
      let address = street.split(',');
      if (address.length == 4) {
        this.PracticeLocData.StreetAddress = address[0];
        this.PracticeLocData.City = address[1];
        this.PracticeLocData.State = address[2];
        this.PracticeLocData.Zipcode = address[3];
      }
    }
  }
  enterAddressManually() {
    this.disableaddressverification = true;
    this.PracticeLocData.Street = "";
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

  clearPracticeLocation() {
    this.PracticeLocData = new PracticeLocation
  }

  deleteLocation(){
    this.settingsService.DeleteLocation({LocationId: this.PracticeLocData.LocationId}).subscribe(resp => {
      if (resp.IsSuccess) {
        this.practiceLocations();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JP003"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP005"]);
      }
    });
  }


}
