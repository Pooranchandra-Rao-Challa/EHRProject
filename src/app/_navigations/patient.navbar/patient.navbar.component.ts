

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, UserLocations, ViewModel } from '../../_models';
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
  viewModel: ViewModel;
  @Output() Bredcrumchanged = new EventEmitter<String>();

  constructor(private authenticationService: AuthenticationService, private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router) {
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.viewModel = authenticationService.viewModel;
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
  getPatientProfile() {

    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientMyProfileByPatientId(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile = resp.ListResult[0];
      }
    });
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
}
