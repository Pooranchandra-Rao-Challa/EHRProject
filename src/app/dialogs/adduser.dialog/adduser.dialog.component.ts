
import { AuthenticationService } from './../../_services/authentication.service';
import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { IdService } from 'src/app/_helpers/_id.service';
import { Registration } from 'src/app/_models/_account/registration';
import { Accountservice } from 'src/app/_services/account.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/_models';
import { AreaCode, Clinic } from 'src/app/_models/_admin/admins';

@Component({
  selector: 'app-adduser.dialog',
  templateUrl: './adduser.dialog.component.html',
  styleUrls: ['./adduser.dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {
  myControlPrimary = new FormControl();
  myControlSecondary = new FormControl();
  filteredOptionsPrimary: any;
  filteredOptionsSecondary: any;
  AreaCodes: AreaCode[];
  DisplayPwdInput: boolean = true;
  titles: {}[];
  degrees: {}[];
  specialities: {}[];
  Clinics?: Clinic[];
  newUser: Registration = new Registration;
  randomPassword?: string = null;
  showPassword?: boolean = false;
  displayDialog: boolean;
  displayAddress = "none";
  displaymsg: any;
  ValidAddressForUse: any;
  url: string;
  PhonePattern: any;
  AddressResult: any;
  user: User
  phonePattern = /^[0-9]{10}/;
  emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;
  emailVerfied?: boolean = null;
  emailVerficationMessage?: string;
  alertMsgTitle: string;
  alertTextEmail: string;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private accountservice: Accountservice,
    private plaformLocation: PlatformLocation,
    private idService: IdService) {
    this.updateLocalModel(ref.RequestData);
    this.url = `${plaformLocation.protocol}//${plaformLocation.hostname}:${plaformLocation.port}/`;
    this.user = authService.userValue;
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
  }

  ngOnInit(): void {
    this.filteredOptionsPrimary = this.myControlPrimary.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    this.filteredOptionsSecondary = this.myControlSecondary.valueChanges.pipe(startWith(''), map(valueS => this._filterAreaCode(valueS)));
    this.loadDefaults();
    this.newUser.EPrescribeFrom = 'none';
  }

  updateLocalModel(data: Registration) {
    this.newUser = new Registration;
    if (data == null) return;
    else {
      this.newUser = data;
      if (!this.newUser.PrimaryPhone) {
        this.newUser.PrimaryPhonePreffix = '';
        this.newUser.PrimaryPhoneSuffix = '';
      }
      else {
        let list = this.newUser.PrimaryPhone.split('+1');

        let i = list.length - 1;
        if(i<0 ) i = 0;
        this.newUser.PrimaryPhonePreffix = list[i].slice(0, 3);
        this.newUser.PrimaryPhoneSuffix = list[i].slice(3, 10);
      }
      if (!this.newUser.MobilePhone) {
        this.newUser.MobilePhonePreffix = '';
        this.newUser.MobilePhoneSuffix = '';
      }
      else {
        let secondarylist = this.newUser.MobilePhone.split('+1');
        let i = secondarylist.length - 1;
        if(i<0 ) i = 0;
        this.newUser.MobilePhonePreffix = secondarylist[i].slice(0, 3);
        this.newUser.MobilePhoneSuffix = secondarylist[i].slice(3, 10);
      }
    }
  }

  checkEmailExistance() {
    if (this.emailPattern.test(this.newUser.Email))
      this.accountservice.CheckEmailAvailablity({ Email: this.newUser.Email }).subscribe((resp) => {
        this.emailVerfied = resp.IsSuccess;
        this.emailVerficationMessage = resp.EndUserMessage
      })
    else this.emailVerfied = null;
  }

  private _filterAreaCode(value: string): string[] {
    if (value == "") {
      return ['Please enter 1 or more characters']
    }
    var _areaCodes = this.AreaCodes.filter(option => option.AreaCode?.includes(value));
    if (_areaCodes.length === 0) {
      return ['No Data Found']
    }
    return _areaCodes.map(value => value.AreaCode);
  }

  GeneratePassword() {
    this.randomPassword = this.idService.generateID(12);
    this.DisplayPwdInput = false;
  }

  onCheckboxChange(event) {
    this.showPassword = event.target.checked
  }

  close() {
    this.ref.close(null);
  }

  loadDefaults() {
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
    this.utilityService.ClinicsForAdmin().subscribe(resp => {
      if (resp.IsSuccess) {
        this.Clinics = resp.ListResult as Clinic[];
      }
    });
    this.utilityService.AreaCodes()
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.AreaCodes = resp.ListResult as AreaCode[];
        } else {
          this.AreaCodes = [];
        }
      },
        error => {
        });
  }

  AddressVerification() {
    if (this.newUser.Address != null) {
      this.accountservice.VerifyAddress(this.newUser.Address).subscribe(resp => {
        if (resp.IsSuccess) {
          this.displayDialog = false;
          this.openPopupAddress();
          this.AddressResult = resp.Result;
          this.ValidAddressForUse = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"]
          this.displaymsg = resp.EndUserMessage;
        }
        else {
          this.displayDialog = true;
          this.openPopupAddress();
          this.displaymsg = resp.EndUserMessage;
        }
      });
    }
  }

  openPopupAddress() {
    this.displayAddress = "block";
  }

  closePopupAddress() {
    this.displayAddress = "none";
  }

  UseValidatedAddress() {
    this.newUser.City = this.AddressResult.components.city_name;
    this.newUser.State = this.AddressResult.components.state_abbreviation;
    this.newUser.StreetAddress = this.AddressResult.delivery_line_1;
    this.newUser.ZipCode = this.AddressResult.components.zipcode;
    this.newUser.PracticeAddress = this.ValidAddressForUse;
    this.closePopupAddress();
  }

  onSelectedMobileCode(code: string) {
    this.newUser.MobilePhonePreffix = code;
  }

  onSelectedPrimaryPhoneCode(code: string) {
    this.newUser.PrimaryPhonePreffix = code;
  }

  createProviderRegistration() {
    this.newUser.PrimaryPhone = '+1' + this.newUser.PrimaryPhonePreffix + this.newUser.PrimaryPhoneSuffix;
    if (this.newUser.MobilePhonePreffix == undefined || this.newUser.MobilePhoneSuffix == undefined
      || this.newUser.MobilePhonePreffix == '' || this.newUser.MobilePhoneSuffix == ''
      || this.newUser.MobilePhonePreffix == null || this.newUser.MobilePhoneSuffix == null) {
      this.newUser.MobilePhone = null;
    }
    else {
      this.newUser.MobilePhone = '+1' + this.newUser.MobilePhonePreffix + this.newUser.MobilePhoneSuffix;
    }
    this.newUser.URL = this.url;

    this.accountservice.CreateProvider(this.newUser).subscribe(resp => {
      if (resp.IsSuccess) {
        if (this.newUser.ProviderId) {
          this.alertMsgTitle = 'User Updated Successfully ';
          this.alertTextEmail = '';
        }
        else {
          this.alertMsgTitle = 'Thank you for registering for an EHR1 Account! An email with instructions for how to complete  setup of your account has been sent to ';
          this.alertTextEmail = this.newUser.Email;
        }
        this.alertWithSuccess();
        this.ref.close({
          saved: true
        });
      }
      else {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'There is some issue to send the mail',
          text: resp.EndUserMessage,
          width: '700',
        });
        this.close();
      }
    });
  }

  alertWithSuccess() {
    Swal.fire({
      position: 'top',
      //icon: 'success',
      title: this.alertMsgTitle + this.alertTextEmail,
      confirmButtonText: 'Close',
      width: '700',
      customClass: {
        cancelButton: 'admin-cancel-button',
        title: "admin-swal2-styled"
      },
      background: '#f9f9f9',
      showCancelButton: true,
      showConfirmButton: false,
      backdrop: true,
    });
  }

  disableProviderRegistration() {
    var npireg = /^[0-9]{10}$/;
    let pNo = this.newUser.PrimaryPhonePreffix + this.newUser.PrimaryPhoneSuffix;
    let mNo = this.newUser.MobilePhonePreffix + this.newUser.MobilePhoneSuffix;
    let flag = (this.newUser.EPrescribeFrom == 'dosespot'
      && this.newUser.IsDoseSpotRegistation != null && this.newUser.IsDoseSpotRegistation == true
      && this.newUser.DoseSpotClinicKey
      && this.newUser.DoseSpotClinicianId) ||
      (this.newUser.EPrescribeFrom == 'drfirst'
        && this.newUser.VendorSecretKey
        && this.newUser.VendorUsername
        && this.newUser.ProviderUsername
        && this.newUser.ProviderPassword
        && this.newUser.PracticeUsername
        && this.newUser.PracticePassword
        // && this.newUser.UserExternalId != null && this.newUser.UserExternalId != ""
      ) ||
      this.newUser.EPrescribeFrom == 'none' || this.newUser.EPrescribeFrom == undefined

    return !(this.newUser.Title
      && this.newUser.FirstName
      && this.newUser.LastName
      && this.newUser.Degree
      && this.newUser.Speciality
      && this.newUser.NPI
      && this.newUser.StreetAddress || this.newUser.Address
      && this.newUser.ClinicId
      && (this.phonePattern.test(pNo))
      && ((!this.newUser.MobilePhonePreffix && !this.newUser.MobilePhoneSuffix) || (this.phonePattern.test(mNo)))
      && (this.emailPattern.test(this.newUser.Email))
      && (this.newUser.AltEmail == null || this.newUser.AltEmail == '' || (this.emailPattern.test(this.newUser.AltEmail)))
      && flag && npireg.test(this.newUser.NPI))
  }

}
