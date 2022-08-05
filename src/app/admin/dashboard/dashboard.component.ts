import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject, } from 'rxjs';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { AdminService } from 'src/app/_services/admin.service';
import { ComponentType } from '@angular/cdk/portal';
import { AddUserDialogComponent } from 'src/app/dialogs/adduser.dialog/adduser.dialog.component';
import { ProviderList } from 'src/app/_models/_admin/providerList';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

export class FilterQueryParams {
  Active: boolean = true;
  Paid?: boolean = null;
  SearchTerm?: string = "";
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageSize: number = 50;
  page: number = 1;
  ProviderList: ProviderList[] = [{}];
  filterQueryParams: FilterQueryParams = new FilterQueryParams();
  filterSubject = new BehaviorSubject<FilterQueryParams>(this.filterQueryParams);
  filtededProviders: ProviderList[];
  TotalItems: number;
  UserDialogComponent = AddUserDialogComponent;
  DialogResponse = null;
  SelectedProvider: ProviderList = {};
  // FitlerActiveStatus: any = [];
  // Active: boolean = true;
  // Suspended: boolean = false;
  // NotPaidChecked: boolean = false;
  // PaidChecked: boolean = false;
  // ActiveStatus: string = 'Active';
  // TrailStatus: string = '';
  //ProviderColumnList: ProviderList[];
  //AlterStatus: any;
  //GetFilterList: any;
  //SearchKey = "";
  //  Status: boolean;
  displayAccess: string;
  Id: any;

  provideraccess: any;
  Locked: boolean;
  displayHeading: string;
  primaryProviderModal = 'none';
  lockedModal = 'none';
  AccessProvider = 'none';
  message: string;
  constructor(private adminservice: AdminService,
    private overlayService: OverlayService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage) { }

  ngOnInit(): void {
    this.GetProivderList();
    this.filterSubject.subscribe(value => {
      this.filtededProviders = this.ProviderList.filter(x =>
        (value.SearchTerm == "" || x.ProviderName.toLowerCase().match(value.SearchTerm.toLowerCase()))
        && x.Status == value.Active
        && (x.Paid == value.Paid || value.Paid == null)
      );
    })
  }

  StageChange(event) {
    if (event.target.id == 'Suspended')
      this.filterQueryParams.Active = !event.target.checked;
    else if (event.target.id == 'Active')
      this.filterQueryParams.Active = event.target.checked;
    if (event.target.id == 'Paid')
      this.filterQueryParams.Paid = event.target.checked ? true : null;
    else if (event.target.id == 'Trial')
      this.filterQueryParams.Paid = event.target.checked ? false : null;
    this.filterSubject.next(this.filterQueryParams);
  }

