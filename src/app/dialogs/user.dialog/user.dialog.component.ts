import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SettingsService } from 'src/app/_services/settings.service';
import { User, UserLocations } from '../../_models';
import { NewUser } from '../../_models/settings';
import { UtilityService } from 'src/app/_services/utiltiy.service';

@Component({
  selector: 'app-user.dialog',
  templateUrl: './user.dialog.component.html',
  styleUrls: ['./user.dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  NewUserData: NewUser;
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

  constructor(private settingsService: SettingsService, private utilityService: UtilityService) {
    this.NewUserData = {
    }
  }

  ngOnInit(): void {
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

  // getProviderDetails() {
  //   var reqparams = {
  //     provider_Id: this.user.ProviderId,
  //     location_Id: this.changedLocationId
  //   }
  //   this.settingsService.ProviderDetails(reqparams).subscribe(resp => {
  //     if (resp.IsSuccess) {
  //       this.providersDataSource = resp.ListResult as NewUser[];
  //     }else this.providersDataSource = [];
  //   });
  // }

  getUserDataforEdit(u: NewUser) {
    var reqparams = {
      UserId: u.UserId,
      LoginProviderId: this.user.ProviderId,
      ClinicId: this.user.ClinicId
    }

    this.settingsService.UserInfoWithPraceticeLocations(reqparams).subscribe(resp => {
      this.NewUserData = resp.Result as NewUser;
      this.NewUserData.LocationInfo = JSON.parse(resp.Result.LocationInfo);
      console.log(this.NewUserData)
    });
  }

  updateUser(activity) {
    if (activity == 'add') {
      this.NewUserData.ClinicId = this.user.ClinicId;
      this.NewUserData.LocationId = this.user.CurrentLocation;
    } else {

    }
    if (this.NewUserData.PracticeName == null)
      this.NewUserData.PracticeName = this.user.BusinessName;

    console.log(JSON.stringify(this.NewUserData))
    this.settingsService.AddUpdateUser(this.NewUserData).subscribe(resp => {
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
