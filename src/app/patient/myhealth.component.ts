import { DatePipe } from '@angular/common';
import { PatientService } from './../_services/patient.service'
import { Component, OnInit } from '@angular/core'
import { User, UserLocations } from '../_models'
import { AuthenticationService } from '../_services/authentication.service'
import { PatientProfile } from '../_models/_patient/patientprofile'
import {
  Allergies, CareTeam, LabtestResult, Medications, MedicationsAllergies, PatientClinicalProvider,
  ProblemDX, VitalStats
} from '../_models/_patient/patientclinicalprovider'

@Component({
  selector: 'app-myhealth',
  templateUrl: './myhealth.component.html',
  styleUrls: ['./myhealth.component.scss']
})
export class MyhealthComponent implements OnInit {
  user: User
  locationsInfo: UserLocations[];
  PatientProfile: PatientProfile;
  StatusList: any;
  ProvidersList: any;
  smokingStatus: any;
  CareTeamList: CareTeam[];
  ProblemDxData: ProblemDX[];
  Providerdata: PatientClinicalProvider[];
  clinicaldata: PatientClinicalProvider[]
  AllergiesData: Allergies[];
  VitalStatus: VitalStats[];
  Medications: Medications[];
  AllAlergies: MedicationsAllergies[];
  LabTest: LabtestResult[];
  ProcedurePatietn: ProblemDX[];
  CarePlan: ProblemDX[];

  constructor(private authenticationService: AuthenticationService,
    private patientservise: PatientService,
    private datePipe: DatePipe) {
    this.user = authenticationService.userValue
    this.locationsInfo = JSON.parse(this.user.LocationInfo)
  }

  ngOnInit(): void {
    this.getLocations();
    this.getProviders();
    this.getPatientProfile();
    this.getPatientProfile();
    this.getSmokingStatus();
    this.getCareTeamByPatientId();
    this.getProblemDx();
    this.getVitalStatus();
    this.getMedicationsByPatientId();
    this.getAllMedicationAlleries();
    this.getLabTest();
    this.getCarePlanInstruction();
    this.getProcedurePatient();
  }

  getSmokingStatus() {
    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientservise.SmokingStatusByPatientId(req).subscribe(req => {
      this.StatusList = req.ListResult
      this.smokingStatus = this.StatusList.Status
    })
  }

  getPatientProfile() {
    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientservise.PatientMyProfileByPatientId(req).subscribe(resp => {
      this.PatientProfile = resp.ListResult[0];
    })
  }

  getLocations() {
    var req = {
      "ClinicId": this.user.ClinicId,
    }
    this.patientservise.PatientLocations(req).subscribe(req => {
      this.clinicaldata = req.ListResult;
    })
  }

  getProviders() {
    var req = {
      "ClinicId": this.user.ClinicId,
    }
    this.patientservise.PatientProviders(req).subscribe(resp => {
      if (resp.IsSuccess) this.Providerdata = resp.ListResult;
      else this.CarePlan = []
    })
  }

  getCareTeamByPatientId() {
    this.patientservise.CareTeamByPatientId({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) this.CareTeamList = resp.ListResult;
      else this.CareTeamList = []
    });
  }

  getProblemDx() {
    this.patientservise.ProblemDx({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) this.ProblemDxData = resp.ListResult;
      else this.ProblemDxData = []
    });
  }

  getMedicationsByPatientId() {
    this.patientservise.MedicationsByPatientId({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) this.Medications = resp.ListResult;
      else this.Medications = []
    });
  }

  getAllMedicationAlleries() {
    this.patientservise.AllergiesByPatientId({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AllAlergies = resp.ListResult as MedicationsAllergies[];
      }

      else this.AllAlergies = []
    });
  }

  getLabTest() {
    this.patientservise.LabTestResultByPatientId({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) this.LabTest = resp.ListResult as LabtestResult[];
      else this.LabTest = []
    })
  }

  getVitalStatus() {
    this.patientservise.VitalStatsByPatientId({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) this.VitalStatus = resp.ListResult as VitalStats[];
      else this.VitalStatus = []

    });
  }

  getCarePlanInstruction() {
    this.patientservise.CarePlanGoalInstructionsBypatientId({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) this.CarePlan = resp.ListResult;
      else this.CarePlan = []
    });
  }

  getProcedurePatient() {
    this.patientservise.ProcedureByPatientId({PatientId: this.user.PatientId}).subscribe(resp => {
      if (resp.IsSuccess) this.ProcedurePatietn = resp.ListResult;
      else this.CarePlan = []
    });
  }
}
