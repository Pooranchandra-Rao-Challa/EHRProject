import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations } from '../../_models';
//import { NGXLogger   } from 'ngx-logger';


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
  view: string;

  constructor(private route: ActivatedRoute,
    config: NgbDropdownConfig, private router: Router,
    private authenticationService: AuthenticationService) {
    config.placement = 'bottom-right';
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.user.CurrentLocation = this.locationsInfo[0].locationId;

  }

  ngOnInit() {

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
    console.log(view)
    if (view != null) {
      console.log(view)
      this.router.navigate(
        [url],
        { queryParams: { name: name, view: view } }
      );
    }

    else
      this.router.navigate(
        [url],
        { queryParams: { name: name } }
      );
  }



}
