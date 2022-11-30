

import { FormFieldValue } from './../../_components/advanced-medical-code-search/field-control/field-control-component';
import { AddendaDoc, AddendaComment, DENTAL_SURFACES } from './../../_models/_provider/encounter';

import { Component, ElementRef, OnInit, TemplateRef, ViewChild, enableProdMode } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PatientService } from 'src/app/_services/patient.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { ComponentType } from '@angular/cdk/portal';
import {
  EncounterInfo, EncounterDiagnosis, ProceduresInfo, VitalInfo, PracticeProviders, Actions,
  ScheduledAppointment, AppointmentTypes,
  UserLocations,
  PatientChart
} from 'src/app/_models';
import {
  MedicalCode
} from 'src/app/_models/codes';
import { MatRadioButton } from '@angular/material/radio';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subject } from 'rxjs'
import { OverlayService } from 'src/app/overlay.service';
import { map, } from 'rxjs/operators';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { SignEncounterNoteComponent } from 'src/app/dialogs/encounter.dialog/sign.encounter.note.component'
import { AddendaAttachDocumentComponent } from 'src/app/dialogs/encounter.dialog/addenda.attach.document';
import { SignAddendaDocumentComponent } from 'src/app/dialogs/encounter.dialog/attenda.document.sign.component';
import { AddendaReviewDocumentComponent } from 'src/app/dialogs/encounter.dialog/addenda.review.document';
import { AddendaCommentComponent } from 'src/app/dialogs/encounter.dialog/addenda.comment';

