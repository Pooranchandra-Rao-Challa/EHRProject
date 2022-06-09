import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { patientService } from '../../../_services/patient.service';

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
  PatientId: any = {};
  constructor(public overlayService: OverlayService,
    private patientService: patientService) {
    this.PatientId = {
      'PatientId': sessionStorage.getItem('PatientId')
    }
  }

  ngOnInit(): void {
    this.AdvancedDirectivesByPatientId();
    this.DiagnosesByPatientId();
    this.AllergiesByPatientId();
    this.PastMedicalHistoriesByPatientId();
    this.ImmunizationsByPatientId();
    this.MedicationsByPatientId();
    this.EncountersByPatientId();
    this.AppointmentsByPatientId();
    this.SmokingStatusByPatientId();
    this.TobaccoUseScreenings();
    this.TobaccoUseInterventions();
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string, dialogData) {
    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {

      }
      else if (content === this.advancedDirectivesDialogComponent) {
        this.advanceddirectivesdialogResponse = res.data;
      }
      else if (content === this.smokingStatusDialogComponent) {
        this.smokingstatusdialogResponse = res.data;
      }
      else if (content === this.interventionDialogComponent) {
        this.dialogResponse = res.data;
      }
    });
  }

  // Get advanced directives info
  AdvancedDirectivesByPatientId() {
    this.patientService.AdvancedDirectivesByPatientId(this.PatientId).subscribe((resp) => {
      this.advancedDirectives = resp.ListResult;
    });
  }

  // Get diagnoses info
  DiagnosesByPatientId() {
    this.patientService.DiagnosesByPatientId(this.PatientId).subscribe((resp) => {
      this.allDiagnoses = resp.ListResult;
    });
  }

  // Get allergies info
  AllergiesByPatientId() {
    this.patientService.AllergiesByPatientId(this.PatientId).subscribe((resp) => {
      this.allAllergies = resp.ListResult;
    });
  }

  // Get Past Medical Histories info
  PastMedicalHistoriesByPatientId() {
    this.patientService.PastMedicalHistoriesByPatientId(this.PatientId).subscribe((resp) => {
      this.pastMedicalHistories = resp.ListResult;
    });
  }

  // Get Immunizations info
  ImmunizationsByPatientId() {
    this.patientService.ImmunizationsByPatientId(this.PatientId).subscribe((resp) => {
      this.immunizations = resp.ListResult;
    });
  }

  // Get medications info
  MedicationsByPatientId() {
    this.patientService.MedicationsByPatientId(this.PatientId).subscribe((resp) => {
      this.medications = resp.ListResult;
    });
  }

  // Get encounters info
  EncountersByPatientId() {
    this.patientService.EncountersByPatientId(this.PatientId).subscribe((resp) => {
      this.encounters = resp.ListResult;
    });
  }

  // Get appointments info
  AppointmentsByPatientId() {
    this.patientService.AppointmentsByPatientId(this.PatientId).subscribe((resp) => {
      this.appointments = resp.ListResult;
    });
  }

  // Get smoking status info
  SmokingStatusByPatientId() {
    this.patientService.SmokingStatusByPatientId(this.PatientId).subscribe((resp) => {
      this.smokingstatus = resp.ListResult;
    });
  }

  // Get tobacco screnning info
  TobaccoUseScreenings() {
    this.patientService.TobaccoUseScreenings(this.PatientId).subscribe((resp) => {
      this.tobaccoscreenings = resp.ListResult;
    });
  }

  // Get tobacco interventions info
  TobaccoUseInterventions() {
    this.patientService.TobaccoUseInterventions(this.PatientId).subscribe((resp) => {
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
