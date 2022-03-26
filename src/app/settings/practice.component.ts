
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { SettingsService } from '../_services/settings.service';
import { UtilityService } from '../_services/utiltiy.service';
import { User, UserLocations } from '../_models';
import { UUID } from 'angular2-uuid';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationSelectService } from '../_navigations/provider.layout/location.service';
import Swal from 'sweetalert2';
import { Accountservice } from '../_services/account.service';
declare var $: any;


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
  providerDataSource: any;
  ProviderId: any;
  LocationAddress: any;
  user: User;
  locationColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];
  providerColumns: string[] = ['FullName', 'Email', 'Role', 'Space', 'Status', 'EmergencyAccess']
  providerLocationColumn: string[] = ['LocationName', 'CityState', 'PracticeSchedule', 'ServicedLocation'];
  locationsInfo: UserLocations[];
  LocationForm: FormGroup;
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
  AddUserFrom: FormGroup;
  saveUserModel = "none";
  displayuser = "none";
  providerRoles: {}[];
  UserInformation: FormGroup;
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
  ChangePasswords: FormGroup;


  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private settingsService: SettingsService,
    private accountservice: Accountservice,
    private utilityService: UtilityService) {
    this.user = authService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
  }
  ngOnInit(): void {
    this.buildTimeZoneForm();
    this.getTimeZoneList();
    this.getLocationsList();
    this.getProviderDetails();
    this.buildLocationForm();
    this.loadFormDefaults();
    this.buildUserForm();
    this.buildChangePwdForm();
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
  buildTimeZoneForm() {
    this.TimeZoneForm = this.fb.group({
      TimeZones: ['']
    });
  }
  buildAddUserForm() {
    this.AddUserFrom = this.fb.group({
      FirstName: [],
      LastName: [],
      Email: [],
      Role: [],
      Status: []
    });
  }
  // dropdown for TimeZone
  getTimeZoneList() {
    this.settingsService.TimeZones().subscribe(resp => {
      if (resp.IsSuccess) {
        this.TimeZoneList = resp.ListResult;
        this.TimeZoneForm.get("TimeZones").setValue(this.user.TimeZone);
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
  getLocationsList() {
    this.ProviderId = this.user.ProviderId;
    this.settingsService.LocationList(this.ProviderId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.locationdataSource = resp.ListResult;
        this.LocationAddress = resp.ListResult;
      }
    });
  }
  // get display User Details
  getProviderDetails() {
    debugger;
    var reqparams = {
      provider_Id: this.user.ProviderId,
      location_Id: this.locationsInfo[0].locationId  //location id of login user
    }
    this.settingsService.ProviderDetails(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.providerDataSource = resp.ListResult;
      }
    });
  }
  buildLocationForm() {
    this.LocationForm = this.fb.group({
      ProviderId: [],
      LocationId: [],
      LocationName: [],
      LocationPhone: [''],
      Fax: [],
      Street: [],
      Stree2: [],
      City: [],
      State: [],
      Zipcode: [],
      NPI: [],
      RenderNPI: [],
      Tin: [],
      WeekDays: [],
      From: [],
      To: [],
      ActivityStatus: [],
      SunOpenTime: ['09:00 AM'],
      MonOpenTime: ['09:00 AM'],
      TueOpenTime: ['09:00 AM'],
      WedOpenTime: ['09:00 AM'],
      ThursOpenTime: ['09:00 AM'],
      FriOpenTime: ['09:00 AM'],
      SatOpenTime: ['09:00 AM'],
      SunCloseTime: ['10:00 PM'],
      MonCloseTime: ['10:00 PM'],
      TueCloseTime: ['10:00 PM'],
      WedCloseTime: ['10:00 PM'],
      ThursCloseTime: ['10:00 PM'],
      FriCloseTime: ['10:00 PM'],
      SatCloseTime: ['10:00 PM'],
      SunDDL: ['Specific Hours'],
      MonDDL: ['Specific Hours'],
      TueDDL: ['Specific Hours'],
      WedDDL: ['Specific Hours'],
      ThursDDL: ['Specific Hours'],
      FriDDL: ['Specific Hours'],
      SatDDL: ['Specific Hours'],
      locationprimary: []
    });
  }
  // address verification
  AddressVerification() {
    debugger;
    this.manuallybtn = true;
    this.LocationForm.value;
    var practiceAddress = this.LocationForm.value.Street || "";
    if (practiceAddress != null) {
      this.accountservice.VerifyAddress(practiceAddress).subscribe(resp => {
        if (resp.IsSuccess) {
          this.sucessdisplay = false;
          this.openPopupAddress();
          this.addressdata = this.LocationForm.value.Street;
          this.addressVerifymsg = resp.EndUserMessage;
        }
        else {
          this.sucessdisplay = true;
          this.errorDisplay = false;
          this.openPopupAddress();
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
  openPopupAddress() {
    this.displayAddress = "block";
  }
  AddLocation() {
    debugger;
    var name = this.LocationForm.value.LocationName;
    this.splitAddress = null;
    var Street = this.LocationForm.value.Street;

    let data = this.LocationForm.value;
    let locationId = this.LocationForm.value.LocationId;

    let fromDate = data.SunOpenTime + ',' + data.MonOpenTime + ',' + data.TueOpenTime + ',' + data.WedOpenTime +
      ',' + data.ThursOpenTime + ',' + data.FriOpenTime + ',' + data.SatOpenTime;

    let ToDate = data.SunCloseTime + ',' + data.MonCloseTime + ',' + data.TueCloseTime + ',' + data.WedCloseTime +
      ',' + data.ThursCloseTime + ',' + data.FriCloseTime + ',' + data.SatCloseTime;

    let ActivityStatus = data.SunDDL + ',' + data.MonDDL + ',' + data.TueDDL + ',' + data.WedDDL + ',' + data.ThursDDL +
      ',' + data.FriDDL + ',' + data.SatDDL;

    let Weekday = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday";
    {
      if (name == null) {

        Swal.fire({
          icon: 'warning',
          title: 'Location Name is Required',
          showConfirmButton: false,
          confirmButtonText: 'Ok',
          width: '700',
          position: 'top-end',
          timer: 1500
        });
      }
      else {
        if (Street != null) {
          this.splitAddress = Street.split(',');

          if (locationId != null) {
            let locationdata = {
              "ProviderId": this.user.ProviderId,
              "LocationId": locationId,
              "LocationName": data.LocationName,
              "LocationPhone": data.LocationPhone,
              "Fax": data.Fax,
              "StreetAddress": this.splitAddress[0],
              "City": this.splitAddress[1],
              "State": this.splitAddress[2],
              "Zip": this.splitAddress[3],
              "NPI": data.NPI,
              "RenderNPI": data.RenderNPI,
              "Tin": data.Tin,
              "WeekDays": Weekday,
              "From": fromDate,
              "To": ToDate,
              "SpecificHour": ActivityStatus,
              "locationprimary": data.locationprimary
            }
            this.SaveupateLocation(locationdata);
          }
          else {
            let locationdata = {
              "ProviderId": this.user.ProviderId,
              "LocationId": UUID.UUID(),
              "LocationName": data.LocationName,
              "LocationPhone": data.LocationPhone,
              "Fax": data.Fax,
              "StreetAddress": this.splitAddress[0],
              "City": this.splitAddress[1],
              "State": this.splitAddress[2],
              "Zip": this.splitAddress[3],
              "NPI": data.NPI,
              "RenderNPI": data.RenderNPI,
              "Tin": data.Tin,
              "WeekDays": Weekday,
              "From": fromDate,
              "To": ToDate,
              "SpecificHour": ActivityStatus,
              "locationprimary": data.locationprimary
            }
            this.SaveupateLocation(locationdata);
          }
        }
        else {
          if (locationId != null) {
            let locationdata = {
              "ProviderId": this.user.ProviderId,
              "LocationId": locationId,
              "LocationName": data.LocationName,
              "LocationPhone": data.LocationPhone,
              "Fax": data.Fax,
              "StreetAddress": this.LocationForm.value.Stree2,
              "City": this.LocationForm.value.City,
              "State": this.LocationForm.value.State,
              "Zip": this.LocationForm.value.Zipcode,
              "NPI": data.NPI,
              "RenderNPI": data.RenderNPI,
              "Tin": data.Tin,
              "WeekDays": Weekday,
              "From": fromDate,
              "To": ToDate,
              "SpecificHour": ActivityStatus,
              "locationprimary": data.locationprimary
            }
            this.SaveupateLocation(locationdata);
          }
          else {
            let locationdata = {
              "ProviderId": this.user.ProviderId,
              "LocationId": UUID.UUID(),
              "LocationName": data.LocationName,
              "LocationPhone": data.LocationPhone,
              "Fax": data.Fax,
              "StreetAddress": this.LocationForm.value.Stree2,
              "City": this.LocationForm.value.City,
              "State": this.LocationForm.value.State,
              "Zip": this.LocationForm.value.Zipcode,
              "NPI": data.NPI,
              "RenderNPI": data.RenderNPI,
              "Tin": data.Tin,
              "WeekDays": Weekday,
              "From": fromDate,
              "To": ToDate,
              "SpecificHour": ActivityStatus,
              "locationprimary": data.locationprimary
            }
            this.SaveupateLocation(locationdata);
          }
        }
      }
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
        this.getLocationsList();
        this.clearForm();

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
    this.clearForm();
    this.displayforEditLocation = false;
    this.locationDisplayModel = "none";
    this.manuallybtn = true;
    this.enterbtn = false;
    this.dispalyOptionStreet = false;
    this.visiblebtn = true
  }
  clearForm() {
    this.buildLocationForm();

  }

  getEditLocData(reqparam) {
    debugger;
    this.locationDisplayModel = "block";
    this.displayforEditLocation = true;
    let id = reqparam.Location_Id;

    this.settingsService.Location(id).subscribe(resp => {
      if (resp.IsSuccess) {
        let location = resp.ListResult[0];
        let weekdata = resp.ListResult[1];
        // this.LocationForm.patchValue(location[0]);
        this.LocationForm.get("LocationId").setValue(reqparam.Location_Id);
        this.LocationForm.get("LocationName").setValue(location[0].name);
        this.LocationForm.get('LocationPhone').patchValue(location[0].phone);
        this.LocationForm.get('Fax').patchValue(location[0].fax);
        this.LocationForm.get('Stree2').patchValue(location[0].street_address);
        this.LocationForm.get('City').patchValue(location[0].city);
        this.LocationForm.get('State').patchValue(location[0].state);
        this.LocationForm.get('Zipcode').patchValue(location[0].zip);
        this.LocationForm.get('NPI').patchValue(location[0].npi);
        this.LocationForm.get('RenderNPI').patchValue(location[0].render_npi);
        this.LocationForm.get('Tin').patchValue(location[0].tin_en);
        this.LocationForm.get('locationprimary').patchValue(location[0].location_primary);
        this.LocationForm.get('SunOpenTime').patchValue(weekdata[0].from);
        this.LocationForm.get('SunCloseTime').patchValue(weekdata[0].to);
        this.LocationForm.controls['SunDDL'].setValue(weekdata[0].specific_hour);
        this.LocationForm.get('MonOpenTime').patchValue(weekdata[1].from);
        this.LocationForm.get('MonCloseTime').patchValue(weekdata[1].to);
        this.LocationForm.get('MonDDL').patchValue(weekdata[1].specific_hour);
        this.LocationForm.get('TueOpenTime').patchValue(weekdata[2].from);
        this.LocationForm.get('TueCloseTime').patchValue(weekdata[2].to);
        this.LocationForm.get('TueDDL').patchValue(weekdata[2].specific_hour);
        this.LocationForm.get('WedOpenTime').patchValue(weekdata[3].from);
        this.LocationForm.get('WedCloseTime').patchValue(weekdata[3].to);
        this.LocationForm.get('WedDDL').patchValue(weekdata[3].specific_hour);
        this.LocationForm.get('ThursOpenTime').patchValue(weekdata[4].from);
        this.LocationForm.get('ThursCloseTime').patchValue(weekdata[4].to);
        this.LocationForm.get('ThursDDL').patchValue(weekdata[4].specific_hour);
        this.LocationForm.get('FriOpenTime').patchValue(weekdata[5].from);
        this.LocationForm.get('FriCloseTime').patchValue(weekdata[5].to);
        this.LocationForm.get('FriDDL').patchValue(weekdata[5].specific_hour);
        this.LocationForm.get('SatOpenTime').patchValue(weekdata[6].from);
        this.LocationForm.get('SatCloseTime').patchValue(weekdata[6].to);
        this.LocationForm.get('SatDDL').patchValue(weekdata[6].specific_hour);
      }
    });
  }
  AddUser() {

    let formValue = this.AddUserFrom.value;

    if (formValue.FirstName == null && formValue.LastName == null && formValue.Role == null) {
      var msg = 'Email can not be blank, Email is invalid, and Provider is invalid';
      this.alertmsgforAddUser(msg);
      return;
    }
    if (formValue.Email == null) {
      var msg = 'Email can not be blank and Email is invalid';
      this.alertmsgforAddUser(msg);
      return;
    }
    if (formValue.Role == null) {
      var msg = 'Provider is invalid';
      this.alertmsgforAddUser(msg);
      return;
    }

    else {
      let reqparams = {
        "Id": 0,
        "UserId": "124abcd",
        "UserProviderId": "24",
        "Title": "",
        "FirstName": formValue.FirstName,
        "MiddleName": formValue.MiddleName,
        "LastName": formValue.LastName,
        "PracticeId": this.locationsInfo[0].locationId, //current loction id
        "PracticeName": "", //current loction name
        "Degree": "",
        "Speciality": "",
        "SecondarySpeciality": "",
        "PracticeRole": formValue.Role,
        "assigend_location": "",
        "DentalLicense": "",
        "ExpirationAt": "",
        "Active": formValue.Status,
        "State": "",
        "NPI": "",
        "Dea": "",
        "Upin": "",
        "Nadean": "",
        "Ssn": "",
        "StreetAddress": "",
        "SuiteNumber": "",
        "PrimarPhone": "",
        "MobilePhone": "",
        "Email": formValue.Email,
        "AltEmail": "",
        "EncryptedPassword": "",
        "SelectedUserLocationIds": ""
      }
      this.settingsService.AddUpdateUser(reqparams).subscribe(resp => {
        if (resp.IsSuccess) {
          this.closeAddUserModel();
          this.openSaveUserModel();
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
            title: msg,
            width: '700',
            confirmButtonText: 'Close',
            background: '#e5e1e1',
            showConfirmButton: true,
          });
        }
      });
    }

  }
  closeAddUserModel() {
    this.displayuser = "none";
  }
  openSaveUserModel() {
    this.saveUserModel = "block";
  }
  alertmsgforAddUser(msg: any) {
    Swal.fire({
      customClass: {
        container: 'container-class',
        title: 'title-error',
        confirmButton: 'close-error-button',
      },
      position: 'top',
      title: msg,
      width: '700',
      confirmButtonText: 'Close',
      background: '#e5e1e1',
      showConfirmButton: true,
    });
  }

  buildUserForm() {
    this.UserInformation = this.fb.group({
      Title: [],
      FirstName: [''],
      MiddleName: [''],
      LastName: [''],
      PracticeName: [''],
      Degree: [''],
      NPI: [''],
      Speciality: [''],
      SecondarySpeciality: [''],
      DentalLicense: [''],
      State: [''],
      UPIN: [''],
      UserId: [''],
      ExpirationDate: [''],
      NADEAN: [''],
      SSN: [''],
      DEA: [''],
      EHR1UserID: [''],
      Role: [''],
      Active: [''],
      EmailAddress: [''],
      LoginPhone: [''],
      RecoveryEmail: ['']

    })
    this.UserInformation.get('Title').setValue('Dr')
  }
  splitAddresses() {
    debugger;
    var street = this.LocationForm.value.Street;
    if (street != null) {
      this.address = street.split(',');
      this.LocationForm.get("Stree2").setValue(this.address[0]);
      this.LocationForm.get("City").setValue(this.address[1]);
      this.LocationForm.get("State").setValue(this.address[2]);
      this.LocationForm.get("Zipcode").setValue(this.address[3]);
      this.closePopupAddress()
    }
    this.visiblebtn = false;
    this.visiblebtn2 = true;
    this.dispalyOptionStreet = false;
    this.manuallybtn = true;
    this.enterbtn = true;
    this.LocationForm.get("Street").setValue(null);
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }
  getUserDataforEdit(user) {

    var reqparams = {
      ProviderId: this.user.ProviderId,//this.users.ProviderId,
      UserProviderId: user._id
    }

    this.settingsService.UserList(reqparams).subscribe(resp => {
      this.userList = resp.ListResult[0];
      this.providerList = resp.ListResult[1];
      this.locationList = resp.ListResult[2];
      if (resp.IsSuccess) {
        this.TemptableData = this.locationList;

        this.TemptableData.map((e) => {

          if (e.assigend_location == 1) {
            e.assigend_locations == true;
          } else {
            e.assigend_locations == false;
          }
          switch (e._weekday.toLowerCase()) {
            case 'sunday':
              e.shortofWeek = "su";
              break;
            case 'monday':
              e.shortofWeek = "m";
              break;
            case 'tuesday':
              e.shortofWeek = "t";
              break
            case 'wednesday':
              e.shortofWeek = "w";
              break;
            case 'thursday':
              e.shortofWeek = "th";
              break;
            case 'friday':
              e.shortofWeek = "f";
              break;
            case 'saturday':
              e.shortofWeek = "sa";
              break;
          }
        });
        this.providerLocationDataSource = this.TemptableData;
        console.log(this.TemptableData)
        this.UserInformation.get('Title').setValue('Dr');
        this.UserInformation.get('FirstName').setValue(this.providerList[0].first_name);
        this.UserInformation.get('MiddleName').setValue(this.providerList[0].middle_name);
        this.UserInformation.get('LastName').setValue(this.providerList[0].last_name);
        this.UserInformation.get('Degree').setValue(this.providerList[0].degree);
        this.UserInformation.get('Speciality').setValue(this.providerList[0].speciality);
        this.UserInformation.get('SecondarySpeciality').setValue(this.providerList[0].secondary_speciality);
        this.UserInformation.get('DentalLicense').setValue(this.providerList[0].dental_licence);
        this.UserInformation.get('State').setValue(this.providerList[0].state);
        this.UserInformation.get('ExpirationDate').setValue(this.providerList[0].expiration_at);
        this.UserInformation.get('NPI').setValue(this.providerList[0].npi);
        this.UserInformation.get('DEA').setValue(this.providerList[0].dea);
        this.UserInformation.get('UPIN').setValue(this.providerList[0].upin);
        this.UserInformation.get('UserId').setValue(this.providerList[0].user_id);
        this.UserInformation.get('NADEAN').setValue(this.providerList[0].nadean);
        this.UserInformation.get('SSN').setValue(this.providerList[0].ssn);
        this.UserInformation.get('Role').setValue(this.userList[0]._role);
        this.UserInformation.get('Active').setValue(this.providerList[0].active);
        this.UserInformation.get('EmailAddress').setValue(this.userList[0].email);
        this.UserInformation.get('LoginPhone').setValue(this.providerList[0].primary_phone);
        this.UserInformation.get('RecoveryEmail').setValue(this.userList[0].recovery_email);
      }
    });
  }
  UpdateUser() {
    var UserFormDetails = this.UserInformation.value;
    this.userList[0];
    let reqparams = {
      "Id": 1,
      "UserId": "122abcd",
      "UserProviderId": "22",
      "Title": UserFormDetails.Title,
      "FirstName": UserFormDetails.FirstName,
      "MiddleName": UserFormDetails.MiddleName,
      "LastName": UserFormDetails.LastName,
      "PracticeId": "5b686dd7c832dd0c444f288a",
      "PracticeName": "Mumbai",
      "Degree": UserFormDetails.Degree,
      "Speciality": UserFormDetails.Speciality,
      "SecondarySpeciality": UserFormDetails.SecondarySpeciality,
      "PracticeRole": UserFormDetails.Role,
      "DentalLicense": UserFormDetails.DentalLicense,
      "ExpirationAt": UserFormDetails.ExpirationDate,
      "Active": true,
      "State": UserFormDetails.State,
      "NPI": UserFormDetails.NPI,
      "Dea": UserFormDetails.DEA,
      "Upin": UserFormDetails.UPIN,
      "Nadean": UserFormDetails.NADEAN,
      "Ssn": UserFormDetails.SSN,
      "StreetAddress": 'Abcd',
      "SuiteNumber": '123',
      "PrimarPhone": UserFormDetails.LoginPhone,
      "MobilePhone": UserFormDetails.LoginPhone,
      "Email": UserFormDetails.EmailAddress,
      "AltEmail": UserFormDetails.RecoveryEmail,
      "EncryptedPassword": "Abcd@123",
      "SelectedUserLocationIds": "5b686dd7c832dd0c444f288a"//select user location
    }
    this.settingsService.AddUpdateUser(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.closeAddUserModel();
        this.closePopup();
        Swal.fire({
          // icon: 'success',
          position: 'top',
          background: '#e1dddd',
          title: 'Provider updated successfully',
          showConfirmButton: true,
          confirmButtonText: 'Close',
          width: '700',
        });
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
          title: resp.EndUserMessage,
          width: '700',
          confirmButtonText: 'Close',
          background: '#e5e1e1',
          showConfirmButton: true,
        });
      }
    });
  }
  closeUserPopup() {
    this.buildUserForm();
  }
  buildChangePwdForm() {
    this.ChangePasswords = this.fb.group({
      Email: [],
      NewPassword: [],
      ConfirmPassword: [, Validators.required]
    }, { validators: this.matchPassword });

  }
  ChangePassword() {
    let pwd = this.ChangePasswords.value;
    if (pwd.NewPassword != pwd.ConfirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Confirm Password Must Match With NewPassword',
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        width: '600',
        position: 'top-end',
      })
    }
    else {

    }
  }
  matchPassword(AC: AbstractControl) {
    let password = AC.get('NewPassword').value;
    if (AC.get('ConfirmPassword').touched || AC.get('ConfirmPassword').dirty) {
      let verifyPassword = AC.get('ConfirmPassword').value;

      if (password != verifyPassword) {
        AC.get('ConfirmPassword').setErrors({ MatchPassword: true })
      } else {
        return null
      }
    }
  }
}
