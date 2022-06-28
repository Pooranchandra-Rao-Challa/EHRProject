import { ProviderPatient } from './../../../_models/_provider/Providerpatient';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { PatientService } from '../../../_services/patient.service';
import {
  AdvancedDirective, ChartInfo, PatientChart, Allergies, EncounterDiagnosis, PastMedicalHistories, Actions,
  Immunizations, Medications, EncounterInfo, NewAppointment, SmokingStatus, TobaccoUseScreenings, TobaccoUseInterventions
} from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from "@angular/common";
const moment = require('moment');
import { EncounterDialogComponent } from '../../../dialogs/encounter.dialog/encounter.dialog.component';


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

  dialogResponse = null;
  // advancedDirectives: AdvancedDirective[];
  allDiagnoses: EncounterDiagnosis[];
  allAllergies = [] as Allergies;
  pastMedicalHistories = [] as PastMedicalHistories;
  immunizations: Immunizations[];
  medications: Medications[];
  encounters: EncounterInfo[];
  appointments: NewAppointment[];
  // smokingstatus: SmokingStatus[];
  tobaccoscreenings: TobaccoUseScreenings[];
  tobaccointerventions: TobaccoUseInterventions[];
  advanceddirectivesdialogResponse: any;
  smokingstatusdialogResponse: any;
  allergyType: any;
  severityLevel: any;
  onsetAt: any;
  allergens: any;
  allergyReaction: any;
  currentPatient: ProviderPatient;
  ActionTypes = Actions;
  chartInfo: ChartInfo = new ChartInfo;
  constructor(public overlayService: OverlayService,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe) {
  }

  ngOnInit(): void {
    this.allergyType = ['Medication', 'Food', 'Environment'];
    this.severityLevel = ['Very Mild', 'Mild', 'Moderate', 'Severe'];
    this.onsetAt = ['Childhood', 'Adulthood', 'Unknown'];
    this.allergens = ['1,1-diphenylethylene', '1,2-dioleoyl-sn-glycero-3-phosphocholine', '2-methoxynaphthoquinone'];
    this.allergyReaction = ['Anaphylaxis', 'Bloating/gas', 'Chest Pain', 'Cough'];
    this.currentPatient = this.authService.viewModel.Patient;
    this.ChartInfo();
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, actions: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (actions == Actions.view && content === this.advancedDirectivesDialogComponent) {
      reqdata = dialogData;
    }
    else if (actions == Actions.view && content === this.smokingStatusDialogComponent) {
      reqdata = dialogData;
    }
    else if (actions == Actions.new && content === this.encounterDialogComponent) {
      reqdata = this.authService.viewModel.PatientView;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      if (content === this.advancedDirectivesDialogComponent) {
        this.advanceddirectivesdialogResponse = res.data;
      }
      else if (content === this.smokingStatusDialogComponent) {
        this.smokingstatusdialogResponse = res.data;
      }
      else if (content === this.interventionDialogComponent) {
        this.dialogResponse = res.data;
      }
      else if (res.data == null) {
        reqdata = dialogData;
      }
      this.UpdateView(res.data);
    });
  }

  UpdateView(data) {
    if (data.UpdatedModal == PatientChart.AdvancedDirectives) {
      this.AdvancedDirectivesByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.SmokingStatus) {
      this.SmokingStatusByPatientId();
    }
    data = {};
  }

  ChartInfo() {
    this.patientService.ChartInfo({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.chartInfo = resp.Result;
      this.pastMedicalHistories = this.chartInfo.PastMedicalHistories[0];
    });
  }

  resetDialog() {
    this.allAllergies = new Allergies;
  }

  editDialog(dialogData, name) {
    if (name == 'past medical history') {
      this.pastMedicalHistories = dialogData;
    }
    else if (name == 'allergie') {
      if (dialogData.StartAt != undefined) {
        dialogData.StartAt = moment(dialogData.StartAt).format('YYYY-MM-DD');
      }
      if (dialogData.EndAt != undefined) {
        dialogData.EndAt = moment(dialogData.EndAt).format('YYYY-MM-DD');
      }
      this.allAllergies = dialogData;
      this.allAllergies.AllergenId = dialogData.AllergenId;
    }
  }

  CreatePastMedicalHistories() {
    this.patientService.CreatePastMedicalHistories(this.pastMedicalHistories).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.PastMedicalHistoriesByPatientId();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CPMH002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CPMH001"]);
      }
    });
  }

  CreateAllergies() {
    let isAdd = this.allAllergies.AlergieId == "";
    this.allAllergies.PatientId = this.currentPatient.PatientId;
    this.allAllergies.StartAt = this.datepipe.transform(this.allAllergies.StartAt, "MM/dd/yyyy hh:mm:ss");
    this.allAllergies.EndAt = this.datepipe.transform(this.allAllergies.EndAt, "MM/dd/yyyy hh:mm:ss");
    this.allAllergies.EncounterId = '60d72688391cba0e236c28c8';
    this.patientService.CreateAllergies(this.allAllergies).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.AllergiesByPatientId();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CA001" : "M2CA002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CA001"]);
      }
    });
  }

  disablePastMedicalHistory() {
    return !(this.pastMedicalHistories.MajorEvents != ''
      && this.pastMedicalHistories.OngoingProblems != ''
      && this.pastMedicalHistories.PerventiveCare != ''
      && this.pastMedicalHistories.NutritionHistory != '')
  }

  disableAllergies() {
    return !(this.allAllergies.AllergenType != undefined
      && this.allAllergies.AllergenName != undefined
      && this.allAllergies.SeverityLevel != undefined
      && this.allAllergies.OnSetAt != undefined
      && this.allAllergies.Reaction != undefined
      && this.allAllergies.StartAt != undefined)
  }

  // Get advanced directives info
  AdvancedDirectivesByPatientId() {
    this.patientService.AdvancedDirectivesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.chartInfo.AdvancedDirectives = resp.ListResult;
    });
  }

  // Get diagnoses info
  DiagnosesByPatientId() {
    this.patientService.DiagnosesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.allDiagnoses = resp.ListResult;
    });
  }

  // Get allergies info
  AllergiesByPatientId() {
    this.patientService.AllergiesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.chartInfo.Alergies = resp.ListResult;
    });
  }

  // Get Past Medical Histories info
  PastMedicalHistoriesByPatientId() {
    this.patientService.PastMedicalHistoriesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      // this.pastMedicalHistories = resp.ListResult;
      this.chartInfo.PastMedicalHistories = resp.ListResult;
    });
  }

  // Get Immunizations info
  ImmunizationsByPatientId() {
    this.patientService.ImmunizationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.immunizations = resp.ListResult;
    });
  }

  // Get medications info
  MedicationsByPatientId() {
    this.patientService.MedicationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.medications = resp.ListResult;
    });
  }

  // Get encounters info
  EncountersByPatientId() {
    this.patientService.EncountersByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.encounters = resp.ListResult;
    });
  }

  // Get appointments info
  AppointmentsByPatientId() {
    this.patientService.AppointmentsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.appointments = resp.ListResult;
    });
  }

  // Get smoking status info
  SmokingStatusByPatientId() {
    this.patientService.SmokingStatusByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.chartInfo.SmokingStatuses = resp.ListResult;
    });
  }

  // Get tobacco screnning info
  TobaccoUseScreenings() {
    this.patientService.TobaccoUseScreenings({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      this.tobaccoscreenings = resp.ListResult;
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
}
