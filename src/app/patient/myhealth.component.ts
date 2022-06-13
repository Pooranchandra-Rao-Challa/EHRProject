import { PatientService } from './../_services/patient.service'
import { Component, OnInit } from '@angular/core'
import { User, UserLocations } from '../_models'
import { AuthenticationService } from '../_services/authentication.service'
import { PatientProfile } from '../_models/_patient/patientprofile'
import { Allergies, CareTeam, PatientClinicalProvider, ProblemDX, VitalStats } from '../_models/_patient/patientclinicalprovider'


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
   CareTeamList:CareTeam[];
   ProblemDxData:ProblemDX[];
   Providerdata:PatientClinicalProvider[];
   AllergiesData:Allergies[];
   VitalStatus:VitalStats[];

  constructor(private authenticationService: AuthenticationService,private patientservise: PatientService,) {
    //debugger

    this.user = authenticationService.userValue
    this.locationsInfo = JSON.parse(this.user.LocationInfo)
   }

  ngOnInit(): void {
    this.getclinicalProvider();
    this.getPatientProfile();
     this.getSmokingStatus();
     this.getCareTeamByPatientId();
     this.getProblemDx();
    //  this.getVitalStatus();
  }

  getSmokingStatus() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientservise.SmokingStatusByPatientId(req).subscribe(req => {
        this.StatusList = req.ListResult[0]
        this.smokingStatus = this.StatusList.Status
    })
  }
  getPatientProfile() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientservise.PatientMyProfileByPatientId(req).subscribe(resp => {
        this.PatientProfile=resp.ListResult[0]
    })
  }
  getclinicalProvider() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientservise.PatientClinicProviders(req).subscribe(req => {
        this.Providerdata = req.ListResult;
    })
  }
  getCareTeamByPatientId() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientservise.CareTeamByPatientId(reqparam).subscribe(resp => {
        this.CareTeamList = resp.ListResult;
    });
  }
  getProblemDx() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientservise.ProblemDx(reqparam).subscribe(resp => {
        this.ProblemDxData = resp.ListResult;
    });
  }
  // getAllergiesByPatientId() {
  //   let reqparam = {
  //     'PatientId':this.user.PatientId,
  //   }
  //   this.patientservise.AllergiesByPatientId(reqparam).subscribe(resp => {
  //       this.AllergiesData = resp.ListResult;
  //   });
  // }

  // getVitalStatus() {
  //   let reqparam = {
  //     'PatientId':this.user.PatientId,
  //   }
  //   this.patientservise.VitalStatsByPatientId(reqparam).subscribe(resp => {
  //       this.VitalStatus = resp.ListResult;
  //   });
  // }
}
