
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
import { AreaCode } from 'src/app/_models/_admin/Admins';
import { of } from 'rxjs';
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
  //codeListPrimary: string[] = ['201', '202', '203', '204', '601', '603'];
  //codeListSecondary: string[] = ['501', '502', '401', '402', '601', '603'];
  AreaCodes: AreaCode[];
  DisplayPwdInput: boolean = true;
  titles: {}[];
  degrees: {}[];
  specialities: {}[];
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

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private accountservice: Accountservice,
    private plaformLocation: PlatformLocation,
    private idService: IdService) {
    this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
    this.user = authService.userValue;
    console.log(this.user.Role);

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

    this.utilityService.AreaCodes()
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.AreaCodes = resp.ListResult as AreaCode[];
        } else {
          this.AreaCodes=[];
        }
      },
      error=>{
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
    this.newUser.Address = this.AddressResult.delivery_line_1;
    this.newUser.ZipCode = this.AddressResult.components.zipcode;
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

    console.log(this.newUser)
    this.accountservice.RegisterNewProvider(this.newUser).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertWithSuccess();
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: resp.EndUserMessage,
          width: '700',
        })
      }
    });
  }

  alertWithSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Thank you for registering for an EHR1 Account! An email with instructions for how to complete  setup of your account has been sent to ' + this.newUser.Email,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '700',
    });
  }

  disableProviderRegistration() {
    // this.NPIValidator();
    var npireg = /^[0-9]{10}$/;
    let flag = (this.newUser.EPrescribeFrom == 'dosespot'
      && this.newUser.DoseSpotClinicId != null && this.newUser.DoseSpotClinicId != ""
      && this.newUser.IsDoseSpotRegistation != null && this.newUser.IsDoseSpotRegistation == true
      && this.newUser.DoseSpotClinicKey != null && this.newUser.DoseSpotClinicKey != ""
      && this.newUser.DoseSpotClinicianId != null && this.newUser.DoseSpotClinicianId != "") ||
      (this.newUser.EPrescribeFrom == 'drfirst'
        && this.newUser.VendorSecretKey != null && this.newUser.VendorSecretKey != ""
        && this.newUser.VendorUsername != null && this.newUser.VendorUsername != ""
        && this.newUser.ProviderUsername != null && this.newUser.ProviderUsername != ""
        && this.newUser.ProviderPassword != null && this.newUser.ProviderPassword != ""
        && this.newUser.PracticeUsername != null && this.newUser.PracticeUsername != ""
        && this.newUser.PracticePassword != null && this.newUser.PracticePassword != ""
        && this.newUser.UserExternalId != null && this.newUser.UserExternalId != ""
      ) ||
      this.newUser.EPrescribeFrom == 'none' || this.newUser.EPrescribeFrom == undefined

    return !(this.newUser.Title == undefined ? '' : this.newUser.Title != ''
      && this.newUser.FirstName == undefined ? '' : this.newUser.FirstName != ''
        && this.newUser.LastName == undefined ? '' : this.newUser.LastName != ''
          && this.newUser.Degree == undefined ? '' : this.newUser.Degree != ''
            && this.newUser.Speciality == undefined ? '' : this.newUser.Speciality != ''
              && this.newUser.NPI == undefined ? '' : this.newUser.NPI != ''
                && this.newUser.Address == undefined ? '' : this.newUser.Address != ''
                  && this.newUser.PrimaryPhonePreffix == undefined ? '' : this.newUser.PrimaryPhonePreffix != ''
                    && this.newUser.PrimaryPhoneSuffix == undefined ? '' : this.newUser.PrimaryPhoneSuffix != ''
                      && this.newUser.Email == undefined ? '' : this.newUser.Email != ''
                      && flag && npireg.test(this.newUser.NPI))
  }

}


