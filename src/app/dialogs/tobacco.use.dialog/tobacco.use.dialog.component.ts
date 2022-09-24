import { pipe } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, GlobalConstants, TobaccoUseConstants, TobaccoUse, TobaccoUseInterventions, TobaccoUseScreenings, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AddeditinterventionComponent } from '../addeditintervention/addeditintervention.component';
import { ComponentType } from '@angular/cdk/portal';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tobacco.use.dialog',
  templateUrl: './tobacco.use.dialog.component.html',
  styleUrls: ['./tobacco.use.dialog.component.scss']
})
export class TobaccoUseDialogComponent implements OnInit {
  patientTobaccoUse: TobaccoUse = new TobaccoUse();
  screeningColumns: string[] = ['DatePerf', 'Screeningperf', 'Status', 'TobaccoUsecode_desc'];
  interventionColumns: string[] = ['DatePerf', 'Interventionperf', 'InterventionDesc', 'AddReasonNotPerformed', 'Reason'];
  currentPatient: ProviderPatient;
  tobaccoScreenings: TobaccoUseScreenings[] = [];
  tobaccoInterventions: TobaccoUseInterventions[] = [];
  cqmNotPerformedDialogComponent = AddeditinterventionComponent;
  ActionTypes = Actions;
  screeningPerformed: TobaccoUseConstants;
  screeningTobaccoStatus: TobaccoUseConstants;
  screeningTobaccoStatusFilter: TobaccoUseConstants;
  interventionPerformed: TobaccoUseConstants;
  interventionTobaccoStatus: TobaccoUseConstants;
  interventionTobaccoStatusFilter: TobaccoUseConstants;
  tobacooUseScreeningsSubject = new BehaviorSubject<TobaccoUseScreenings[]>([]);
  tobacooUseInterventionsSubject = new BehaviorSubject<TobaccoUseInterventions[]>([]);

  constructor(private patientService: PatientService,
    private authService: AuthenticationService,
    public overlayService: OverlayService,
    private ref: EHROverlayRef,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    this.TobaccoUseScreenings();
    this.TobaccoUseInterventions();
    this.loadTobaccoUseConstants();
  }

  updateLocalModel(data: TobaccoUse) {
    this.patientTobaccoUse = new TobaccoUse;
    if (data == null) return;
    this.patientTobaccoUse = data;
  }

  loadTobaccoUseConstants() {
    this.screeningPerformed = TobaccoUseConstants.SCREENING_PERFORMED;
    this.screeningTobaccoStatus = TobaccoUseConstants.SCREENING_TOBACCO_STATUS;
    this.screeningTobaccoStatus = this.screeningTobaccoStatus.map((obj) => ({
      Code: obj.Code,
      Description: obj.Description,
      CodeDescription: obj.Code + ' - ' + obj.Description
    }));
    this.screeningTobaccoStatusFilter = this.screeningTobaccoStatus.slice();
    this.interventionPerformed = TobaccoUseConstants.INTERVENTION_PERFORMED;
    this.interventionTobaccoStatus = TobaccoUseConstants.INTERVENTION_TOBACCO_STATUS;
    this.interventionTobaccoStatus = this.interventionTobaccoStatus.map((obj) => ({
      Code: obj.Code,
      Description: obj.Description,
      CodeDescription: obj.Code + ' - ' + obj.Description
    }));
    this.interventionTobaccoStatusFilter = this.interventionTobaccoStatus.slice();
  }

  cancel() {
    this.ref.close(null);
  }

  // // Get tobacco interventions info
  // TobaccoUseByPatientId() {
  //   this.patientService.TobaccoUseByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
  //     if (resp.IsSuccess){
  //     this.tobaccoScreenings = resp.ListResult;
  //     this.tobaccoInterventions = resp.ListResult;
  //     this.tobacooUseScreeningsSubject.next(this.tobaccoScreenings);
  //     this.tobacooUseInterventionsSubject.next(this.tobaccoInterventions);
  //     }
  //   });
  // }

