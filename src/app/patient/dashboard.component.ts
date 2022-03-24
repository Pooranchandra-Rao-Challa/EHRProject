import { Component } from '@angular/core';
import { User, UserLocations } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-patientdashboard',
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
