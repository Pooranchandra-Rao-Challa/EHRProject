import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations } from '../../_models';
declare var $: any;
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-navbar',
  templateUrl: './patient.navbar.component.html',
  styleUrls: ['./patient.navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class PatientNavbarComponent implements OnInit {
  navbarOpen: boolean = false;
  user: User;
  locationsInfo: UserLocations[];
  currentLocation: string;
  view: string = 'dashboard';

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute) {
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    //this.currentLocation = this.locationsInfo[0].locationId;
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params.view != undefined) {
          this.view = params.view;
        }
        else {
          this.view = this.view;
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
