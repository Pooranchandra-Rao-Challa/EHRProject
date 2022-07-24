import { DiscontinueDialogComponent } from './../../../dialogs/discontinue.dialog/discontinue.dialog.component';
import { filter, map, } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProviderPatient } from './../../../_models/_provider/Providerpatient';
import { Component, OnInit, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { PatientService } from '../../../_services/patient.service';
import {
  ScheduledAppointment,
  AdvancedDirective, ChartInfo, PatientChart, Allergy, EncounterDiagnosis, PastMedicalHistory, Actions,
  Immunization, Medication, EncounterInfo, NewAppointment, SmokingStatus, TobaccoUseScreenings, TobaccoUseInterventions,
  Diagnosis, AllergyType, SeverityLevel, OnSetAt, DiagnosisDpCodes, PracticeProviders,
  AppointmentTypes, UserLocations, Room, AppointmentDialogInfo, Vaccine, User, TobaccoUse,
  GlobalConstants, PatientSearchResults, Labandimaging, MEDICATION_NAMES
} from 'src/app/_models';


import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from "@angular/common";
const moment = require('moment');
import { EncounterDialogComponent } from '../../../dialogs/encounter.dialog/encounter.dialog.component';
import { NewAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/newappointment.dialog.component';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AddeditinterventionComponent } from 'src/app/dialogs/addeditintervention/addeditintervention.component';
import { SettingsService } from '../../../_services/settings.service';
import { MedicationDialogComponent } from 'src/app/dialogs/medication.dialog/medication.dialog.component';
import { AllergyDialogComponent } from 'src/app/dialogs/allergy.dialog/allergy.dialog.component';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public selectedPatient: PatientSearchResults[];
  @ViewChild('searchVaccineCode', { static: true }) searchVaccineCode: ElementRef;
  labandimaging: Labandimaging;
  // @ViewChild('searchMedicineCode', { static: true }) searchMedicineCode: ElementRef;
  // filteredMedicines: Observable<PatientSearchResults[]>;
  vaccines: Observable<Vaccine[]>;
  filteredMedicines: any = [];
  isLoading = false;

  advancedDirectivesDialogComponent = AdvancedDirectivesDialogComponent;
  smokingStatusDialogComponent = SmokingStatusDialogComponent;
  interventionDialogComponent = InterventionDialogComponent;
  encounterDialogComponent = EncounterDialogComponent;
  appointmentDialogComponent = NewAppointmentDialogComponent;
  cqmNotPerformedDialogComponent = AddeditinterventionComponent;
  discontinueDialogComponent = DiscontinueDialogComponent;
  medicationDialogComponent = MedicationDialogComponent;
  allergyDialogComponent = AllergyDialogComponent;
  // advancedDirectives: AdvancedDirective[];
  patientDiagnoses: Diagnosis = new Diagnosis();
  patientAllergy: Allergy = new Allergy();
  patientPastMedicalHistory: PastMedicalHistory = new PastMedicalHistory();
  patientMedication: Medication = new Medication();
  patientImmunization: Immunization = new Immunization();
  patientTobaccoUse: TobaccoUse = new TobaccoUse();
  // encounters: EncounterInfo[];
  appointments: NewAppointment[];
  // smokingstatus: SmokingStatus[];
  tobaccoscreenings: TobaccoUseScreenings[];
  tobaccointerventions: TobaccoUseInterventions[];
  allergyType: AllergyType[];
  severityLevel: SeverityLevel[];
  onsetAt: OnSetAt[];
  allergens: any[];
  allergyReaction: GlobalConstants;
  DxCodes: DiagnosisDpCodes[];
  medications: GlobalConstants;
  immUnits: GlobalConstants;
  immRoutes: GlobalConstants;
  immBodySites: GlobalConstants;
  immFundingSources: GlobalConstants;
  immRegistryNotifications: GlobalConstants;
  immVfcClasses: GlobalConstants;
  immManufacturers: GlobalConstants;
  immSourceOfInfo: GlobalConstants;
  immReasonRefuseds: GlobalConstants;
  immReasonRefusedsCode: GlobalConstants;
  currentPatient: ProviderPatient;
  ActionTypes = Actions;
  chartInfo: ChartInfo = new ChartInfo;
  //PatientAppointment: NewAppointment = {};
  PracticeProviders: PracticeProviders[];
  AppointmentTypes: AppointmentTypes[];
  Locations: UserLocations[];
  Rooms: Room[];
  medication_prescription: any[];
  locationColumns: string[] = ['Location', 'Address', 'Phone', 'Providers'];
  screeningColumns: string[] = ['DatePerf', 'Screeningperf', 'Status', 'TobaccoUsecode_desc'];
  interventionColumns: string[] = ['DatePerf', 'Interventionperf', 'InterventionDesc', 'AddReasonNotPerformed', 'Reason'];
  immuniztionColumns: string[] = ['VaccineDescription', 'CVXCode', 'Date', 'Status'];
  administered: boolean = false;
  historical: boolean = true;
  refused: boolean = true;
  LocationAddress: any;
  user: User;
  vaccinesFilter: any;
  medicationsFilter: GlobalConstants;

  constructor(public overlayService: OverlayService,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private smartSchedulerService: SmartSchedulerService,
    private settingsService: SettingsService) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    this.loadGlobalConstants();
    this.currentPatient = this.authService.viewModel.Patient;
    this.ChartInfo();
    this.loadDefaults();
    this.loadAllergyNames('');
    // this.loadVaccines();
    this.loadLocationsList();
    fromEvent(this.searchVaccineCode.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 1
      , filter(res => res.length > 1)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterVaccine(value));

  }

  _filterVaccine(term) {
    this.isLoading = true;
    let reqparams = {
      SearchTearm: term,
    };
    this.patientService.Vaccines(reqparams)
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.vaccines = of(
            resp.ListResult as Vaccine[]);
        } else this.vaccines = of([]);
      });
  }

  displayWithVaccine(value: any): string {
    if (!value) return "";
    return "";
  }

  deleteVaccineCode() {
    this.patientImmunization.Code = '';
    this.patientImmunization.Description = '';
  }

  onSelectedImmunization(selected) {
    debugger;
    this.patientImmunization.Code = selected.option.value.Code;
    this.patientImmunization.Description = selected.option.value.Description;
  }

  // search medications
  // _filterMedicine(term) {
  //   console.log(term);
  //   this.isLoading = true;
  //   this.filteredMedicines = this.reason;
  //   // this.filteredMedicines = this.reason.filter(
  //   //   function (data) {
  //   //     return data.ReasonCode == term;
  //   //   }
  //   // );
  // }

  onMedicineSelected(selected) {
    this.labandimaging.ProviderId = selected.option.value.ProviderId;
    this.labandimaging.PatientId = selected.option.value.PatientId;
  }

  displayMedicineWith(value: any): string {
    if (!value) return "";
    return value.ReasonCode + "-" + value.ReasonDescription;
  }

  loadGlobalConstants() {
    this.allergyType = Object.values(AllergyType);
    this.severityLevel = Object.values(SeverityLevel);
    this.onsetAt = Object.values(OnSetAt);
    this.allergyReaction = GlobalConstants.AllergyReactions;
    this.DxCodes = Object.values(DiagnosisDpCodes);
    this.medications = GlobalConstants.Medication_Names;
    this.medicationsFilter = this.medications.slice();
    this.immUnits = GlobalConstants.Units;
    this.immRoutes = GlobalConstants.Routes;
    this.immBodySites = GlobalConstants.BodySites;
    this.immFundingSources = GlobalConstants.FundingSources;
    this.immRegistryNotifications = GlobalConstants.RegistryNotifications;
    this.immVfcClasses = GlobalConstants.VfcClasses;
    this.immManufacturers = GlobalConstants.Manufacturers;
    this.immSourceOfInfo = GlobalConstants.SourceOfInfo;
    this.immReasonRefuseds = GlobalConstants.ReasonRefuseds;
    this.immReasonRefusedsCode = GlobalConstants.DrugReasonRefusedsCode;
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.advancedDirectivesDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.smokingStatusDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.cqmNotPerformedDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.medicationDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.allergyDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.discontinueDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.new && content === this.encounterDialogComponent) {
      let ef = new EncounterInfo();
      if (dialogData == null){
        ef.PatientId = this.authService.viewModel.Patient.PatientId;
      }
      reqdata = ef;
    }else if (action == Actions.view && content === this.encounterDialogComponent) {
      let ef = new EncounterInfo();
      ef.EncounterId = dialogData.EncounterId
      ef.PatientId = dialogData.PatientId
      reqdata = ef;
    } else if (action == Actions.new && content === this.appointmentDialogComponent) {
      reqdata = this.PatientAppointmentInfoForNew(action);
    }else if (action == Actions.view && content === this.appointmentDialogComponent) {
      reqdata = this.PatientAppointmentInfoForView(dialogData,action);
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
    }
    else if (data.UpdatedModal == PatientChart.Allergies) {
      this.AllergiesByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.Medications) {
      this.MedicationsByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.Encounters) {
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
    this.patientImmunization = new Immunization;
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
    else if (name == 'immunization') {
      this.patientImmunization = dialogData;
      var dateString = this.patientImmunization.AdministeredAt;
      var timeFull = dateString.split('T');
      var time = timeFull[1].split('.');
      this.patientImmunization.AdministeredTime = time[0];
      // this.displayWithVaccine(dialogData);
    }
  }

  GetAppointmentInfo(){
    let data: AppointmentDialogInfo = {}

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

  loadAllergyNames(req) {
    this.patientService.AllergyNames(req).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.allergens = resp.ListResult;
      }
    })
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

  // loadVaccines() {
  //   debugger;
  //   this.patientService.Vaccines().subscribe(resp => {
  //     if (resp.IsSuccess) {
  //       var sample = resp.ListResult.map((x) => ({
  //         'code': x.code,
  //         'description': x.description
  //       }));
  //       this.vaccines = sample;
  //       // this.vaccinesFilter = this.vaccines.slice();
  //       console.log(this.vaccines);
  //       console.log(this.vaccinesFilter);
  //       // if (this.patientImmunization.Code != "") {
  //       //   let data = this.patientImmunization.Code;
  //       //   let interventionlist = this.patientImmunization.find(x => x.Code == data);
  //       //   this.CQMNotPerformed.InterventionCode = interventionlist.Code;
  //       //   this.CQMNotPerformed.InterventionDescription = interventionlist.Description;
  //       // }
  //     }
  //   });
  // }

  // get display Location Details
  loadLocationsList() {
    this.LocationAddress = [];
    this.settingsService.PracticeLocations(this.user.ProviderId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.LocationAddress = resp.ListResult;
      }
    });
  }

  vaccineCodeDescription(vaccine) {
    this.patientImmunization.Code = vaccine.code;
    this.patientImmunization.Description = vaccine.description;
  }

  CreateImmunizationsAdministered() {
    debugger;
    let isAdd = this.patientImmunization.ImmunizationId == undefined;
    this.patientImmunization.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateImmunizationsAdministered(this.patientImmunization).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ImmunizationsByPatientId();
        this.resetDialog();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCI001" : "M2CCI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCI001"]);
        this.resetDialog();
      }
    });
  }

  CreateImmunizationsHistorical() {
    let isAdd = this.patientImmunization.ImmunizationId == undefined;
    this.patientImmunization.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateImmunizationsHistorical(this.patientImmunization).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ImmunizationsByPatientId();
        this.resetDialog();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCI001" : "M2CCI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCI001"]);
        this.resetDialog();
      }
    });
  }

  CreateImmunizationsRefused() {
    let isAdd = this.patientImmunization.ImmunizationId == undefined;
    this.patientImmunization.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateImmunizationsRefused(this.patientImmunization).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ImmunizationsByPatientId();
        this.resetDialog();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCI001" : "M2CCI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCI001"]);
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

  disableImmAdministered() {
    return !(this.patientImmunization.Code == undefined ? '' : this.patientImmunization.Code != ''
      && this.patientImmunization.AdministeredAt == undefined ? '' : this.patientImmunization.AdministeredAt != ''
        && this.patientImmunization.AdministeredById == undefined ? '' : this.patientImmunization.AdministeredById != ''
          && this.patientImmunization.OrderedById == undefined ? '' : this.patientImmunization.OrderedById != ''
            && this.patientImmunization.AdministeredFacilityId == undefined ? '' : this.patientImmunization.AdministeredFacilityId != ''
              && this.patientImmunization.Manufacturer == undefined ? '' : this.patientImmunization.Manufacturer != ''
                && this.patientImmunization.Lot == undefined ? '' : this.patientImmunization.Lot != ''
                  && this.patientImmunization.Quantity == undefined ? '' : this.patientImmunization.Quantity != ''
                    && this.patientImmunization.Dose == undefined ? '' : this.patientImmunization.Dose != ''
                      && this.patientImmunization.Unit == undefined ? '' : this.patientImmunization.Unit != ''
                        && this.patientImmunization.ExpirationAt == undefined ? '' : this.patientImmunization.ExpirationAt.toString() != '')
  }

  disableImmHistorical() {
    return !(this.patientImmunization.Code == undefined ? '' : this.patientImmunization.Code != ''
      && this.patientImmunization.AdministeredAt == undefined ? '' : this.patientImmunization.AdministeredAt != ''
        && this.patientImmunization.SourceOfInformation == undefined ? '' : this.patientImmunization.SourceOfInformation != ''
          && this.patientImmunization.AdministeredFacilityId == undefined ? '' : this.patientImmunization.AdministeredFacilityId != '')
  }

  disableImmRefused() {
    return !(this.patientImmunization.Code == undefined ? '' : this.patientImmunization.Code != ''
      && this.patientImmunization.ReasonRefused == undefined ? '' : this.patientImmunization.ReasonRefused != ''
        && this.patientImmunization.ReasonCode == undefined ? '' : this.patientImmunization.ReasonCode != ''
          && this.patientImmunization.RefusedAt == undefined ? '' : this.patientImmunization.RefusedAt.toString() != ''
            && this.patientImmunization.AdministeredFacilityId == undefined ? '' : this.patientImmunization.AdministeredFacilityId != '')
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
      if (resp.IsSuccess) this.chartInfo.Immunizations = resp.ListResult;
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
      if (resp.IsSuccess) this.chartInfo.TobaccoUseScreenings = resp.ListResult;
    });
  }

  // Get tobacco interventions info
  TobaccoUseInterventions() {
    this.patientService.TobaccoUseInterventions({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.TobaccoUseInterventions = resp.ListResult;
    });
  }

  TriggerRuleDD: any[] = [
    { value: 'ONE', viewValue: 'ONE' },
    { value: 'Two', viewValue: 'Two' },
    { value: 'Three', viewValue: 'Three' },
    { value: 'All', viewValue: 'All' },
  ];

  PatientAppointmentInfoForView(appointment: any, action?: Actions) {
    let data = {} as AppointmentDialogInfo;
    let PatientAppointment: NewAppointment = {};

    PatientAppointment = {} as NewAppointment;
    PatientAppointment.PatientId = appointment.PatientId;
    PatientAppointment.PatientName = appointment.PatientName;
    PatientAppointment.LocationId = appointment.LocationId;
    PatientAppointment.ProviderId = appointment.ProviderId;
    PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    PatientAppointment.AppointmentId = appointment.AppointmentId;
    PatientAppointment.AppointmentStatusId = appointment.ApptStatusId;
    PatientAppointment.AppointmentTypeId = appointment.ApptTypeId;
    PatientAppointment.LocationId = appointment.LocationId;
    PatientAppointment.RoomId = appointment.RoomId;
    PatientAppointment.Notes = appointment.Note;
    PatientAppointment.Duration = 30;
    PatientAppointment.Notes = appointment.Note;
    PatientAppointment.Startat = appointment.StartAt
    data.Title = "Edit Appointment";
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = appointment.ProviderId;
    data.LocationId = appointment.LocationId;
    data.PatientAppointment = PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;
    data.status = action;
    console.log(data);

    return data;
  }

  PatientAppointmentInfoForNew(action: Actions) {

    let data = {} as AppointmentDialogInfo;
    let PatientAppointment: NewAppointment = {};
    PatientAppointment.PatientId = this.currentPatient.PatientId;
    PatientAppointment.PatientName = this.currentPatient.FirstName + ' ' + this.currentPatient.LastName;
    PatientAppointment.LocationId = this.authService.userValue.CurrentLocation;
    PatientAppointment.ProviderId = this.currentPatient.ProviderId;
    PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    PatientAppointment.Duration = 30;
    data.Title = "New Appointment";
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = this.currentPatient.ProviderId;
    data.LocationId = this.authService.userValue.CurrentLocation;
    data.PatientAppointment = PatientAppointment;
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

  resetImmunization() {
    if (this.patientImmunization.ImmunizationId == undefined) {
      this.patientImmunization = new Immunization;
    }
    else {
      this.ImmunizationsByPatientId();
    }
  }

}
