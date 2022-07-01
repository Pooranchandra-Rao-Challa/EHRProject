import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations } from '../../_models';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PatientService } from 'src/app/_services/patient.service';
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
  PatientProfile: PatientProfile;
  constructor(private authenticationService: AuthenticationService,private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router) {
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    //this.currentLocation = this.locationsInfo[0].locationId;
  }

  ngOnInit(): void {
    this.name = 'dashboard';
    this.getPatientProfile();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  logout() {
    this.authenticationService.logout();
  }
  getPatientProfile(reqparam?) {

    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientMyProfileByPatientId(req).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.PatientProfile = resp.ListResult[0];
      }
    });
  }
  onChangeBreadCrum(url: string, name: string, view?: string,) {
    //debugger;
    // console.log(view)
    if (view != null) {
      // console.log(view)
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
