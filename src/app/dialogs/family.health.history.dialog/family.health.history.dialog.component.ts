import { PastMedicalHistory, Diagnosis, GlobalConstants, FamilyMedicalHistory, PatientChart } from './../../_models';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject, Subject } from 'rxjs-compat';
import { Obj } from '@popperjs/core';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  diagnosesStartDate: Date;
  diagnosesStopDate: string;
  originalDiagnoses: any[] = [];
  onSelectedDiagnoses: Diagnosis;
  // todayDate: Date;
  minBirthdate: Date;
  minDateToFinish = new Subject<string>();
  endDateForDiagnosis;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private patientService: PatientService) {
    this.currentPatient = this.authService.viewModel.Patient;
    this.updateLocalModel(ref.RequestData);
    // this.todayDate = new Date();
    this.minDateToFinish.subscribe(d => {
      this.endDateForDiagnosis = new Date(d);
    })
  }

  ngOnInit(): void {
    this.patientRelationShip = GlobalConstants.RELATIONSHIP;
    this.diagnosesStartDate = new Date();
    // this.diagnosesStopDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.endDateForDiagnosis = new Date(this.diagnosesStartDate);

    this.minDate();
  }
  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }
  updateLocalModel(data: FamilyMedicalHistory) {
    this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo = new FamilyMedicalHistory;
    if (data == null) return;
    this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo = data;
  }

  cancel() {
    this.ref.close({
      "UpdatedModal": PatientChart.FamilyMedicalHistory
    });
  }

  optionChangedForDiagnosis(value: Diagnosis) {
    this.onSelectedDiagnoses = value;
    this.disableAddDxbtn = false;
  }

  bindDiagnosesCode() {
    let reqparams = {
      'Code': this.onSelectedDiagnoses.Code,
      'CodeSystem': this.onSelectedDiagnoses.CodeSystem,
      'Description': this.onSelectedDiagnoses.Description,
      'StartAt': new Date(this.datepipe.transform(this.diagnosesStartDate, "MM/dd/yyyy hh:mm:ss")),
      'StopAt': this.diagnosesStopDate.toString()
    }
    this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Diagnoses.push(reqparams);
    this.diagnosesStartDate = new Date();
    this.diagnosesStopDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.disableAddDxbtn = true;
  }

  deleteDiagnose(i) {
    if (this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Diagnoses[i].DiagnosisId == undefined) {
      this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Diagnoses.splice(i, 1);
    }
    else {
      let reqparams = {
        DiagnosisId: this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Diagnoses[i].DiagnosisId
      }
      this.patientService.DeleteDiagnoses(reqparams).subscribe((resp) => {
        if (resp.IsSuccess) {
          this.ref.close({
            "UpdatedModal": PatientChart.FamilyMedicalHistory
          });
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2CD003"]);
        }
        else {
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CD002"]);
        }
      });
    }
  }

  ageCalculator() {
    if (this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.BirthAt) {
      let timeDiff = Math.abs(Date.now() - new Date(this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.BirthAt).getTime());
      this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    }
  }

  minDate() {
    const now = new Date();
    this.minBirthdate = new Date(this.datepipe.transform(now.setFullYear(now.getFullYear() - 1), "yyyy-MM-dd"));
  }

  Create() {
    let isAdd = this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.FamilyHealthHistoryId == undefined;
    this.patientFamilyHealthHistory.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateFamilyHealthHistories(this.patientFamilyHealthHistory).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.FamilyMedicalHistory
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CFHH001" : "M2CFHH002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CFHH001"]);
      }
    });
  }

  disableFamilyHealthHistory() {
    return !(this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.FirstName && this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.LastName
      && this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Relationship && this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.BirthAt
      && this.patientFamilyHealthHistory.FamilyMedicalHistoryInfo.Age > 0)
  }
}
