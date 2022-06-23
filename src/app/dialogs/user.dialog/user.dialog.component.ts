import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from 'src/app/_services/settings.service';
import { User, UserLocations } from '../../_models';
import { NewUser } from '../../_models/_provider/_settings/settings';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ChangePasswordDialogComponent } from 'src/app/dialogs/user.dialog/changepassword.dialog.component';
import { OverlayService } from '../../overlay.service';
import { Actions } from 'src/app/_models/';
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



  constructor(private ref: EHROverlayRef,
    private settingsService: SettingsService,
    private utilityService: UtilityService,
    private dialog: MatDialog,
    public overlayService: OverlayService,
    private authServer: AuthenticationService,
    private alertmsg: AlertMessage) {

    this.user = authServer.userValue;
    this.getUserDataforEdit(ref.RequestData as NewUser);
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

  getUserDataforEdit(u: NewUser) {
    var reqparams = {
      UserId: u.UserId,
      LoginProviderId: this.user.ProviderId,
      ClinicId: this.user.ClinicId
    }


    this.settingsService.UserInfoWithPraceticeLocations(reqparams).subscribe(resp => {
      this.dialogIsLoading = false;
      if(resp.IsSuccess){
        this.EditProvider = resp.Result as NewUser;
        this.EditProvider.LocationInfo = JSON.parse(resp.Result.LocationInfo);
      }
    });
  }

  updateUser(activity) {
    if (activity == 'add') {
      this.EditProvider.ClinicId = this.user.ClinicId;
      this.EditProvider.LocationId = this.user.CurrentLocation;
    } else {

    }
    if (this.EditProvider.PracticeName == null)
      this.EditProvider.PracticeName = this.user.BusinessName;

    // console.log(JSON.stringify(this.EditProvider))
    this.settingsService.AddUpdateUser(this.EditProvider).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({'saved':'true'});
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

    dialogRef.afterClosed().subscribe(result =>
    {
      this.settingsService.ChangePassword(result).subscribe(resp => {
        if (resp.IsSuccess) {
          //this.ref.close({'saved':'true'});
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
    if (content === this.locationDialogComponent && action == Actions.view) {
      dialogData = data;
    }
    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.locationDialogComponent) {
        this.locationDialogResponse = res.data;
      }
    });
  }
}
