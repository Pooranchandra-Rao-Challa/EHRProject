import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-navbar',
  templateUrl: './patient.navbar.component.html',
  styleUrls: ['./patient.navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class PatientNavbarComponent implements OnInit {
  navbarOpen: boolean = false;
  constructor(config: NgbDropdownConfig) { }

  ngOnInit(): void {
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
