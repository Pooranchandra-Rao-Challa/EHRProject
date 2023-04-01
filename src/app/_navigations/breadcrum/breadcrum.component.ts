import { User } from 'src/app/_models';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { ViewChangeService } from '../provider.layout/view.notification.service';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  isSubscribe: boolean = false;
  currentView: string = "Smart Schedule"
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

  openMyMenu() {
    this.trigger.toggleMenu();
  }

  // closeMyMenu() {
  //   this.trigger.closeMenu();
  // }

}
