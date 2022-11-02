import { NotifyMessageService, NotifyProviderHeaderService, ProviderHeader } from './../../_navigations/provider.layout/view.notification.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from 'src/app/_services/settings.service';
import { User } from '../../_models';
import { LocationDialog, NewUser } from '../../_models/_provider/_settings/settings';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ChangePasswordDialogComponent } from 'src/app/dialogs/user.dialog/changepassword.dialog.component';
import { OverlayService } from '../../overlay.service';
import { Actions, Location } from 'src/app/_models/';
import { LocationDialogComponent } from 'src/app/dialogs/location.dialog/location.dialog.component';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
@Component({
  selector: 'app-user.dialog',
  templateUrl: './user.dialog.component.html',
  styleUrls: ['./user.dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  EditProvider: NewUser = {}
  user: User;
  providerLocationColumn: string[] = ['LocationName', 'CityState', 'PracticeSchedule', 'ServicedLocation'];
  titles: {}[];
  degrees: {}[];
  specialities: {}[];
  states: {}[];
  providerRoles: {}[];
  scrHeight: any;
  scrWidth: any;
  dynamicheight: {};
  locationDialogComponent = LocationDialogComponent;
  locationDialogResponse: any;
  ActionsType = Actions;
  dialogIsLoading: boolean = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;

  }
  ssnpattern = { 0: { pattern: new RegExp(/^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$/), symbol: '*' } };
  userQuery: {};
  pattern = { 0: { pattern: new RegExp('\\d'), symbol: '*' } };

  constructor(private ref: EHROverlayRef,
    private settingsService: SettingsService,
    private utilityService: UtilityService,
    private dialog: MatDialog,
    public overlayService: OverlayService,
    private authServer: AuthenticationService,
    private notifyProviderHeader: NotifyProviderHeaderService,
    private alertmsg: AlertMessage) {
    this.user = authServer.userValue;
    this.userQuery = {
      UserId: (ref.RequestData as NewUser).UserId,
      LoginProviderId: this.user.ProviderId,
      ClinicId: this.user.ClinicId
    }
    this.getUserDataforEdit();
    this.loadFormDefaults();
    this.getScreenSize();
    this.dynamicheight = { 'height.px': this.scrHeight - 250, }

  }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }

  loadFormDefaults() {
    this.dialogIsLoading = true;
    this.utilityService.Titles().subscribe(resp => {
      if (resp.IsSuccess) {
        this.titles = JSON.parse(resp.Result);
      }
    });
    this.utilityService.Degree().subscribe(resp => {
      if (resp.IsSuccess) {
        this.degrees = JSON.parse(resp.Result);
      }
    });
    this.utilityService.Specilaity().subscribe(resp => {
      if (resp.IsSuccess) {
        this.specialities = JSON.parse(resp.Result);
      }
    });
    this.utilityService.States().subscribe(resp => {
      if (resp.IsSuccess) {
        this.states = JSON.parse(resp.Result);
      }
    });
    this.utilityService.ProviderRoles().subscribe(resp => {
      if (resp.IsSuccess) {
        this.providerRoles = JSON.parse(resp.Result);
      }
    });
  }

  getUserDataforEdit() {
    this.settingsService.UserInfoWithPracticeLocations(this.userQuery).subscribe(resp => {
      this.dialogIsLoading = false;
      if (resp.IsSuccess) {
        this.EditProvider = resp.Result as NewUser;
        this.EditProvider.LocationInfo = JSON.parse(resp.Result.LocationInfo);
        // if(this.EditProvider.LocationInfo.)
        this.updateTimeSlotString();
      }
    });
  }

  updateTimeSlotString() {
    this.EditProvider.LocationInfo.forEach(loc => {
      let rtnString = '';
      loc.TimeSlots.forEach(timeslot => {
        if (rtnString != '') rtnString += '<br>'
        if (timeslot.SpecificHour == 'Specific Hours')
          rtnString += '<p style="color:red" >' + timeslot.WeekDay + ', ' + timeslot.From + '-' + timeslot.To + '</p>'
        else
          rtnString += '<p style="color:red" >' + timeslot.WeekDay + ', ' + timeslot.SpecificHour + '</p>';
      })
      loc.FormatedTimeSlot = rtnString;
    });
  }

  updateUser(activity) {
    if (activity == 'add') {
      this.EditProvider.ClinicId = this.user.ClinicId;
      this.EditProvider.LocationId = this.user.CurrentLocation;
    }
    if (this.EditProvider.PracticeName == null)
      this.EditProvider.PracticeName = this.user.BusinessName;
    this.settingsService.AddUpdateUser(this.EditProvider).subscribe(resp => {
      if (resp.IsSuccess) {
        if (this.user.ProviderId == this.EditProvider.ProviderId) {
          var provider: ProviderHeader = new ProviderHeader();
          provider.FirstName = this.EditProvider.FirstName;
          provider.LastName = this.EditProvider.LastName;
          this.notifyProviderHeader.sendData(provider);
          this.authServer.updateProviderHeader(provider);
        }
        this.ref.close({ 'saved': 'true' });
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JP005"]);
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP003"]);
      }
    });
  }

  closePopup() {
    this.ref.close();
  }

  openChangePasswordDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'app-change-password-dialog';
    dialogConfig.data = {
      id: 2,
      title: 'Change Password',
      Email: this.EditProvider.Email,
      Userid: this.EditProvider.UserId
    };

    let dialogRef = this.dialog.open(ChangePasswordDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.settingsService.ChangePassword(result).subscribe(resp => {
        if (resp.IsSuccess) {
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2JP009"]);
        }
        else {
          this.cancel();
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2JP008"]);
        }
      });


    });

  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.locationDialogComponent) {
      let locdig: LocationDialog = {};
      if (action == Actions.view) {
        locdig.ProviderId = this.EditProvider.ProviderId;
        locdig.LocationInfo = data;
      }
      else {
        locdig.ProviderId = this.EditProvider.ProviderId;
      }
      dialogData = locdig;
    }
    const ref = this.overlayService.open(content, dialogData, true);
    ref.afterClosed$.subscribe(res => {
      if (content === this.locationDialogComponent) {

        if (res.data != null && (res.data.saved || res.data.deleted))
          this.getUserDataforEdit();
        this.ref.close({ viewRefresh: true })
      }
    });
  }
  enablesave() {
    return !(this.EditProvider.FirstName != null && this.EditProvider.FirstName != ''
      && this.EditProvider.LastName != null && this.EditProvider.LastName != '')
  }
}
