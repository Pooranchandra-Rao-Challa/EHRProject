
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PatientService } from 'src/app/_services/patient.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { ComponentType } from '@angular/cdk/portal';
import {
  EncounterInfo, EncounterDiagnosis, ProceduresInfo, VitalInfo,PracticeProviders,Actions,
  ScheduledAppointment, AppointmentTypes,
  UserLocations,
  PatientChart
} from 'src/app/_models';
import {
  MedicalCode
} from 'src/app/_models/codes';
import { MatRadioButton } from '@angular/material/radio';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable } from 'rxjs'
import { OverlayService } from 'src/app/overlay.service';
import { map, } from 'rxjs/operators';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { SignEncounterNoteComponent } from 'src/app/dialogs/encounter.dialog/sign.encounter.note.component'
import { stringify } from 'querystring';
import { DatePipe } from '@angular/common';

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

  EnableNewEncounterData: boolean = true;
  recommendedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
  // completedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
  diagnosesInfo = new BehaviorSubject<EncounterDiagnosis[]>([]);
  vitalsInfo = new BehaviorSubject<VitalInfo[]>([]);
  teethNumbers = [] // [0,1,2,3,4]
  @ViewChild('heightField',  { static: true }) heightField: ElementRef;
  @ViewChild('weightField',  { static: true }) weightField: ElementRef;
  heightValue$: Observable<number>;
  weightValue$: Observable<number>;
  bmi$: Observable<number>;

  appointment: ScheduledAppointment
  location: UserLocations;
  encounterInfo: EncounterInfo = new EncounterInfo;
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  codeSystemsForReconcillation: string[] = ['SNOMED'];
  codeSystemsForDischarge: string[] = ['SNOMED'];
  codeSystemsForDocumentation: string[] = ['CPT'];
  codeSystemsForProcedures: string[] = ['CDT/CPT', 'HCPCS'];
  vitalDialogResponse: any;
  ActionsType = Actions;
  message: string = "";
  BloodTypes = [
    { Id: 1, BloodType: 'Group A' },
    { Id: 2, BloodType: 'Group B' },
    { Id: 3, BloodType: 'Group AB' },
    { Id: 4, BloodType: 'Group O' }
  ]
  dischargeCode = new MedicalCode();
  dialogIsLoading: boolean = false;
  patient: ProviderPatient;
  signEncounterNoteComponent = SignEncounterNoteComponent;

  private messageflagSubject = new BehaviorSubject<boolean>(false);
  public messageflag$ = this.messageflagSubject.asObservable();
  constructor(private overlayref: EHROverlayRef, private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private patientService: PatientService,
    private overlayService: OverlayService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe) {
      let i = 1;  //normally would use var here
      while(this.teethNumbers.push(i++)<32){}
     }

  ngOnInit(): void {


    this.heightValue$ = fromEvent<Event>(this.heightField.nativeElement, 'input')
    .pipe(map(e => +(<HTMLInputElement>e.target).value));
    this.weightValue$ = fromEvent<Event>(this.weightField.nativeElement, 'input')
    .pipe(map(e => +(<HTMLInputElement>e.target).value));
    this.bmi$ = combineLatest([this.heightValue$, this.weightValue$]).pipe(
      map(([h, w]) => this.computeBmi(h, w)),
    )


    this.location = (JSON.parse(this.authService.userValue.LocationInfo) as UserLocations[])
    .filter((loc) => loc.locationId === this.authService.userValue.CurrentLocation )[0];
    this.loadDefaults();
    this.appointment = this.overlayref.RequestData as ScheduledAppointment
    this.patient = this.overlayref.RequestData as ProviderPatient;


    this.initEncoutnerView();
    this.loadEncouterView();
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;
    this.encounterInfo.Diagnoses.forEach(fn => {
      fn.MedLineUrl = this.medLinePlusUrl({
        Code: fn.Code,
        CodeSystem: fn.CodeSystem
      })
    })
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);


    if(this.encounterInfo.Vital.CollectedAt != null)
    this.encounterInfo.Vital.CollectedTime = this.encounterInfo.Vital.CollectedAt.toTimeString().substring(0, 5);
  }
  private computeBmi(height: number, weight: number): number {
    const bmi = (weight / ((height) * (height))) * 703;
    this.encounterInfo.Vital.BMI = Number(bmi.toFixed(2));
    return Number(bmi.toFixed(2));
  }
  initEncoutnerView(){
    if(this.EnableNewEncounterData){
      this.encounterInfo.EncounterType = "Office Visit (1853490003)";
      this.encounterInfo.EncounterCode = ""
      this.encounterInfo.EncounterCodeSystem ="";
      this.encounterInfo.EncounterDescription ="";
    }else{
      this.encounterInfo.EncounterType = "";
      this.encounterInfo.EncounterCode = "99213"
      this.encounterInfo.EncounterCodeSystem ="SNOMED";
      this.encounterInfo.EncounterDescription ="Office or Other Outpatient Visit";
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
    let requestdata = {"AppointmentId":null,"EncounterId":null}
    if(this.appointment != null)
      requestdata = {"EncounterId":this.appointment.EncounterId,
                    "AppointmentId": this.appointment.EncounterId == null ?
                            this.appointment.AppointmentId : null};
    console.log(this.overlayref.RequestData as {"AppointmentId":null,"EncounterId":null} );


    this.dialogIsLoading = true;
    this.patientService.EncounterView(requestdata).subscribe(resp => {
      if (resp.IsSuccess) {
        this.dialogIsLoading = false;
        if(resp.AffectedRecords == 1){
          this.encounterInfo = resp.Result as EncounterInfo;
          console.log(this.encounterInfo);
          this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
          this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);
          //console.log(this.encounterInfo.Vital.CollectedAt.toString().substring(11,16));

          if(this.encounterInfo.Vital.CollectedAt != null)
            this.encounterInfo.Vital.CollectedTime = this.encounterInfo.Vital.CollectedAt.toString().substring(11, 16);
          this.dischargeCode.Code = this.encounterInfo.DischargeStatusCode
          this.dischargeCode.Description = this.encounterInfo.DischargeStatus
          this.dischargeCode.CodeSystem = this.encounterInfo.DischargeStatusCodeSystem;
          console.log(this.dischargeCode);
        }else{
          this.encounterInfo.ProviderId = this.authService.userValue.ProviderId;
          this.encounterInfo.LocationId = this.location.locationId;
          if(this.appointment != null){
            this.encounterInfo.AppointmentId = this.appointment.AppointmentId;
            this.encounterInfo.PatientId = this.appointment.PatientId;
          }

        }

      }else{
        this.overlayref.close();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AE003"])
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
  }

  removeEncounterDiagnosis(value: EncounterDiagnosis, index: number) {
    value.CanDelete = true;
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }
  onReferralFromStateChange(value){
    if(value){
      this.encounterInfo.ReferredTo = false;
    }
  }
  onReferralToStateChange(value){
    if(value){
      this.encounterInfo.ReferredFrom = false;
    }
  }
  optionChangedForDiagnosis(value: MedicalCode) {
    let d: EncounterDiagnosis = new EncounterDiagnosis();
    d.Code = value.Code
    d.CodeSystem = value.CodeSystem
    d.Description = value.Description
    d.MedLineUrl = this.medLinePlusUrl(value);
    d.CanDelete = false;
    this.encounterInfo.Diagnoses.push(d);
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }

  onProceduresRecommended(value: MedicalCode) {
    let p: ProceduresInfo = new ProceduresInfo();
    p.Code = value.Code
    p.CodeSystem = value.CodeSystem
    p.Description = value.Description
    p.CanDelete = false;
    p.Status = "Treatment planned";
    this.encounterInfo.RecommendedProcedures.push(p);
    this.recommendedProcedures.next(
      this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
  }

  onProcedureCompleted(value: MedicalCode) {
    let p: ProceduresInfo = new ProceduresInfo;
    p.Code = value.Code
    p.CodeSystem = value.CodeSystem
    p.Description = value.Description
    p.CanDelete = false;
    this.encounterInfo.CompletedProcedures.push(p);
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
    if (event == true) {
      this.showAssociateVitals = true;
    }
    else {
      this.showAssociateVitals = false;
    }
  }



  closePopup() {
    this.overlayref.close();
  }

  saveAsDraft() {
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;
    this.encounterInfo.Signed = false;
    if(this.encounterInfo.ServiceEndAt == new Date())
      this.encounterInfo.ServiceEndAt = null;
    this.updateEncounter();
  }

  signConfirmation(){
    this.openComponentDialog(this.signEncounterNoteComponent,null);
  }
  signEncounter() {
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;
    this.encounterInfo.Signed = true;
    this.updateEncounter();
  }


  updateEncounter(){
    let isAdd = this.encounterInfo.EncounterId == null;

    this.encounterInfo.strServicedAt = this.datePipe.transform(this.encounterInfo.ServicedAt, "MM/dd/yyyy")
    if(this.encounterInfo.ServiceEndAt != null)
    this.encounterInfo.strServiceEndAt = this.datePipe.transform(this.encounterInfo.ServiceEndAt, "MM/dd/yyyy")
    console.log(this.encounterInfo);

    this.patientService.CreateEncounter(this.encounterInfo).subscribe(resp => {
      if (resp.IsSuccess) {
        this.overlayref.close({"UpdatedModal": PatientChart.Encounters});
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2AE001" : "M2AE002"])
      }else{
        this.overlayref.close();
        this.alertmsg.displayErrorDailog(ERROR_CODES[isAdd ? "E2AE001" : "E2AE002"])
      }
    });
  }

  enableSaveButtons(){

    if(this.encounterInfo.HealthInfoExchange == true &&
      this.encounterInfo.ReferredTo == false
      || this.encounterInfo.ReferralTo == ""
      || this.encounterInfo.ReferralTo == null){
        this.messageflagSubject.next(true);
        this.message = "Update the provider to whom you referring this patient."
      }else
    if(this.encounterInfo.HealthInfoExchange == true &&
      this.encounterInfo.ReferredFrom == false
      || this.encounterInfo.ReferralFrom == ""
      || this.encounterInfo.ReferralFrom == null  ){
        this.messageflagSubject.next(true);
        this.message = "Update the provider from whom you redirected this patient."
      }else this.messageflagSubject.next(false);;
  }

  medLinePlusUrl(code: MedicalCode):string{
    if(code.CodeSystem= "SNOMED"){
      return "http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.96&amp;mainSearchCriteria.v.c="+code.Code
    }else{
      return "http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.90&mainSearchCriteria.v.c="+code.Code
    }
  }

  recordSuperBill(){


  }

  addAddenda(){


  }

  attachDocuments(){

  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {

    const ref = this.overlayService.open(content, data);
    ref.afterClosed$.subscribe(res => {
      if (content === this.signEncounterNoteComponent) {
        if(res.data && res.data.signed){
          this.signEncounter();
        }
      }
    });
  }
}
