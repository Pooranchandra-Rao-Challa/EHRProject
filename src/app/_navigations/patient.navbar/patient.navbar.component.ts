import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations } from '../../_models';
import { ActivatedRoute, Router } from '@angular/router';
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
  name: string;

  constructor(private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) {
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

  onChangeBreadCrum(url: string, name: string, view?: string,) {
    debugger;
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
    this.name = name;
  }
}
