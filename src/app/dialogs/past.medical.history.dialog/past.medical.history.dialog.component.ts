import { FormArray } from '@angular/forms';
import { FamilyMedicalHistory, PatientChart } from './../../_models/_provider/chart';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Component, OnInit } from '@angular/core';
import { Actions, ChartInfo, PastMedicalHistory } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { FamilyHealthHistoryDialogComponent } from '../family.health.history.dialog/family.health.history.dialog.component';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';

@Component({
  selector: 'app-past.medical.history.dialog',
  templateUrl: './past.medical.history.dialog.component.html',
  styleUrls: ['./past.medical.history.dialog.component.scss']
})
export class PastMedicalHistoryDialogComponent implements OnInit {
  patientPastMedicalHistory: PastMedicalHistory = new PastMedicalHistory();
  currentPatient: ProviderPatient;
  chartInfo: ChartInfo = new ChartInfo;
  familyHealthHistoryDialogComponent = FamilyHealthHistoryDialogComponent;
  ActionTypes = Actions;
  strFamilyMedicalHistories: unknown;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    private overlayService: OverlayService) {
    this.currentPatient = this.authService.viewModel.Patient;
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
  }

  updateLocalModel(data: any) {
    this.patientPastMedicalHistory = new PastMedicalHistory;
    if (data == null) return;
    if (data.length != 0) {
      this.patientPastMedicalHistory = data[0];
      this.patientPastMedicalHistory.FamilyMedicalHistories = this.patientPastMedicalHistory.FamilyMedicalHistories == null ? [] : this.patientPastMedicalHistory.FamilyMedicalHistories;
    }
    if (this.patientPastMedicalHistory.FamilyMedicalHistories.length > 0) {
      this.patientPastMedicalHistory.FamilyMedicalHistories = JSON.parse(this.patientPastMedicalHistory.FamilyMedicalHistories.toString());
    }
  }
  cancel() {
    this.strFamilyMedicalHistories = JSON.stringify(this.patientPastMedicalHistory.FamilyMedicalHistories);
    this.patientPastMedicalHistory.FamilyMedicalHistories = this.strFamilyMedicalHistories as FamilyMedicalHistory[];
    this.ref.close({
      "UpdatedModal": PatientChart.PastMedicalHistory
    });
  }

  CreatePastMedicalHistories() {
    let isAdd = this.patientPastMedicalHistory.PastMedicalHistoryId == undefined;
    this.patientPastMedicalHistory.PatientId = this.currentPatient.PatientId;
    this.patientService.CreatePastMedicalHistories(this.patientPastMedicalHistory).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.PastMedicalHistory
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CPMH001" : "M2CPMH002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CPMH001"]);
      }
    });
  }

  disablePastMedicalHistory() {
    return !(this.patientPastMedicalHistory.MajorEvents && this.patientPastMedicalHistory.OngoingProblems
      && this.patientPastMedicalHistory.PerventiveCare && this.patientPastMedicalHistory.NutritionHistory)
  }

  // Get Past Medical Histories info
  PastMedicalHistoriesByPatientId() {
    this.patientService.PastMedicalHistoriesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.PastMedicalHistories = resp.ListResult;
    });
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.familyHealthHistoryDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.add && content === this.familyHealthHistoryDialogComponent) {
      reqdata = new FamilyMedicalHistory;
      reqdata.PastMedicalHistoryId  = this.patientPastMedicalHistory.PastMedicalHistoryId;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if (res.data != null) {
        this.ref.close(res.data);
      }
    });
  }

}
