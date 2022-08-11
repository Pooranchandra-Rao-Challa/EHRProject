import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { Actions, NewUser, User, UserLocations, ViewModel } from '../../_models';
import { ViewChangeService } from '../provider.layout/view.notification.service';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from 'src/app/overlay.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UserDialogComponent } from 'src/app/dialogs/user.dialog/user.dialog.component';
@Component({
  selector: 'provider-app-navbar',
  templateUrl: './provider.navbar.component.html',
  styleUrls: ['./provider.navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class ProviderNavbarComponent implements OnInit {

  navbarOpen: boolean = false;
  user: User;
  locationsInfo: UserLocations[];
  currentLocation: string;
  @Output() LocationChanged = new EventEmitter<String>();
  @Output() Bredcrumchanged = new EventEmitter<String>();
  view: string;
  name: string;
  viewModel: ViewModel;
  userDialogComponent = UserDialogComponent
  constructor(private route: ActivatedRoute,
    config: NgbDropdownConfig, private router: Router,
    private authenticationService: AuthenticationService,
    public overlayService: OverlayService,
    private settingsService: SettingsService,
    private viewChangeService: ViewChangeService) {
    config.placement = 'bottom-right';


    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.user.CurrentLocation = this.locationsInfo[0].LocationId;
    this.viewModel = authenticationService.viewModel;
  }

  ngOnInit() {
    this.name = 'Smart Schedule';
    this.viewChangeService.getData().subscribe(value => {
      this.name = value;
      this.authenticationService.SetViewParam("View", value)
      this.viewModel = this.authenticationService.viewModel;

    });
  }

  changeLocation(locationId) {
    this.user.CurrentLocation = locationId;
    this.LocationChanged.emit(locationId);
  }

  logout() {
    this.authenticationService.logout();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  onChangeBreadCrum(url: string, name: string, view?: string,) {
    this.authenticationService.SetViewParam("View", name)
    if (view != null) {
      this.authenticationService.SetViewParam("SubView", view)
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
      this.openComponentDialog(this.userDialogComponent,UserInfo,Actions.view)
    });
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    const ref = this.overlayService.open(content, data);
    ref.afterClosed$.subscribe(res => {
    });
  }

}
