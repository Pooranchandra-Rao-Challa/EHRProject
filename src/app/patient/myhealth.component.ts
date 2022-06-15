import { patientService } from './../_services/patient.service'
import { Component, OnInit } from '@angular/core'
import { User, UserLocations } from '../_models'
import { AuthenticationService } from '../_services/authentication.service'
import { PatientProfile } from '../_models/_patient/patientprofile'
import { Allergies, CareTeam, LabtestResult, Medications, MedicationsAllergies, PatientClinicalProvider,
   ProblemDX, VitalStats } from '../_models/_patient/patientclinicalprovider'


@Component({
  selector: 'app-myhealth',
  templateUrl: './myhealth.component.html',
  styleUrls: ['./myhealth.component.scss']
})
export class MyhealthComponent implements OnInit {
  user: User
  locationsInfo: UserLocations[];
   PatientProfile: PatientProfile;
   StatusList :any ;
   ProvidersList:any;
   smokingStatus: any;
   CareTeamList:CareTeam[];
   ProblemDxData:ProblemDX[];
   Providerdata:PatientClinicalProvider[];
   AllergiesData:Allergies[];
   VitalStatus:VitalStats[];
   Medications:Medications[];
   AllAlergies:MedicationsAllergies[];
   LabTest:LabtestResult[];
   ProcedurePatietn:ProblemDX[];
   CarePlan:ProblemDX[];

  constructor(private authenticationService: AuthenticationService,private patientService: patientService,) {
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
     this.getVitalStatus();
     this.getMedicationsByPatientId();
     this.getAllMedicationAlleries();
     this.getLabTest();
     this.getCarePlanInstruction();
     this.getProcedurePatient()
;  }

  getSmokingStatus() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientService.SmokingStatusByPatientId(req).subscribe(req => {
        this.StatusList = req.ListResult[0]
        this.smokingStatus = this.StatusList.Status
    })
  }
  getPatientProfile() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientMyProfileByPatientId(req).subscribe(resp => {
        this.PatientProfile=resp.ListResult[0]
    })
  }
  getclinicalProvider() {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientClinicProviders(req).subscribe(req => {
        this.Providerdata = req.ListResult;
    })
  }
  getCareTeamByPatientId() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientService.CareTeamByPatientId(reqparam).subscribe(resp => {
        this.CareTeamList = resp.ListResult;
    });
  }
  getProblemDx() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientService.ProblemDx(reqparam).subscribe(resp => {
        this.ProblemDxData = resp.ListResult;
    });
  }
  getMedicationsByPatientId() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }

      this.patientService.MedicationsByPatientId(reqparam).subscribe(resp => {
      this.Medications = resp.ListResult;
    });
  }
  getAllMedicationAlleries() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientService.ProblemDx(reqparam).subscribe(resp => {
        this.AllAlergies = resp.ListResult;
    });
  }
    getLabTest() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientService.LabTestResultByPatientId(reqparam).subscribe(resp => {
        this.LabTest = resp.ListResult;
    });
  }

  getVitalStatus() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientService.VitalStatsByPatientId(reqparam).subscribe(resp => {
        this.VitalStatus = resp.ListResult;
    });
  }
  getCarePlanInstruction() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientService.CarePlanGoalInstructionsBypatientId(reqparam).subscribe(resp => {
        this.CarePlan = resp.ListResult;
    });
  }
  getProcedurePatient() {
    let reqparam = {
      'PatientId':this.user.PatientId,
    }
    this.patientService.ProcedureByPatientId(reqparam).subscribe(resp => {
        this.ProcedurePatietn = resp.ListResult;
    });
  }
}
