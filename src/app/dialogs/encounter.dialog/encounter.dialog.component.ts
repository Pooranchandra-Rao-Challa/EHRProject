

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
  EncounterInfo,EncounterDiagnosis,ProceduresInfo, VitalInfo
} from 'src/app/_models';
import {
  MedicalCode
} from 'src/app/_models/codes';
import { MatRadioButton } from '@angular/material/radio';
import { BehaviorSubject} from 'rxjs'
import { OverlayService } from 'src/app/overlay.service';
import { VitalDialogComponent } from 'src/app/dialogs/vital.dalog/vital.dialog.component';
const ELEMENT_DATA: VitalInfo[] = [
  { VitalId: '65756lsdfoirkrtoikfwe747', EncounterId: 'ewer423234090293220933', CollectedAt: new Date('2022/06/10 10:10 AM'), Height: 6.6, Weight: 172, BMI: 1.0079, BPSystolic: 120, BPDiastolic: 80, Temperature: 98.4, Pulse: 88, RespiratoryRate: 1.0079, O2Saturation: 98, BloodType: 'Group A', UnitSystem: 'us', TempType: 'unspcified',Note:'Testing' },
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
  encounterdiagnosesColumns = ["CODE","CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX","Delete"];
  procedureColumns = ["CODE","CODE SYSTEM", "DESCRIPTION","TOOTH","TOOTH SURFACE","Delete"];
  vitalsColumns = ["CollectedAt","Height", "Weight", "BMI", "BP", "Temperature", "Pulse", "Respiratory_rate", "O2_Saturation", "Blood_type", "Actions"];

  EncounterData = "";
  recommendedProcedures  =new BehaviorSubject<ProceduresInfo[]>([]);
  completedProcedures  =new BehaviorSubject<ProceduresInfo[]>([]);
  diagnosesInfo = new BehaviorSubject<EncounterDiagnosis[]>([]);
  vitalsInfo = new BehaviorSubject<VitalInfo[]>([]);
  teethNumbers = [] // [0,1,2,3,4]

  appointment: ScheduledAppointment
  location: UserLocations;
  encounterInfo: EncounterInfo = new EncounterInfo;
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  codeSystemsForReconcillation: string[] = ['SNOMED'];
  codeSystemsForDocumentation: string[] = ['CPT'];
  codeSystemsForProcedures: string[] = ['CDT/CPT','HCPCS'];
  vitalDialogComponent = VitalDialogComponent
  vitalDialogResponse: any;
  ActionsType = Actions;

  constructor(private overlayref: EHROverlayRef,private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private patientService: PatientService,
    public overlayService: OverlayService) {
      let i = 1;  //normally would use var here
      while(this.teethNumbers.push(i++)<32){}
      this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
      this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);
      this.completedProcedures.next(this.encounterInfo.CompletedProcedures);
      this.appointment = overlayref.RequestData as ScheduledAppointment
      this.encounterInfo.ProviderId = authService.userValue.ProviderId;
      this.location = (JSON.parse(this.authService.userValue.LocationInfo) as UserLocations[])
        .filter((loc) => loc.locationId === this.authService.userValue.CurrentLocation )[0];
      this.encounterInfo.LocationId = this.location.locationId;
      this.encounterInfo.AppointmentId = this.appointment.AppointmentId;
      this.encounterInfo.Vitals = ELEMENT_DATA
      this.vitalsInfo.next(this.encounterInfo.Vitals);
     }

  ngOnInit(): void {
    this.loadDefaults();
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
  documentationChanged(value){
    this.encounterInfo.mu2.CurrentMedicationDocumented = (value as MatRadioButton).value
    if(this.encounterInfo.mu2.CurrentMedicationDocumented == 2){
      this.encounterInfo.mu2.DocumentedCode = "";
      this.encounterInfo.mu2.DocumentedDescription ="";
    }else{
      /// default code.
      this.encounterInfo.mu2.DocumentedCode = "99213";
      this.encounterInfo.mu2.DocumentedDescription ="Office or Other Outpatient Visit";
    }
  }


  optionChangedForReconcillation(value: MedicalCode){
    this.encounterInfo.mu2.ReconcillationCode = value.Code;
    this.encounterInfo.mu2.ReconcillationDescription   = value.Description


  }

  removeRecommendedProcedure(value: ProceduresInfo,index: number){
    value.CanDelete = true;
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
  }

  removeCompletedProcedure(value: ProceduresInfo,index: number){
    value.CanDelete = true;
    this.completedProcedures.next(this.encounterInfo.CompletedProcedures.filter(fn => fn.CanDelete === false));
  }

  removeEncounterDiagnosis(value: EncounterDiagnosis,index: number){
    //let n = this.encounterInfo.Diagnoses.indexOf(value)
    value.CanDelete = true;
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }

  optionChangedForDiagnosis(value: MedicalCode )
  {
    let d: EncounterDiagnosis = new EncounterDiagnosis;
    d.Code  = value.Code
    d.CodeSystem = value.CodeSystem
    d.Description = value.Description
    d.CanDelete = false;
    this.encounterInfo.Diagnoses.push(d);
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }

  onProceduresRecommended(value: MedicalCode ){
    let p: ProceduresInfo = new ProceduresInfo;
    p.Code  = value.Code
    p.CodeSystem = value.CodeSystem
    p.Description = value.Description
    p.CanDelete = false;
    this.encounterInfo.RecommendedProcedures.push(p);
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
  }

  onProcedureCompleted(value: MedicalCode ){
    let p: ProceduresInfo = new ProceduresInfo;
    p.Code  = value.Code
    p.CodeSystem = value.CodeSystem
    p.Description = value.Description
    p.CanDelete = false;
    this.encounterInfo.CompletedProcedures.push(p);
    this.completedProcedures.next(this.encounterInfo.CompletedProcedures.filter(fn => fn.CanDelete === false));
  }


  onDocumentedReasonChange(value){
    this.encounterInfo.mu2.DocumentedCode = value.Code;
    this.encounterInfo.mu2.DocumentedDescription = value.Description;
  }

  onToothSurfaceSelectedForCP(value,item: ProceduresInfo,index){
    item.Surface = value;
  }

  onToothSurfaceSelectedForRP(value,item,index){
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
    if(content === this.vitalDialogComponent && action == Actions.view){
      dialogData = data;
    }
    console.log(dialogData);

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

  saveAsDraft(){
    this.encounterInfo.Signed = false;
    console.log(this.encounterInfo);

    this.updateEncounter();
  }
  signEncounter(){
    this.encounterInfo.Signed = true;
  }

  updateEncounter(){

    this.patientService.CreateEncounter(this.encounterInfo).subscribe(resp => {
      console.log(resp);

      if (resp.IsSuccess) {

      }
    });

  }
}
