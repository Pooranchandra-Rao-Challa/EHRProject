import { User } from 'src/app/_models';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../_services/authentication.service';
import { ViewChangeService } from '../provider.layout/view.notification.service';
@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit {
  isSubscribe: boolean = false;
  currentView: string = "Smart Schedule"
  showemail: boolean = environment.showemail;
  user: User
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private viewChangeService: ViewChangeService,) {
    this.user = authenticationService.userValue;
    if (authenticationService.viewModel.View)
      this.currentView = authenticationService.viewModel.View;
    viewChangeService.getData().subscribe(view => this.currentView = view);
  }

  ngOnInit(): void {

  }

  onEmailURLs() {
    this.router.navigate(["account/emailedurls"]);
  }

  onHome() {
    this.viewChangeService.sendData('Smart Schedule');
  }

  get TrailText() {
    return `Your Trial Period Ends in ${this.user.TrialDaysLeft.valueOf()} day(s)`;
  }

}
