import { Router } from '@angular/router';
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

  constructor(
    config: NgbDropdownConfig, private router: Router,
    private authenticationService: AuthenticationService) {
    config.placement = 'bottom-right';
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.currentLocation = this.locationsInfo[0].locationId;
    console.log(this.locationsInfo);

  }
  ngOnInit() {

  }

  changeLocation(locationId) {
    console.log(locationId);
    this.LocationChanged.emit(locationId);

  }

  logout() {
    this.authenticationService.logout();
  }



  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
