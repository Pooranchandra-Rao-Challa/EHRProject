import { Component, OnInit,TemplateRef } from '@angular/core';
import { AnyTxtRecord } from 'dns';
import { ProviderList } from 'src/app/_models/_admin/providerList';
import { AdminService } from 'src/app/_services/admin.service';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from './../../overlay.service';
import { AddUserDialogComponent } from 'src/app/dialogs/adduser.dialog/adduser.dialog.component';

@Component({
  selector: 'app-admin-practice',
  templateUrl: './admin-practice.component.html',
  styleUrls: ['./admin-practice.component.scss']
})
export class AdminPracticeComponent implements OnInit {

  pageSize = 50;
  page = 0;
  GlobalSearch:any;
  ProviderList: any = [];
  GetFilterList: any;
  FitlerActiveStatus: any = [];
  Active: boolean = true;
  Suspended: boolean = false;
  NotPaidChecked: boolean = false;
  PaidChecked: boolean = false;
  ActiveStatus: string = '';
  TrailStatus: string = '';
  ProviderColumnList: ProviderList[];
  SearchKey = "";
  AlterStatus:any;
  UserDialogComponent = AddUserDialogComponent;
  DialogResponse = null;

  constructor(private adminservice: AdminService,private overlayService :OverlayService) { }

  ngOnInit(): void {
   this.GetProivderList();
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
          this.FitlerActiveStatus = this.ProviderList.filter(x =>
            (x.ActiveStatus === 'Active')
          );
          this.ProviderList = this.FitlerActiveStatus;
          if(e.ActiveStatus == 'Active'){
            this.AlterStatus = 'Suspend'
          }
          else if(e.ActiveStatus == 'Suspended'){
            this.AlterStatus = 'Activate'
          }
        });
        this.GetFilterList = this.ProviderList;
      } else
        this.ProviderList = [];
    });
  }


  FilterProvider(eventType, event) {
    debugger;
    if (eventType == 'ActiveStatus') {
      if (event == 'Active' && this.Active) {
        this.Suspended = false;
        this.ActiveStatus = 'Active';
        this.AlterStatus = 'Suspend';
      } else if (event == 'Suspended' && this.Suspended) {
        this.Active = false;
        this.ActiveStatus = 'Suspended';
        this.AlterStatus = 'Activate'
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
      return item == null?'':item.toString().indexOf(this.SearchKey) > -1
    }
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
       }
      else if (content === this.UserDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }

}