import { DatePipe } from '@angular/common';
import {
  environment,
  MEDLINE_PLUS_URL,
  MEDLINE_PLUS_LOINC,
  MEDLINE_PLUS_RXNORM,
  MEDLINE_PLUS_SNOMED,
  MEDLINE_PLUS_ICD
} from "src/environments/environment";
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { FormContainerComponent } from 'src/app/_components/advanced-medical-code-search/form-container/form-container-component';

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

  EnableNewEncounterData: boolean;
  recommendedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
  completedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
  diagnosesInfo = new BehaviorSubject<EncounterDiagnosis[]>([]);
  vitalsInfo = new BehaviorSubject<VitalInfo[]>([]);
  teethNumbers = [] // [0,1,2,3,4]
  @ViewChild('heightField', { static: true }) heightField: ElementRef;
  @ViewChild('weightField', { static: true }) weightField: ElementRef;
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
  selectedProcedureValue: FormFieldValue = {CodeSystem:'CDT/CPT',SearchTerm:''}
  selectedDiagnosisValue: FormFieldValue = {CodeSystem:'SNOMED/ICD10',SearchTerm:''}
  selectedReconcillationValue: FormFieldValue = {CodeSystem:'SNOMED',SearchTerm:''}
  selectedDischargeValue: FormFieldValue = {CodeSystem:'SNOMED',SearchTerm: ''}
  selectedDocumentationValue: FormFieldValue = {CodeSystem:'CPT',SearchTerm:''}
  selectedEncounterCodeValue: FormFieldValue = {CodeSystem:'CPT',SearchTerm:''}
  dentalSurfaces=DENTAL_SURFACES;


  vitalDialogResponse: any;
  ActionsType = Actions;
  message: string = "";
  BloodTypes = [
    { Id: 1, BloodType: 'Group A' },
    { Id: 2, BloodType: 'Group B' },
    { Id: 3, BloodType: 'Group AB' },
    { Id: 4, BloodType: 'Group O' }
  ]
  dischargeCode: MedicalCode = {};
  dialogIsLoading: boolean = false;
  patient: ProviderPatient;
  signEncounterNoteComponent = SignEncounterNoteComponent;
  addendaAttachDocumentComponent = AddendaAttachDocumentComponent
  signAddendaDocumentComponent = SignAddendaDocumentComponent;
  addendaReviewDocumentComponent = AddendaReviewDocumentComponent;
  addendaCommentComponent = AddendaCommentComponent
  isNavigateFromProductView: boolean = false;
  minDateToFinish = new Subject<string>();
  endDateForEncounter;
  isPickAny: boolean = false;
  currentTabIndex: number = 0;
  encounterAddendaColumns: string[] = ['Signed/Authorized', 'Name', 'DocumentType','Comments'];

  private messageflagSubject = new BehaviorSubject<boolean>(false);
  public messageflag$ = this.messageflagSubject.asObservable();
  constructor(private overlayref: EHROverlayRef, private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private patientService: PatientService,
    private overlayService: OverlayService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe) {
    let i = 1;  //normally would use var here
    while (this.teethNumbers.push(i++) < 32) { }

    this.minDateToFinish.subscribe(e => {
      this.endDateForEncounter = new Date(e);
    })

  }

  ngOnInit(): void {

    this.EnableNewEncounterData = this.authService.userValue.EnableStage3;
    this.heightValue$ = fromEvent<Event>(this.heightField.nativeElement, 'input')
      .pipe(map(e => +(<HTMLInputElement>e.target).value));
    this.weightValue$ = fromEvent<Event>(this.weightField.nativeElement, 'input')
      .pipe(map(e => +(<HTMLInputElement>e.target).value));
    this.bmi$ = combineLatest([this.heightValue$, this.weightValue$]).pipe(
      map(([h, w]) => this.computeBmi(h, w)),
    )

    this.location = (JSON.parse(this.authService.userValue.LocationInfo) as UserLocations[])
      .filter((loc) => loc.LocationId === this.authService.userValue.CurrentLocation)[0];

    this.loadDefaults();
    this.appointment = this.overlayref.RequestData as ScheduledAppointment

    this.initEncoutnerView();
    this.loadEncouterView();
    this.patientService.PatientProfile({"PatientId":this.authService.viewModel.Patient.PatientId})
      .subscribe((resp)=>
      {
        if(resp.IsSuccess){
            this.patient =  resp.Result as ProviderPatient;
        }
      })


    this.isNavigateFromProductView = this.overlayref.RequestData["From"] == "ProcedureView";
    if (this.overlayref.RequestData["From"] == "ProcedureView"
      && this.overlayref.RequestData.EncounterId == null) {
        let proceduredata = this.overlayref.RequestData as ProceduresInfo;
        if(proceduredata.Status == "Completed"){
          this.encounterInfo.CompletedProcedures.push(this.overlayref.RequestData as ProceduresInfo);
        }
        else{
          this.encounterInfo.RecommendedProcedures.push(this.overlayref.RequestData as ProceduresInfo);
        }

    }
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;
    console.log(this.encounterInfo.Diagnoses);

    this.encounterInfo.Diagnoses.forEach(fn => {
      fn.PatientEdn = "Medline Plus"
      fn.MedLineUrl = this.medLinePlusUrl({
        Code: fn.Code,
        CodeSystem: fn.CodeSystem
      })
    })
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);
    this.completedProcedures.next(this.encounterInfo.CompletedProcedures);


    if (this.encounterInfo.Vital.CollectedAt != null)
      this.encounterInfo.Vital.CollectedTime = this.datePipe.transform(this.encounterInfo.Vital.CollectedAt, "hh:mm a");
    this.endDateForEncounter = new Date(this.encounterInfo.ServicedAt);
  }

  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }

  private computeBmi(height: number, weight: number): number {
    const bmi = (weight / ((height) * (height))) * 703;
    this.encounterInfo.Vital.BMI = Number(bmi.toFixed(2));
    return Number(bmi.toFixed(2));
  }

  public encounterTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTabIndex = tabChangeEvent.index;
  }

  initEncoutnerView() {
    if (this.EnableNewEncounterData) {
      this.encounterInfo.EncounterType = "Office Visit (1853490003)";
      this.encounterInfo.EncounterCode = ""
      this.encounterInfo.EncounterCodeSystem = "";
      this.encounterInfo.EncounterDescription = "";
    } else {
      this.encounterInfo.EncounterType = "";
      this.encounterInfo.EncounterCode = "99213"
      this.encounterInfo.EncounterCodeSystem = "SNOMED";
      this.encounterInfo.EncounterDescription = "Office or Other Outpatient Visit";
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

  loadEncouterView() {
    let requestdata = { "AppointmentId": null, "EncounterId": null }
    if (this.appointment != null)
      requestdata = {
        "EncounterId": this.appointment.EncounterId,
        "AppointmentId": this.appointment.EncounterId == null ?
          this.appointment.AppointmentId : null
      };



    this.dialogIsLoading = true;
    this.patientService.EncounterView(requestdata).subscribe(resp => {
      if (resp.IsSuccess) {
        this.dialogIsLoading = false;
        if (resp.AffectedRecords == 1) {
          this.encounterInfo = resp.Result as EncounterInfo;

          this.encounterInfo.PatientName = this.appointment.PatientName;
          this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
          this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);
          this.completedProcedures.next(this.encounterInfo.CompletedProcedures);

          if (this.encounterInfo.Vital.CollectedAt != null)
            this.encounterInfo.Vital.CollectedTime = this.datePipe.transform(this.encounterInfo.Vital.CollectedAt, "hh:mm a");

          this.dischargeCode.Code = this.encounterInfo.DischargeStatusCode
          this.dischargeCode.Description = this.encounterInfo.DischargeStatus
          this.dischargeCode.CodeSystem = this.encounterInfo.DischargeStatusCodeSystem;
          this.encounterInfo.Diagnoses.forEach(fn => {
            fn.PatientEdn = "Medline Plus"
            fn.MedLineUrl = this.medLinePlusUrl({
              Code: fn.Code,
              CodeSystem: fn.CodeSystem
            })
          })

        } else {
          this.encounterInfo.ProviderId = this.authService.userValue.ProviderId;
          this.encounterInfo.LocationId = this.location.LocationId;
          if (this.appointment != null) {
            this.encounterInfo.AppointmentId = this.appointment.AppointmentId;
            this.encounterInfo.PatientId = this.appointment.PatientId;
            this.encounterInfo.PatientName = this.appointment.PatientName
          }

        }
        this.isPickAny = (this.encounterInfo.Vital.CollectedAt == null ||
          this.encounterInfo.Vital.CollectedTime == null || this.encounterInfo.Vital.Height == null ||
          this.encounterInfo.Vital.Weight == null ||
          this.encounterInfo.Vital.Temperature == null ||
          this.encounterInfo.Vital.BPSystolic == null ||
          this.encounterInfo.Vital.BPDiastolic == null ||
          this.encounterInfo.Vital.O2Saturation == null ||
          this.encounterInfo.Vital.Pulse == null ||
          this.encounterInfo.Vital.RespiratoryRate == null ||
          this.encounterInfo.Vital.BloodType == null)

      } else {
        this.overlayref.close();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AE003"])
      }
    });
  }
  documentationChanged(value) {
    this.encounterInfo.CurrentMedicationDocumented = (value as MatRadioButton).value
    if (this.encounterInfo.CurrentMedicationDocumented == 2) {
      this.encounterInfo.EncounterCode = "";
      this.encounterInfo.EncounterDescription = "";
      this.encounterInfo.EncounterCodeSystem = "";
    } else {
      /// default code.
      this.encounterInfo.EncounterCode = "99213";
      this.encounterInfo.EncounterDescription = "Office or Other Outpatient Visit";
      this.encounterInfo.EncounterCodeSystem = "SNOMED";
    }
  }

  onDischargeCodeChange(value: any) {
    this.encounterInfo.DischargeStatus = value.Description;
    this.encounterInfo.DischargeStatusCode = value.Code
    this.encounterInfo.DischargeStatusCodeSystem = value.CodeSystem;
  }

  onEncounterCodeChange(value: MedicalCode) {
    this.encounterInfo.EncounterDescription = value.Description;
    this.encounterInfo.EncounterCode = value.Code
    this.encounterInfo.EncounterCodeSystem = value.CodeSystem;
  }

  removeRecommendedProcedure(value: ProceduresInfo, index: number) {
    // if (value.ViewFrom != 'ProcedureView') {
    if (this.overlayref.RequestData.ViewFrom != "ProcedureView") {
      value.CanDelete = true;
      this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
    }
    else {
      this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP1003"])
      // Can't delete this procedure from encounter form, however this procedure can be deleted from the parent form i.e. Dental form.
    }
  }

  removeCompletedProcedure(value: ProceduresInfo, index: number) {

    if (this.overlayref.RequestData.ViewFrom != "ProcedureView") {
      value.CanDelete = true;
      this.completedProcedures.next(this.encounterInfo.CompletedProcedures.filter(fn => fn.CanDelete === false));
    }
    else {
      this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP1003"])
      // Can't delete this procedure from encounter form, however this procedure can be deleted from the parent form i.e. Dental form.
    }
  }

  removeEncounterDiagnosis(value: EncounterDiagnosis, index: number) {
    value.CanDelete = true;
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }

  onReferralFromStateChange(value) {
    if (value) {
      this.encounterInfo.ReferredTo = false;
      this.encounterInfo.ReferralTo = "";
    }
  }

  onReferralToStateChange(value) {
    if (value) {
      this.encounterInfo.ReferredFrom = false;
      this.encounterInfo.ReferralFrom = "";
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
    p.Status = "Completed";
    this.encounterInfo.CompletedProcedures.push(p);
    this.completedProcedures.next(
      this.encounterInfo.CompletedProcedures.filter(fn => fn.CanDelete === false));
  }


  onDocumentedReasonChange(value: MedicalCode) {
    this.encounterInfo.EncounterCode = value.Code;
    this.encounterInfo.EncounterDescription = value.Description;
    this.encounterInfo.EncounterCodeSystem = value.CodeSystem;
  }

  onToothSurfaceSelectedForCP(value, item: ProceduresInfo, index) {
    item.Place = value;
  }

  onToothSurfaceSelectedForRP(value, item, index) {
    item.Place = value;
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
    this.overlayref.close({ "UpdatedModal": PatientChart.Encounters, refreshView: true, "saved": true });
  }

  saveAsDraft() {
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;
    this.encounterInfo.Signed = false;
    if (this.encounterInfo.ServiceEndAt == new Date())
      this.encounterInfo.ServiceEndAt = null;
    this.updateEncounter();
  }

  signConfirmation() {
    this.openComponentDialog(this.signEncounterNoteComponent, null);
  }
  signEncounter() {
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;
    this.encounterInfo.Signed = true;
    this.updateEncounter();
  }


  updateEncounter() {

    let isAdd = this.encounterInfo.EncounterId == null;

    console.log(this.encounterInfo);


    if (this.encounterInfo.Vital.CollectedAt != null)
      this.encounterInfo.Vital.strCollectedAt = this.datePipe.transform(this.encounterInfo.Vital.CollectedAt, "MM/dd/yyyy")

    if (this.encounterInfo.Vital.CollectedTime != null)
      this.encounterInfo.Vital.strCollectedAt = this.encounterInfo.Vital.strCollectedAt + " " + this.encounterInfo.Vital.CollectedTime;

      this.encounterInfo.strServicedAt = this.datePipe.transform(this.encounterInfo.ServicedAt, "MM/dd/yyyy")

    if (this.encounterInfo.ServiceEndAt != null)
      this.encounterInfo.strServiceEndAt = this.datePipe.transform(this.encounterInfo.ServiceEndAt, "MM/dd/yyyy")

    this.patientService.CreateEncounter(this.encounterInfo).subscribe(resp => {
      if (resp.IsSuccess) {
        this.overlayref.close({ "UpdatedModal": PatientChart.Encounters, refreshView: true, "saved": true });
        if (this.encounterInfo.Signed == true) {
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2AE001" : "M2AE002"]);
        }
        else {
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2AE003"]);
        }
      }
      else {
        this.overlayref.close();
        if (this.encounterInfo.Signed == true) {
          this.alertmsg.displayErrorDailog(ERROR_CODES[isAdd ? "E2AE001" : "E2AE002"]);
        }
        else {
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2AE004"]);
        }
      }
    });
  }

  collectAtRequired(){
   return !(this.encounterInfo.Vital.CollectedAt == null ||
      this.encounterInfo.Vital.CollectedTime == null || this.encounterInfo.Vital.Height == null ||
      this.encounterInfo.Vital.Weight == null ||
      this.encounterInfo.Vital.Temperature == null ||
      this.encounterInfo.Vital.BPSystolic == null ||
      this.encounterInfo.Vital.BPDiastolic == null ||
      this.encounterInfo.Vital.O2Saturation == null ||
      this.encounterInfo.Vital.Pulse == null ||
      this.encounterInfo.Vital.RespiratoryRate == null ||
      this.encounterInfo.Vital.BloodType == null)
  }
  enableSaveButtons() {
    return false;
    // if (this.encounterInfo.ReferredFrom == true) {
    //   return !(this.encounterInfo.ReferralFrom)
    // }
    // else if (this.encounterInfo.ReferredTo == true) {
    //   return !(this.encounterInfo.ReferralTo)
    // }
    // let enableVitals =
    //   (this.encounterInfo.Vital.CollectedAt == null ||
    //     this.encounterInfo.Vital.CollectedTime == null || this.encounterInfo.Vital.Height == null ||
    //     this.encounterInfo.Vital.Weight == null ||
    //     this.encounterInfo.Vital.Temperature == null ||
    //     this.encounterInfo.Vital.BPSystolic == null ||
    //     this.encounterInfo.Vital.BPDiastolic == null ||
    //     this.encounterInfo.Vital.O2Saturation == null ||
    //     this.encounterInfo.Vital.Pulse == null ||
    //     this.encounterInfo.Vital.RespiratoryRate == null ||
    //     this.encounterInfo.Vital.BloodType == null)


    // if (enableVitals) {
    //   let flag = ((this.encounterInfo.Vital.CollectedAt && this.encounterInfo.Vital.CollectedTime) && (this.encounterInfo.Vital.Temperature ||
    //     this.encounterInfo.Vital.O2Saturation || this.encounterInfo.Vital.Pulse || this.encounterInfo.Vital.RespiratoryRate ||
    //     this.encounterInfo.Vital.BloodType))

    //   if ((this.encounterInfo.Vital.Height || this.encounterInfo.Vital.Weight) && !(this.encounterInfo.Vital.Height && this.encounterInfo.Vital.Weight)) {
    //     return !(this.encounterInfo.Vital.Height && this.encounterInfo.Vital.Weight && flag)
    //   }
    //   else if ((this.encounterInfo.Vital.BPSystolic || this.encounterInfo.Vital.BPDiastolic) && !(this.encounterInfo.Vital.BPSystolic && this.encounterInfo.Vital.BPDiastolic)) {
    //     return !(this.encounterInfo.Vital.BPSystolic && this.encounterInfo.Vital.BPDiastolic && flag)
    //   }
    //   else {
    //     return !(flag)
    //   }
    // }


    // return !(this.encounterInfo.Vital.CollectedAt && this.encounterInfo.Vital.CollectedTime)


    // if (this.encounterInfo.HealthInfoExchange == true &&
    //   this.encounterInfo.ReferredTo == false
    //   || this.encounterInfo.ReferralTo == ""
    //   || this.encounterInfo.ReferralTo == null) {
    //   this.messageflagSubject.next(true);
    //   this.message = "Update the provider to whom you referring this patient."
    // } else
    //   if (this.encounterInfo.HealthInfoExchange == true &&
    //     this.encounterInfo.ReferredFrom == false
    //     || this.encounterInfo.ReferralFrom == ""
    //     || this.encounterInfo.ReferralFrom == null) {
    //     this.messageflagSubject.next(true);
    //     this.message = "Update the provider from whom you redirected this patient."
    //   } else this.messageflagSubject.next(false);;
  }

  checkRecommendedProceduresMandatoryFields() {
    let flag = true;
    this.encounterInfo.RecommendedProcedures.forEach((value) => {
      flag = value.ToothNo != null && value.Place != null;
      if (!flag) return false;
    });
    return flag;
  }

  medLinePlusUrl(code: MedicalCode): string {
    if (code.CodeSystem = "SNOMED") {
      return MEDLINE_PLUS_URL(code.Code, MEDLINE_PLUS_SNOMED)
    } else {
      return MEDLINE_PLUS_URL(code.Code, MEDLINE_PLUS_ICD)
    }
  }

  recordSuperBill() {


  }

  addAddendum() {
    let addendum: AddendaComment = {};
    addendum.EncounterId = this.encounterInfo.EncounterId;
    addendum.ProviderId = this.encounterInfo.ProviderId;
    this.openComponentDialog(this.addendaCommentComponent, addendum, Actions.add)
  }

  attachDocuments() {
    let data = {
      "PatientId": this.encounterInfo.PatientId,
      "EncounterId": this.encounterInfo.EncounterId
    }
    this.openComponentDialog(this.addendaAttachDocumentComponent, data, Actions.add)
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {

    const ref = this.overlayService.open(content, data,true);
    ref.afterClosed$.subscribe(res => {
      if (content === this.signEncounterNoteComponent) {
        if (res.data && res.data.signed) {
          this.signEncounter();
        }
      } else if (content === this.addendaAttachDocumentComponent) {
        if (res.data && res.data.Refresh) {
          this.encounterAddendaDocs();
        }
      } else if(content === this.signAddendaDocumentComponent){
        if (res.data && res.data.Signed) {
          this.SignAddendaDoc(res.data.Addenda as AddendaDoc)
        }

      }else if(content === this.addendaReviewDocumentComponent){
        if (res.data && res.data.Refresh) {
          this.encounterAddendaDocs();
        }
      }else if(content === this.addendaCommentComponent){
        if (res.data && res.data.Refresh) {
          this.Addendums();
        }
      }
    });
  }

  onAddendaSinged(addendadoc: AddendaDoc) {
    if(!addendadoc.Signed){
      this.openComponentDialog(this.signAddendaDocumentComponent,addendadoc,Actions.add);
    }
  }

  SignAddendaDoc(addendadoc: AddendaDoc){
    addendadoc.Signed = true;
    this.patientService.SingAddendaDocs(addendadoc).subscribe(resp => {
      this.encounterAddendaDocs();
    })
  }

  encounterAddendaDocs() {
    let requestParams = {
      "EncounterId": this.encounterInfo.EncounterId
    }
    this.patientService.EncounterAddendaDocs(requestParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.encounterInfo.AddendaDocs = resp.ListResult as AddendaDoc[];
      } else {
        this.encounterInfo.AddendaDocs = [];
      }
    })

  }
  Addendums(){
    let requestParams = {
      "EncounterId": this.encounterInfo.EncounterId
    }
    this.patientService.Addendums(requestParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.encounterInfo.AddendaComments = resp.ListResult as AddendaComment[];
      } else {
        this.encounterInfo.AddendaComments = [];
      }
    })
  }
  onDocumentReview(addendadoc: AddendaDoc){
    if(this.patient != null) addendadoc.PatientName = this.patient.FirstName+' '+this.patient.LastName;
    addendadoc.PracticeProviders = this.PracticeProviders;
    addendadoc.ProviderId = this.encounterInfo.ProviderId;
    if(addendadoc.SelectedProviderId == null)
      addendadoc.SelectedProviderId = this.encounterInfo.ProviderId;
    this.openComponentDialog(this.addendaReviewDocumentComponent,addendadoc,Actions.add);
  }
}
