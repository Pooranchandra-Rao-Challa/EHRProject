import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ViewModel } from '../../_models/_account/registration';
import { AdminRegistration, Admins } from 'src/app/_models/_admin/Admins';
import { Accountservice } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import Swal from 'sweetalert2';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  isAddAdmin: boolean = false;
  isSave: boolean = true;
  codeValue = new FormControl();
  adminDataSource: Admins[] = [];
  myControlPrimary = new FormControl();
  myControlSecondary = new FormControl();
  filteredOptions: any;
  filteredOptionsPrimary: any;
  filteredOptionsSecondary: any;
  codeListPrimary: string[] = ['501', '502', '401', '402', '601', '603'];
  codeListSecondary: string[] = ['501', '502', '401', '402', '601', '603'];
  newAdminRegistration: AdminRegistration = new AdminRegistration();
  titles: {}[];
  viewModel: ViewModel = {} as ViewModel;
  url: string;
  PhonePattern: any;

  constructor(private adminservice: AdminService,
    private utilityService: UtilityService,
    private accountservice: Accountservice,
    private plaformLocation: PlatformLocation,
    private alertmsg: AlertMessage) {
    this.url = plaformLocation.href.substring(0, plaformLocation.href.indexOf('?')).replace(plaformLocation.pathname, '/');
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
    this.getAdminList();
    this.loadDefaults();
  }


  getAdminList() {
    this.adminservice.AdminList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.adminDataSource = resp.ListResult;
      } else
        this.adminDataSource = [];
    });
  }

  loadDefaults() {
    this.utilityService.Titles().subscribe(resp => {
      if (resp.IsSuccess) {
        this.titles = JSON.parse(resp.Result);
      }
    });
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

  isView(item) {
    this.isSave = true;
    this.isAddAdmin = false;

    this.newAdminRegistration.AdminId = item.AdminId;
    this.newAdminRegistration.Role = item.C_role;
    this.newAdminRegistration.Title = item.C_title;
    this.newAdminRegistration.AltEmail = item.alt_email;
    this.newAdminRegistration.Email = item.email;
    this.newAdminRegistration.FirstName = item.first_name;
    this.newAdminRegistration.LastName = item.last_name;
    this.newAdminRegistration.MiddleName = item.middle_name;
    if (item.primary_phone == null) {
      this.newAdminRegistration.PrimaryPhonePreffix = '';
      this.newAdminRegistration.PrimaryPhoneSuffix = '';
    }
    else {
      let list = item.primary_phone.split('+1');
      this.newAdminRegistration.PrimaryPhonePreffix = list[1].slice(0, 3);
      this.newAdminRegistration.PrimaryPhoneSuffix = list[1].slice(3, 10);
    }
    if (item.mobile_phone == null) {
      this.newAdminRegistration.MobilePhonePreffix = '';
      this.newAdminRegistration.MobilePhoneSuffix = '';
    }
    else {
      let secondarylist = item.mobile_phone.split('+1');
      this.newAdminRegistration.MobilePhonePreffix = secondarylist[1].slice(0, 3);
      this.newAdminRegistration.MobilePhoneSuffix = secondarylist[1].slice(3, 10);
    }
  }

  onAddAdmin() {
    this.isAddAdmin = true;
    this.isSave = false;
    this.newAdminRegistration.Role = 'admin';
    this.newAdminRegistration.Title = 'Dr';
  }

  CreateAdminRegistration() {
    this.newAdminRegistration.Title = this.newAdminRegistration.Title;
    this.newAdminRegistration.PrimaryPhone = '+1' + this.newAdminRegistration.PrimaryPhonePreffix + this.newAdminRegistration.PrimaryPhoneSuffix;
    if (this.newAdminRegistration.MobilePhonePreffix == undefined || this.newAdminRegistration.MobilePhoneSuffix == undefined
      || this.newAdminRegistration.MobilePhonePreffix == '' || this.newAdminRegistration.MobilePhoneSuffix == ''
      || this.newAdminRegistration.MobilePhonePreffix == null || this.newAdminRegistration.MobilePhoneSuffix == null) {
      this.newAdminRegistration.MobilePhone = null;
    }
    else {
      this.newAdminRegistration.MobilePhone = '+1' + this.newAdminRegistration.MobilePhonePreffix + this.newAdminRegistration.MobilePhoneSuffix;
    }
    this.newAdminRegistration.URL = this.url;
    this.accountservice.CreateAdmin(this.newAdminRegistration).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertWithSuccess();
        this.getAdminList();
        this.resetDialog();
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: resp.EndUserMessage,
          width: '700',
        });
        this.resetDialog();
      }
    })
  }

  alertWithSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Thank you for registering for an EHR1 Account! An email with instructions for how to complete  setup of your account has been sent to ' + this.newAdminRegistration.Email,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '700',
    });
  }

  disableAdminRegistration() {
    return !(this.newAdminRegistration.Title == undefined ? '' : this.newAdminRegistration.Title != ''
      && this.newAdminRegistration.FirstName == undefined ? '' : this.newAdminRegistration.FirstName != ''
        && this.newAdminRegistration.LastName == undefined ? '' : this.newAdminRegistration.LastName != ''
          && this.newAdminRegistration.Role == undefined ? '' : this.newAdminRegistration.Role != ''
            && this.newAdminRegistration.PrimaryPhonePreffix == undefined ? '' : this.newAdminRegistration.PrimaryPhonePreffix != ''
              && this.newAdminRegistration.PrimaryPhoneSuffix == undefined ? '' : this.newAdminRegistration.PrimaryPhoneSuffix != ''
                && this.newAdminRegistration.Email == null ? '' : this.newAdminRegistration.Email != '')
  }

  resetDialog() {
    this.newAdminRegistration = new AdminRegistration;
  }

  onSelectedMobileCode(code: string) {
    this.newAdminRegistration.MobilePhoneCode = code;
  }

  onSelectedPrimaryPhoneCode(code: string) {
    this.newAdminRegistration.PrimaryPhonePreffix = code;
  }

  DeleteAdmin(AdminId: string) {
    this.accountservice.DeleteAdmin({ AdminId: AdminId }).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M1A003"]);
        this.getAdminList();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E1A001"]);
      }
    })
  }
}
