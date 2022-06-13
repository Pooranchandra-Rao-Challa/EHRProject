import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { User,ViewModel } from '../../_models';
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
  viewModel: ViewModel;
  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router:Router) {
    this.user = this.authService.userValue;
    this.viewModel = authService.viewModel;
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
    // this.route.queryParams
    //   .subscribe(params => {
    //     this.view = params.view;
    //   }
    //   );
  }

  onChangeViewState(view){

    this.authService.SetViewParam("SubView",view);
    this.viewModel = this.authService.viewModel;
    this.router.navigate(
      ['/provider/settings'],
    );
  }

}
