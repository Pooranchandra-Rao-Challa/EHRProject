import { User } from 'src/app/_models';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { DrfirstUrlChanged, ViewChangeService } from '../provider.layout/view.notification.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { DrfirstService } from 'src/app/_services/drfirst.service';
@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  isSubscribe: boolean = false;
  currentView: string = "Smart Schedule"
  user: User;
  drfirstProviderMessageUrl:string;
  drfirstProviderReportUrl:string;
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private drfirstService: DrfirstService,
    private viewChangeService: ViewChangeService,
    private drfirstUrlChanged: DrfirstUrlChanged,) {
    this.user = authenticationService.userValue;
    if (authenticationService.viewModel.View)
      this.currentView = authenticationService.viewModel.View;
    viewChangeService.getData().subscribe(view => this.currentView = view);
  }

  ngOnInit(): void {
    this.drfirstService.ProviderUrl('message');
    this.drfirstUrlChanged.getData().subscribe((data) => {
      if(data.urlfor=="Provider" && data.purpose=="message")
        this.drfirstProviderMessageUrl = data.url
    });
    this.drfirstService.ProviderUrl('report');
    this.drfirstUrlChanged.getData().subscribe((data) => {
      if(data.urlfor=="Provider" && data.purpose=="report")
        this.drfirstProviderReportUrl = data.url
    });
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
