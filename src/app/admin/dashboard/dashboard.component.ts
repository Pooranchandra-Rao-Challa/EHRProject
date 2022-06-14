import { Subscription } from 'rxjs';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { AdminService } from 'src/app/_services/admin.service';
import { ComponentType } from '@angular/cdk/portal';
import { AddUserDialogComponent } from 'src/app/dialogs/adduser.dialog/adduser.dialog.component';
import { ProviderList } from 'src/app/_models/_admin/providerList';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Router } from '@angular/router';


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
  displayAccess: string;
  Id: any;

  provideraccess: any;
  Locked: boolean;
  displayHeading: string;
  primaryProviderModal='none';
  lockedModal ='none';
  AccessProvider='none';
  message: string;

  constructor(private adminservice: AdminService, private overlayService: OverlayService, private router: Router, private alertmsg: AlertMessage) { }

  ngOnInit(): void {
    this.GetProivderList();
  }

  GetProivderList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        console.log(this.ProviderList);
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
          if (e.primary_provider == true) {
            e.primaryprovider = 'Remove as Primary';
            this.displayAccess = 'Remove as Primary';
          }
          else {
            e.primaryprovider = 'Assign as Primary';
            this.displayAccess = 'Assign as Primary';
          }
          if (e.Locked == true) {
            e.lock = 'Unlock';
          }
          else {
            e.lock = 'Lock';
          }
        });
        this.ProviderColumnList = resp.ListResult;
        this.ProviderColumnList.map((e) => {
          if (e.Trial.toLowerCase() == 'trial') {
            e.Trial = 'Trail';
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
    //debugger;
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
    this.ProviderList = this.GetFilterList.filter((invoice) => this.isMatch(invoice));
  }

  isMatch(item) {
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1
    }
  }

  // get providerId
  primaryProviderId(item) {
    this.primaryProviderModal='block';
    this.Id = item.ProviderId;
    this.provideraccess = !item.primary_provider;
    if(item.primary_provider == true){
      this.displayAccess = 'Remove as Primary';
      this.message = 'remove';
    }
    else{ this.displayAccess = 'Assign as Primary'
    this.message = 'assign';
   }
}
  // updte provider access
  providerPrimaryAccess() {
    debugger;
    let reqparam =
    {
      ProviderId: this.Id,
      Accesss: this.provideraccess
    }
    this.adminservice.UpdateAccessProvider(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.primaryProviderModal='none';
        this.GetProivderList();
        this.AccessProvider='block';
      }
    });
  }

  // update trail/paid provider
  changeTraiPaidStatus(item) {
    debugger;
    let trailvalue;
    if (item.Trial == 'Trail') {
      trailvalue = null;
    }
    else{
      trailvalue = 0;
    }
    let reqparam = {
      "ProviderId": item.ProviderId,
      "Trail": trailvalue
    }
    console.log(reqparam);
    this.adminservice.UpdatedTrailStatus(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.GetProivderList();
      }
    })
  }

  // update user locked/unlocked
  updateUserlock(item) {
    let msg= item.lock
    this.Locked = !item.Locked;
    let reqparam =
    {
      UserId: item.UserId,
      Locked: this.Locked
    }
    this.adminservice.UpdateLockedUser(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.displayHeading = msg;
        this.GetProivderList();
         this.lockedModal='block';
      }
    });
  }

  closelockedModal(){ this.lockedModal='none';}

  closeAccessProvider(){this.AccessProvider='none';}

  providerLogin(item) {
    if (item.Trial == 'Paid' || item.lock == 'Unlock') {
      // this.router.navigate(['/account/login']);
      // this.alertmsg.displayMessageDailog(ERROR_CODES["M1P001"])
    }
    if (item.Trail == 'Not Paid' || item.lock == 'lock') {
      //this.router.navigate(['/provider/smartschedule']);
    }
    if (item.Trail == 'Not Paid' || item.lock == 'Unlock') {
      //this.router.navigate(['/provider/smartschedule']);
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

}