  // Get tobacco screnning info
  TobaccoUseScreenings() {
    this.patientService.TobaccoUseScreenings({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.tobaccoScreenings = resp.ListResult;
        this.tobacooUseScreeningsSubject.next(this.tobaccoScreenings);
      }
    });
  }

  // Get tobacco interventions info
  TobaccoUseInterventions() {
    this.patientService.TobaccoUseInterventions({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.tobaccoInterventions = resp.ListResult;
        this.tobacooUseInterventionsSubject.next(this.tobaccoInterventions);
      }
    });
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.cqmNotPerformedDialogComponent) {
      reqdata = {
        CessationInterventionId: dialogData,
        InterventionId: null
      }
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if (res.data != null && res.data.saved) {
        this.ref.close({
          refreshCQMNotPerformed: true
        });
      }
    });
  }

  CreateTobaccoUse() {
    let isAdd = this.patientTobaccoUse.TobaccoUseId == undefined;
    this.patientTobaccoUse.PatientId = this.currentPatient.PatientId;
    this.patientTobaccoUse.ScreeningDate = new Date(this.datepipe.transform(this.patientTobaccoUse.ScreeningDate, "yyyy-MM-dd", "en-US"));
    this.patientTobaccoUse.CI_Date = new Date(this.datepipe.transform(this.patientTobaccoUse.CI_Date, "yyyy-MM-dd", "en-US"));
    this.patientService.CreateTobaccoUse(this.patientTobaccoUse).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.TobaccoUse
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CTU001" : "M2CTU002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CTU001"]);
        this.cancel();
      }
    });
  }

  selectedScreeningStatus(screening) {
    this.patientTobaccoUse.ScreeningCode = screening.Code;
    this.patientTobaccoUse.ScreeningDescription = screening.Description;
  }

  selectedInterventionStatus(intervention) {
    this.patientTobaccoUse.CI_Code = intervention.Code;
    this.patientTobaccoUse.CI_Description = intervention.Description;
  }

  onSelectedRecordScreening() {
    let obj = {
      'ScreeningType': this.patientTobaccoUse.ScreeningType,
      'ScreeningDate': this.patientTobaccoUse.ScreeningDate,
      'Status': this.patientTobaccoUse.Status,
      'ScreeningCode': this.patientTobaccoUse.ScreeningCode,
      'ScreeningDescription': this.patientTobaccoUse.ScreeningDescription
    }
    this.tobaccoScreenings.push(obj);
    this.tobacooUseScreeningsSubject.next(this.tobaccoScreenings);
  }

  onSelectedRecordIntervention() {
    let reqparams = {
      'CI_Type': this.patientTobaccoUse.CI_Type,
      'CI_Date': this.patientTobaccoUse.CI_Date,
      'CI_Code': this.patientTobaccoUse.CI_Code,
      'CI_Description': this.patientTobaccoUse.CI_Description
    }
    this.tobaccoInterventions.push(reqparams);
    this.tobacooUseInterventionsSubject.next(this.tobaccoInterventions);
  }

  disableRecordScreening() {
    return !(this.patientTobaccoUse.ScreeningType == undefined ? '' : this.patientTobaccoUse.ScreeningType != ''
      && this.patientTobaccoUse.ScreeningDate == undefined ? '' : this.patientTobaccoUse.ScreeningDate.toString() != ''
        && this.patientTobaccoUse.ScreeningCode == undefined ? '' : this.patientTobaccoUse.ScreeningCode != ''
          && this.patientTobaccoUse.Status == undefined ? '' : this.patientTobaccoUse.Status != '')
  }

  disableRecordIntervention() {
    return !(this.patientTobaccoUse.CI_Type == undefined ? '' : this.patientTobaccoUse.CI_Type != ''
      && this.patientTobaccoUse.CI_Date == undefined ? '' : this.patientTobaccoUse.CI_Date.toString() != ''
        && this.patientTobaccoUse.CI_Code == undefined ? '' : this.patientTobaccoUse.CI_Code != '')
  }

  disableTobaccoUse() {
    return !(this.patientTobaccoUse.ScreeningType == undefined ? '' : this.patientTobaccoUse.ScreeningType != ''
      && this.patientTobaccoUse.ScreeningDate == undefined ? '' : this.patientTobaccoUse.ScreeningDate.toString() != ''
        && this.patientTobaccoUse.ScreeningCode == undefined ? '' : this.patientTobaccoUse.ScreeningCode != ''
          && this.patientTobaccoUse.Status == undefined ? '' : this.patientTobaccoUse.Status != ''
            && this.patientTobaccoUse.CI_Type == undefined ? '' : this.patientTobaccoUse.CI_Type != ''
              && this.patientTobaccoUse.CI_Date == undefined ? '' : this.patientTobaccoUse.CI_Date.toString() != ''
                && this.patientTobaccoUse.CI_Code == undefined ? '' : this.patientTobaccoUse.CI_Code != '')
  }
}
