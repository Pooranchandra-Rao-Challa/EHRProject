import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models';
import { Accountservice } from '../../_services/account.service';


@Component({
  selector: 'provider-app-navbar',
  templateUrl: './provider.navbar.component.html',
  styleUrls: ['./provider.navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class ProviderNavbarComponent implements OnInit {
  navbarOpen: boolean = false;
  user: User;
  constructor(
    config: NgbDropdownConfig, private router: Router,
    private authenticationService: AuthenticationService) {
    config.placement = 'bottom-right';
    this.user = authenticationService.userValue;
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
