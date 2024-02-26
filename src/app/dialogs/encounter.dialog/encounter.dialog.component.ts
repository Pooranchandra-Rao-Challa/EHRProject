

import { FormFieldValue } from './../../_components/advanced-medical-code-search/field-control/field-control-component';
import { AddendaDoc, AddendaComment, DENTAL_SURFACES } from './../../_models/_provider/encounter';

import { Component, ElementRef, OnInit, TemplateRef, ViewChild,  } from '@angular/core';
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
import { BehaviorSubject, Subject } from 'rxjs';
import { OverlayService } from 'src/app/overlay.service';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { SignEncounterNoteComponent } from 'src/app/dialogs/encounter.dialog/sign.encounter.note.component';
import { AddendaAttachDocumentComponent } from 'src/app/dialogs/encounter.dialog/addenda.attach.document';
import { SignAddendaDocumentComponent } from 'src/app/dialogs/encounter.dialog/attenda.document.sign.component';
import { AddendaReviewDocumentComponent } from 'src/app/dialogs/encounter.dialog/addenda.review.document';
import { AddendaCommentComponent } from 'src/app/dialogs/encounter.dialog/addenda.comment';
import { VitalDialogComponent } from 'src/app/dialogs/vital.dalog/vital.dialog.component';
import { SuperbillDialogComponent } from 'src/app/dialogs/superbill/superbill.component';

