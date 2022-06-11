import { SmokingStatus } from './../_models';
import { patientService } from './../_services/patient.service'
import { Component, OnInit } from '@angular/core'
import { User, UserLocations } from '../_models'
import { AuthenticationService } from '../_services/authentication.service'
import { PatientProfile } from '../_models/_patient/patientprofile'


@Component({
  selector: 'app-myhealth',
  templateUrl: './myhealth.component.html',
  styleUrls: ['./myhealth.component.scss']
})
export class MyhealthComponent implements OnInit {
  user: User
  locationsInfo: UserLocations[]
   PatientProfile: PatientProfile
   StatusList :any ;
   ProvidersList:any;
   smokingStatus: any;
   Providerdata:any;

  constructor(private authenticationService: AuthenticationService,private patientservise: patientService,) {
    //debugger

    this.user = authenticationService.userValue
    this.locationsInfo = JSON.parse(this.user.LocationInfo)
   }

  ngOnInit(): void {
    this.getPatientProfile();
     this.getSmokingStatus();
    //  this.getclinicalProvider();
  }

  getSmokingStatus() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientservise.SmokingStatusByPatientId(req).subscribe(req => {
      //debugger
      if (req.IsSuccess) {
        this.StatusList = req.ListResult[0]
        this.smokingStatus = this.StatusList.Status
      }
    })
  }
  getPatientProfile() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientservise.PatientMyProfileByPatientId(req).subscribe(resp => {
      //debugger
      if (resp.IsSuccess) {
        this.PatientProfile=resp.ListResult[0]
      }
    })
  }
  // getclinicalProvider() {

  //   var req={
  //     "PatientId": this.user.PatientId,
  //   }
  //   this.patientservise.PatientClinicProviders(req).subscribe(req => {
  //     debugger
  //     if (req.IsSuccess) {
  //       this.ProvidersList = req.ListResult[0]

  //     }
  //   })
  // }
}
