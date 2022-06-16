

import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { PracticeProviders } from 'src/app/_models/';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PatientService } from 'src/app/_services/patient.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import {
  Actions,
  ScheduledAppointment, AppointmentTypes,
  UserLocations
} from 'src/app/_models';
import {
  EncounterInfo, EncounterDiagnosis, ProceduresInfo, VitalInfo
} from 'src/app/_models';
import {
  MedicalCode
} from 'src/app/_models/codes';
import { MatRadioButton } from '@angular/material/radio';
import { BehaviorSubject } from 'rxjs'
import { OverlayService } from 'src/app/overlay.service';
import { VitalDialogComponent } from 'src/app/dialogs/vital.dalog/vital.dialog.component';
import { stringify } from 'querystring';
import { flatten } from '@angular/compiler';
const ELEMENT_DATA: VitalInfo[] = [
  { VitalId: '65756lsdfoirkrtoikfwe747', EncounterId: 'ewer423234090293220933', CollectedAt: new Date('2022/06/10 10:10 AM'), Height: 6.6, Weight: 172, BMI: 1.0079, BPSystolic: 120, BPDiastolic: 80, Temperature: 98.4, Pulse: 88, RespiratoryRate: 1.0079, O2Saturation: 98, BloodType: 'Group A', UnitSystem: 'us', TempType: 'unspcified', Note: 'Testing' },
  { VitalId: '65756lkdfi62irkrtoikf747', EncounterId: '7868ewer42323402932209', CollectedAt: new Date('2022/06/09 02:10 PM'), Height: 5.6, Weight: 132, BMI: 4.0026, BPSystolic: 110, BPDiastolic: 90, Temperature: 98.7, Pulse: 77, RespiratoryRate: 4.0026, O2Saturation: 99, BloodType: 'Group B', UnitSystem: 'us', TempType: 'unspcified', Note: 'Testing' },
];
@Component({
  selector: 'app-encounter.dialog',
  templateUrl: './encounter.dialog.component.html',
  styleUrls: ['./encounter.dialog.component.scss']
})
export class EncounterDialogComponent implements OnInit {
  PracticeProviders: PracticeProviders[];
  SelectedProviderId: string;
  AppointmentTypes: AppointmentTypes[];
  encounterdiagnosesColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX", "Delete"];
  procedureColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "TOOTH", "TOOTH SURFACE", "Delete"];
  vitalsColumns = ["CollectedAt", "Height", "Weight", "BMI", "BP", "Temperature", "Pulse", "Respiratory_rate", "O2_Saturation", "Blood_type", "Actions"];

  EnableNewEncounterData: boolean = false;
  recommendedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
  // completedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
   diagnosesInfo = new BehaviorSubject<EncounterDiagnosis[]>([]);
  vitalsInfo = new BehaviorSubject<VitalInfo[]>([]);
  teethNumbers = [] // [0,1,2,3,4]

  appointment: ScheduledAppointment
  location: UserLocations;
  encounterInfo: EncounterInfo = new EncounterInfo;
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  codeSystemsForReconcillation: string[] = ['SNOMED'];
  codeSystemsForDischarge: string[] = ['SNOMED'];
  codeSystemsForDocumentation: string[] = ['CPT'];
  codeSystemsForProcedures: string[] = ['CDT/CPT', 'HCPCS'];
  vitalDialogComponent = VitalDialogComponent
  vitalDialogResponse: any;
  ActionsType = Actions;
  message: string = "";
  messageflag: boolean = true;

  constructor(private overlayref: EHROverlayRef, private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private patientService: PatientService,
    public overlayService: OverlayService) {
      let i = 1;  //normally would use var here
      while(this.teethNumbers.push(i++)<32){}
     }

  ngOnInit(): void {
    this.location = (JSON.parse(this.authService.userValue.LocationInfo) as UserLocations[])
    .filter((loc) => loc.locationId === this.authService.userValue.CurrentLocation )[0];
    this.loadDefaults();
    this.appointment = this.overlayref.RequestData as ScheduledAppointment
    this.initEncoutnerView();
    this.loadEncouterView();
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;

    this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);
    // this.completedProcedures.next(this.encounterInfo.CompletedProcedures);
    this.encounterInfo.Vitals = ELEMENT_DATA
    this.vitalsInfo.next(this.encounterInfo.Vitals);
  }
  initEncoutnerView(){
    if(this.EnableNewEncounterData){
      this.encounterInfo.EncounterType = "Office Visit (1853490003)";
      this.encounterInfo.EncounterCode = ""
      this.encounterInfo.EncounterCodeSystem ="";
      this.encounterInfo.EncounterDescription ="";
      this.encounterInfo.SummaryCareRecordRefIn = false;
      this.encounterInfo.SummaryCareRecordRefOut = false;
      this.encounterInfo.DeclinedToReceiveSummary = false;
      this.encounterInfo.MedicationAllergyReconciliationCompleted = false;
      this.encounterInfo.DiagnosisReconciliationCompleted = false;
      this.encounterInfo.NewPatientEncounter = false;
      this.encounterInfo.medCompleted = null;
      this.encounterInfo.HealthInfoExchange = null;

    }else{
      this.encounterInfo.EncounterType = "";
      this.encounterInfo.EncounterCode = "99213"
      this.encounterInfo.EncounterCodeSystem ="SNOMED";
      this.encounterInfo.EncounterDescription ="Office or Other Outpatient Visit";
      this.encounterInfo.SummaryCareRecordRefIn = null;
      this.encounterInfo.SummaryCareRecordRefOut = null;
      this.encounterInfo.DeclinedToReceiveSummary = null;
      this.encounterInfo.MedicationAllergyReconciliationCompleted = null;
      this.encounterInfo.DiagnosisReconciliationCompleted = null;
      this.encounterInfo.NewPatientEncounter = null;
      this.encounterInfo.medCompleted = false;
      this.encounterInfo.HealthInfoExchange = false;
    }
  }

  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
    let preq = { "ProviderId": this.SelectedProviderId };
    this.smartSchedulerService.AppointmentTypes(preq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AppointmentTypes = resp.ListResult as AppointmentTypes[];
      }
    });

  }
  loadEncouterView(){
  // {"EncounterId": this.appointment.EncounterId}
    this.patientService.EncounterView({"EncounterId":this.appointment.EncounterId}).subscribe(resp => {
      if (resp.IsSuccess) {
        this.encounterInfo = resp.Result as EncounterInfo;
        console.log(this.encounterInfo);

      }else{
        this.encounterInfo.ProviderId = this.authService.userValue.ProviderId;
        this.encounterInfo.LocationId = this.location.locationId;
        this.encounterInfo.AppointmentId = this.appointment.AppointmentId;
      }
    });
  }
  documentationChanged(value) {
    this.encounterInfo.CurrentMedicationDocumented = (value as MatRadioButton).value
    if (this.encounterInfo.CurrentMedicationDocumented == 2) {
      this.encounterInfo.EncounterCode ="";
      this.encounterInfo.EncounterDescription = "";
      this.encounterInfo.EncounterCodeSystem = "";
    } else {
      /// default code.
      this.encounterInfo.EncounterCode = "99213";
      this.encounterInfo.EncounterDescription = "Office or Other Outpatient Visit";
      this.encounterInfo.EncounterCodeSystem = "SNOMED";
    }
  }


  // optionChangedForReconcillation(value: MedicalCode){
  //   this.encounterInfo.ReconcillationCode = value.Code;
  //   this.encounterInfo.ReconcillationDescription   = value.Description
  //   this.encounterInfo.CodeSystem = value.CodeSystem;

  // }

  onDischargeCodeChange(value: MedicalCode){
    this.encounterInfo.DischargeStatus = value.Description;
    this.encounterInfo.DischargeStatusCode   = value.Code
    this.encounterInfo.DischargeStatusCodeSystem = value.CodeSystem;
  }

  onEncounterCodeChange(value: MedicalCode){
    this.encounterInfo.EncounterDescription = value.Description;
    this.encounterInfo.EncounterCode   = value.Code
    this.encounterInfo.EncounterCodeSystem = value.CodeSystem;
  }

  removeRecommendedProcedure(value: ProceduresInfo, index: number) {
    value.CanDelete = true;
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
  }

  removeCompletedProcedure(value: ProceduresInfo, index: number) {
    value.CanDelete = true;
   // this.completedProcedures.next(this.encounterInfo.CompletedProcedures.filter(fn => fn.CanDelete === false));
  }

  removeEncounterDiagnosis(value: EncounterDiagnosis, index: number) {
    //let n = this.encounterInfo.Diagnoses.indexOf(value)
    value.CanDelete = true;
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }

  optionChangedForDiagnosis(value: MedicalCode) {
    let d: EncounterDiagnosis = new EncounterDiagnosis;
    d.Code = value.Code
    d.CodeSystem = value.CodeSystem
    d.Description = value.Description
    d.CanDelete = false;
    this.encounterInfo.Diagnoses.push(d);
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }

  onProceduresRecommended(value: MedicalCode) {
    let p: ProceduresInfo = new ProceduresInfo;
    p.Code = value.Code
    p.CodeSystem = value.CodeSystem
    p.Description = value.Description
    p.CanDelete = false;
    this.encounterInfo.RecommendedProcedures.push(p);
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
  }

  onProcedureCompleted(value: MedicalCode) {
    let p: ProceduresInfo = new ProceduresInfo;
    p.Code = value.Code
    p.CodeSystem = value.CodeSystem
    p.Description = value.Description
    p.CanDelete = false;
    this.encounterInfo.CompletedProcedures.push(p);
   // this.completedProcedures.next(this.encounterInfo.CompletedProcedures.filter(fn => fn.CanDelete === false));
  }


  onDocumentedReasonChange(value: MedicalCode) {
    this.encounterInfo.EncounterCode = value.Code;
    this.encounterInfo.EncounterDescription = value.Description;
    this.encounterInfo.EncounterCodeSystem = value.CodeSystem;
  }

  onToothSurfaceSelectedForCP(value, item: ProceduresInfo, index) {
    item.Surface = value;
  }

  onToothSurfaceSelectedForRP(value, item, index) {
    item.Surface = value;
  }

  showAssociateVitals: boolean = true;
  displayVitalsDialog(event) {
    //debugger;
    if (event == true) {
      this.showAssociateVitals = true;
    }
    else {
      this.showAssociateVitals = false;
    }
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.vitalDialogComponent && action == Actions.view) {
      dialogData = data;
    }
    // console.log(dialogData);

    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.vitalDialogComponent) {
        this.vitalDialogResponse = res.data;
      }
    });
  }


  closePopup() {
    this.overlayref.close();
  }

  saveAsDraft() {
    this.encounterInfo.Signed = false;
    // console.log(this.encounterInfo);

    this.updateEncounter();
  }
  signEncounter() {
    this.encounterInfo.Signed = true;
    this.updateEncounter();
  }

  updateEncounter(){
    console.log(this.encounterInfo);
    this.patientService.CreateEncounter(this.encounterInfo).subscribe(resp => {
      console.log(resp);

      if (resp.IsSuccess) {

      }
    });

  }

  enableSaveButtons(): boolean{


    this.messageflag = this.encounterInfo.ServicedAt != null
    if(this.encounterInfo.HealthInfoExchange == true &&
      this.encounterInfo.ReferredTo == false
      || this.encounterInfo.ReferralTo == ""
      || this.encounterInfo.ReferralTo == null){
        this.messageflag = false;
        this.message = "Update the provider to whom you referring this patient."
      }
    if(this.encounterInfo.HealthInfoExchange == true &&
      this.encounterInfo.ReferredFrom == false
      || this.encounterInfo.ReferralFrom == ""
      || this.encounterInfo.ReferralFrom == null  ){
        this.messageflag = false;
        this.message = "Update the provider from whom you redirected this patient."
      }

      return this.messageflag;
  }
}
