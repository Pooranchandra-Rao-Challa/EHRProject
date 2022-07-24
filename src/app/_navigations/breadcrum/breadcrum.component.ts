import { Component, Input, OnInit } from '@angular/core';
import { ViewModel } from 'src/app/_models';
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
  constructor(private authenticationService: AuthenticationService,
    private viewChangeService: ViewChangeService,) {
    if(authenticationService.viewModel.View)
      this.currentView = authenticationService.viewModel.View;
    viewChangeService.getData().subscribe(view => this.currentView = view)
  }

  ngOnInit(): void {

  }



}
