import { Component } from '@angular/core';
import { User, UserLocations } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isHealth:boolean=false;
  isAccees:boolean=false;
  displayReq = "none";
  displayNew = "none";
  user: User;
  locationsInfo: UserLocations[];
  constructor(private authenticationService: AuthenticationService) {

    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo)
   }

  ngOnInit(): void {
    $(document).ready(function () {
  
      $('ul.navbar-nav > li')
              .click(function (e) {
          $('ul.navbar-nav > li')
              .removeClass('active');
          $(this).addClass('active');
      });
  });
  }

  onhealth(){
    this.isAccees=false;
    this.isHealth=true;
  }
  onAcess(){
    this.isHealth=false;
    this.isAccees=true;

  }
 
}
