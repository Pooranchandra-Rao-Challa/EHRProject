import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


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
    private route: ActivatedRoute) {
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


}
