import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Registration } from 'src/app/_models/_account/registration';
import { Accountservice } from 'src/app/_services/account.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import Swal from 'sweetalert2';
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
  codeListPrimary: string[] = ['501', '502', '401', '402', '601', '603'];
  codeListSecondary: string[] = ['501', '502', '401', '402', '601', '603'];
  DisplayPwdInput: boolean = true;
  titles: {}[];
  degrees: {}[];
  specialities: {}[];
  newUser: Registration = {} as Registration;
  displayDialog: boolean;
  displayAddress = "none";
  displaymsg: any;
  ValidAddressForUse: any;
  url: string;
  PhonePattern: any;

  constructor(private ref: EHROverlayRef,
    private utilityService: UtilityService,
    private accountservice: Accountservice,
    private plaformLocation: PlatformLocation) {
      this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
      //console.log(plaformLocation.href.replace(plaformLocation.pathname,'/'));
      this.PhonePattern = {
        0: {
          pattern: new RegExp('\\d'),
          symbol: 'X',
        },
      };
    }

  ngOnInit(): void {
    this.filteredOptionsPrimary = this.myControlPrimary.valueChanges.pipe(startWith(''), map(value => this._filterPrimary(value)));
    this.filteredOptionsSecondary = this.myControlSecondary.valueChanges.pipe(startWith(''), map(valueS => this._filterSecondary(valueS)));
    this.loadDefaults();
  }

  private _filterPrimary(value: string): string[] {
    if (value == "") {
      return ['Please enter 1 or more characters']
    }
    const filterValue = value;
    var searchData = this.codeListPrimary.filter(option => option.includes(filterValue));
    if (searchData.length === 0) {
      return ['No Data Found']
    }
    return searchData;
  }

  private _filterSecondary(value: string): string[] {
    if (value == "") {
      return ['Please enter 1 or more characters']
    }
    const filterValueSecondary = value;
    var searchDataSecondary = this.codeListSecondary.filter(option => option.includes(filterValueSecondary));
    if (searchDataSecondary.length === 0) {
      return ['No Data Found']
    }
    return searchDataSecondary;
  }

  GeneratePassword() {
    this.DisplayPwdInput = false;
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
  }

  AddressVerification() {
    if (this.newUser.Address != null) {
      this.accountservice.VerifyAddress(this.newUser.Address).subscribe(resp => {
        if (resp.IsSuccess) {
          this.displayDialog = false;
          this.openPopupAddress();
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
    return;
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

}