  GetProivderList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.ProviderList = resp.ListResult;
        this.filtededProviders = this.ProviderList.filter(x =>
          x.Status == this.filterQueryParams.Active
          && (x.Paid == this.filterQueryParams.Paid ||
            this.filterQueryParams.Paid == null)
        );
        // this.ProviderList.map((e) => {
        //   // if (e.Trial == 'Trial') {
        //   //   e.ToggleButton = false;
        //   // }
        //   // else {
        //   //   e.ToggleButton = true;
        //   // }
        //   // if (e.ActiveStatus == 'Active') {
        //   //   e.Status = true;
        //   // }
        //   // else {
        //   //   e.Status = false;
        //   // }
        //   // if (e.Trial == 'Trial') {
        //   //   e.Paid = true;
        //   // }
        //   // else {
        //   //   e.Paid = false;
        //   // }
        //   // if (e.primary_provider == true) {
        //   //   e.primaryprovider = 'Remove as Primary';
        //   //   this.displayAccess = 'Remove as Primary';
        //   // }
        //   // else {
        //   //   e.primaryprovider = 'Assign as Primary';
        //   //   this.displayAccess = 'Assign as Primary';
        //   // }
        //   // if (e.Locked == true) {
        //   //   e.lock = 'Unlock';
        //   // }
        //   // else {
        //   //   e.lock = 'Lock';
        //   // }
        // });
        //this.ProviderColumnList = resp.ListResult;
        // this.ProviderColumnList.map((e) => {
        //   // if (e.Trial.toLowerCase() == 'trial') {
        //   //   e.Trial = 'Trail';
        //   // }
        //   // else {
        //   //   e.Trial = 'Paid';
        //   // }
        // this.FitlerActiveStatus = this.ProviderList.filter(x =>
        //   (x.ActiveStatus === 'Active')
        // );
        //   // this.ProviderList = this.FitlerActiveStatus;
        //   // if (e.ActiveStatus == 'Active') {
        //   //   this.AlterStatus = 'Suspend'
        //   // }
        //   // else if (e.ActiveStatus == 'Suspended') {
        //   //   this.AlterStatus = 'Activate'
        //   // }
        // });
        //this.GetFilterList = this.ProviderList;
      } else
        this.ProviderList = [];
    });
  }

  // FilterProvider(eventType, event) {
  //   // if (eventType == 'ActiveStatus') {
  //   //   if (event == 'Active' && this.Active) {
  //   //     this.Suspended = false;
  //   //     this.ActiveStatus = 'Active';
  //   //     this.AlterStatus = 'Suspend';
  //   //   } else if (event == 'Suspended' && this.Suspended) {
  //   //     this.Active = false;
  //   //     this.ActiveStatus = 'Suspended';
  //   //     this.AlterStatus = 'Activate'
  //   //   } else {
  //   //     this.ActiveStatus = '';
  //   //   }
  //   // } else {
  //   //   if (event == 'Trial' && this.NotPaidChecked) {
  //   //     this.PaidChecked = false;
  //   //     this.TrailStatus = 'Trial';
  //   //   }
  //   //   else if (event == 'Paid' && this.PaidChecked) {
  //   //     this.NotPaidChecked = false;
  //   //     this.TrailStatus = 'Paid'
  //   //   } else {
  //   //     this.TrailStatus = '';
  //   //   }
  //   // }
  //   // if (this.ActiveStatus != '' || this.TrailStatus != '') {
  //   //   if (this.ActiveStatus != '' && this.TrailStatus == '') {
  //   //     this.ProviderList = this.ProviderColumnList.filter(x => x.ActiveStatus.toLocaleLowerCase() == this.ActiveStatus.toLocaleLowerCase());
  //   //   } else if (this.TrailStatus != '' && this.ActiveStatus == '') {
  //   //     this.ProviderList = this.ProviderColumnList.filter(x => x.Trial.toLocaleLowerCase() == this.TrailStatus.toLocaleLowerCase());
  //   //   } else {
  //   //     this.ProviderList = this.ProviderColumnList.
  //   //     filter(x => x.ActiveStatus.toLocaleLowerCase() == this.ActiveStatus.toLocaleLowerCase()
  //   //     && x.Trial.toLocaleLowerCase() == this.TrailStatus.toLocaleLowerCase());
  //   //   }
  //   // }
  //   // else {
  //   //   this.GetProivderList();
  //   // }
  // }

  // SearchDetails() {
  //   //this.ProviderList = this.GetFilterList.filter((invoice) => this.isMatch(invoice));
  //   this.filterSubject.next(this.filterQueryParams);
  // }

  // isMatch(item) {
  //   if (item instanceof Object) {
  //     return Object.keys(item).some((k) => this.isMatch(item[k]));
  //   } else {
  //     return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1
  //   }
  // }

  // get providerId
  primaryProviderId(item) {
    this.SelectedProvider = item;
    this.primaryProviderModal = 'block';
    this.freezDocument();
  }
  // updte provider access
  providerPrimaryAccess() {

    let reqparam =
    {
      ProviderId: this.SelectedProvider.ProviderId,
      Accesss: !this.SelectedProvider.IsPrimaryProvider
    }

    this.adminservice.UpdateAccessProvider(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.primaryProviderModal = 'none';
        this.GetProivderList();
        this.AccessProvider = 'block';
        this.SelectedProvider = {};
      } else {
        this.primaryProviderModal = 'none';
        this.AccessProvider = 'block';
      }
    });
  }

  okThanks() { this.clearSelectedProvider(); this.freezDocument(); }
  closeAccessProvider() { this.clearSelectedProvider(); this.freezDocument(); }
  clearSelectedProvider() {
    this.primaryProviderModal = 'none';
    this.AccessProvider = 'none';
    this.SelectedProvider = {};
  }

  freezDocument() {
    document.body.scrollBy(0, -document.body.scrollTop);
    document.body.style.overflow = "hidden";
  }
  clearDocument() {
    document.body.style.overflow = "auto";
  }
  // update trail/paid provider
  changeTraiPaidStatus(item) {
    let trailvalue;
    if (item.Trial == 'Trail') {
      trailvalue = null;
    }
    else {
      trailvalue = 0;
    }
    let reqparam = {
      "ProviderId": item.ProviderId,
      "Trail": trailvalue
    }
    this.adminservice.UpdatedTrailStatus(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.GetProivderList();
      }
    })
  }

  // update user locked/unlocked
  updateUserlock(item) {
    let msg = item.lock
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
        this.lockedModal = 'block';
      }
    });
  }

  closelockedModal() { this.lockedModal = 'none'; }



  // providerLogin(item) {
  //   if (item.Trial == 'Paid' || item.lock == 'Unlock') {
  //     // this.router.navigate(['/account/login']);
  //     // this.alertmsg.displayMessageDailog(ERROR_CODES["M1P001"])
  //   }
  //   if (item.Trail == 'Not Paid' || item.lock == 'lock') {
  //     //this.router.navigate(['/provider/smartschedule']);
  //   }
  //   if (item.Trail == 'Not Paid' || item.lock == 'Unlock') {
  //     //this.router.navigate(['/provider/smartschedule']);
  //   }
  // }

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

  switchUser(provider: ProviderList)
  {
    let switchKey: string  = provider.UserId +":" +provider.ProviderId;
    console.log(switchKey);

    this.adminservice.SwitchUserKey(provider).subscribe(resp =>{
      if(resp.IsSuccess){
        let encKey = resp.Result;
        this.authService.SwitchUser({SwitchUserKey:switchKey,SwitchUserEncKey:encKey}).subscribe(logresp =>{
          if (!logresp.IsSuccess) {

          }
        })
      }
    })


  }
}
