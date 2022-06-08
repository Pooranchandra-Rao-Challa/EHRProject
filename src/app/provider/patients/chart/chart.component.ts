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

  constructor(public overlayService: OverlayService,
    private patientService: patientService) { }

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
        this.dialogResponse = res.data;
      }
      else if (content === this.interventionDialogComponent) {
        this.dialogResponse = res.data;
      }
    });
  }

  // Common Reqparams for chart screen
  reqparams = {
    // ClinicId: '5836d8f2f2e48f33037e5e39',
    // ProviderId: '5836d7d1f2e48f310385069c',
    PatientId: '5836dafef2e48f36ba90a996'
  }

  // Get advanced directives info
  AdvancedDirectivesByPatientId() {
    this.patientService.AdvancedDirectivesByPatientId(this.reqparams).subscribe((resp) => {
      this.advancedDirectives = resp.ListResult;
    });
  }

  // Get diagnoses info
  DiagnosesByPatientId() {
    let reqparams = {
      // ClinicId: '59307584bc61173526a63361',
      // ProviderId: '59307582bc61173526a63336',
      PatientId: '59841816bc61176759627700'
    }
    this.patientService.DiagnosesByPatientId(reqparams).subscribe((resp) => {
      this.allDiagnoses = resp.ListResult;
    });
  }

  // Get allergies info
  AllergiesByPatientId() {
    let reqparams = {
      // ClinicId: '5953c325bc611739aaf8c0e7',
      // ProviderId: '5953c323bc611739aaf8c0bc',
      PatientId: '59dd3796bc6117730c9ca3d3'
    }
    this.patientService.AllergiesByPatientId(reqparams).subscribe((resp) => {
      this.allAllergies = resp.ListResult;
    });
  }

  // Get Past Medical Histories info
  PastMedicalHistoriesByPatientId() {
    let reqparams = {
      // ClinicId: '5953c325bc611739aaf8c0e7',
      // ProviderId: '5953c323bc611739aaf8c0bc',
      PatientId: '59dd3796bc6117730c9ca3d3'
    }
    this.patientService.PastMedicalHistoriesByPatientId(reqparams).subscribe((resp) => {
      this.pastMedicalHistories = resp.ListResult;
    });
  }

  // Get Immunizations info
  ImmunizationsByPatientId() {
    let reqparams = {
      // ClinicId: '59307584bc61173526a63361',
      // ProviderId: '59307582bc61173526a63336',
      PatientId: '5ab94defbc61173a61c5cf1c'
    }
    this.patientService.ImmunizationsByPatientId(reqparams).subscribe((resp) => {
      this.immunizations = resp.ListResult;
    });
  }

  // Get medications info
  MedicationsByPatientId() {
    let reqparams = {
      // ClinicId: '5953c325bc611739aaf8c0e7',
      // ProviderId: '5953c323bc611739aaf8c0bc',
      PatientId: '59e8c25bbc61170be57c869f'
    }
    this.patientService.MedicationsByPatientId(reqparams).subscribe((resp) => {
      this.medications = resp.ListResult;
    });
  }

  // Get encounters info
  EncountersByPatientId() {
    let reqparams = {
      // ClinicId: '5836d8f2f2e48f33037e5e39',
      // ProviderId: '5836d7d1f2e48f310385069c',
      PatientId: '5836dafef2e48f36ba90a996'
    }
    this.patientService.EncountersByPatientId(reqparams).subscribe((resp) => {
      this.encounters = resp.ListResult;
    });
  }

  // Get appointments info
  AppointmentsByPatientId() {
    let reqparams = {
      // ClinicId: '5836d8eff2e48f33037e5cd5',
      // ProviderId: '5836d7cff2e48f3103850699',
      PatientId: '5836db02f2e48f36ba90ac4a'
    }
    this.patientService.AppointmentsByPatientId(reqparams).subscribe((resp) => {
      this.appointments = resp.ListResult;
    });
  }

  // Get smoking status info
  SmokingStatusByPatientId() {
    let reqparams = {
      PatientId: '5836daf4f2e48f36ba90a383'
    }
    this.patientService.SmokingStatusByPatientId(reqparams).subscribe((resp) => {
      this.smokingstatus = resp.ListResult;
    });
  }

  // Get tobacco screnning info
  TobaccoUseScreenings() {
    let reqparams = {
      PatientId: '588ba54ec1a4c002ab2b38f3'
    }
    this.patientService.TobaccoUseScreenings(reqparams).subscribe((resp) => {
      this.tobaccoscreenings = resp.ListResult;
    });
  }

  // Get tobacco interventions info
  TobaccoUseInterventions() {
    let reqparams = {
      PatientId: '588ba54ec1a4c002ab2b38f3'
    }
    this.patientService.TobaccoUseInterventions(reqparams).subscribe((resp) => {
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
