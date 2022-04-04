import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';


@Component({
  selector: 'menu-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user: User;
  locationsubscription: Subscription;
  view: string;
  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router:Router) {
    this.user = this.authService.userValue;
    /*this.locationsubscription = this.locationSelectService.getData().subscribe(locationId => {
        console.log("From Header:"+locationId);
        ,
    private locationSelectService: LocationSelectService
    });*/
  }
  /*ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.locationsubscription.unsubscribe();
  }*/
  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.view = params.view;
      }
      );
  }
  onChangePractice(name,url){
     this.router.navigate(
       [url],
       {queryParams:{name:name,view:'practice'}}
     );
  }
  onChangeSchedule(name,url){   
   debugger;
      this.router.navigate(
        [url],
        { queryParams: { name: name,view:'schedule'  } }
      );   
  }
  onChangeAccessPermission(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'accesspermission'}}
    );
  }
  onChangePatient(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'patient'}}
    );
  }
  onChangeMessages(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'message'}}
    );
  }
  onChangeeRx(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'erx'}}
    );
  }
  onChangelabmapping(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'labmapping'}}
    );
  }
  onChangeReports(name,url)
  {
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'reports'}}
    );
  }

  onChangeClinicDecision(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'clinicdecision'}}
    );
  }
  onChangePatientednmaterial(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'patientednmaterial'}}
    );
  }
  onChangeAuditlog(name,url){
    this.router.navigate(
      [url],
      {queryParams:{name:name,view:'auditlog'}}
    );
  }
}
