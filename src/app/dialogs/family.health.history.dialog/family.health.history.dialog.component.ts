import { PastMedicalHistory, Diagnosis, GlobalConstants, FamilyMedicalHistory, PatientChart } from './../../_models';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Subject } from 'rxjs-compat';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';
import { FormFieldValue } from 'src/app/_components/advanced-medical-code-search/field-control/field-control-component';
import { FamilyRecordNotifier } from 'src/app/_navigations/provider.layout/view.notification.service';
@Component({
  selector: 'app-family.health.history.dialog',
  templateUrl: './family.health.history.dialog.component.html',
  styleUrls: ['./family.health.history.dialog.component.scss']
})
export class FamilyHealthHistoryDialogComponent implements OnInit {
  //patientFamilyHealthHistory: PastMedicalHistory = new PastMedicalHistory;
  familyMedicalHistory: FamilyMedicalHistory = {Diagnoses: []};
  patientRelationShip: GlobalConstants;
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  selectedCodeSystemValue: FormFieldValue = { CodeSystem: 'SNOMED/ICD10', SearchTerm: '' }
  currentPatient: ProviderPatient;
  disableAddDxbtn: boolean = true;
  diagnosesStartDate: Date;
  diagnosesStopDate: string;
  originalDiagnoses: any[] = [];
  selectedDiagnosis: Diagnosis;
  minBirthdate: Date;
  minDateToFinish = new Subject<string>();
  endDateForDiagnosis;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private patientService: PatientService,
    private familyRecordNotifier: FamilyRecordNotifier ) {
    this.currentPatient = this.authService.viewModel.Patient;
    this.updateLocalModel(ref.RequestData);
    this.minDateToFinish.subscribe(d => {
      this.endDateForDiagnosis = new Date(d);
    })
  }

  ngOnInit(): void {
    this.patientRelationShip = GlobalConstants.RELATIONSHIP;
    this.diagnosesStartDate = new Date();
    this.endDateForDiagnosis = new Date(this.diagnosesStartDate);
    this.diagnosesStopDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.minDate();
  }

  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }

  updateLocalModel(data: FamilyMedicalHistory) {
    this.familyMedicalHistory = {Diagnoses:[]};
    if (data == null) return;
    this.familyMedicalHistory = data;
    console.log(this.familyMedicalHistory);

  }

  cancel() {
    this.ref.close({
      Close: true
    });
  }

  optionChangedForDiagnosis(value: Diagnosis) {
    this.selectedDiagnosis = value;
    this.disableAddDxbtn = false;
  }

  bindDiagnosesCode() {
    let diagnosis: Diagnosis = {};
    diagnosis.Acute =true;
    diagnosis.Code = this.selectedDiagnosis.Code;
    diagnosis.CodeSystem = this.selectedDiagnosis.CodeSystem;
    diagnosis.Description = this.selectedDiagnosis.Description;
    diagnosis.strStartAt = this.datepipe.transform(this.diagnosesStartDate, "MM/dd/yyyy hh:mm:ss");
    diagnosis.StartAt = new Date(diagnosis.strStartAt);
    diagnosis.StopAt = this.datepipe.transform(this.diagnosesStopDate, "MM/dd/yyyy hh:mm:ss")
    diagnosis.Primary = false;
    diagnosis.Referral = false;
    diagnosis.Terminal = false;

    if(!this.familyMedicalHistory.Diagnoses) this.familyMedicalHistory.Diagnoses = [];
    this.familyMedicalHistory.Diagnoses.push(diagnosis);
    this.clearDiagnosisFields();
    this.disableAddDxbtn = true;
  }

  clearDiagnosisFields(){
    this.selectedDiagnosis = undefined;
    this.diagnosesStartDate = undefined;
    this.diagnosesStopDate = undefined;
  }

  deleteDiagnose(i) {
    if (this.familyMedicalHistory.Diagnoses[i].DiagnosisId == undefined) {
      this.familyMedicalHistory.Diagnoses.splice(i, 1);
    }
    else {
      let reqparams = {
        DiagnosisId: this.familyMedicalHistory.Diagnoses[i].DiagnosisId
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
    if (this.familyMedicalHistory.BirthAt) {
      let timeDiff = Math.abs(Date.now() - new Date(this.familyMedicalHistory.BirthAt).getTime());
      this.familyMedicalHistory.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    }
  }

  minDate() {
    const now = new Date();
    this.minBirthdate = new Date(this.datepipe.transform(now.setFullYear(now.getFullYear() - 1), "yyyy-MM-dd"));
  }

  Create() {
    this.familyRecordNotifier.sendData(this.familyMedicalHistory,false);
    this.ref.close({
      UpdatedModal: PatientChart.FamilyMedicalHistory
    });
  }

  disableFamilyHealthHistory() {
    return !(this.familyMedicalHistory.FirstName && this.familyMedicalHistory.LastName
      && this.familyMedicalHistory.Relationship && this.familyMedicalHistory.BirthAt
      && this.familyMedicalHistory.Age > 0)
  }

  DeleteFamilyHealthRecord(){
    this.familyRecordNotifier.sendData(this.familyMedicalHistory,true);
    this.ref.close({
      UpdatedModal: PatientChart.FamilyMedicalHistory
    });
  }

}
