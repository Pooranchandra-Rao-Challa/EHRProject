import { Component, OnInit, TemplateRef } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { AdminService } from 'src/app/_services/admin.service';
import { ComponentType } from '@angular/cdk/portal';
import { AddUserDialogComponent } from 'src/app/dialogs/adduser.dialog/adduser.dialog.component';
import { ProviderList } from 'src/app/_models/_admin/providerList';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageSize: number = 50;
  page: number = 1;
  ProviderList: any = [];
  TotalItems: number;
  UserDialogComponent = AddUserDialogComponent;
  DialogResponse = null;
  FitlerActiveStatus: any = [];
  Active: boolean = true;
  Suspended: boolean = false;
  NotPaidChecked: boolean = false;
  PaidChecked: boolean = false;
  ActiveStatus: string = 'Active';
  TrailStatus: string = '';
  ProviderColumnList: ProviderList[];
  AlterStatus: any;
  GetFilterList: any;
  SearchKey = "";
  Status: boolean;
  ClinicId:any=null;

  constructor(private adminservice: AdminService, private overlayService: OverlayService) { }

  ngOnInit(): void {
    this.GetProivderList();
  }

  GetProivderList() {
    var reqparams = {
      ClinicId: this.ClinicId
    }
    console.log(reqparams);

    this.adminservice.GetProviderList(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        this.ProviderList.map((e) => {
          if (e.Trial == 'Trial') {
            e.ToggleButton = false;
          }
          else {
            e.ToggleButton = true;
          }
          if (e.ActiveStatus == 'Active') {
            e.Status = true;
          }
          else {
            e.Status = false;
          }
          if (e.Trial == 'Trial') {
            e.Paid = true;

          }
          else {
            e.Paid = false;
          }
        });
        console.log(this.ProviderList);
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
          if (e.ActiveStatus == 'Active') {
            this.AlterStatus = 'Suspend'
          }
          else if (e.ActiveStatus == 'Suspended') {
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
    this.ProviderList = this.GetFilterList.filter((invoice) => this.isMatch(invoice));
  }

  isMatch(item) {
    debugger;
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1
    }
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
        //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.UserDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }

  ExpandProvider(clientid)
  {
     this.ClinicId = clientid;
     this.GetProivderList();
  }
}
