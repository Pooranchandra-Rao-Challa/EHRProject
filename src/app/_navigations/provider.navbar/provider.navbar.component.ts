import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User,UserLocations } from '../../_models';
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
  constructor(
    config: NgbDropdownConfig, private router: Router,
    private authenticationService: AuthenticationService) {
    config.placement = 'bottom-right';

    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    console.log(this.locationsInfo);
    //this.logger.debug("locationInfo:" + this.locationsInfo);
  }
  ngOnInit() {


  }


  logout() {
    this.authenticationService.logout();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
