import { PlatformLocation } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ViewModel } from '../../_models/_account/registration';
import { AdminRegistration, Admins, AreaCode } from 'src/app/_models/_admin/admins';
import { Accountservice } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import Swal from 'sweetalert2';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { TwoFAToggleComponent } from './twofa.toggle.component';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';
import { Actions } from 'src/app/_models';
import { OverlayService } from 'src/app/overlay.service';

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
  AreaCodes: AreaCode[];
  phonePattern = /^[0-9]{10}/;
  emailPattern = /^[A-Za-z0-9._-]+[@][A-Za-z0-9._-]+[\.][A-Za-z]{2,4}$/;
  emailVerfied?: boolean = null;
  emailVerficationMessage?: string;
  pageSize: number = 10;
  page: number = 1;
  adminListBehaviour: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  alertMsgTitle: string;
  alertTextEmail: string;
  dialogIsLoading:boolean = false;
  twoFAToggleComponent = TwoFAToggleComponent;
  constructor(private overlayService: OverlayService,
    private adminservice: AdminService,
    private utilityService: UtilityService,
    private accountservice: Accountservice,
    private plaformLocation: PlatformLocation,
    private router: Router,
    private alertmsg: AlertMessage) {
    this.url = `${plaformLocation.protocol}//${plaformLocation.hostname}:${plaformLocation.port}/`;

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
    this.getAdminList();
    this.loadDefaults();
  }


  getAdminList() {
    this.dialogIsLoading = true;
    this.adminservice.AdminList().subscribe(resp => {
      this.dialogIsLoading = false;

      if (resp.IsSuccess) {
        this.adminDataSource = resp.ListResult;
      }
      else {
        this.adminListBehaviour.next(true);
        this.adminDataSource = [];
      }
    });
  }

  loadDefaults() {
    this.utilityService.Titles().subscribe(resp => {
      if (resp.IsSuccess) {
        this.titles = JSON.parse(resp.Result);
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
  phoneReg = /(?<begin>^[+]\d{1})?(?<left>\d{3})(?<middle>\d{3})(?<right>\d{4})/;
  isView(item: Admins) {
    this.isSave = true;
    this.isAddAdmin = false;
    this.newAdminRegistration.AdminId = item.AdminId;
    this.newAdminRegistration.Role = item.Role;
    this.newAdminRegistration.Title = item.Title && (item.Title[0].toUpperCase() + item.Title.slice(1));
    this.newAdminRegistration.AltEmail = item.AltEmail;
    this.newAdminRegistration.Email = item.Email;
    this.newAdminRegistration.FirstName = item.FirstName;
    this.newAdminRegistration.LastName = item.LastName;
    this.newAdminRegistration.MiddleName = item.MiddleName;
    this.newAdminRegistration.UserId = item.UserId;
    if(this.phoneReg.test(item.PrimaryPhone)){
      let result = this.phoneReg.exec(item.PrimaryPhone);
      this.newAdminRegistration.PrimaryPhonePreffix = result.groups["left"];
      this.newAdminRegistration.PrimaryPhoneSuffix = `${result.groups["middle"]}${result.groups["right"]}`;
    }else{
      this.newAdminRegistration.PrimaryPhonePreffix = '';
      this.newAdminRegistration.PrimaryPhoneSuffix = '';
    }
    if(this.phoneReg.test(item.MobilePhone)){
      let result = this.phoneReg.exec(item.MobilePhone);
      this.newAdminRegistration.MobilePhonePreffix = result.groups["left"];
      this.newAdminRegistration.MobilePhoneSuffix = `${result.groups["middle"]}${result.groups["right"]}`;
    }else{
      this.newAdminRegistration.MobilePhonePreffix = '';
      this.newAdminRegistration.MobilePhoneSuffix = '';
    }
    this.checkEmailExistance();
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
        if (this.newAdminRegistration.AdminId) {
          this.alertMsgTitle = 'User Updated Successfully ';
          this.alertTextEmail = '';
        }
        else {
          this.alertMsgTitle = 'Thank you for registering for an EHR1 Account! An email with instructions for how to complete  setup of your account has been sent to ';
          this.alertTextEmail = this.newAdminRegistration.Email;
        }
        this.alertWithSuccess();
        this.getAdminList();
        this.resetDialog();
      }
      else {
        Swal.fire({
          title: 'resp.EndUserMessage,',
          width: '700',
          customClass: {
            cancelButton: 'admin-cancel-button',
            title: "admin-swal2-styled"
          },
          background: '#f9f9f9',
          showCancelButton: true,
          cancelButtonText: 'Close',
          showConfirmButton: false,
          backdrop: true,
        });
        this.resetDialog();
      }
    })
  }

  alertWithSuccess() {
    Swal.fire({
      title: this.alertMsgTitle + this.alertTextEmail,
      width: '700',
      customClass: {
        cancelButton: 'admin-cancel-button',
        title: "admin-swal2-styled"
      },
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      showConfirmButton: false,
      backdrop: true,
    });
  }

  checkEmailExistance() {

    if (this.emailPattern.test(this.newAdminRegistration.Email))
      this.accountservice.CheckEmailAvailablity({ Email: this.newAdminRegistration.Email, AdminId: this.newAdminRegistration.AdminId }).subscribe((resp) => {
        this.emailVerfied = resp.IsSuccess;
        if (this.newAdminRegistration.AdminId == null) {
          this.emailVerficationMessage = resp.EndUserMessage
        }
      })
    else this.emailVerfied = null;
  }
  disableAdminRegistration() {
    // this.newAdminRegistration.MobilePhonePreffix = this.newAdminRegistration.MobilePhonePreffix == undefined ? '' : this.newAdminRegistration.MobilePhonePreffix;
    // let mNo = this.newAdminRegistration.MobilePhonePreffix ?? '' + this.newAdminRegistration.MobilePhoneSuffix ?? '';
    let mNo = this.newAdminRegistration.MobilePhonePreffix + this.newAdminRegistration.MobilePhoneSuffix;
    let pNo = this.newAdminRegistration.PrimaryPhonePreffix + this.newAdminRegistration.PrimaryPhoneSuffix;
    return !((this.emailVerfied == true) && this.newAdminRegistration.Title
      && this.newAdminRegistration.FirstName
      && this.newAdminRegistration.LastName
      && this.newAdminRegistration.Role
      && (this.phonePattern.test(pNo))
      && (this.emailPattern.test(this.newAdminRegistration.Email))
      && (this.newAdminRegistration.AltEmail == null || this.newAdminRegistration.AltEmail == ''
        || (this.emailPattern.test(this.newAdminRegistration.AltEmail)))
      && ((!this.newAdminRegistration.MobilePhonePreffix && !this.newAdminRegistration.MobilePhoneSuffix) ||
        (this.phonePattern.test(mNo))))
  }
  // && (mNo == undefined || mNo == "" || (this.phonePattern.test(mNo)))

  resetDialog() {
    this.newAdminRegistration = new AdminRegistration();
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
        this.alertmsg.displayErrorDailog(ERROR_CODES["M1A003"]);
        this.getAdminList();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E1A001"]);
      }
    })
  }

  async DeleteConfirmation(item){
    Swal.fire({
      title: 'Delete admin user confirmation',
      html: `<p class='swal-admin-message'>Are you sure to delete <span class='swal-admin-message2'>${item.Title} ${item.FirstName} ${item.LastName}</span><p>`,

      padding: '1px !important',
      customClass: {
        title: 'swal-admin-modal-header swal-admin-header-font',
        cancelButton: 'swal-admin-cancel-button swal-admin-cancel-button1',
        confirmButton: 'swal-admin-confirm-button swal-admin-confirm-button1'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      confirmButtonText: 'Okay-Delete!',
      backdrop: true,



    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this. DeleteAdmin(item.AdminId)
      }
    })
  }

  ToggleDuo(admindata){
    this.openComponentDialog(this.twoFAToggleComponent,admindata,Actions.edit)
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string, dialogData, action: Actions = Actions.add) {
    let reqdata: any;
    if (action == Actions.edit && content === this.twoFAToggleComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      if (content === this.twoFAToggleComponent) {
        this.getAdminList();
      }

    });
  }

}
