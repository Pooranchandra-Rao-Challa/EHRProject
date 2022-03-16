import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-patient-navbar',
  templateUrl: './patient.navbar.component.html',
  styleUrls: ['./patient.navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class PatientNavbarComponent implements OnInit {
  navbarOpen: boolean = false;
  constructor(config: NgbDropdownConfig, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  logout() {
    this.authenticationService.logout();
  }
}
