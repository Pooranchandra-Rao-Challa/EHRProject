import { DrfirstService } from 'src/app/_services/drfirst.service';
import { AdminService } from './../../_services/admin.service';
import { NotifyProviderHeaderService, ProviderLocationUpdateNotifier, UpdateEmergencyAccess } from './../provider.layout/view.notification.service';
import { NotifyMessageService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { Actions, DrFirstAttributes, NewUser, User, UserLocations, ViewModel } from '../../_models';
import { ViewChangeService } from '../provider.layout/view.notification.service';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from 'src/app/overlay.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UserDialogComponent } from 'src/app/dialogs/user.dialog/user.dialog.component';
import { LockedComponent } from 'src/app/dialogs/locked/locked.component';
import { DrfirstUrlChanged } from 'src/app/_navigations/provider.layout/view.notification.service'
import { DrFirstStartUpScreens } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'provider-app-navbar',
  templateUrl: './provider.navbar.component.html',
  styleUrls: ['./provider.navbar.component.scss']
})
export class ProviderNavbarComponent implements OnInit, AfterViewInit {

  navbarOpen: boolean = false;
  user: User;
  locationsInfo: UserLocations[];
  currentLocation: string;
  @Output() LocationChanged = new EventEmitter<String>();
  @Output() Bredcrumchanged = new EventEmitter<String>();
  view: string;
  name: string;
  viewModel: ViewModel;
  userDialogComponent = UserDialogComponent;
  unreadMails: number;
  urgentMails: number;
  lockedComponent = LockedComponent;
  menuwidth: number;
  providersDataSource: NewUser[];
  drfirstProviderUrl: string;
  drFirstAttributes: DrFirstAttributes;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public overlayService: OverlayService,
    private settingsService: SettingsService,
    private viewChangeService: ViewChangeService,
    private notifyMessage: NotifyMessageService,
    private notifyProviderHeader: NotifyProviderHeaderService,
    private notifyEmergencyAccess: UpdateEmergencyAccess,
    private drfirstService: DrfirstService,
    private drfirstUrlChanged: DrfirstUrlChanged,
    private adminservice: AdminService,
    private chdetref: ChangeDetectorRef,
    private uplodateLocations: ProviderLocationUpdateNotifier) {
    // config.placement = 'bottom-right';
    authenticationService.startRefreshTokenTimer();
    this.user = authenticationService.userValue;
    this.unreadMails = this.user.UnReadMails;
    this.urgentMails = this.user.UrgentMessages;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.user.CurrentLocation = this.locationsInfo[0].LocationId;
    this.viewModel = authenticationService.viewModel;
    this.drFirstAttributes = this.authenticationService.GetDrFirstAttributes();
    //
  }

  ngOnInit() {
    this.name = 'Smart Schedule';
    this.viewChangeService.getData().subscribe(value => {
      this.name = value;
      this.authenticationService.SetViewParam("View", value)
      this.viewModel = this.authenticationService.viewModel;

    });
    this.notifyMessage.getData().subscribe(value => {
      this.unreadMails = value.UnreadCount;
      this.urgentMails = value.UrgentCount;
    });
    this.notifyProviderHeader.getData().subscribe(value => {
      this.user.FirstName = value.FirstName;
      this.user.LastName = value.LastName;
    });
    this.uplodateLocations.getData().subscribe(value => {
      if (value) {
        var reqparams = {
          ProviderId: this.user.ProviderId,
        }
        this.settingsService.ProviderPracticeLocations(reqparams).subscribe(resp => {
          if (resp.IsSuccess) {
            this.locationsInfo = resp.ListResult as UserLocations[];
            this.user.LocationInfo = JSON.stringify(this.locationsInfo)
            this.authenticationService.UpdateUser(this.user);
          }
        });
      }
    })

    this.drfirstUrlChanged.getData().subscribe((data) => {
      if (data.urlfor == "Provider" && DrFirstStartUpScreens.Report == data.purpose) {

        window.open(data.url, 'mozillaTab');
      }
    });
    this.drfirstUrlChanged.hasData().subscribe(noData => {
      if (noData)
        Swal.fire({
          title: 'eRx Not Registered !!!',
          html: `<p class="swal-title-message">Register with Dr. First Services.</p>`,
          showDenyButton: false,
          showCancelButton: true,
          showConfirmButton: false,
          confirmButtonColor: '#FF810E',
          confirmButtonText: 'View Progress Note',
          cancelButtonText: 'Close',
          allowOutsideClick: false,
          customClass: {
            cancelButton: 'swal2-error',
            popup: 'swal2-success-popup',
            container: ['swal2-container-high-zindex'],
          }
        })
    });
  }

  OpenProviderIPrescribe() {
    this.drfirstService.ProviderUrl(DrFirstStartUpScreens.Report);
  }
  ngAfterViewInit(): void {
    this.menuwidth = (document.getElementById('UserDropdown').clientWidth + (this.user.EmergencyAccess ? 30 : 8));
    var usernavbar = document.getElementsByClassName("user-nav-bar-normal");
    if (usernavbar == null || usernavbar.length == 0)
      usernavbar = document.getElementsByClassName("user-nav-bar-access");
    if (usernavbar != null && usernavbar.length == 1)
      if (usernavbar[0].getAttribute("style") == null) {
        usernavbar[0].setAttribute("style", "width:" + this.menuwidth + "px");
      }

    this.chdetref.detectChanges();
  }
  changeLocation(locationId) {
    this.user.CurrentLocation = locationId;
    this.LocationChanged.emit(locationId);
  }

  logout() {
    this.authenticationService.logout();
  }

  public get KeyParam(): string {
    return this.user.UserId + ',' + this.user.ProviderId
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  onChangeBreadCrum(url: string, name: string, view?: string,) {
    this.authenticationService.SetViewParam("View", name)
    if (view != null) {
      if (!this.CanViewPractice) this.authenticationService.SetViewParam("SubView", 'accesspermission')
      else this.authenticationService.SetViewParam("SubView", view)
    }
    this.viewModel = this.authenticationService.viewModel;

    if (url == 'provider/patients') this.viewModel.PatientBreadCrumb = [];
    this.Bredcrumchanged.emit(name);
    this.router.navigate(
      [url],
    );

  }

  GetUserInfoData() {
    var reqparams = {
      UserId: this.user.UserId,
      LoginProviderId: this.user.ProviderId,
      ClinicId: this.user.ClinicId
    }
    this.settingsService.UserInfoWithPracticeLocations(reqparams).subscribe(resp => {
      let UserInfo = resp.Result as NewUser;
      UserInfo.LocationInfo = JSON.parse(resp.Result.LocationInfo);
      this.openComponentDialog(this.userDialogComponent, UserInfo, Actions.view)
    });
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    const ref = this.overlayService.open(content, data);
    ref.afterClosed$.subscribe(res => {
    });
  }

  updateUserLock() {
    let reqparam =
    {
      UserId: this.user.UserId,
      Locked: true
    }
    this.adminservice.UpdateLockedUser(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        let unLockToken = resp.Result;
        this.authenticationService.userValue.UserLocked = reqparam.Locked;
        this.authenticationService.userValue.UnlockToken = unLockToken;
        localStorage.setItem('user', JSON.stringify(this.authenticationService.userValue as User));
        this.openComponentDialog(this.lockedComponent, this.authenticationService.userValue, Actions.view);
      }
    });
  }

  deactivateEmergencyAccess() {
    var reqparams = {
      fieldToUpdate: 'EmergencyAccess',
      user: {
        FirstName: this.user.FirstName,
        UserId: this.user.UserId,
        EmergencyAccess: false
      }
    }
    this.settingsService.ToggleUserFieldValues(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.user.EmergencyAccess = false;
        this.notifyEmergencyAccess.sendData(this.user.EmergencyAccess);
        this.authenticationService.UpdateEmergencyAccess();
        // this.getProviderDetails();
      }
    });
  }

  // get display User Details
  getProviderDetails() {
    var reqparams = {
      ClinicId: this.user.ClinicId
    }
    this.settingsService.ClinicProviders(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.providersDataSource = resp.ListResult as NewUser[];
      } else this.providersDataSource = [];
    });
  }

  // Access Permissions

  get CanViewEmailMessage(): boolean {
    var permissions = this.authenticationService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "EmailMessagePolicy" && fn.MethodName == "show")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

  get CanViewSettings(): boolean {
    var permissions = this.authenticationService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "SettingPolicy" && fn.MethodName == "show")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

  get CanViewPractice(): boolean {
    var permissions = this.authenticationService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "PracticePolicy" && fn.MethodName == "show")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

}
