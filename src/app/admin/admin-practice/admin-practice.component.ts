import { Component, OnInit } from '@angular/core';
import { AnyTxtRecord } from 'dns';
import { providerList } from 'src/app/_models/Admin.ts/providerList';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-practice',
  templateUrl: './admin-practice.component.html',
  styleUrls: ['./admin-practice.component.scss']
})
export class AdminPracticeComponent implements OnInit {

  pageSize = 50;
  page = 0;
  GlobalSearch:any;
  ProviderList: any;
  GetFilterList: any;
  FitlerGetStatus: any = [];
  Active: boolean = false;
  Suspended: boolean = false;
  NotPaidChecked: boolean = false;
  PaidChecked: boolean = false;
  ActiveStatus: string = '';
  TrailStatus: string = '';
  ProviderColumnList: providerList[];
  SearchKey:string=" ";
  filterString = "";

  constructor(private adminservice: AdminService) { }

  ngOnInit(): void {
    this.GetProivderList();
    this.activeSataus();
  }

  GetProivderList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        this.ProviderColumnList = resp.ListResult;
        this.ProviderColumnList.map((e) => {
          if (e.Trial.toLowerCase() == 'trial') {
            e.Trial = 'Not Paid';
          }
          else {
            e.Trial = 'Paid';
          }
          this.FitlerGetStatus = this.ProviderList.filter(x =>
            (x.ActiveStatus === 'Active')
          );
          // if(e.ActiveStatus == 'Suspended'){
          //   e.ActiveStatus = 'Suspend'
          // }
        });
        this.GetFilterList = this.ProviderList;
      } else
        this.ProviderList = [];
    });
  }
  activeSataus(){
    this.Active = true;
    this.FilterProvider(this.ActiveStatus,this.Active);
  }


  FilterProvider(eventType, event) {
    debugger;
    if (eventType == 'ActiveStatus') {
      if (event == 'Active' && this.Active) {
        this.Suspended = false;
        this.ActiveStatus = 'Active';
      } else if (event == 'Suspended' && this.Suspended) {
        this.Active = false;
        this.ActiveStatus = 'Suspended'
      } else {
        this.ActiveStatus = '';
      }
    } else {
      if (event == 'Not Paid' && this.NotPaidChecked) {
        this.PaidChecked = false;
        this.TrailStatus = 'Not Paid';
      }
      else if (event == 'Paid' && this.PaidChecked) {
        this.NotPaidChecked = false;
        this.TrailStatus = 'Paid'
      } else {
        this.TrailStatus = '';
      }
    }
    if (this.ActiveStatus != '' || this.TrailStatus != '') {
      if (this.ActiveStatus != '' && this.TrailStatus == '') {
        this.ProviderList = this.ProviderColumnList.filter(x => x.ActiveStatus.toLocaleLowerCase() == this.ActiveStatus.toLocaleLowerCase());
      } else if (this.TrailStatus != '' && this.ActiveStatus == '') {
        this.ProviderList = this.ProviderColumnList.filter(x => x.Trial.toLocaleLowerCase() == this.TrailStatus.toLocaleLowerCase());
      } else {
        this.ProviderList = this.ProviderColumnList.filter(x => x.ActiveStatus.toLocaleLowerCase() == this.ActiveStatus.toLocaleLowerCase() && x.Trial.toLocaleLowerCase() == this.TrailStatus.toLocaleLowerCase());
      }
    }
    else {
      this.GetProivderList();
    }
  }



  SearchDetails() {
    debugger;
    this.ProviderList=this.GetFilterList.filter((invoice) => this.isMatch(invoice));
  }

  isMatch(item) {
    debugger;
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null?'':item.toString().indexOf(this.filterString) > -1
    }
  }

}
