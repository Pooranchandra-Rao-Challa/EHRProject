import { User } from './../../_models/_account/user';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
//import { LoaderService } from 'src/app/_loader/loader.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin.navbar.component.html',
  styleUrls: ['./admin.navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {
  user:User

  constructor(private authenticationService: AuthenticationService) {
    authenticationService.startRefreshTokenTimer();
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
  }
}
