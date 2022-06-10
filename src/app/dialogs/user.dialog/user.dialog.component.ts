import { TimeSlot } from './../../_models/_provider/_settings/settings';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SettingsService } from 'src/app/_services/settings.service';
import { User, UserLocations } from '../../_models';
import { NewUser } from '../../_models/_provider/_settings/settings';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-user.dialog',
  templateUrl: './user.dialog.component.html',
  styleUrls: ['./user.dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  EditProvider: NewUser= {}



  user: User;
  providerLocationColumn: string[] = ['LocationName', 'CityState', 'PracticeSchedule', 'ServicedLocation'];
  titles: {}[];
  degrees: {}[];
  specialities: {}[];
  states: {}[];
  providerRoles: {}[];
  displayforEditLocation: boolean;
  dispalyOptionStreet: boolean;
  locationDisplayModel = "none";
  manuallybtn: boolean = true;
  enterbtn: boolean;
  visiblebtn: boolean = true;
  scrHeight:any;
  scrWidth:any;
  dynamicheight: {};

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);
  }

  constructor(private ref: EHROverlayRef,
    private settingsService: SettingsService,
    private utilityService: UtilityService,
    private authServer: AuthenticationService) {

    this.user = authServer.userValue;
    this.getUserDataforEdit(ref.RequestData as NewUser);
    this.loadFormDefaults();
    this.getScreenSize();
      this.dynamicheight ={'height.px': this.scrHeight - 250,}
  }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
  loadFormDefaults() {
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
    console.log(reqparams);

    this.settingsService.UserInfoWithPraceticeLocations(reqparams).subscribe(resp => {

      this.EditProvider = resp.Result as NewUser;
      this.EditProvider.LocationInfo = JSON.parse(resp.Result.LocationInfo);
      console.log(this.EditProvider)
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

    console.log(JSON.stringify(this.EditProvider))
    this.settingsService.AddUpdateUser(this.EditProvider).subscribe(resp => {
      if (resp.IsSuccess) {
        // this.closePopup();
        // this.getProviderDetails();
      }
      else {
        Swal.fire({
          customClass: {
            container: 'container-class',
            title: 'title-error',
            confirmButton: 'close-error-button',
          },
          position: 'top',
          //title: msg,
          width: '700',
          confirmButtonText: 'Close',
          background: '#e5e1e1',
          showConfirmButton: true,
        });
      }
    });
  }

  closePopup() {
    this.displayforEditLocation = false;
    this.locationDisplayModel = "none";
    this.manuallybtn = true;
    this.enterbtn = false;
    this.dispalyOptionStreet = false;
    this.visiblebtn = true
  }

}
