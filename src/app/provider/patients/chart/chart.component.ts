import { ProviderPatient } from './../../../_models/_provider/Providerpatient';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { PatientService } from '../../../_services/patient.service';
import {
  ScheduledAppointment,
  AdvancedDirective, ChartInfo, PatientChart, Allergy, EncounterDiagnosis, PastMedicalHistory, Actions,
  Immunizations, Medication, EncounterInfo, NewAppointment, SmokingStatus, TobaccoUseScreenings, TobaccoUseInterventions,
  Diagnosis, AllergyType, SeverityLevel, OnSetAt, Allergens, AllergyReaction, DiagnosisDpCodes, PracticeProviders, AppointmentTypes, UserLocations, Room, AppointmentDialogInfo
} from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from "@angular/common";
const moment = require('moment');
import { EncounterDialogComponent } from '../../../dialogs/encounter.dialog/encounter.dialog.component';
import { NewAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/newappointment.dialog.component';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  advancedDirectivesDialogComponent = AdvancedDirectivesDialogComponent;
  smokingStatusDialogComponent = SmokingStatusDialogComponent;
  interventionDialogComponent = InterventionDialogComponent;
  encounterDialogComponent = EncounterDialogComponent;
  appointmentDialogComponent = NewAppointmentDialogComponent;
  // advancedDirectives: AdvancedDirective[];
  patientDiagnoses: Diagnosis = new Diagnosis();
  patientAllergy: Allergy = new Allergy();
  patientPastMedicalHistory: PastMedicalHistory = new PastMedicalHistory();
  immunizations: Immunizations[];
  patientMedication: Medication = new Medication();
  // encounters: EncounterInfo[];
  appointments: NewAppointment[];
  // smokingstatus: SmokingStatus[];
  tobaccoscreenings: TobaccoUseScreenings[];
  tobaccointerventions: TobaccoUseInterventions[];
  allergyType: AllergyType[];
  severityLevel: SeverityLevel[];
  onsetAt: OnSetAt[];
  allergens: Allergens[];
  allergyReaction: AllergyReaction[];
  DxCodes: DiagnosisDpCodes[];
  currentPatient: ProviderPatient;
  ActionTypes = Actions;
  chartInfo: ChartInfo = new ChartInfo;
  PatientAppointment: NewAppointment = {};
  PracticeProviders: PracticeProviders[]
  AppointmentTypes: AppointmentTypes[]
  Locations: UserLocations[]
  Rooms: Room[]
  medication_prescription: any;
  locationColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];

  constructor(public overlayService: OverlayService,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private smartSchedulerService: SmartSchedulerService) {
  }

  ngOnInit(): void {
    this.reasons();
    this.enums();
    this.currentPatient = this.authService.viewModel.Patient;
    this.ChartInfo();
    this.loadDefaults();
  }

  reason: { ReasonCode: string; ReasonDescription: string; }[];
  filteredreason: { ReasonCode: string; ReasonDescription: string; }[];

  reasons() {
    this.reason = [
      { ReasonCode: '183945002', ReasonDescription: 'Procedure refused for religious reason (situation)' },
      { ReasonCode: '397745006', ReasonDescription: 'Medical contraindication (finding)' },
      { ReasonCode: '413310006', ReasonDescription: 'Patient non-compliant' }
    ];
    this.filteredreason = this.reason.slice();
  }

  selectedReason(searchItem) {
    var filterReason = this.reason.filter(x => x.ReasonCode === searchItem);
    this.patientMedication.ReasonCode = filterReason[0].ReasonCode;
    this.patientMedication.ReasonDescription = filterReason[0].ReasonDescription;
  }

  enums() {
    this.allergyType = Object.values(AllergyType);
    this.severityLevel = Object.values(SeverityLevel);
    this.onsetAt = Object.values(OnSetAt);
    this.allergens = Object.values(Allergens);
    this.allergyReaction = Object.values(AllergyReaction);
    this.DxCodes = Object.values(DiagnosisDpCodes);
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.advancedDirectivesDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.smokingStatusDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.new && content === this.encounterDialogComponent) {
      if (dialogData != null) reqdata = dialogData as ScheduledAppointment;
      else reqdata = this.authService.viewModel.Patient;
      if (reqdata.PatientId == null)
        reqdata.PatientId = this.currentPatient.PatientId;

    } else if (action == Actions.new && content === this.appointmentDialogComponent) {
      reqdata = this.PatientAppointmentInfo(action);
    }

    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {

      this.UpdateView(res.data);
    });
  }

  UpdateView(data) {
    if (data == null) return;
    if (data.UpdatedModal == PatientChart.AdvancedDirectives) {
      this.AdvancedDirectivesByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.SmokingStatus) {
      this.SmokingStatusByPatientId();
    } else if (data.UpdatedModal == PatientChart.Encounters) {
      this.EncountersByPatientId();
    }

  }

  ChartInfo() {
    this.patientService.ChartInfo({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.chartInfo = resp.Result;
      }
    });
  }

  resetDialog() {
    this.patientMedication = new Medication;
    this.patientAllergy = new Allergy;
    this.patientPastMedicalHistory = new PastMedicalHistory;
    this.patientDiagnoses = new Diagnosis;
  }

  editDialog(dialogData, name) {
    if (name == 'past medical history') {
      this.patientPastMedicalHistory = dialogData;
    }
    else if (name == 'allergie') {
      if (dialogData.StartAt != undefined) {
        dialogData.StartAt = moment(dialogData.StartAt).format('YYYY-MM-DD');
      }
      if (dialogData.EndAt != undefined) {
        dialogData.EndAt = moment(dialogData.EndAt).format('YYYY-MM-DD');
      }
      this.patientAllergy = dialogData;
      this.patientAllergy.AllergenId = dialogData.AllergenId;
    }
    else if (name == 'diagnosis') {
      if (dialogData.StopAt != undefined) {
        dialogData.StopAt = moment(dialogData.StopAt).format('YYYY-MM-DD');
      }
      this.patientDiagnoses = dialogData;
    }
    else if (name == 'medication') {
      this.patientMedication = dialogData;
    }
  }

  CreatePastMedicalHistories() {
    let isAdd = this.patientPastMedicalHistory.PastMedicalHistoryId == undefined;
    this.patientPastMedicalHistory.PatientId = this.currentPatient.PatientId;
    this.patientService.CreatePastMedicalHistories(this.patientPastMedicalHistory).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.PastMedicalHistoriesByPatientId();
        this.resetDialog();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CPMH001" : "M2CPMH002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CPMH001"]);
        this.resetDialog();
      }
    });
  }

  CreateAllergies() {
    let isAdd = this.patientAllergy.AlergieId == undefined;
    this.patientAllergy.PatientId = this.currentPatient.PatientId;
    this.patientAllergy.StartAt = this.datepipe.transform(this.patientAllergy.StartAt, "MM/dd/yyyy hh:mm:ss");
    this.patientAllergy.EndAt = this.datepipe.transform(this.patientAllergy.EndAt, "MM/dd/yyyy hh:mm:ss");
    this.patientAllergy.EncounterId = '60d72688391cba0e236c28c8';
    this.patientService.CreateAllergies(this.patientAllergy).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.AllergiesByPatientId();
        this.resetDialog();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CA001" : "M2CA002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CA001"]);
        this.resetDialog();
      }
    });
  }

  todayStartAt() {
    this.patientDiagnoses.StartAt = new Date();
  }
  todayStopAt() {
    this.patientDiagnoses.StopAt = moment(new Date()).format('YYYY-MM-DD');
  }

  CreateDiagnoses() {
    debugger;
    let isAdd = this.patientDiagnoses.DiagnosisId == undefined;
    this.patientDiagnoses.PatinetId = this.currentPatient.PatientId;
    this.patientDiagnoses.StopAt = this.datepipe.transform(this.patientDiagnoses.StopAt, "MM/dd/yyyy hh:mm:ss");
    this.patientService.CreateDiagnoses(this.patientDiagnoses).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.DiagnosesByPatientId();
        this.resetDialog();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CD001" : "M2CD002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CD001"]);
        this.resetDialog();
      }
    });
  }

  CreateMedication() {
    let isAdd = this.patientMedication.MedicationId == undefined;
    this.patientMedication.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateMedication(this.patientMedication).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.MedicationsByPatientId();
        this.resetDialog();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CM001" : "M2CM002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CM001"]);
        this.resetDialog();
      }
    });
  }

  disablePastMedicalHistory() {
    return !(this.patientPastMedicalHistory.MajorEvents == undefined ? '' : this.patientPastMedicalHistory.MajorEvents != ''
      && this.patientPastMedicalHistory.OngoingProblems == undefined ? '' : this.patientPastMedicalHistory.OngoingProblems != ''
        && this.patientPastMedicalHistory.PerventiveCare == undefined ? '' : this.patientPastMedicalHistory.PerventiveCare != ''
          && this.patientPastMedicalHistory.NutritionHistory == undefined ? '' : this.patientPastMedicalHistory.NutritionHistory != '')
  }

  disableAllergies() {
    return !(this.patientAllergy.AllergenType == undefined ? '' : this.patientAllergy.AllergenType != ''
      && this.patientAllergy.AllergenName == undefined ? '' : this.patientAllergy.AllergenName != ''
        && this.patientAllergy.SeverityLevel == undefined ? '' : this.patientAllergy.SeverityLevel != ''
          && this.patientAllergy.OnSetAt == undefined ? '' : this.patientAllergy.OnSetAt != ''
            && this.patientAllergy.Reaction == undefined ? '' : this.patientAllergy.Reaction != ''
              && this.patientAllergy.StartAt == undefined ? '' : this.patientAllergy.StartAt != '')
  }

  disableDiagnosis() {
    return !(this.patientDiagnoses.CodeSystem == undefined ? '' : this.patientDiagnoses.CodeSystem != ''
      && this.patientDiagnoses.Code == undefined ? '' : this.patientDiagnoses.Code != ''
        && this.patientDiagnoses.Description == undefined ? '' : this.patientDiagnoses.Description != ''
          && this.patientDiagnoses.StartAt == undefined ? '' : this.patientDiagnoses.StartAt.toString() != ''
            && this.patientDiagnoses.StopAt == undefined ? '' : this.patientDiagnoses.StopAt != ''
              && this.patientDiagnoses.Note == undefined ? '' : this.patientDiagnoses.Note != '')
  }

  disableMedication() {
    return !(this.patientMedication.DrugName == undefined ? '' : this.patientMedication.DrugName != ''
      && this.patientMedication.StartAt == undefined ? '' : this.patientMedication.StartAt.toString() != '')
  }

  // Get advanced directives info
  AdvancedDirectivesByPatientId() {
    this.patientService.AdvancedDirectivesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.AdvancedDirectives = resp.ListResult;
    });
  }

  // Get diagnoses info
  DiagnosesByPatientId() {
    this.patientService.DiagnosesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Diagnoses = resp.ListResult;
    });
  }

  // Get allergies info
  AllergiesByPatientId() {
    this.patientService.AllergiesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Alergies = resp.ListResult;
    });
  }

  // Get Past Medical Histories info
  PastMedicalHistoriesByPatientId() {
    this.patientService.PastMedicalHistoriesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      // this.pastMedicalHistories = resp.ListResult;
      if (resp.IsSuccess) this.chartInfo.PastMedicalHistories = resp.ListResult;
    });
  }

  // Get Immunizations info
  ImmunizationsByPatientId() {
    this.patientService.ImmunizationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.immunizations = resp.ListResult;
    });
  }

  // Get medications info
  MedicationsByPatientId() {
    this.patientService.MedicationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Medications = resp.ListResult;
    });
  }

  // Get encounters info
  EncountersByPatientId() {
    this.patientService.EncountersByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Encounters = resp.ListResult;
    });
  }

  // Get appointments info
  AppointmentsByPatientId() {
    this.patientService.AppointmentsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.appointments = resp.ListResult;
    });
  }

  // Get smoking status info
  SmokingStatusByPatientId() {
    this.patientService.SmokingStatusByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.SmokingStatuses = resp.ListResult;
    });
  }

  // Get tobacco screnning info
  TobaccoUseScreenings() {
    this.patientService.TobaccoUseScreenings({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.tobaccoscreenings = resp.ListResult;
    });
  }

  // Get tobacco interventions info
  TobaccoUseInterventions() {
    this.patientService.TobaccoUseInterventions({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.tobaccointerventions = resp.ListResult;
    });
  }

  TriggerRuleDD: any[] = [
    { value: 'ONE', viewValue: 'ONE' },
    { value: 'Two', viewValue: 'Two' },
    { value: 'Three', viewValue: 'Three' },
    { value: 'All', viewValue: 'All' },
  ];


  PatientAppointmentInfo(action: Actions) {

    let data = {} as AppointmentDialogInfo;
    //this.PatientAppointment = {} as NewAppointment;
    this.PatientAppointment.PatientId = this.currentPatient.PatientId;
    this.PatientAppointment.PatientName = this.currentPatient.FirstName + ' ' + this.currentPatient.LastName;
    this.PatientAppointment.LocationId = this.authService.userValue.CurrentLocation;
    this.PatientAppointment.ProviderId = this.currentPatient.ProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;
    data.Title = "New Appointment";
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = this.currentPatient.ProviderId;
    data.LocationId = this.authService.userValue.CurrentLocation;
    data.PatientAppointment = this.PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;
    data.status = action;
    return data;
  }

  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
    let preq = { "ProviderId": this.authService.userValue.ProviderId };
    this.smartSchedulerService.AppointmentTypes(preq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AppointmentTypes = resp.ListResult as AppointmentTypes[];
      }
    });
    this.Locations = JSON.parse(this.authService.userValue.LocationInfo);
    let lreq = { "LocationId": this.authService.userValue.CurrentLocation };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Rooms = resp.ListResult as Room[];
        // this.PatientAppointment.RoomId = this.Rooms[0].RoomId;
      }
    });
  }
}
