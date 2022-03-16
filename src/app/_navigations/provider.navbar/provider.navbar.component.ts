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
  public locationarray: any[] = [];
  locationIdarray: any;
  providerlocation: any;
  req1: any;
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
    this.getlocations();

  }
  getlocations() {
    var location = this.user.LocationName;
    this.locationarray = location.split(',');
    for (var i = 0; i < this.locationarray.length; i++) {
      this.locationarray[i] = this.locationarray[i].replace(/^\s*/, "").replace(/\s*$/, "");
    }
    this.change('');
  }
  change(req: any) {
    this.req1 = req == "" ? 0 : req;
    var locationId = this.user.LocationId;
    this.locationIdarray = locationId.split(',');
    for (var i = 0; i < this.locationIdarray.length; i++) {
      this.locationIdarray[i] = this.locationIdarray[i].replace(/^\s*/, "").replace(/\s*$/, "");
    }
    this.providerlocation = this.locationIdarray[this.req1];
    localStorage.setItem('providerlocation', this.providerlocation);
  }
  logout() {
    this.authenticationService.logout();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
