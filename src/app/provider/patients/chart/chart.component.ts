import { ProviderPatient } from './../../../_models/_provider/Providerpatient';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { PatientService } from '../../../_services/patient.service';
import { AdvancedDirective, ChartInfo, PatientChart } from 'src/app/_models/_provider/chart';
import { Actions } from 'src/app/_models/_provider/smart.scheduler.data';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Console } from 'console';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  advancedDirectivesDialogComponent = AdvancedDirectivesDialogComponent;
  smokingStatusDialogComponent = SmokingStatusDialogComponent;
  interventionDialogComponent = InterventionDialogComponent;

  dialogResponse = null;
  advancedDirectives: any[];
  allDiagnoses: any[];
  allAllergies: any[];
  pastMedicalHistories: any[];
  immunizations: any[];
  medications: any[];
  encounters: any[];
  appointments: any[];
  smokingstatus: any[];
  tobaccoscreenings: any[];
  tobaccointerventions: any[];
  advanceddirectivesdialogResponse: any;
  smokingstatusdialogResponse: any;

  currentPatient: ProviderPatient;
  ActionTypes = Actions;
  chartInfo: ChartInfo = new ChartInfo;
  constructor(public overlayService: OverlayService,
    private patientService: PatientService,
    private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    // this.AdvancedDirectivesByPatientId();
    // this.DiagnosesByPatientId();
    // this.AllergiesByPatientId();
    // this.PastMedicalHistoriesByPatientId();
    // this.ImmunizationsByPatientId();
    // this.MedicationsByPatientId();
    // this.EncountersByPatientId();
    // this.AppointmentsByPatientId();
    // this.SmokingStatusByPatientId();
    // this.TobaccoUseScreenings();
    // this.TobaccoUseInterventions();
    this.ChartInfo();
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, actions: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (actions == Actions.view && content === this.advancedDirectivesDialogComponent) {
      reqdata = dialogData;
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
      this.UpdateView(ref.data);
    });
  }

  UpdateView(data) {
    if (data.UpdatedModal == PatientChart.AdvancedDirectives) {
      this.AdvancedDirectivesByPatientId();
    }
    data = {};
  }

  ChartInfo() {
    this.patientService.ChartInfo({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.chartInfo = resp.Result;
    });
  }

  // Get advanced directives info
  AdvancedDirectivesByPatientId() {
    this.patientService.AdvancedDirectivesByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.advancedDirectives = resp.ListResult;
    });
  }

  // Get diagnoses info
  DiagnosesByPatientId() {
    this.patientService.DiagnosesByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.allDiagnoses = resp.ListResult;
    });
  }

  // Get allergies info
  AllergiesByPatientId() {
    this.patientService.AllergiesByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.allAllergies = resp.ListResult;
    });
  }

  // Get Past Medical Histories info
  PastMedicalHistoriesByPatientId() {
    this.patientService.PastMedicalHistoriesByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.pastMedicalHistories = resp.ListResult;
    });
  }

  // Get Immunizations info
  ImmunizationsByPatientId() {
    this.patientService.ImmunizationsByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.immunizations = resp.ListResult;
    });
  }

  // Get medications info
  MedicationsByPatientId() {
    this.patientService.MedicationsByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.medications = resp.ListResult;
    });
  }

  // Get encounters info
  EncountersByPatientId() {
    this.patientService.EncountersByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.encounters = resp.ListResult;
    });
  }

  // Get appointments info
  AppointmentsByPatientId() {
    this.patientService.AppointmentsByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.appointments = resp.ListResult;
    });
  }

  // Get smoking status info
  SmokingStatusByPatientId() {
    this.patientService.SmokingStatusByPatientId({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.smokingstatus = resp.ListResult;
    });
  }

  // Get tobacco screnning info
  TobaccoUseScreenings() {
    this.patientService.TobaccoUseScreenings({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
      this.tobaccoscreenings = resp.ListResult;
    });
  }

  // Get tobacco interventions info
  TobaccoUseInterventions() {
    this.patientService.TobaccoUseInterventions({PatientId: this.currentPatient.PatientId}).subscribe((resp) => {
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
