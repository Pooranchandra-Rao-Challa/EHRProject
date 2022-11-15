
import { SettingsService } from 'src/app/_services/settings.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject, } from 'rxjs';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { AdminService } from 'src/app/_services/admin.service';
import { ComponentType } from '@angular/cdk/portal';
import { AddUserDialogComponent } from 'src/app/dialogs/adduser.dialog/adduser.dialog.component';
import { ProviderList } from 'src/app/_models/_admin/providerList';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
import { Actions, NewUser } from 'src/app/_models';
import { DOCUMENT } from '@angular/common';
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
  pageSize: number = 10;
  page: number = 1;

  ProviderList: ProviderList[] = [{}];
  filterQueryParams: FilterQueryParams = new FilterQueryParams();
  filterSubject = new BehaviorSubject<FilterQueryParams>(this.filterQueryParams);
  providerListBehaviour: BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false);
  filtededProviders: ProviderList[];
  TotalItems: number;
  UserDialogComponent = AddUserDialogComponent;
  DialogResponse = null;
  SelectedProvider: ProviderList = {};
  displayAccess: string;
  Id: any;
  provideraccess: any;
  Locked: boolean;
  displayHeading: string;
  primaryProviderModal = 'none';
  lockedModal = 'none';
  AccessProvider = 'none';
  message: string;
  ActionTypes = Actions;
  search?: string;
  userIP:string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private adminservice: AdminService,
    private overlayService: OverlayService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private settingsService: SettingsService,
    private accountservice: Accountservice) { }

  ngOnInit(): void {
    this.GetProivderList();
    this.filterSubject.subscribe(value => {
      this.filtededProviders = this.ProviderList.filter(x =>
        (value.SearchTerm == "" || x.ProviderName?.toLowerCase().match(value.SearchTerm?.toLowerCase()) ||
          x.PracticeName?.toLowerCase().match(value.SearchTerm?.toLowerCase()))
        && x.Status == value.Active
        && (x.Paid == value.Paid || value.Paid == null)
      );
    })
    this.UserIP();
    this.providerListBehaviour.subscribe(value => {
      console.log(value);

    })
  }

  StageChange(event) {
    this.page = 1;
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
        this.filtededProviders = this._filterProviders();
      } else
        this.providerListBehaviour.next(true);
        this.ProviderList = [];
    });
  }

  _filterProviders(value: FilterQueryParams = null): ProviderList[] {
    let val = value == null ? new FilterQueryParams() : value;
    return this.ProviderList.filter(x =>
      (val.SearchTerm == "" || (x.ProviderName?.toLowerCase().match(val.SearchTerm?.toLowerCase())) ||
        x.PracticeName?.toLowerCase().match(value.SearchTerm?.toLowerCase()))
      && x.Status == val.Active
      && (x.Paid == val.Paid || val.Paid == null)
    );
  }


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

  okThanks() { this.clearSelectedProvider(); this.clearDocument(); }
  closeAccessProvider() { this.clearSelectedProvider(); this.clearDocument(); }
  clearSelectedProvider() {
    this.primaryProviderModal = 'none';
    this.AccessProvider = 'none';
    this.SelectedProvider = {};
  }

  freezDocument() {
    document.body.scrollBy(0, - document.body.scrollTop);
    document.body.style.overflow = "hidden";
  }
  clearDocument() {
    document.body.style.overflow = "auto";
  }
  // update trail/paid provider
  changeTraiPaidStatus(item, event) {
    let reqparam = {
      "ProviderId": item.ProviderId,
      "Trail": event.target.checked ? null : 30
    }
    let y = document.body.scrollTop;
    this.adminservice.UpdatedTrailStatus(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.GetProivderList();
        document.body.scrollTo(0, y);
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
        if (item.Locked == true) {
          this.displayHeading = 'unlocked';
          this.GetProivderList();
          this.lockedModal = 'block';
        }
        else {
          this.displayHeading = 'locked';
          this.GetProivderList();
          this.lockedModal = 'block';
        }

      }
    });
  }
  closelockedModal() { this.lockedModal = 'none'; }


  deactivateUser(event, item: ProviderList) {
    let user: NewUser = new NewUser();
    user.UserId = item.UserId;
    user.Active = event.currentTarget.checked;
    this.updateToggleUserFieldValues("Active", user)
  }

  updateToggleUserFieldValues(fieldToUpdate: string, user: NewUser) {
    var reqparams = {
      fieldToUpdate: fieldToUpdate,
      user: user
    }
    this.settingsService.ToggleUserFieldValues(reqparams).subscribe(resp => {
      let message: string;
      if (resp.IsSuccess) {
        message = resp.Message;
      }
    });

  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string, dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.UserDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
        //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.UserDialogComponent) {
        this.DialogResponse = res.data;
      }
      if (res.data != null) {
        this.UpdateView(res.data);
      }
    });
  }

  UpdateView(data) {
    if (data == null) return;
    if (data.saved) {
      this.GetProivderList();
    }
  }

  disableSwitchUser: boolean = false;
  switchUser(provider: ProviderList) {
    this.disableSwitchUser = true;
    let switchKey: string = provider.UserId + ":" + provider.ProviderId;
    this.adminservice.SwitchUserKey(provider).subscribe(resp => {
      if (resp.IsSuccess) {
        let encKey = resp.Result;
        this.authService.SwitchUser({ SwitchUserKey: switchKey, SwitchUserEncKey: encKey,UserIP:this.userIP }).subscribe(logresp => {
          if (!logresp.IsSuccess) {
          }
        })
      } else {
      }
    })
  }
  private UserIP(){
    this.authService.UserIp().subscribe((resp:any)=>{this.userIP = resp.ip})
  }
}
