import { SettingsService } from './../../_services/settings.service';
import { DrFirstNotificationsData, User } from 'src/app/_models';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { DrfirstUrlChanged, ViewChangeService } from '../provider.layout/view.notification.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { DrfirstService } from 'src/app/_services/drfirst.service';
import { DrFirstStartUpScreens } from 'src/environments/environment';
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
  drfirstProviderMessageUrl: string;
  drfirstProviderReportUrl: string;
  notifications: DrFirstNotificationsData = {};
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private drfirstService: DrfirstService,
    private viewChangeService: ViewChangeService,
    private drfirstUrlChanged: DrfirstUrlChanged,
    private settingsService: SettingsService) {
    this.user = authenticationService.userValue;
    if (authenticationService.viewModel.View)
      this.currentView = authenticationService.viewModel.View;
    viewChangeService.getData().subscribe(view => this.currentView = view);
  }

  ngOnInit(): void {

    this.drfirstUrlChanged.getData().subscribe((data) => {
      if (data.urlfor == "Provider" && data.purpose == DrFirstStartUpScreens.Message)
        this.drfirstProviderMessageUrl = data.url
      else if (data.urlfor == "Provider" && data.purpose == DrFirstStartUpScreens.Report)
        this.drfirstProviderReportUrl = data.url
    });
    this.settingsService.DrFirstNotifications(this.user.ProviderId).subscribe(resp => {
      if (resp.IsSuccess) {
        if (resp.Result != null)
          this.notifications = resp.Result as DrFirstNotificationsData;
        else {
          this.notifications = {};
          this.notifications.Error = '0';
          this.notifications.Refill = '0';
          this.notifications.RxPending = '0';
        }
      } else {
        this.notifications = {};
        this.notifications.Error = '0';
        this.notifications.Refill = '0';
        this.notifications.RxPending = '0';
      };
    })
    this.drfirstService.ProviderUrl(DrFirstStartUpScreens.Message);
    this.drfirstService.ProviderUrl(DrFirstStartUpScreens.Report);
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
