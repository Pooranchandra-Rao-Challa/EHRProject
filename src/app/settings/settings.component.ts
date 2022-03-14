import { Component, OnInit } from '@angular/core';
import { Accountservice } from '../_services/account.service';
import { User } from '../_models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
declare var $: any;


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  disPactice: boolean;
  disSechudle: boolean;
  ProviderId: any;
  LocationId: any;
  users: User;
  AdminCheck: boolean;
  displayStyle = "none";
  displayuser = "none";
  displayAddress = "none";

  user: any = [{

    "FullName": "Joha",
    "Email": "jkiffin0@google.pl",
    "Role": "Kiffin",
    "Space": "Admin",
    "Status": "Active",
    "EmergencyAccess": ""

  }, {

    "FullName": "Johannah",
    "Email": "jkiffin0@google.pl",
    "Role": "Kiffin",
    "Space": "Admin",
    "Status": "Active",
    "EmergencyAccess": ""
  },
  {

    "FullName": "Anna",
    "Email": "jkiffin0@google.pl",
    "Role": "Kiffin",
    "Space": "Admin",
    "Status": "Active",
    "EmergencyAccess": ""
  },
  {

    "FullName": "Johan",
    "Email": "jkiffin0@google.pl",
    "Role": "Kiffin",
    "Space": "Admin",
    "Status": "Active",
    "EmergencyAccess": ""
  },
  {

    "FullName": "Joha",
    "Email": "jkiffin0@google.pl",
    "Role": "Kiffin",
    "Space": "Admin",
    "Status": "Active",
    "EmergencyAccess": ""
  }];
  valueid: any;

  tableColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];
  tableColumns1: string[] = ['FullName', 'Email', 'Role', 'Space', 'Status', 'EmergencyAccess']
  tableColumns3: string[] = ['LocationName', 'CityState', 'PracticeSchedule', 'ServicedLocation'];
  dataSource: any;
  dataSource2: any;
  dataSource5: any;
  TimeZoneList: any;
  UTCTime: any;
  CurrentTime: any;
  LocationForm: FormGroup;
  displaymsg: any;
  addressdata: any;
  selectedValue: any;
  TimeZoneForm: FormGroup;
  disforEdit: boolean;
  WeekDropDown: any = [{
    days: ["Specific Hours", "Closed/NA", "Open 24 Hrs"]
  }]
  sucessdisplay: boolean;
  errorDisplay: boolean;
  address: any;
  enterbtn: boolean;
  visiblebtn: boolean = true;
  visiblebtn2: boolean = true;
  manuallybtn: boolean = true;
  Street2: boolean;
  address1: any;
  dataSource4: any;
  hover: any;
  hover1: any;
  getResponse: any = {}

  AppointData = {
    "Status": "text",
    "Color": "text",
    "isEdit": "isEdit"
  }
  AppointStatusData = [
    { "Status": "Sechduled", "Color": "gdfg" },
    { "Status": "Confirmed", "Color": "gdfgd" },
    { "Status": "Not Confirmed", "Color": "fdsgs" },
    { "Status": "Cancelled", "Color": "sdfg" },

  ];
  AppointType = {
    "Type": "text",
    "Color": "text",
    "isEdit": "isEdit"
  }
  AppointTypeData = [
    { "Type": "Consultation", "Color": "Abcd" },
    { "Type": "Crown/Bridge Delivery", "Color": "Abcd" },
    { "Type": "Emergency", "Color": "Abcd" },
    { "Type": "Endo", "Color": "Abcd" },
  ]

  myString: number;
  PhoneNumber: HTMLInputElement;
  displayedColumns2: string[] = ['Type', 'Color', 'isEdit'];
  displayedColumns1: string[] = ['Status', 'Color', 'isEdit'];
  dataSource3: any;
  // dataSchema = this.USERSCHEMA;
  dataSchema = this.AppointData;
  show: boolean;
  searchElement: any;
  LocationAddress: any;
  nameTitle: { titleId: number; titleName: string; }[];
  degree: { degreeId: number; degreeName: string; }[];
  speciality: { specId: number; specName: string; }[];
  role: { roleId: number; roleName: string }[];
  stateList: { stateCode: string; stateName: string }[];
  UserInformation: FormGroup;
  constructor(private fb: FormBuilder,
    private accountservice: Accountservice,) {
    this.users = JSON.parse(localStorage.getItem("user"));
    console.log(this.users);

  }

  ngOnInit(): void {

    this.dataSource3 = this.AppointTypeData;
    this.dataSource4 = this.AppointStatusData;
    this.buildTimeZoneForm();
    this.buildLocationForm();
    this.getLocationsList()
    this.getProviderDetails();
    this.getTimeZoneList();

    $(document).ready(function () {
      $('#sidebar ul li').click(function () {
        $('#sidebar ul li').removeClass("active");
        $(this).addClass("active");
      });
    });
    //user deatils
    this.dropdownMenusList();
    this.buildUserForm();
  }
  dropdownMenusList() {
    this.nameTitle = [
      { titleId: 1, titleName: 'Dr' },
      { titleId: 2, titleName: 'Mr' },
      { titleId: 3, titleName: 'Ms' },
      { titleId: 4, titleName: 'Mrs' },
    ];
    this.degree = [
      { degreeId: 1, degreeName: 'DDS' },
      { degreeId: 2, degreeName: 'DMD' },
      { degreeId: 3, degreeName: 'MD' },
      { degreeId: 4, degreeName: 'DO' },
      { degreeId: 5, degreeName: 'RDH' },
      { degreeId: 6, degreeName: 'N/A Degree' },
    ];
    this.speciality = [
      { specId: 1, specName: 'Dentistry' },
      { specId: 2, specName: 'Endodontics' },
      { specId: 3, specName: 'Oral and maxillofacial Pathology' },
      { specId: 4, specName: 'Oral and Maxillofacial Radiology' },
      { specId: 5, specName: 'Oral and Maxillofacial Surgery' },
      { specId: 6, specName: 'Orthodontics and Dentofacial Orthopedics' },
      { specId: 7, specName: 'Pediatric Dentistry' },
      { specId: 8, specName: 'Periodontics' },
      { specId: 9, specName: 'Prosthodontics' },
      { specId: 10, specName: 'N/A speciality' },
    ];
    this.stateList = [

      { stateCode: 'AK', stateName: 'Alaska' },
      { stateCode: 'AL', stateName: 'Alabama' },
      { stateCode: 'AR', stateName: 'Arkansas' },
      { stateCode: 'AS', stateName: 'American Samoa' },
      { stateCode: 'AZ', stateName: 'Arizona' },
      { stateCode: 'CA', stateName: 'California' },
      { stateCode: 'CO', stateName: 'Colorado' },
      { stateCode: 'CT', stateName: 'Connecticut' },
      { stateCode: 'DC', stateName: 'District of Columbia' },
      { stateCode: 'DE', stateName: 'Delaware' },
      { stateCode: 'GA', stateName: 'Georgia' },
      { stateCode: 'GU', stateName: 'Guam' },
      { stateCode: 'HI', stateName: 'Hawaii' },
      { stateCode: 'IA', stateName: 'Iowa' },
      { stateCode: 'ID', stateName: 'Idaho' },
      { stateCode: 'IL', stateName: 'Illinois' },
      { stateCode: 'IN', stateName: 'Indiana' },
      { stateCode: 'KS', stateName: 'Kansas' },
      { stateCode: 'KY', stateName: 'Kentucky' },
      { stateCode: 'LA', stateName: 'Louisiana' },
      { stateCode: 'MA', stateName: 'Massachusetts' },
      { stateCode: 'MD', stateName: 'Maryland' },
      { stateCode: 'ME', stateName: 'Maine' },
      { stateCode: 'MI', stateName: 'Michigan' },
      { stateCode: 'MN', stateName: 'Minnesota' },
      { stateCode: 'MO', stateName: 'Missouri' },
      { stateCode: 'MP', stateName: 'Northern Mariana Islands' },
      { stateCode: 'MS', stateName: 'Mississippi' },
      { stateCode: 'MT', stateName: 'Montana' },
      { stateCode: 'NC', stateName: 'North Carolina' },
      { stateCode: 'ND', stateName: 'North Dacota' },
      { stateCode: 'NE', stateName: 'Nebraska' },
      { stateCode: 'NH', stateName: 'New Hampshire' },
      { stateCode: 'NJ', stateName: 'New Jersey' },
      { stateCode: 'NM', stateName: 'New Mexico' },
      { stateCode: 'NV', stateName: 'Nevada' },
      { stateCode: 'NY', stateName: 'New York' },
      { stateCode: 'OH', stateName: 'Ohio' },
      { stateCode: 'OK', stateName: 'Oklahoma' },
      { stateCode: 'OR', stateName: 'Oregon' },
      { stateCode: 'PA', stateName: 'Pennsylvania' },
      { stateCode: 'PR', stateName: 'Puerto Rico' },
      { stateCode: 'RI', stateName: 'Rhode Island' },
      { stateCode: 'SC', stateName: 'South Carolina' },
      { stateCode: 'SD', stateName: 'South Dakota' },
      { stateCode: 'TN', stateName: 'Tennessee' },
      { stateCode: 'TX', stateName: 'Texas' },
      { stateCode: 'UM', stateName: 'United States Minor Outlying Islands' },
      { stateCode: 'UT', stateName: 'Utah' },
      { stateCode: 'VA', stateName: 'Virginia' },
      { stateCode: 'VI', stateName: 'Virgin Islands, U.S.' },
      { stateCode: 'VT', stateName: 'Vermont' },
      { stateCode: 'WA', stateName: 'Washington' },
      { stateCode: 'WI', stateName: 'Wisconsin' },
      { stateCode: 'WV', stateName: 'West Virginia' },
      { stateCode: 'WY', stateName: 'Wyoming' },


    ];
    this.role = [
      { roleId: 1, roleName: 'Provider' },
      { roleId: 2, roleName: 'Dentist' },
      { roleId: 3, roleName: 'Hygientist' },
      { roleId: 4, roleName: 'Back Office' },
      { roleId: 5, roleName: 'Front Desk' },
      { roleId: 6, roleName: 'EHR1 administrator' }


    ];
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
      MedicalLicense: [''],
      State: [''],
      ExpirationDate: [''],
      DEA: [''],
      EHR1UserID: [''],
      Role: [''],
      // NPI: ['', Validators.required],

    })
    this.UserInformation.get('Title').setValue('Dr')
  }


  addStatus() {
    const newRow = { "Status": "", "Color": "", isEdit: true }
    this.dataSource4 = [...this.dataSource4, newRow];
  }
  addType() {
    const newRow = { "Type": "", "Color": "", isEdit: true }
    this.dataSource3 = [...this.dataSource3, newRow];
  }
  deleteTicket(rowid: number) {
    if (rowid > -1) {
      this.dataSource4.splice(rowid, 1);
      this.dataSource4 = [...this.dataSource4]; // new ref!
    }
  }
  deleteType(rowid: number) {
    if (rowid > -1) {
      this.dataSource3.splice(rowid, 1);
      this.dataSource3 = [...this.dataSource3]; // new ref!
    }
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
  buildTimeZoneForm() {
    this.TimeZoneForm = this.fb.group({
      TimeZones: ['']
    });
  }

  // get display Location Details
  getLocationsList() {
    this.ProviderId = this.users.ProviderId;
    console.log(this.ProviderId)
    this.accountservice.getLocationsList(this.ProviderId).subscribe(data => {
      if (data.IsSuccess) {
        this.dataSource = data.ListResult;
        this.LocationAddress = data.ListResult;
        console.log(this.LocationAddress);

      }
    });
  }

  // get display User Details
  getProviderDetails() {
    debugger;
    var reqparams = {
      provider_Id: "615ad0cb391cba75e3388e5d",//this.users.ProviderId,
      location_Id: "5b686dd7c832dd0c444f288a" //this.users.LocationId
    }
    this.accountservice.GetProviderDetails(reqparams).subscribe(data => {
      this.getResponse = data;
      if (this.getResponse.IsSuccess) {
        this.dataSource2 = this.getResponse.ListResult;
        console.log(this.dataSource2);
      }

    });
  }

  // Update User Grid
  CheckAdminAccess(row) {
    let reqparams = {
      ProviderId: row.C_id,
      AdminRole: row.admin,
      EmergencyAcess: row.emergency_access,
      Active: row.active,
      UpdatedAt: new Date()
    }
    this.accountservice.PostProvdierAdminAccess(reqparams).subscribe(data => {
      if (data) {

      }
      else {

      }

    })
  }
  // dropdown for TimeZone
  getTimeZoneList() {
    debugger;
    this.accountservice.getTimeZoneList().subscribe(data => {
      if (data.IsSuccess) {
        this.TimeZoneList = data.ListResult;
        var data = this.TimeZoneList[6];
        var datas = data.Id
        this.TimeZoneForm.get("TimeZones").setValue(datas);
        this.DisplayDateTimeZone(datas);
      }
    });
  }

  // DatetimeZone data
  DisplayDateTimeZone(event) {
    debugger;
    var data = event;
    var time = this.LocationForm.value.TimeZones;
    this.accountservice.getDateTimeZone(data).subscribe(data => {
      if (data.IsSuccess) {
        var UTC = data.EndUserMessage;
        var datas = UTC.split(" ");
        this.UTCTime = datas[1] + ' ' + datas[2];
        this.CurrentTime = datas[5] + ' ' + datas[6];

      }

    });
  }

  ///address verification
  AddressVerification() {
    debugger;
    this.manuallybtn = true;
    this.LocationForm.value;
    var Street = this.LocationForm.value.Street
    if (Street != null) {
      var address = Street.split(',');
      let obj1 = {
        street: address[0],
        city: address[1],
        stateName: address[2],
        zipcode: address[3]
      }
      this.accountservice.PostAddressVerification(obj1).subscribe(addresslist => {
        this.getResponse = addresslist;
        if (this.getResponse.IsSuccess) {

          this.sucessdisplay = false;
          this.openPopupAddress();
          this.addressdata = this.LocationForm.value.Street;
          this.displaymsg = this.getResponse.EndUserMessage;

        }
        else {

          this.sucessdisplay = true;
          this.errorDisplay = false;
          this.openPopupAddress();
          this.displaymsg = this.getResponse.EndUserMessage;
        }
      });
    }
    else {
      let obj2 = {
        Street: this.LocationForm.value.Street,
        Stree2: this.LocationForm.value.Stree2,
        city: this.LocationForm.value.City,
        stateName: this.LocationForm.value.State,
        zipcode: this.LocationForm.value.Zipcode
      }
      this.accountservice.PostAddressVerification(obj2).subscribe(addresslist => {
        this.getResponse = addresslist
        if (this.getResponse.IsSuccess) {
          this.displaymsg = this.getResponse.EndUserMessage
        }
      });
    }
  }
  //display Schedule Screen
  Schedule() {
    this.disSechudle = true;
    this.disPactice = true
  }
  //display Practice Screen
  Practice() {
    this.disSechudle = false;
    this.disPactice = false
  }
  openPopupAddress() {

    this.displayAddress = "block";
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }
  openPopupLocation() {
    this.displayuser = "block";
  }
  closePopupLocation() {
    this.displayuser = "none";
  }
  openPopup() {
    this.clearForm();
    this.disforEdit = false;
    this.displayStyle = "block";
  }

  closePopup() {
    this.clearForm();
    this.disforEdit = false;
    //  $('#staticBackdrop1').appenTo("body");
    // $('#staticBackdrop1').modal('hide')
    this.displayStyle = "none";
    this.manuallybtn = true;
    this.enterbtn = false;
    this.Street2 = false;
    this.visiblebtn = true
  }


  getEditLocData(reqparam) {
    debugger;
    this.displayStyle = "block";
    this.disforEdit = true;
    let id = reqparam.Location_Id;

    this.accountservice.GetLocationById(id).subscribe(locationAndWeekList => {
      this.getResponse = locationAndWeekList;
      if (this.getResponse.IsSuccess) {
        let location = this.getResponse.ListResult[0];
        let weekdata = this.getResponse.ListResult[1];

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
  AddLocation() {
    debugger;
    var name = this.LocationForm.value.LocationName;
    this.address1 = null;
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
    // this.getSlpitValue();
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
          this.address1 = Street.split(',');

          if (locationId != null) {
            let obj = {
              "ProviderId": this.users.ProviderId,
              "LocationId": locationId,
              "LocationName": data.LocationName,
              "LocationPhone": data.LocationPhone,
              "Fax": data.Fax,
              "StreetAddress": this.address1[0],
              "City": this.address1[1],
              "State": this.address1[2],
              "Zip": this.address1[3],
              "NPI": data.NPI,
              "RenderNPI": data.RenderNPI,
              "Tin": data.Tin,
              "WeekDays": Weekday,
              "From": fromDate,
              "To": ToDate,
              "SpecificHour": ActivityStatus,
              "locationprimary": data.locationprimary
            }
            this.SaveupateLocation(obj);
          }
          else {
            let obj = {
              "ProviderId": this.users.ProviderId,
              "LocationId": '153',
              "LocationName": data.LocationName,
              "LocationPhone": data.LocationPhone,
              "Fax": data.Fax,
              "StreetAddress": this.address1[0],
              "City": this.address1[1],
              "State": this.address1[2],
              "Zip": this.address1[3],
              "NPI": data.NPI,
              "RenderNPI": data.RenderNPI,
              "Tin": data.Tin,
              "WeekDays": Weekday,
              "From": fromDate,
              "To": ToDate,
              "SpecificHour": ActivityStatus,
              "locationprimary": data.locationprimary
            }
            this.SaveupateLocation(obj);
          }
        }
        else {
          if (locationId != null) {
            let obj = {
              "ProviderId": this.users.ProviderId,
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
            this.SaveupateLocation(obj);
          }
          else {
            let obj = {
              "ProviderId": this.users.ProviderId,
              "LocationId": '225',
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
            this.SaveupateLocation(obj);
          }
        }
      }
    }
  }
  SaveupateLocation(reqparams) {
    this.accountservice.PostAddUpdateLocation(reqparams).subscribe(Locationlist => {
      this.getResponse = Locationlist;

      if (this.getResponse.IsSuccess) {
        Swal.fire({
          icon: 'success',
          title: 'Location Save Successfully',
          // showConfirmButton: true,
          // confirmButtonText: 'Close',
          width: '700',
          position: 'top-end',
          timer: 1500
        });
        console.log(this.getResponse)
        this.closePopup();
        this.getLocationsList();
        this.clearForm();

      }

      else {
        Swal.fire({
          icon: 'warning',
          title: this.getResponse.EndUserMessage,
          showConfirmButton: false,
          confirmButtonText: 'Ok',
          position: 'top-end',
          width: '700',
        })
      }
    });
  }

  splitAddress() {
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
    this.Street2 = false;
    this.manuallybtn = true;
    this.enterbtn = true;
    this.LocationForm.get("Street").setValue(null);
  }

  EnterAddress() {

    this.LocationForm.get("City").setValue(null);
    this.LocationForm.get("State").setValue(null);
    this.LocationForm.get("Zipcode").setValue(null);
    this.LocationForm.get("Stree2").setValue(null);
    this.visiblebtn = true;
    this.visiblebtn2 = true;
    this.Street2 = true;
    this.enterbtn = false;
    this.manuallybtn = false;
  }
  EnterManually() {
    this.visiblebtn = true;
    this.visiblebtn2 = false;
    this.enterbtn = false;
    this.Street2 = false;
  }
  DeleteLocation() {

  }
  clearForm() {
    this.buildLocationForm();

  }

  //////user




  GetEditUserData(user) {

  }
  UpdateUser() {

  }
  CloseUserPopup() {
    this.buildUserForm();
  }
}
