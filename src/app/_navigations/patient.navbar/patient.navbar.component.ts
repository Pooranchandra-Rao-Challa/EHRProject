import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations } from '../../_models';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-patient-navbar',
  templateUrl: './patient.navbar.component.html',
  styleUrls: ['./patient.navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class PatientNavbarComponent implements OnInit {
  navbarOpen: boolean = false;
  user: User;
  view: string;
  locationsInfo: UserLocations[];
  currentLocation: string;

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute) {
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    //this.currentLocation = this.locationsInfo[0].locationId;
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params.view == undefined) {
          this.view = "dashboard"
        } else {
          this.view = params.view;
        }

      }
      );
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  logout() {
    this.authenticationService.logout();
  }


}
