import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin.navbar.component.html',
  styleUrls: ['./admin.navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {


  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

  }
  logout() {
    this.authenticationService.logout();
  }
}
