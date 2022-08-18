import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Diagnosis, DiagnosisDpCodes, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
//const moment = require('moment');

@Component({
  selector: 'app-add.diagnoses.dialog',
  templateUrl: './add.diagnoses.dialog.component.html',
  styleUrls: ['./add.diagnoses.dialog.component.scss']
})
export class AddDiagnosesDialogComponent implements OnInit {
  patientDiagnoses: Diagnosis = new Diagnosis();
  DxCodes: DiagnosisDpCodes[];
  currentPatient: ProviderPatient;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe) {
    this.updateLocalModel(ref.RequestData);
    if (this.patientDiagnoses.StopAt != (null || '' || undefined)) {
      this.patientDiagnoses.StopAt = this.datepipe.transform(this.patientDiagnoses.StopAt, "yyyy-MM-dd");
    }
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    this.DxCodes = Object.values(DiagnosisDpCodes);
  }

  updateLocalModel(data: Diagnosis) {
    this.patientDiagnoses = new Diagnosis;
    if (data == null) return;
    this.patientDiagnoses = data;
  }

  cancel() {
    this.ref.close(null);
  }

  todayStartAt() {
    this.patientDiagnoses.StartAt = new Date();
  }
  todayStopAt() {
    this.patientDiagnoses.StopAt = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  }

  CreateDiagnoses() {
    let isAdd = this.patientDiagnoses.DiagnosisId == undefined;
    this.patientDiagnoses.PatinetId = this.currentPatient.PatientId;
    this.patientDiagnoses.StartAt = new Date(this.datepipe.transform(this.patientDiagnoses.StartAt, "yyyy-MM-dd", "en-US"));
    this.patientDiagnoses.StopAt = this.datepipe.transform(this.patientDiagnoses.StopAt, "yyyy-MM-dd", "en-US");
    let reqparams = {
      DiagnosisId: this.patientDiagnoses.DiagnosisId,
      PatinetId: this.patientDiagnoses.PatinetId,
      CodeSystem: this.patientDiagnoses.CodeSystem,
      Code: this.patientDiagnoses.Code,
      Description: this.patientDiagnoses.Description,
      StartAt: this.patientDiagnoses.StartAt,
      StopAt: this.patientDiagnoses.StopAt,
      Note: this.patientDiagnoses.Note
    }
    this.patientService.CreateDiagnoses(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.Diagnoses,
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CD001" : "M2CD002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CD001"]);
        this.cancel();
      }
    });
  }

  disableDiagnosis() {
    return !(this.patientDiagnoses.CodeSystem && this.patientDiagnoses.Code && this.patientDiagnoses.Description && this.patientDiagnoses.StartAt
            && this.patientDiagnoses.StopAt && this.patientDiagnoses.Note)
  }

}