import { DatePipe } from '@angular/common';
import {
  MEDLINE_PLUS_URL,
  MEDLINE_PLUS_SNOMED,
  MEDLINE_PLUS_ICD
} from "src/environments/environment";
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import Swal from 'sweetalert2';


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
  vitalsColumns = ["CollectedAt", "Height", "Weight", "BMI", "BP", "Temperature", "Pulse", "Respiratory_Rate", "O2_Saturation", "Blood_type", "Actions"];

  EnableNewEncounterData: boolean;
  recommendedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
  completedProcedures = new BehaviorSubject<ProceduresInfo[]>([]);
  diagnosesInfo = new BehaviorSubject<EncounterDiagnosis[]>([]);
  vitalsInfo = new BehaviorSubject<VitalInfo[]>([]);
  teethNumbers = []; // [0,1,2,3,4]
  @ViewChild('heightField', { static: true }) heightField: ElementRef;

  appointment: ScheduledAppointment;
  location: UserLocations;
  encounterInfo: EncounterInfo = new EncounterInfo;
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  codeSystemsForReconcillation: string[] = ['SNOMED'];
  codeSystemsForDischarge: string[] = ['SNOMED'];
  codeSystemsForDocumentation: string[] = ['CPT'];
  codeSystemsForProcedures: string[] = ['CDT/CPT', 'HCPCS'];
  selectedProcedureValue: FormFieldValue = { CodeSystem: 'CDT/CPT', SearchTerm: '' };
  selectedDiagnosisValue: FormFieldValue = { CodeSystem: 'SNOMED/ICD10', SearchTerm: '' };
  selectedReconcillationValue: FormFieldValue = { CodeSystem: 'SNOMED', SearchTerm: '' };
  selectedDischargeValue: FormFieldValue = { CodeSystem: 'SNOMED', SearchTerm: '' };
  selectedDocumentationValue: FormFieldValue = { CodeSystem: 'CPT', SearchTerm: '' };
  selectedEncounterCodeValue: FormFieldValue = { CodeSystem: 'CPT', SearchTerm: '' };
  dentalSurfaces = DENTAL_SURFACES;


  vitalDialogResponse: any;
  ActionsType = Actions;
  message: string = "";
  BloodTypes = [
    { Id: 1, BloodType: 'Group A' },
    { Id: 2, BloodType: 'Group B' },
    { Id: 3, BloodType: 'Group AB' },
    { Id: 4, BloodType: 'Group O' }
  ];
  dischargeCode: MedicalCode = {};
  dialogIsLoading: boolean = false;
  patient: ProviderPatient;
  signEncounterNoteComponent = SignEncounterNoteComponent;
  addendaAttachDocumentComponent = AddendaAttachDocumentComponent;
  signAddendaDocumentComponent = SignAddendaDocumentComponent;
  addendaReviewDocumentComponent = AddendaReviewDocumentComponent;
  addendaCommentComponent = AddendaCommentComponent;
  vitalDialogComponent = VitalDialogComponent;
  superbillDialogComponent = SuperbillDialogComponent;
  isNavigateFromProductView: boolean = false;
  minDateToFinish = new Subject<string>();
  endDateForEncounter;
  startDateForEncounter;
  currentTabIndex: number = 0;
  encounterAddendaColumns: string[] = ['Signed/Authorized', 'Name', 'DocumentType', 'Comments'];

  private messageflagSubject = new BehaviorSubject<boolean>(false);
  public messageflag$ = this.messageflagSubject.asObservable();
  constructor(private overlayref: EHROverlayRef, public authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private patientService: PatientService,
    private overlayService: OverlayService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe) {
    let i = 1;  //normally would use var here
    while (this.teethNumbers.push(i++) < 32) { }

    this.minDateToFinish.subscribe(e => {
      this.endDateForEncounter = new Date(e);
    });
  }

  ngOnInit(): void {

    this.EnableNewEncounterData = this.authService.userValue.EnableStage3;

    this.location = (JSON.parse(this.authService.userValue.LocationInfo) as UserLocations[])
      .filter((loc) => loc.LocationId === this.authService.userValue.CurrentLocation)[0];

    this.loadDefaults();

    if(this.overlayref.RequestData instanceof  EncounterInfo)
      this.encounterInfo = this.overlayref.RequestData as EncounterInfo;
    else if(this.overlayref.RequestData.appointment){
      this.appointment = this.overlayref.RequestData.appointment as ScheduledAppointment;
      this.startDateForEncounter = new Date(this.datePipe.transform(this.appointment.AppointmentTime,"MM/dd/yyyy"));


    }else if(this.overlayref.RequestData.ViewFrom == "ProcedureView"){
      this.encounterInfo = {EncounterId: this.overlayref.RequestData.EncounterId,PatientId:this.overlayref.RequestData.PatientId }
    }




    this.initEncoutnerView();
    this.loadEncouterView();
    let patientId = this.appointment ? this.appointment.PatientId : this.encounterInfo.PatientId;
    if(patientId)
    this.patientService.PatientProfile({ "PatientId": patientId })
      .subscribe((resp) => {
        if (resp.IsSuccess) {
          this.patient = resp.Result as ProviderPatient;
        }
      });


    this.isNavigateFromProductView = this.overlayref.RequestData["From"] == "ProcedureView";
    if (this.overlayref.RequestData["From"] == "ProcedureView"
      && this.overlayref.RequestData.EncounterId == null) {
      let proceduredata = this.overlayref.RequestData as ProceduresInfo;
      if (proceduredata.Status == "Completed") {
        this.encounterInfo.CompletedProcedures.push(this.overlayref.RequestData as ProceduresInfo);
      }
      else {
        this.encounterInfo.RecommendedProcedures.push(this.overlayref.RequestData as ProceduresInfo);
      }

    }
    this.encounterInfo.EnableNewEncounterData = this.EnableNewEncounterData;
    this.encounterInfo.Diagnoses.forEach(fn => {
      fn.PatientEdn = "Medline Plus";
      fn.MedLineUrl = this.medLinePlusUrl({
        Code: fn.Code,
        CodeSystem: fn.CodeSystem
      });
    });
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
    this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);
    this.completedProcedures.next(this.encounterInfo.CompletedProcedures);

    this.endDateForEncounter = new Date(this.encounterInfo.ServicedAt);
  }

  editVital(vital: VitalInfo, index: number) {
    vital.RowNumber = index;
    vital.CanDelete = false;
    this.openVitalView(vital);
  }

  addVital() {
    this.openVitalView();
  }

  updateVital(vital: VitalInfo) {
    if (vital.RowNumber > -1) {
      this.encounterInfo.Vitals[vital.RowNumber] = vital;
    } else {
      this.encounterInfo.Vitals.push(vital);
    }
    this.vitalsInfo.next(this.encounterInfo.Vitals.filter(fn => fn.CanDelete === false));
  }
  removeVital(vital: VitalInfo, index: number) {
    vital.RowNumber = index;
    this.encounterInfo.Vitals[index].CanDelete = true;
    this.vitalsInfo.next(this.encounterInfo.Vitals.filter(fn => fn.CanDelete === false));
  }
  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
    let providerId = this.appointment ? this.appointment.ProviderId : this.encounterInfo.ProviderId;
    let patientId = this.appointment ? this.appointment.PatientId : this.encounterInfo.PatientId;
    let serviceingDate = this.datePipe.transform(e.value,"MM/dd/yyyy");
    this.patientService.DuplicateEncounter({
      ProviderId: providerId,
      PatientId: patientId,
      strStartAt: serviceingDate
    }).subscribe(resp =>{
      if(resp.IsSuccess){
        if(resp.Result.hasEncounter){
          this.encounterInfo.ServicedAt = null;
          this.openDuplicateDialog(resp.Result.encounterId,serviceingDate);
        }
      }
    })
  }

  public encounterTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTabIndex = tabChangeEvent.index;
  }

  initEncoutnerView() {
    if (this.EnableNewEncounterData) {
      this.encounterInfo.EncounterType = "Office Visit (1853490003)";
      this.encounterInfo.EncounterCode = "";
      this.encounterInfo.EncounterCodeSystem = "";
      this.encounterInfo.EncounterDescription = "";
    } else {
      this.encounterInfo.EncounterType = "";
      this.encounterInfo.EncounterCode = "99213";
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

  loadEncouterView(encounterId: string = null) {
    let requestdata = { "AppointmentId": null, "EncounterId": null };
    if (this.appointment != null)
      requestdata = {
        "EncounterId": this.appointment.EncounterId,
        "AppointmentId": this.appointment.EncounterId == null ?
          this.appointment.AppointmentId : null
      };
    else if(encounterId != null){
      requestdata = {
        "EncounterId": encounterId,
        "AppointmentId": null
      };
    }else if(this.encounterInfo && this.encounterInfo.EncounterId){
      requestdata = {
        "EncounterId": this.encounterInfo.EncounterId,
        "AppointmentId": null
      };
    }


    this.dialogIsLoading = true;
    this.patientService.EncounterView(requestdata).subscribe(resp => {
      if (resp.IsSuccess) {
        this.dialogIsLoading = false;
        if (resp.AffectedRecords == 1) {
          this.encounterInfo = resp.Result as EncounterInfo;



          if (this.encounterInfo.Vitals)
            this.encounterInfo.Vitals.forEach(vital => {
              if (vital.CollectedAt != null)
                vital.CollectedTime = this.datePipe.transform(vital.CollectedAt, "hh:mm a");
            });
          else this.encounterInfo.Vitals =[];

          this.encounterInfo.PatientName = this.appointment ? this.appointment.PatientName : this.patient ? `${this.patient.FirstName} ${this.patient.LastName}` : "";
          this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
          this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures);
          this.completedProcedures.next(this.encounterInfo.CompletedProcedures);
          this.vitalsInfo.next(this.encounterInfo.Vitals);

          this.dischargeCode.Code = this.encounterInfo.DischargeStatusCode;
          this.dischargeCode.Description = this.encounterInfo.DischargeStatus;
          this.dischargeCode.CodeSystem = this.encounterInfo.DischargeStatusCodeSystem;
          this.encounterInfo.Diagnoses.forEach(fn => {
            fn.PatientEdn = "Medline Plus";
            fn.MedLineUrl = this.medLinePlusUrl({
              Code: fn.Code,
              CodeSystem: fn.CodeSystem
            });
          });

        } else {
          this.encounterInfo.ProviderId = this.authService.userValue.ProviderId;
          this.encounterInfo.LocationId = this.location.LocationId;
          if (this.appointment != null) {
            this.encounterInfo.AppointmentId = this.appointment.AppointmentId;
            this.encounterInfo.PatientId = this.appointment.PatientId;
            this.encounterInfo.PatientName = this.appointment.PatientName;
          }
          if(resp.AffectedRecords == 0 && this.appointment){
            this.encounterInfo.ServicedAt = this.startDateForEncounter;
          }else if(this.encounterInfo.EncounterId == null)
            this.encounterInfo.ServicedAt = new Date();
        }

      } else {
        this.overlayref.close();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AE003"]);
      }
    });
  }
  documentationChanged(value) {
    this.encounterInfo.CurrentMedicationDocumented = (value as MatRadioButton).value;
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
    this.encounterInfo.DischargeStatusCode = value.Code;
    this.encounterInfo.DischargeStatusCodeSystem = value.CodeSystem;
  }

  onEncounterCodeChange(value: MedicalCode) {
    this.encounterInfo.EncounterDescription = value.Description;
    this.encounterInfo.EncounterCode = value.Code;
    this.encounterInfo.EncounterCodeSystem = value.CodeSystem;
  }

  removeRecommendedProcedure(value: ProceduresInfo, index: number) {
    // if (value.ViewFrom != 'ProcedureView') {
    if (this.overlayref.RequestData.ViewFrom != "ProcedureView") {
      value.CanDelete = true;
      this.recommendedProcedures.next(this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
    }
    else {
      this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP1003"]);
      // Can't delete this procedure from encounter form, however this procedure can be deleted from the parent form i.e. Dental form.
    }
  }

  removeCompletedProcedure(value: ProceduresInfo, index: number) {

    if (this.overlayref.RequestData.ViewFrom != "ProcedureView") {
      value.CanDelete = true;
      this.completedProcedures.next(this.encounterInfo.CompletedProcedures.filter(fn => fn.CanDelete === false));
    }
    else {
      this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP1003"]);
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
    d.Code = value.Code;
    d.CodeSystem = value.CodeSystem;
    d.Description = value.Description;
    d.MedLineUrl = this.medLinePlusUrl(value);
    d.CanDelete = false;
    this.encounterInfo.Diagnoses.push(d);
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses.filter(fn => fn.CanDelete === false));
  }

  onProceduresRecommended(value: MedicalCode) {
    let p: ProceduresInfo = new ProceduresInfo();
    p.Code = value.Code;
    p.CodeSystem = value.CodeSystem;
    p.Description = value.Description;
    p.CanDelete = false;
    p.Status = "Treatment planned";
    this.encounterInfo.RecommendedProcedures.push(p);
    this.recommendedProcedures.next(
      this.encounterInfo.RecommendedProcedures.filter(fn => fn.CanDelete === false));
  }

  onProcedureCompleted(value: MedicalCode) {
    let p: ProceduresInfo = new ProceduresInfo;
    p.Code = value.Code;
    p.CodeSystem = value.CodeSystem;
    p.Description = value.Description;
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

  dischargeSelected(): string {
    if (!this.encounterInfo.DischargeStatusCode) return "";
    return this.encounterInfo.DischargeStatusCode + '-' + this.encounterInfo.DischargeStatus;
  }

  encounterCodeSeelcted(): string {
    if (!this.encounterInfo.EncounterCode) return "";
    return this.encounterInfo.EncounterCode + '-' + this.encounterInfo.EncounterDescription;
  }

  updateEncounter() {

    let isAdd = this.encounterInfo.EncounterId == null;
    if (!this.encounterInfo.Vitals) this.encounterInfo.Vitals = [];
    this.encounterInfo.Vitals.forEach(vital => {
      if (vital.CollectedAt != null)
        vital.strCollectedAt = this.datePipe.transform(vital.CollectedAt, "MM/dd/yyyy");
      if (vital.CollectedTime != null)
        vital.strCollectedAt = vital.strCollectedAt + " " + vital.CollectedTime;

    });


    this.encounterInfo.strServicedAt = this.datePipe.transform(this.encounterInfo.ServicedAt, "MM/dd/yyyy");

    if (this.encounterInfo.ServiceEndAt != null)
      this.encounterInfo.strServiceEndAt = this.datePipe.transform(this.encounterInfo.ServiceEndAt, "MM/dd/yyyy");


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

  enableSaveButtons() {

    if (this.encounterInfo.ReferredFrom == true) {
      return !(this.encounterInfo.ReferralFrom);
    }
    else if (this.encounterInfo.ReferredTo == true) {
      return !(this.encounterInfo.ReferralTo);
    }


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
      return MEDLINE_PLUS_URL(code.Code, MEDLINE_PLUS_SNOMED);
    } else {
      return MEDLINE_PLUS_URL(code.Code, MEDLINE_PLUS_ICD);
    }
  }

  recordSuperBill() {
    this.openComponentDialog(this.superbillDialogComponent,{encounterInfo: this.encounterInfo, patient:this.patient}, Actions.view);

  }

  addAddendum() {
    let addendum: AddendaComment = {};
    addendum.EncounterId = this.encounterInfo.EncounterId;
    addendum.ProviderId = this.encounterInfo.ProviderId;
    this.openComponentDialog(this.addendaCommentComponent, addendum, Actions.add);
  }

  attachDocuments() {
    let data = {
      "PatientId": this.encounterInfo.PatientId,
      "EncounterId": this.encounterInfo.EncounterId
    };
    this.openComponentDialog(this.addendaAttachDocumentComponent, data, Actions.add);
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {

    const ref = this.overlayService.open(content, data, true);
    ref.afterClosed$.subscribe(res => {
      if (content === this.signEncounterNoteComponent) {
        if (res.data && res.data.signed) {
          this.signEncounter();
        }
      } else if (content === this.addendaAttachDocumentComponent) {
        if (res.data && res.data.Refresh) {
          this.encounterAddendaDocs();
        }
      } else if (content === this.signAddendaDocumentComponent) {
        if (res.data && res.data.Signed) {
          this.SignAddendaDoc(res.data.Addenda as AddendaDoc);
        }

      } else if (content === this.addendaReviewDocumentComponent) {
        if (res.data && res.data.Refresh) {
          this.encounterAddendaDocs();
        }
      } else if (content === this.addendaCommentComponent) {
        if (res.data && res.data.Refresh) {
          this.Addendums();
        }
      } else if (content === this.vitalDialogComponent) {
        if (res.data && res.data.UpdateVital) {
          this.updateVital(res.data.data);
        }
      } else if (content === this.superbillDialogComponent){
        if(res.data && res.data.UpdateView == true){
          //ref.close();
          this.overlayref.close();
        }
      }
    });
  }

  openVitalView(vital: VitalInfo = null) {
    let action = Actions.edit;
    if (vital == null) {
      vital = {
        UnitSystem: "us",
        TempType: "unspecified",
        CanDelete: false
      };
      let action = Actions.add;
      vital.EncounterId = this.encounterInfo.EncounterId;
    }
    this.openComponentDialog(this.vitalDialogComponent, vital, action);
  }
  onAddendaSinged(addendadoc: AddendaDoc) {
    if (!addendadoc.Signed) {
      this.openComponentDialog(this.signAddendaDocumentComponent, addendadoc, Actions.add);
    }
  }

  SignAddendaDoc(addendadoc: AddendaDoc) {
    addendadoc.Signed = true;
    this.patientService.SingAddendaDocs(addendadoc).subscribe(resp => {
      this.encounterAddendaDocs();
    });
  }

  encounterAddendaDocs() {
    let requestParams = {
      "EncounterId": this.encounterInfo.EncounterId
    };
    this.patientService.EncounterAddendaDocs(requestParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.encounterInfo.AddendaDocs = resp.ListResult as AddendaDoc[];
      } else {
        this.encounterInfo.AddendaDocs = [];
      }
    });

  }
  Addendums() {
    let requestParams = {
      "EncounterId": this.encounterInfo.EncounterId
    };
    this.patientService.Addendums(requestParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.encounterInfo.AddendaComments = resp.ListResult as AddendaComment[];
      } else {
        this.encounterInfo.AddendaComments = [];
      }
    });
  }
  onDocumentReview(addendadoc: AddendaDoc) {
    if (this.patient != null) addendadoc.PatientName = this.patient.FirstName + ' ' + this.patient.LastName;
    addendadoc.PracticeProviders = this.PracticeProviders;
    addendadoc.ProviderId = this.encounterInfo.ProviderId;
    if (addendadoc.SelectedProviderId == null)
      addendadoc.SelectedProviderId = this.encounterInfo.ProviderId;
    this.openComponentDialog(this.addendaReviewDocumentComponent, addendadoc, Actions.add);
  }

  validatePrimaryDx(event){


  }

  openDuplicateDialog(encounterId,serviceingDate){
    let date = this.datePipe.transform(serviceingDate,"EEEE, dd MMM, yyyy")
    Swal.fire({
      title: 'Redundant Encounter Warning!',
      html: `<p class="swal-title-message">There is already an encounter recorded for this patient for selected date <b>${date}</b></p><div class="swal-note-message"><b>NOTE:</b>Once an Encounter Note has been signed, it cannot be edited. If you need to add additional notes to a signed Encounter Note, you can add Addenda. To add an addendum, click on the Addenda in signed progress note.</div>`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonColor: '#FF810E',
      confirmButtonText: 'View Progress Note',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      customClass: {
        cancelButton: 'swal2-error',
        popup:'swal2-success-popup',
        container: ['swal2-container-high-zindex'],
      }
  }).then((result) => {

      if (result.isConfirmed) {
          this.loadEncouterView(encounterId);
      } else
          if (result.dismiss === Swal.DismissReason.cancel) {
            this.overlayref.close();
          }
  });
  }
}
