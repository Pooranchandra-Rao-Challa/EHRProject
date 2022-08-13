import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { LocationDialog, User } from 'src/app/_models';
import { Accountservice } from 'src/app/_services/account.service';
import { PracticeLocation } from 'src/app/_models/';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location.dialog.component.html',
  styleUrls: ['./location.dialog.component.scss']
})
export class LocationDialogComponent implements OnInit {
  locationColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];
  timeStatus = [{ name: 'Specific Hours' }, { name: 'Closed/NA' }, { name: 'Open 24 Hrs' }];
  PracticeLocData: PracticeLocation;
  PhonePattern: any;
  user: User;
  addressVerfied: boolean = false;
  displayforEditLocation: boolean;
  disableaddressverification: boolean = false;
  manuallybtn: boolean = false;
  locationDisplayModel = "none";
  isDeletable: boolean = false;
  data: LocationDialog

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private settingsService: SettingsService,
    private accountservice: Accountservice,
    private alertmsg: AlertMessage) {
    this.data = ref.RequestData as LocationDialog


    this.editPracticeLocation(this.data.LocationInfo)
    this.user = authService.userValue;
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    this.PracticeLocData = new PracticeLocation
  }
  ngOnInit(): void {

  }

  // address verification
  AddressVerification() {
    this.accountservice.VerifyAddress(this.PracticeLocData.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeLocData.City = resp.Result.components.city_name
        this.PracticeLocData.State = resp.Result.components.state_abbreviation
        this.PracticeLocData.StreetAddress = resp.Result.delivery_line_1
        this.PracticeLocData.Zipcode = resp.Result.components.zipcode
        this.PracticeLocData.Street = "";
        this.addressVerfied = true;
      }
      else {
        this.manuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP009"])
      }
    });
  }
  enableManualEntry() {
    this.manuallybtn = true;
    this.clearAddress();
  }
  updateLocation() {
    // this.splitAddress = null;
    this.PracticeLocData.Street = this.PracticeLocData.StreetAddress;

    let data = this.PracticeLocData;

    this.PracticeLocData.ProviderId = this.data.ProviderId;

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
        this.ref.close({ saved: true })
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
  close() { this.ref.close() }

  editPracticeLocation(reqparam) {
    this.displayforEditLocation = true;
    if (reqparam == null || reqparam.LocationId == null) return;
    this.settingsService.EditProviderLocation(reqparam.LocationId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.isDeletable = true;
        let location = resp.ListResult[0];
        let weekdata = resp.ListResult[1];
        let sunday = weekdata[0];
        let monday = weekdata[1];
        let tuesday = weekdata[2];
        let wednesday = weekdata[3];
        let thursday = weekdata[4];
        let friday = weekdata[5];
        let saturday = weekdata[6];

        this.PracticeLocData.LocationId = location[0]._id;
        this.PracticeLocData.ProviderId = this.user.ProviderId;
        this.PracticeLocData.LocationName = location[0].name;
        this.PracticeLocData.Fax = location[0].fax;
        this.PracticeLocData.LocationPhone = location[0].phone;
        this.PracticeLocData.NPI = location[0].npi;
        this.PracticeLocData.RenderNPI = location[0].render_npi;
        this.PracticeLocData.Tin = location[0].tin_en;
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

  enterAddressManually() {
    this.disableaddressverification = true;
  }
  clearAddress() {
    this.PracticeLocData.Street = "";
    this.PracticeLocData.City = ""
    this.PracticeLocData.State = ""
    this.PracticeLocData.StreetAddress = ""
    this.PracticeLocData.Zipcode = ""
  }

  clearPracticeLocation() {
    this.PracticeLocData = new PracticeLocation
  }

  deleteLocation() {
    this.settingsService.DeleteLocation({ LocationId: this.PracticeLocData.LocationId }).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({ deleted: true })
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JP003"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP005"]);
      }
    });
  }


}
