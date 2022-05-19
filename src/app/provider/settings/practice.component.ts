
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { User, UserLocations } from '../../_models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import Swal from 'sweetalert2';
import { Accountservice } from '../../_services/account.service';
import { PracticeLocation } from '../../_models/practiceLocation';
import { NewUser } from '../../_models/settings';
import { Actions } from 'src/app/_models/smart.scheduler.data';
import { ComponentType } from '@angular/cdk/portal';
import { UserDialogComponent } from 'src/app/dialogs/user.dialog/user.dialog.component';
import { OverlayService } from '../../overlay.service';

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
  LocationAddress: any;
  user: User;
  locationColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];
  providerColumns: string[] = ['Image','FullName', 'Email', 'Role', 'Space', 'Status', 'EmergencyAccess']
  providerLocationColumn: string[] = ['LocationName', 'CityState', 'PracticeSchedule', 'ServicedLocation'];
  locationsInfo: UserLocations[];
  hover: any;
  hover1: any;
  manuallybtn: boolean = true;
  sucessdisplay: boolean;
  errorDisplay: boolean;
  addressVerifymsg: any;
  addressdata: any;
  displayAddress = "none";
  splitAddress: any;
  displayforEditLocation: boolean;
  dispalyOptionStreet: boolean;
  enterbtn: boolean;
  visiblebtn: boolean = true;
  visiblebtn2: boolean = true;
  locationDisplayModel = "none";
  saveUserModel = "none";
  displayuser = "none";
  providerRoles: {}[];
  titles: {}[];
  degrees: {}[];
  specialities: {}[];
  states: {}[];
  address: any;
  userList: any;
  providerList: any;
  locationList: any;
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
    private locationSelectService: LocationSelectService) {
    this.user = authService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.changedLocationId = this.user.CurrentLocation;
    this.locationsubscription = this.locationSelectService.getData().subscribe(locationId => {
      this.changedLocationId = locationId;
      console.log(this.changedLocationId );
      this.getProviderDetails();
    });
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    this.PracticeLocData = {
      ProviderId: "",
      LocationId: "",
      LocationName: "",
      LocationPhone: "",
      Fax: "",
      Street: "",
      Stree2: "",
      City: "",
      State: "",
      Zipcode: "",
      NPI: "",
      RenderNPI: "",
      Tin: "",
      WeekDays: "",
      From: "",
      To: "",
      ActivityStatus: "",
      SunOpenTime: "",
      MonOpenTime: "",
      TueOpenTime: "",
      WedOpenTime: "",
      ThursOpenTime: "",
      FriOpenTime: "",
      SatOpenTime: "",
      SunCloseTime: "",
      MonCloseTime: "",
      TueCloseTime: "",
      WedCloseTime: "",
      ThursCloseTime: "",
      FriCloseTime: "",
      SatCloseTime: "",
      SunDDL: "Specific Hours",
      MonDDL: "Specific Hours",
      TueDDL: "Specific Hours",
      WedDDL: "Specific Hours",
      ThursDDL: "Specific Hours",
      FriDDL: "Specific Hours",
      SatDDL: "Specific Hours",
      locationprimary: ""
    }
    this.NewUserData = {
    }


  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.locationsubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.getTimeZoneList();
    this.practiveLocations();
    this.getProviderDetails();
    this.loadFormDefaults();
  }

  loadFormDefaults() {
    this.utilityService.Titles().subscribe(resp => {
      if (resp.IsSuccess) {
        this.titles = JSON.parse(resp.Result);
      }
    });
    this.utilityService.Degree().subscribe(resp => {
      if (resp.IsSuccess) {
        this.degrees = JSON.parse(resp.Result);
      }
    });
    this.utilityService.Specilaity().subscribe(resp => {
      if (resp.IsSuccess) {
        this.specialities = JSON.parse(resp.Result);
      }
    });
    this.utilityService.States().subscribe(resp => {
      if (resp.IsSuccess) {
        this.states = JSON.parse(resp.Result);
      }
    });
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
  practiveLocations() {
    this.settingsService.PracticeLocations(this.user.ProviderId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.locationdataSource = resp.ListResult;
        this.LocationAddress = resp.ListResult;
        console.log(this.locationdataSource );
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
      }else this.providersDataSource = [];
    });
  }

  toggleAdmin(user: NewUser){
    console.log(JSON.stringify(user))
    this.updateToggleUserFieldValues("Admin",user);
  }
  toggleEmergencyAccess(user: NewUser){
    console.log(JSON.stringify(user))
    this.updateToggleUserFieldValues("EmergencyAccess",user);
  }
  toggleStatus(user: NewUser){
    user.Active = user.Active == null ? true : user.Active.valueOf() == false ? true: false;
    console.log(JSON.stringify(user))
    this.updateToggleUserFieldValues("Active",user);
  }

  updateToggleUserFieldValues(fieldToUpdate:string, user: NewUser){
    var reqparams = {
      fieldToUpdate: fieldToUpdate,
      user: user
    }
    this.settingsService.ToggleUserFieldValues(reqparams).subscribe(resp => {

      let message:string;
      if (resp.IsSuccess) {
        // show update message;
        message = resp.Message;
      }
    });

  }
  // address verification
  AddressVerification() {
    this.manuallybtn = true;
    var practiceAddress = this.PracticeLocData.Street || "";
    if (practiceAddress != null) {
      this.accountservice.VerifyAddress(practiceAddress).subscribe(resp => {
        if (resp.IsSuccess) {
          this.sucessdisplay = false;
          this.addressdata = this.PracticeLocData.Street;
          this.addressVerifymsg = resp.EndUserMessage;
        }
        else {
          this.sucessdisplay = true;
          this.errorDisplay = false;
          this.addressVerifymsg = resp.EndUserMessage;
        }
      });
    }
    else {
      this.accountservice.VerifyAddress(practiceAddress).subscribe(resp => {
        if (resp.IsSuccess) {
          this.addressVerifymsg = resp.EndUserMessage
        }

      });
    }
  }
  updateLocation() {
    //debugger;
    // var name = this.LocationForm.value.LocationName;
    var name = this.PracticeLocData.LocationName;
    this.splitAddress = null;
    var Street = this.PracticeLocData.Street;

    let data = this.PracticeLocData;
    // let locationId = this.PracticeLocData.LocationId;
    let locationId = this.changedLocationId;

    let fromDate = data.SunOpenTime + ',' + data.MonOpenTime + ',' + data.TueOpenTime + ',' + data.WedOpenTime +
      ',' + data.ThursOpenTime + ',' + data.FriOpenTime + ',' + data.SatOpenTime;

    let ToDate = data.SunCloseTime + ',' + data.MonCloseTime + ',' + data.TueCloseTime + ',' + data.WedCloseTime +
      ',' + data.ThursCloseTime + ',' + data.FriCloseTime + ',' + data.SatCloseTime;

    let ActivityStatus = data.SunDDL + ',' + data.MonDDL + ',' + data.TueDDL + ',' + data.WedDDL + ',' + data.ThursDDL +
      ',' + data.FriDDL + ',' + data.SatDDL;

    let Weekday = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday";
    {
      this.SaveupateLocation(this.PracticeLocData);
    }
  }
  SaveupateLocation(reqparams) {
    this.settingsService.AddUpdateLocation(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        Swal.fire({
          position: 'top',
          background: '#e1dddd',
          title: 'Location Save Successfully',
          showConfirmButton: true,
          confirmButtonText: 'Close',
          width: '700',
        });
        this.closePopup();
        this.practiveLocations();
      }

      else {
        Swal.fire({
          icon: 'warning',
          title: resp.EndUserMessage,
          showConfirmButton: false,
          confirmButtonText: 'Ok',
          position: 'top-end',
          width: '700',
        })
      }
    });
  }
  closePopup() {
    this.displayforEditLocation = false;
    this.locationDisplayModel = "none";
    this.manuallybtn = true;
    this.enterbtn = false;
    this.dispalyOptionStreet = false;
    this.visiblebtn = true
  }

  editPracticeLocation(reqparam) {
    this.displayforEditLocation = true;
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
        // this.LocationForm.patchValue(location[0]);
        this.PracticeLocData.LocationName = location[0].name;
        this.PracticeLocData.Fax = location[0].fax;
        this.PracticeLocData.LocationPhone = location[0].phone;
        this.PracticeLocData.NPI = location[0].npi;
        this.PracticeLocData.RenderNPI = location[0].render_npi;
        this.PracticeLocData.Tin = location[0].tin_en;
        // this.PracticeLocData.Street = location[0].street_address;
        this.PracticeLocData.Stree2 = location[0].street_address;
        this.PracticeLocData.City = location[0].city;
        this.PracticeLocData.State = location[0].state;
        this.PracticeLocData.Zipcode = location[0].zip;

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
    if (activity == 'add') {
      this.NewUserData.ClinicId = this.user.ClinicId;
      this.NewUserData.LocationId = this.user.CurrentLocation;
    } else {

    }
    if(this.NewUserData.PracticeName == null)
      this.NewUserData.PracticeName = this.user.BusinessName;

    console.log(JSON.stringify(this.NewUserData))
    this.settingsService.AddUpdateUser(this.NewUserData).subscribe(resp => {
      if (resp.IsSuccess) {
        this.closePopup();
        this.getProviderDetails();
      }
      else {
        Swal.fire({
          customClass: {
            container: 'container-class',
            title: 'title-error',
            confirmButton: 'close-error-button',
          },
          position: 'top',
          //title: msg,
          width: '700',
          confirmButtonText: 'Close',
          background: '#e5e1e1',
          showConfirmButton: true,
        });
      }
    });
  }
  splitAddresses() {
    //debugger;
    var street = this.PracticeLocData.Street;
    if (street != null) {
      this.address = street.split(',');
      this.PracticeLocData.Stree2 = this.address[0];
      this.PracticeLocData.City = this.address[1];
      this.PracticeLocData.State = this.address[2];
      this.PracticeLocData.Zipcode = this.address[3];
      this.closePopupAddress()
    }
    this.visiblebtn = false;
    this.visiblebtn2 = true;
    this.dispalyOptionStreet = false;
    this.manuallybtn = true;
    this.enterbtn = true;
    // this.PracticeLocData.Street = null;
  }
  closePopupAddress() {
    this.displayAddress = "none";
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
        console.log(this.NewUserData)
    });
  }

  userInfoForEdit(data, action: Actions){

  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {

    //this.flag = false;
    //this.patientNameOrCellNumber = "";
    let dialogData: any;
    if (content === this.userDialogComponent && action == Actions.new){
      dialogData = this.userInfoForEdit(data,action);
    }

    const ref = this.overlayService.open(content,dialogData );

    ref.afterClosed$.subscribe(res => {
      if (content === this.userDialogComponent) {
        this.userDialogResponse = res.data;
      }

    });


  }
}
