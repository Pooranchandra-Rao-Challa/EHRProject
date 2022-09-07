import { DiscontinueDialogComponent } from './../../../dialogs/discontinue.dialog/discontinue.dialog.component';
import { filter, map, } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProviderPatient } from './../../../_models/_provider/Providerpatient';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { PatientService } from '../../../_services/patient.service';
import {
  ChartInfo, PatientChart, PastMedicalHistory, Actions,
  Immunization, EncounterInfo, NewAppointment, TobaccoUseScreenings, TobaccoUseInterventions, PracticeProviders,
  AppointmentTypes, UserLocations, Room, AppointmentDialogInfo, Vaccine, User, TobaccoUse, GlobalConstants,
  PatientSearchResults, Labandimaging, PatientSearch
} from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from "@angular/common";
import { EncounterDialogComponent } from '../../../dialogs/encounter.dialog/encounter.dialog.component';
import { NewAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/newappointment.dialog.component';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AddeditinterventionComponent } from 'src/app/dialogs/addeditintervention/addeditintervention.component';
import { SettingsService } from '../../../_services/settings.service';
import { MedicationDialogComponent } from 'src/app/dialogs/medication.dialog/medication.dialog.component';
import { AllergyDialogComponent } from 'src/app/dialogs/allergy.dialog/allergy.dialog.component';
import { TobaccoUseDialogComponent } from 'src/app/dialogs/tobacco.use.dialog/tobacco.use.dialog.component';
import { InterventionTableDialogComponent } from 'src/app/dialogs/intervention.table.dialog/intervention.table.dialog.component';
import { AllergyTableDialogComponent } from 'src/app/dialogs/allergy.table.dialog/allergy.table.dialog.component';
import { FrequentlyUsedDiagnosesDialogComponent } from 'src/app/dialogs/frequently.used.diagnoses.dialog/frequently.used.diagnoses.dialog.component';
import { AddDiagnosesDialogComponent } from 'src/app/dialogs/add.diagnoses.dialog/add.diagnoses.dialog.component';
import { ViewChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { Router } from '@angular/router';
import { DiagnosesTableDialogComponent } from 'src/app/dialogs/diagnoses.table.dialog/diagnoses.table.dialog.component';
import { MedicationTableDialogComponent } from 'src/app/dialogs/medication.table.dialog/medication.table.dialog.component';
import { TobaccoUseTableDialogComponent } from 'src/app/dialogs/tobacco.use.table.dialog/tobacco.use.table.dialog.component';
import { SmokingStatusTableDialogComponent } from 'src/app/dialogs/smoking.status.table.dialog/smoking.status.table.dialog.component';
import { AdvancedDirectivesTableDialogComponent } from 'src/app/dialogs/advanced.directives.table.dialog/advanced.directives.table.dialog.component';
import { PastMedicalHistoryDialogComponent } from 'src/app/dialogs/past.medical.history.dialog/past.medical.history.dialog.component';
import { EncounterTableDialogComponent } from 'src/app/dialogs/encounter.table.dialog/encounter.table.dialog.component';
import { AppointmentsTableDialogComponent } from 'src/app/dialogs/appointments.table.dialog/appointments.table.dialog.component';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {
  public selectedPatient: PatientSearchResults[];
  @ViewChild('searchVaccineCode', { static: true }) searchVaccineCode: ElementRef;

  @ViewChild('searchPatient', { static: true })
  searchPatient: ElementRef;
  labandimaging: Labandimaging;

  vaccines: Observable<Vaccine[]>;
  filteredMedicines: any = [];
  isLoading = false;

  filteredPatients: Observable<PatientSearch[]>;
  frequentlyUsedDiagnosesDialogComponent = FrequentlyUsedDiagnosesDialogComponent;
  addDiagnosesDialogComponent = AddDiagnosesDialogComponent;
  diagnosesTableDialogComponent = DiagnosesTableDialogComponent;
  advancedDirectivesDialogComponent = AdvancedDirectivesDialogComponent;
  advancedDirectivesTableDialogComponent = AdvancedDirectivesTableDialogComponent;
  smokingStatusDialogComponent = SmokingStatusDialogComponent;
  smokingStatusTableDialogComponent = SmokingStatusTableDialogComponent;
  interventionDialogComponent = InterventionDialogComponent;
  interventionTableDialogComponent = InterventionTableDialogComponent;
  encounterDialogComponent = EncounterDialogComponent;
  encounterTableDialogComponent = EncounterTableDialogComponent;
  appointmentDialogComponent = NewAppointmentDialogComponent;
  appointmentsTableDialogComponent = AppointmentsTableDialogComponent;
  cqmNotPerformedDialogComponent = AddeditinterventionComponent;
  discontinueDialogComponent = DiscontinueDialogComponent;
  medicationDialogComponent = MedicationDialogComponent;
  medicationTableDialogComponent = MedicationTableDialogComponent;
  allergyDialogComponent = AllergyDialogComponent;
  allergyTableDialogComponent = AllergyTableDialogComponent;
  tobaccoUseDialogComponent = TobaccoUseDialogComponent;
  tobaccoUseTableDialogComponent = TobaccoUseTableDialogComponent;
  pastMedicalHistoryDialogComponent = PastMedicalHistoryDialogComponent;

  patientImmunization: Immunization = new Immunization();
  tobaccoUseList: TobaccoUse[] = [];
  appointments: NewAppointment[];
  tobaccoscreenings: TobaccoUseScreenings[];
  tobaccointerventions: TobaccoUseInterventions[];
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
  PracticeProviders: PracticeProviders[];
  AppointmentTypes: AppointmentTypes[];
  Locations: UserLocations[];
  Rooms: Room[];
  immunizationColumns: string[] = ['VaccineDescription', 'CVXCode', 'Date', 'Status'];
  administered: boolean = false;
  historical: boolean = true;
  refused: boolean = true;
  LocationAddress: any;
  user: User;
  vaccinesFilter: any;

  constructor(public overlayService: OverlayService,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private smartSchedulerService: SmartSchedulerService,
    private settingsService: SettingsService,
    private viewChangeService: ViewChangeService,
    private router: Router) {
    this.user = authService.userValue;
  }
  ngAfterViewInit(): void {

    fromEvent(this.searchVaccineCode.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.vaccines = of([]);
        return event.target.value;
      })
      // if character length greater or equals to 1
      , filter(res => res.length >= 1)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterVaccine(value));

    fromEvent(this.searchPatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.filteredPatients = of([]);
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 && res.length < 6)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatients(value));
  }

  _filterPatients(term: string) {
    this.patientService
      .PatientSearch({
        ProviderId: this.authService.userValue.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearch[]);
        } else this.filteredPatients = of([]);
      })
  }
  onPatientSelected(selected) {
    //this.labandImaging.CurrentPatient = selected.option.value;
  }
  displayWithPatientSearch(value: PatientSearch): string {
    if (!value) return "";
    return value.Name;
  }
  ngOnInit(): void {
    this.loadGlobalConstants();
    this.currentPatient = this.authService.viewModel.Patient;
    this.ChartInfo();
    this.loadDefaults();
    this.loadLocationsList();
    this.TobaccoUseByPatientId();
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
    else return "";
  }

  deleteVaccineCode() {
    this.patientImmunization.Code = '';
    this.patientImmunization.Description = '';
  }

  onSelectedImmunization(selected) {
    this.patientImmunization.Code = selected.option.value.Code;
    this.patientImmunization.Description = selected.option.value.Description;
  }

  onMedicineSelected(selected) {
    this.labandimaging.ProviderId = selected.option.value.ProviderId;
    this.labandimaging.PatientId = selected.option.value.PatientId;
  }

  displayMedicineWith(value: any): string {
    if (!value) return "";
    return value.ReasonCode + "-" + value.ReasonDescription;
  }

  loadGlobalConstants() {
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
    if (action == Actions.view && content === this.frequentlyUsedDiagnosesDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.addDiagnosesDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.diagnosesTableDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.advancedDirectivesDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.advancedDirectivesTableDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.smokingStatusDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.smokingStatusTableDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.tobaccoUseDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.tobaccoUseTableDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.pastMedicalHistoryDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.cqmNotPerformedDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.medicationDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.medicationTableDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.interventionDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.interventionTableDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.allergyDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.allergyTableDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.discontinueDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.new && content === this.encounterDialogComponent) {
      let ef = new EncounterInfo();
      if (dialogData == null) {
        ef.PatientId = this.authService.viewModel.Patient.PatientId;
        ef.PatientName = this.authService.viewModel.Patient.FirstName + " " + this.authService.viewModel.Patient.LastName;
      }
      reqdata = ef;
    } else if (action == Actions.view && content === this.encounterDialogComponent) {
      let ef = new EncounterInfo();
      ef.EncounterId = dialogData.EncounterId
      ef.PatientId = dialogData.PatientId
      ef.PatientName = this.authService.viewModel.Patient.FirstName + " " + this.authService.viewModel.Patient.LastName;
      reqdata = ef;
    }
    else if (action == Actions.view && content === this.encounterTableDialogComponent) {
      reqdata = dialogData;
    } else if (action == Actions.new && content === this.appointmentDialogComponent) {
      reqdata = this.PatientAppointmentInfoForNew(action);
    } else if (action == Actions.view && content === this.appointmentDialogComponent) {
      reqdata = this.PatientAppointmentInfoForView(dialogData, action);
    }
    else if (action == Actions.view && content === this.appointmentsTableDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      if (res.data != null && res.data.refreshCQMNotPerformed) {
        this._navigateCQMNotPerformed();
      }
      else {
        this.UpdateView(res.data);
      }
    });
  }

  _navigateCQMNotPerformed() {
    this.authService.SetViewParam("PatientView", "CQMs Not Performed");
    this.authService.SetViewParam("View", "Patients");
    this.viewChangeService.sendData("CQMs Not Performed");
  }

  UpdateView(data) {
    if (data == null) return;
    if (data.UpdatedModal == PatientChart.Diagnoses) {
      this.DiagnosesByPatientId();
      // data.DiagnosesList = data.DiagnosesList == undefined ? [] : data.DiagnosesList.length;
      // if (this.chartInfo.Diagnoses.length < data.DiagnosesList.length) {
      //   this.chartInfo.Diagnoses = data.DiagnosesList;
      // }
      // else {
      //   this.DiagnosesByPatientId();
      // }
    }
    else if (data.UpdatedModal == PatientChart.AdvancedDirectives) {
      this.AdvancedDirectivesByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.SmokingStatus) {
      this.SmokingStatusByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.TobaccoUse) {
      // this.TobaccoUseScreenings();
      // this.TobaccoUseInterventions();
      this.TobaccoUseByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.PastMedicalHistory || data.UpdatedModal == PatientChart.FamilyMedicalHistory) {
      this.PastMedicalHistoriesByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.Allergies) {
      data.AllergyDataSource = data.AllergyDataSource == undefined ? [] : data.AllergyDataSource.length;
      if (this.chartInfo.Alergies.length < data.AllergyDataSource.length) {
        this.chartInfo.Alergies = data.AllergyDataSource;
      }
      else {
        this.AllergiesByPatientId();
      }
    }
    else if (data.UpdatedModal == PatientChart.Medications) {
      this.MedicationsByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.Interventions) {
      data.InterventionsDataSource = data.InterventionsDataSource == undefined ? [] : data.InterventionsDataSource.length;
      if (this.chartInfo.Interventions.length < data.InterventionsDataSource.length) {
        this.chartInfo.Interventions = data.InterventionsDataSource;
      }
      else {
        this.InterventionsByPatientId();
      }
    }
    else if (data.UpdatedModal == PatientChart.Encounters) {
      this.EncountersByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.Appointment) {
      this.AppointmentsByPatientId();
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
    this.patientImmunization = new Immunization;
  }

  editDialog(dialogData, name) {
    if (name == 'immunization') {
      this.patientImmunization = dialogData;
      // var dateString = this.patientImmunization.AdministeredAt;
      // var timeFull = dateString.split('T');
      // var time = timeFull[1].split('.');
      // this.patientImmunization.AdministeredAt = this.datepipe.transform(timeFull[0], "yyyy-MM-dd");
      // this.patientImmunization.AdministeredTime = time[0];
      this.patientImmunization.AdministeredTime = this.datepipe.transform(this.patientImmunization.AdministeredAt, "hh:mm a");
      this.patientImmunization.AdministeredAt = this.datepipe.transform(new Date(this.patientImmunization.AdministeredAt), "yyyy-MM-dd");
    }
  }

  GetAppointmentInfo() {
    let data: AppointmentDialogInfo = {}
  }

  // get display Location Details
  loadLocationsList() {
    this.LocationAddress = [];
    this.settingsService.PracticeLocations(this.user.ProviderId, this.user.ClinicId).subscribe(resp => {
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
    let isAdd = this.patientImmunization.ImmunizationId == undefined;
    this.patientImmunization.PatientId = this.currentPatient.PatientId;
    this.patientImmunization.ExpirationAt = new Date(this.datepipe.transform(this.patientImmunization.ExpirationAt, "MM/dd/yyyy hh:mm:ss"));
    // var dateString = this.datepipe.transform(this.patientImmunization.AdministeredAt, "yyyy-MM-dd");
    //   var datetime = dateString.split(' ');
    //   var onlyDate = datetime[0];
    //   this.patientImmunization.AdministeredAt = onlyDate + 'T' + this.patientImmunization.AdministeredTime;
    this.patientImmunization.AdministeredAt = this.datepipe.transform(this.patientImmunization.AdministeredAt, "yyyy-MM-dd");
    this.patientImmunization.AdministeredAt = this.patientImmunization.AdministeredAt + ' ' + this.patientImmunization.AdministeredTime;
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

  disableImmAdministered() {
    return !(this.patientImmunization.Code && this.patientImmunization.AdministeredAt && this.patientImmunization.AdministeredTime != '00:00 AM'
          && this.patientImmunization.AdministeredById && this.patientImmunization.OrderedById && this.patientImmunization.AdministeredFacilityId
          && this.patientImmunization.Manufacturer && this.patientImmunization.Lot && this.patientImmunization.Quantity && this.patientImmunization.Dose
          && this.patientImmunization.Unit && this.patientImmunization.ExpirationAt)
  }

  disableImmHistorical() {
    return !(this.patientImmunization.Code && this.patientImmunization.AdministeredAt && this.patientImmunization.SourceOfInformation
      && this.patientImmunization.AdministeredFacilityId)
  }

  disableImmRefused() {
    return !(this.patientImmunization.Code && this.patientImmunization.ReasonRefused && this.patientImmunization.ReasonCode
      && this.patientImmunization.RefusedAt && this.patientImmunization.AdministeredFacilityId)
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
      if (resp.IsSuccess) this.chartInfo.Appointments = resp.ListResult;
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

  // Get tobacco interventions info
  TobaccoUseByPatientId() {
    this.patientService.TobaccoUseByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.tobaccoUseList = resp.ListResult;
    });
  }

  // Get interventions info
  InterventionsByPatientId() {
    this.patientService.InterventionsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Interventions = resp.ListResult;
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

  resetImmunization(event) {
    this.searchVaccineCode.nativeElement.value = '';
    this.vaccines = of([]);
    if (this.patientImmunization.ImmunizationId == undefined) {
      this.patientImmunization = new Immunization;
    }
    else {
      this.ImmunizationsByPatientId();
    }
  }

  gotoDiagnoses() {
    document.getElementById("toDiagnoses").scrollIntoView();
  }

}
