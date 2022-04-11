import { Component, OnInit } from '@angular/core';
import { ProviderData } from 'src/app/_models/Admin.ts/Providedata';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-practice',
  templateUrl: './admin-practice.component.html',
  styleUrls: ['./admin-practice.component.scss']
})
export class AdminPracticeComponent implements OnInit {

  pageSize = 50;
  page = 0;
  data: any[] = [];
  // provide:ProviderData=new ProviderData();

  ProviderList: any;
  GetFilterList: any;
  FitlerGetStatus: any = [];
  ActiveStatus: boolean = false
  SuspendedStatus: boolean = false;
  FilterTrialPaid: any = [];
  NotPaidChecked: boolean = false;
  PaidChecked: boolean = false;

  constructor(private adminservice: AdminService) { }

  ngOnInit(): void {
    this.GetProivderList();
  }

  GetProivderList() {
    this.adminservice.GetProviders().subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        this.ProviderList.map((e) => {
          if (e.Trial.toLowerCase() == 'trial') {
            e.Trial = 'Not Paid';
          }
          else {
            e.Trial = 'Paid';
          }
        });
        this.GetFilterList = this.ProviderList;
      }
    });
  }

  FilterStatus() {
    debugger;
    if (this.SuspendedStatus == true) {
      this.ActiveStatus = false;
      this.ProviderList = this.GetFilterList;
      this.FitlerGetStatus = this.ProviderList.filter(x =>
        (x.ActiveStatus === 'Suspended')
      );
      this.ProviderList = this.FitlerGetStatus;
    }
    else if (this.ActiveStatus == true) {
      this.SuspendedStatus = false;
      this.ProviderList = this.GetFilterList;
      this.FitlerGetStatus = this.ProviderList.filter(x =>
        (x.ActiveStatus === 'Active')
      );
      this.ProviderList = this.FitlerGetStatus;
    }
    else {
      this.GetProivderList();
    }
  }



  FilterTrailPaid() {
    debugger;
    if(this.PaidChecked == true) {
      this.NotPaidChecked = false;
      this.ProviderList = this.GetFilterList;
      this.FilterTrialPaid = this.ProviderList.filter(x =>
        (x.Trial === 'Paid')
      );
      this.ProviderList = this.FilterTrialPaid;
    }
    else if(this.NotPaidChecked == true) {
      this.NotPaidChecked = true;
      this.PaidChecked = false;
      this.ProviderList = this.GetFilterList;
      this.FilterTrialPaid = this.ProviderList.filter(x =>
        (x.Trial === 'Not Paid')
      );
      this.ProviderList = this.FilterTrialPaid;
    }
    else {
      this.GetProivderList();
    }
  }
}
