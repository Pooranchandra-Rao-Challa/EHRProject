import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations,ViewModel } from '../../_models';
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

  constructor(private route: ActivatedRoute,
    config: NgbDropdownConfig, private router: Router,
    private authenticationService: AuthenticationService) {
    config.placement = 'bottom-right';
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.user.CurrentLocation = this.locationsInfo[0].locationId;
    this.viewModel = authenticationService.viewModel;
  }

  ngOnInit() {
    this.name = 'Smart Schedule';
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
    this.authenticationService.SetViewParam("View",name)
    if(view != null){
      this.authenticationService.SetViewParam("SubView",view)
    }
    this.viewModel = this.authenticationService.viewModel;

    if(url=='provider/patients') this.viewModel.PatientBreadCrumb = [];
    this.Bredcrumchanged.emit(name);
    this.router.navigate(
      [url],
    );

  }

}
