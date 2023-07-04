
import { Intervention } from './../../_models/_provider/chart';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, TobaccoUseConstants, TobaccoUse, TobaccoUseIntervention, TobaccoUseScreening, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AddeditinterventionComponent } from '../addeditintervention/addeditintervention.component';
import { ComponentType } from '@angular/cdk/portal';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

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
  tobaccoScreening: TobaccoUseScreening = {};
  tobaccoIntervention: TobaccoUseIntervention = {};
  editScreeningUpdated:boolean = false;
  editInterventionUpdated:boolean = false;
  cqmNotPerformedDialogComponent = AddeditinterventionComponent;
  ActionTypes = Actions;
  screeningPerformed: TobaccoUseConstants;
  screeningTobaccoStatus: TobaccoUseConstants;
  screeningTobaccoStatusFilter: TobaccoUseConstants;
  interventionPerformed: TobaccoUseConstants;
  interventionTobaccoStatus: TobaccoUseConstants;
  interventionTobaccoStatusFilter: TobaccoUseConstants;
  tobacooUseScreeningsSubject = new BehaviorSubject<TobaccoUseScreening[]>([]);
  tobacooUseInterventionsSubject = new BehaviorSubject<TobaccoUseIntervention[]>([]);
  selectionForScreening = new SelectionModel<TobaccoUseScreening>(false, []);
  selectionForIntervention = new SelectionModel<TobaccoUseIntervention>(false, []);
  selectedScreeningIndex?:number = -1;
  selectedInterventionIndex?:number = -1;

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
    this.loadTobaccoUseConstants();
  }

  updateLocalModel(data: any) {

    this.patientTobaccoUse = {};
    this.patientTobaccoUse.Screenings = [];
    this.patientTobaccoUse.Interventions = [];
    if (data == null) return;
    if (data.tobaccoUse)
      this.patientTobaccoUse = data.tobaccoUse;
    if (this.patientTobaccoUse.Screenings)
      this.tobacooUseScreeningsSubject.next(this.patientTobaccoUse.Screenings);
    if (this.patientTobaccoUse.Interventions)
      this.tobacooUseInterventionsSubject.next(this.patientTobaccoUse.Interventions);

    if (data.screening){
      this.tobaccoScreening = Object.assign(this.tobaccoScreening,data.screening) ;
      let sdata = this.patientTobaccoUse.Screenings.filter((value) => value.ScreeningId == this.tobaccoScreening.ScreeningId)[0]
      this.selectedScreeningIndex = this.patientTobaccoUse.Screenings.indexOf(sdata);
      this.selectionForScreening.select(sdata)
    }

    if (data.intervention){
      this.tobaccoIntervention = Object.assign(this.tobaccoIntervention,data.intervention) ;
      let sdata = this.patientTobaccoUse.Interventions.filter((value) => value.InterventionId == this.tobaccoIntervention.InterventionId)[0]
      this.selectedInterventionIndex = this.patientTobaccoUse.Interventions.indexOf(sdata);
      this.selectionForIntervention.select(sdata)
    }
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
    this.ref.close({
      "UpdatedModal": PatientChart.TobaccoUse
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
    this.patientTobaccoUse.Screenings.forEach(value =>{
      value.strScreeningDate = this.datepipe.transform(value.ScreeningDate, "MM/dd/yyyy hh:mm:ss a", "en-US");
    })
    this.patientTobaccoUse.Interventions.forEach(value =>{
      value.strInterventionDate = this.datepipe.transform(value.InterventionDate, "MM/dd/yyyy hh:mm:ss a", "en-US");
    });
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
    this.tobaccoScreening.ScreeningCode = screening.Code;
    this.tobaccoScreening.ScreeningDescription = screening.Description;
  }

  selectedInterventionStatus(intervention) {
    this.tobaccoIntervention.InterventionCode = intervention.Code;
    this.tobaccoIntervention.InterventionDescription = intervention.Description;
  }

  onSelectedRecordScreening() {

    this.editScreeningUpdated = true;

    if(this.selectedScreeningIndex>=0){
      let local: TobaccoUseScreening ={};
      local = Object.assign(local,this.tobaccoScreening);
      this.patientTobaccoUse.Screenings[this.selectedScreeningIndex] = local;
    }else{
      let local: TobaccoUseScreening ={};
      local = Object.assign(local,this.tobaccoScreening);
      this.patientTobaccoUse.Screenings.push(local);
    }
    this.tobaccoScreening = {};
    this.selectedScreeningIndex = -1;
    this.tobacooUseScreeningsSubject.next(this.patientTobaccoUse.Screenings);

  }

  onSelectedRecordIntervention() {
    this.editInterventionUpdated = true;
    if(this.selectedInterventionIndex>=0){
      let local: TobaccoUseIntervention ={};
      local = Object.assign(local,this.tobaccoIntervention);
      this.patientTobaccoUse.Interventions[this.selectedInterventionIndex] = local;
    }else{
      let local: TobaccoUseIntervention ={};
      local = Object.assign(local,this.tobaccoIntervention);
      this.patientTobaccoUse.Interventions.push(local);
    }
    this.tobaccoIntervention = {};
    this.selectedInterventionIndex = -1;
    this.tobacooUseInterventionsSubject.next(this.patientTobaccoUse.Interventions);
  }

  onScreeningRowSelection(event,data){
    this.selectedScreeningIndex = this.patientTobaccoUse.Screenings.indexOf(data)
    this.tobaccoScreening = Object.assign(this.tobaccoScreening,data);
    if(this.selectionForScreening.isSelected(data)){
      this.selectedScreeningIndex = -1;
      this.tobaccoScreening = {};
    }
  }

  onInterventionRowSelection(event,data){
    this.selectedInterventionIndex = this.patientTobaccoUse.Interventions.indexOf(data)
    this.tobaccoIntervention = Object.assign(this.tobaccoIntervention,data);
    if(this.selectionForIntervention.isSelected(data)){
      this.selectedInterventionIndex = -1;
      this.tobaccoIntervention = {};
    }

  }

  disableRecordScreening() {
    return !(this.tobaccoScreening.ScreeningType
      && this.tobaccoScreening.ScreeningDate
      && this.tobaccoScreening.ScreeningCode
      && this.tobaccoScreening.ScreeningStatus);
  }

  disableRecordIntervention() {
    return !(this.tobaccoIntervention.InterventionType
      && this.tobaccoIntervention.InterventionDate
      && this.tobaccoIntervention.InterventionCode);
  }

  disableTobaccoUse() {


    if(this.patientTobaccoUse.TobaccoUseId)
      return !(this.editScreeningUpdated ||
             this.editInterventionUpdated)
    else if(this.editScreeningUpdated && this.editInterventionUpdated)
        return !this.disableRecordScreening() || !this.disableRecordIntervention();
    else return true;

  }
}
