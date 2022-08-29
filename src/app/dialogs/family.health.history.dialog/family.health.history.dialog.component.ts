import { PastMedicalHistory, Diagnosis, GlobalConstants, FamilyMedicalHistory, PatientChart } from './../../_models';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject } from 'rxjs-compat';
import { Obj } from '@popperjs/core';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-family.health.history.dialog',
  templateUrl: './family.health.history.dialog.component.html',
  styleUrls: ['./family.health.history.dialog.component.scss']
})
export class FamilyHealthHistoryDialogComponent implements OnInit {
  patientFamilyHealthHistory: PastMedicalHistory = new PastMedicalHistory;
  patientRelationShip: GlobalConstants;
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  currentPatient: ProviderPatient;
  disableAddDxbtn: boolean = true;
  // diagnosesSubject = new BehaviorSubject<Diagnosis[]>([]);

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private patientService: PatientService) {
    this.currentPatient = this.authService.viewModel.Patient;
    this.updateLocalModel(ref.RequestData);
   }

  ngOnInit(): void {
    this.patientRelationShip = GlobalConstants.RELATIONSHIP;
  }
  // jsonObj: Array<Object>;
  updateLocalModel(data: any) {
    this.patientFamilyHealthHistory = new PastMedicalHistory;
    // data.PastMedicalHistory.Diagnoses = data.PastMedicalHistory.Diagnoses == null ? [] : data.PastMedicalHistory.Diagnoses;
    if (data == null) return;
    this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo = data;

    // if(data.FamilHealthDetails?.length != 0 || data.FamilHealthDetails?.length != undefined) {
    //   this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo = data.FamilHealthDetails;
    // }
    // if(data.FamilHealthDetails == null) {
    //   this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo = new FamilyMedicalHistory;
    // }
    // if(data.PastMedicalHistory.Diagnoses.length > 0) {
    //     this.patientFamilyHealthHistory.Diagnoses = JSON.parse(data.PastMedicalHistory.Diagnoses);
    //     console.log(this.patientFamilyHealthHistory.Diagnoses);
    //     this.patientFamilyHealthHistory.Diagnoses.forEach(diagonses => {
    //       if(diagonses.DFamilyHealthHistoryId == this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.FamilyHealthHistoryId) {
    //         this.patientFamilyHealthHistory.Diagnoses = [];
    //         this.patientFamilyHealthHistory.Diagnoses.push(diagonses);
    //         console.log(this.patientFamilyHealthHistory.Diagnoses);
    //       }
    //     });
    //     console.log(this.patientFamilyHealthHistory?.Diagnoses);

    // }
    // this.patientFamilyHealthHistory.PastMedicalHistoryId = data.PastMedicalHistory.PastMedicalHistoryId;
  }

  cancel() {
    this.ref.close(null);
  }

  onSelectedDiagnoses: Diagnosis;
  optionChangedForDiagnosis(value: Diagnosis) {
    this.onSelectedDiagnoses = value;
    this.disableAddDxbtn = false;
    // this.diagnosesSubject.next(this.patientFamilyHealthHistory.Diagnoses);

    // console.log(this.diagnosesSubject);
  }

  bindDiagnosesCode(){
    let reqparams = {
      'Code' : this.onSelectedDiagnoses.Code,
      'CodeSystem' : this.onSelectedDiagnoses.CodeSystem,
      'Description' : this.onSelectedDiagnoses.Description,
      // 'StartAt' : this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.DiagnosesInfo.StartAt,
      // 'StopAt' : this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.DiagnosesInfo.StopAt
    }

    this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Diagnoses.push(reqparams);
    this.disableAddDxbtn = true;
  }

  deleteDiagnose(i) {
    if(this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Diagnoses[i].DiagnosisId == undefined){
      this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Diagnoses.splice(i, 1);
    }
    // this.selectedReaction.splice(this.selectedReaction.indexOf(selected), 1);
  }

  ageCalculator(){
    if(this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.BirthAt){
      let timeDiff = Math.abs(Date.now() - new Date(this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.BirthAt).getTime());
      this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
    }
  }

  Create() {
    let isAdd = this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.FamilyHealthHistoryId == undefined;
    this.patientFamilyHealthHistory.PatientId = this.currentPatient.PatientId;
    return
    this.patientService.CreateFamilyHealthHistories(this.patientFamilyHealthHistory).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.FamilyMedicalHistory
        });
        // this.PastMedicalHistoriesByPatientId();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CFHH001" : "M2CFHH002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CFHH001"]);
      }
    });
  }
}
