import { BehaviorSubject, Observable, Subject, fromEvent, merge } from 'rxjs';
import { FamilyMedicalHistory, PatientChart } from './../../_models/_provider/chart';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Actions, ChartInfo, PastMedicalHistory } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { FamilyHealthHistoryDialogComponent } from '../family.health.history.dialog/family.health.history.dialog.component';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { FamilyRecordNotifier } from 'src/app/_navigations/provider.layout/view.notification.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-past.medical.history.dialog',
  templateUrl: './past.medical.history.dialog.component.html',
  styleUrls: ['./past.medical.history.dialog.component.scss']
})
export class PastMedicalHistoryDialogComponent implements OnInit {
  patientPastMedicalHistory: PastMedicalHistory = new PastMedicalHistory();
  currentPatient: ProviderPatient;
  familyHealthHistoryDialogComponent = FamilyHealthHistoryDialogComponent;
  ActionTypes = Actions;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    private overlayService: OverlayService,
    private familyRecordNotifier: FamilyRecordNotifier,
    private cdref: ChangeDetectorRef) {
    this.currentPatient = this.authService.viewModel.Patient;

  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.familyRecordNotifier.getData().subscribe(resp => {
      if (resp.isdeleted) {
        this.patientPastMedicalHistory.FamilyMedicalHistories.splice(resp.record.Index, 1)
      } else {
        if (!this.patientPastMedicalHistory.FamilyMedicalHistories)
          this.patientPastMedicalHistory.FamilyMedicalHistories = []
        if (resp.record.Index > -1) {
          this.patientPastMedicalHistory.FamilyMedicalHistories.splice(resp.record.Index, 1)
        }
        this.patientPastMedicalHistory.FamilyMedicalHistories.push(resp.record);
      }
      //this.CreatePastMedicalHistories();
    });
    this.updateLocalModel(this.ref.RequestData);

  }

  updateLocalModel(data: any) {
    this.patientPastMedicalHistory = {};
    if (data == null) return;
    this.patientPastMedicalHistory = data;
    this.patientPastMedicalHistory.FamilyMedicalHistories =
      this.patientPastMedicalHistory.strFamilyMedicalHistories != null &&
        this.patientPastMedicalHistory.strFamilyMedicalHistories != '' ?
        JSON.parse(this.patientPastMedicalHistory.strFamilyMedicalHistories) : [];
     }
  cancel() {
    this.ref.close({
      "UpdatedModal": PatientChart.PastMedicalHistory
    });
  }

  CreatePastMedicalHistories(close:boolean = true) {
    let isAdd = this.patientPastMedicalHistory.PastMedicalHistoryId == undefined;
    this.patientPastMedicalHistory.PatientId = this.currentPatient.PatientId;

    this.patientService.CreatePastMedicalHistories(this.patientPastMedicalHistory).subscribe((resp) => {
      if (resp.IsSuccess) {
        if(close){
          this.ref.close({
            "UpdatedModal": PatientChart.PastMedicalHistory
          });
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CPMH001" : "M2CPMH002"]);
        }
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CPMH001"]);
      }
    });
  }

  disablePastMedicalHistory() {
    return !(this.patientPastMedicalHistory.MajorEvents || this.patientPastMedicalHistory.OngoingProblems
      || this.patientPastMedicalHistory.PerventiveCare || this.patientPastMedicalHistory.NutritionHistory)
  }

  // // Get Past Medical Histories info
  // PastMedicalHistoriesByPatientId() {
  //   this.patientService.PastMedicalHistoriesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
  //     if (resp.IsSuccess) this.chartInfo.PastMedicalHistories = resp.ListResult;
  //   });
  // }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.familyHealthHistoryDialogComponent) {
      dialogData.Index = this.patientPastMedicalHistory.FamilyMedicalHistories.indexOf(dialogData);
      reqdata = dialogData;
    }
    else if (action == Actions.add && content === this.familyHealthHistoryDialogComponent) {
      reqdata = {};

    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if(res.data && res.data.UpdatedModal == PatientChart.FamilyMedicalHistory
        && res.data.SaveRecord == true){
          this.CreatePastMedicalHistories(false);
        }
    });
  }

}
