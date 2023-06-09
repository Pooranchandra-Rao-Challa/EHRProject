import { DrfirstUrlChanged } from './../../../_navigations/provider.layout/view.notification.service';
import { DrfirstService } from 'src/app/_services/drfirst.service';
import { MessagesService } from './../../../_services/messages.service';
import { Messages } from './../../../_models/_patient/messages';
import { ViewModel } from './../../../_models/_account/user';
import { DiscontinueDialogComponent } from './../../../dialogs/discontinue.dialog/discontinue.dialog.component';
import { filter, map, } from 'rxjs/operators';
import { Observable, of, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProviderPatient } from './../../../_models/_provider/Providerpatient';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ViewChildren, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { PatientService } from '../../../_services/patient.service';
import {
  ChartInfo, PatientChart, Actions,
  Immunization, EncounterInfo, NewAppointment, TobaccoUseScreenings, TobaccoUseInterventions, PracticeProviders,
  AppointmentTypes, UserLocations, Room, AppointmentDialogInfo, Vaccine, User, TobaccoUse, GlobalConstants,
  PatientSearchResults, Labandimaging, PatientSearch, AlertResult, TriggerResult, Medication
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
import { AddDiagnosesDialogComponent } from 'src/app/dialogs/diagnoses.dialog/diagnoses.dialog.component';
import { ViewChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { DiagnosesTableDialogComponent } from 'src/app/dialogs/diagnoses.table.dialog/diagnoses.table.dialog.component';
import { MedicationTableDialogComponent } from 'src/app/dialogs/medication.table.dialog/medication.table.dialog.component';
import { TobaccoUseTableDialogComponent } from 'src/app/dialogs/tobacco.use.table.dialog/tobacco.use.table.dialog.component';
import { SmokingStatusTableDialogComponent } from 'src/app/dialogs/smoking.status.table.dialog/smoking.status.table.dialog.component';
import { AdvancedDirectivesTableDialogComponent } from 'src/app/dialogs/advanced.directives.table.dialog/advanced.directives.table.dialog.component';
import { PastMedicalHistoryDialogComponent } from 'src/app/dialogs/past.medical.history.dialog/past.medical.history.dialog.component';
import { EncounterTableDialogComponent } from 'src/app/dialogs/encounter.table.dialog/encounter.table.dialog.component';
import { AppointmentsTableDialogComponent } from 'src/app/dialogs/appointments.table.dialog/appointments.table.dialog.component';
import { MessageDialogInfo } from 'src/app/_models/_provider/messages';
import { NewMessageDialogComponent } from 'src/app/dialogs/newmessage.dialog/newmessage.dialog.component';
import { MessagesTableDialogComponent } from 'src/app/dialogs/messages.table.dialog/messages.table.dialog.component';
import { ViewMessageDialogComponent } from 'src/app/dialogs/view.message.dialog/view.message.dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DrFirstStartUpScreens } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, AfterViewInit {
  public selectedPatient: PatientSearchResults[];
  public chartInfoImmunizations = new MatTableDataSource<Immunization>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild('searchVaccineCode', { static: true }) searchVaccineCode: ElementRef;
  @ViewChild('searchPatient', { static: true })
  searchPatient: ElementRef;
  labandimaging: Labandimaging;
  vaccines: Observable<Vaccine[]>;
  filteredMedicines: any = [];
  isLoading: boolean = false;
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
  MessageDialogComponent = NewMessageDialogComponent;
  messagesTableDialogComponent = MessagesTableDialogComponent;
  viewMessageDialogComponent = ViewMessageDialogComponent;
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
  immunizationColumns: string[] = ['Description', 'CVXCode', 'Date', 'Status'];
  administered: boolean = false;
  historical: boolean = true;
  refused: boolean = true;
  LocationAddress: any;
  user: User;
  vaccinesFilter: any;
  displayMessage: boolean = true;
  noRecords: boolean = false;
  viewModel: ViewModel;
  patientMessages: Messages[] = [];
  customizedspinner: boolean;
  alertResult: AlertResult[] = []
  drFirstMedicationUrl:string;

  constructor(public overlayService: OverlayService,
    private patientService: PatientService,
    private messageService: MessagesService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private smartSchedulerService: SmartSchedulerService,
    private settingsService: SettingsService,
    private viewChangeService: ViewChangeService,
    private drfirstService:DrfirstService,
    private drfirstUrlChanged:DrfirstUrlChanged) {
    this.user = authService.userValue;
    this.viewModel = authService.viewModel;
  }

  ngAfterViewInit(): void {
    this.chartInfoImmunizations.sort = this.sort.toArray()[0];

    fromEvent(this.searchVaccineCode.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.vaccines = of([]);
        this.noRecords = false;
        if (event.target.value == '') {
          this.displayMessage = true;
        }
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
        this.noRecords = false;
        if (event.target.value == '') {
          this.displayMessage = true;
        }
        return event.target.value;
      })
      // if character length greater then 0
      , filter(res => res.length > 0)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatients(value));
  }

  _filterPatients(term: string) {
    this.isLoading = true;
    this.patientService
      .PatientSearch({
        ProviderId: this.authService.userValue.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearch[]);
        }
        else {
          this.filteredPatients = of([]);
          this.noRecords = true;
        }
      })
  }

  onPatientSelected(selected) {
    //this.labandImaging.CurrentPatient = selected.option.value;
  }

  displayWithPatientSearch(value: PatientSearch): string {
    if (!value) return "";
    return value.Name;
  }

  onSelectedPatient(value) {
    this.authService.SetViewParam("Patient", value);
    window.location.href = "provider/patientdetails";
  }

  ngOnInit(): void {

    this.loadGlobalConstants();
    this.currentPatient = this.authService.viewModel.Patient;
    this.ChartInfo();
    this.loadDefaults();
    this.loadLocationsList();
    this.TobaccoUseByPatientId();
    this.GetProviderMessagesFromPatient();
    this.initCDSAlert();
    this.drfirstUrlChanged.getData().subscribe((data) => {
      console.log(data);

      if(data.urlfor == 'Patient' && data.purpose == DrFirstStartUpScreens.ManageMedication){
        this.drFirstMedicationUrl=data.url
      }
    });
    this.MedicationURL();
  }

  _filterVaccine(term) {
    this.isLoading = true;
    let reqparams = {
      SearchTearm: term,
    };
    this.patientService.Vaccines(reqparams)
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.IsSuccess) {
          this.vaccines = of(
            resp.ListResult as Vaccine[]);
        }
        else {
          this.vaccines = of([]);
          this.noRecords = true;
        }
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
    else if (action == Actions.view && content === this.viewMessageDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.messagesTableDialogComponent) {
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
    //console.log(data);

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
      //console.log(data.UpdatedModel);

      this.MedicationsByPatientId();
    }
    else if (data.UpdatedModal == PatientChart.Interventions) {
      // data.InterventionsDataSource = data.InterventionsDataSource == undefined ? [] : data.InterventionsDataSource.length;
      // if (this.chartInfo.Interventions.length < data.InterventionsDataSource.length) {
      //   this.chartInfo.Interventions = data.InterventionsDataSource;
      // }
      // else {
        this.InterventionsByPatientId();
      // }
    }
    else if (data.UpdatedModal == PatientChart.Encounters) {
      this.EncountersByPatientId();
    }
    // else if (data.UpdatedModal == PatientChart.Message) {
    //   this.GetProviderMessagesFromPatient();
    // }
    else if (data.UpdatedModal == PatientChart.Appointment) {
      this.AppointmentsByPatientId();
    }
  }

  ChartInfo() {
    if(this.currentPatient== null)return;
    this.patientService.ChartInfo({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.chartInfo = resp.Result;
        if(this.chartInfo){
          this.chartInfoImmunizations.data = this.chartInfo.Immunizations;
        }
      }
    });
  }

  resetDialog() {
    this.patientImmunization = new Immunization;
    this.searchVaccineCode.nativeElement.value = '';
    this.ImmunizationsByPatientId();
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
    if(this.currentPatient== null)return;
    let isAdd = this.patientImmunization.ImmunizationId == undefined;
    this.patientImmunization.PatientId = this.currentPatient.PatientId;
    this.patientImmunization.strExpirationAt = this.datepipe.transform(this.patientImmunization.ExpirationAt, "MM/dd/yyyy hh:mm:ss a");
    // var dateString = this.datepipe.transform(this.patientImmunization.AdministeredAt, "yyyy-MM-dd");
    //   var datetime = dateString.split(' ');
    //   var onlyDate = datetime[0];
    //   this.patientImmunization.AdministeredAt = onlyDate + 'T' + this.patientImmunization.AdministeredTime;
    this.patientImmunization.AdministeredAt = this.datepipe.transform(this.patientImmunization.AdministeredAt, "MM/dd/yyyy");
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
    if(this.currentPatient== null)return;
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
    if(this.currentPatient== null)return;
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
      && this.patientImmunization.AdministeredById && this.patientImmunization.OrderedById && this.patientImmunization.LocationId
      && this.patientImmunization.Manufacturer && this.patientImmunization.Lot && this.patientImmunization.Quantity && this.patientImmunization.Dose
      && this.patientImmunization.Unit && this.patientImmunization.ExpirationAt)
  }

  disableImmHistorical() {
    return !(this.patientImmunization.Code && this.patientImmunization.AdministeredAt && this.patientImmunization.SourceOfInformation
      && this.patientImmunization.LocationId)
  }

  disableImmRefused() {
    return !(this.patientImmunization.Code && this.patientImmunization.ReasonRefused && this.patientImmunization.ReasonCode
      && this.patientImmunization.RefusedAt && this.patientImmunization.LocationId)
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
      else this.chartInfo.Diagnoses = [];
    });
  }

  // Get allergies info
  AllergiesByPatientId() {
    this.patientService.AllergiesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Alergies = resp.ListResult;
      else this.chartInfo.Alergies = [];
    });
  }

  // Get Past Medical Histories info
  PastMedicalHistoriesByPatientId() {
    if(this.currentPatient== null)return;
    this.patientService.PastMedicalHistoriesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.PastMedicalHistories = resp.ListResult;
      else this.chartInfo.PastMedicalHistories = [];
    });
  }

  // Get Immunizations info
  ImmunizationsByPatientId() {
    if(this.currentPatient== null)return;
    this.patientService.ImmunizationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.chartInfo.Immunizations = resp.ListResult;
        this.chartInfoImmunizations.data = this.chartInfo.Immunizations;
      }else this.chartInfo.Immunizations = [];
    });
  }

  // Get medications info
  MedicationsByPatientId() {
    if(this.currentPatient== null)return;
    this.patientService.MedicationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Medications = resp.ListResult;
      else this.chartInfo.Medications = [];
    });
  }
  GetString(medication){return JSON.stringify(medication)}
  // Get encounters info
  EncountersByPatientId() {
    if(this.currentPatient== null)return;
    this.patientService.EncountersByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Encounters = resp.ListResult;
      else this.chartInfo.Encounters = [];
    });
  }

  // Get appointments info
  AppointmentsByPatientId() {
    if(this.currentPatient== null)return;
    this.patientService.AppointmentsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Appointments = resp.ListResult;
      else this.chartInfo.Appointments = [];
    });
  }

  // Get smoking status info
  SmokingStatusByPatientId() {
    this.patientService.SmokingStatusByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.SmokingStatuses = resp.ListResult;
      else this.chartInfo.SmokingStatuses = [];
    });
  }

  // Get tobacco screnning info
  TobaccoUseScreenings() {
    this.patientService.TobaccoUseScreenings({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.TobaccoUseScreenings = resp.ListResult;
      else this.chartInfo.TobaccoUseScreenings = [];
    });
  }

  // Get tobacco interventions info
  TobaccoUseInterventions() {
    this.patientService.TobaccoUseInterventions({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.TobaccoUseInterventions = resp.ListResult;
      else this.chartInfo.TobaccoUseInterventions = [];
    });
  }

  // Get tobacco interventions info
  TobaccoUseByPatientId() {
    if(this.currentPatient== null)return;
    this.patientService.TobaccoUseByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.tobaccoUseList = resp.ListResult;
      else this.tobaccoUseList = [];
    });
  }

  // Get interventions info
  InterventionsByPatientId() {
    if(this.currentPatient== null)return;
    this.patientService.InterventionsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.chartInfo.Interventions = resp.ListResult;
      else this.chartInfo.Interventions = [];
    });
  }

  // Get patient messages info
  GetProviderMessagesFromPatient() {
    if(this.currentPatient== null)return;
    let reqParams = {
      "UserId": this.user.UserId,
      "SortField": 'Created',
      "SortDirection": 'desc',
      "PageIndex": 0,
      "PageSize": 100,
      "Filter": null,
      "MessageFilter": 'Inbox'
    }
    this.messageService.Messages(reqParams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.patientMessages = resp.ListResult.filter((fn) =>
        fn.PatientId == this.currentPatient.PatientId);
      }
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

  scrollToDiagnoses() {
    document.getElementById("toDiagnoses").scrollIntoView();
  }

  scrollToSmokingStatus() {
    document.getElementById("toSmokingStatus").scrollIntoView();
  }

  scrollToPastMedicalHistory() {
    document.getElementById("toPastMedicalHistory").scrollIntoView();
  }

  scrollToAdvancedDirectives() {
    document.getElementById("toAdvancedDirectives").scrollIntoView();
  }

  scrollToAllergies() {
    document.getElementById("toAllergies").scrollIntoView();
  }

  scrollToMedications() {
    document.getElementById("toMedications").scrollIntoView();
  }

  scrollToImmunizations() {
    document.getElementById("toImmunizations").scrollIntoView();
  }

  scrollToInterventions() {
    document.getElementById("toInterventions").scrollIntoView();
  }

  scrollToEncounters() {
    document.getElementById("toEncounters").scrollIntoView();
  }

  scrollToMessages() {
    document.getElementById("toMessages").scrollIntoView();
  }

  scrollToAppointments() {
    document.getElementById("toAppointments").scrollIntoView();
  }

  openComponentDialogmessage(content: any | ComponentType<any> | string, data,
    action: Actions = this.ActionTypes.add, message: string) {
    let DialogResponse: MessageDialogInfo = {};
    if (action == Actions.view && content === this.MessageDialogComponent) {
      DialogResponse.MessageFor = message
      DialogResponse.Messages = {};
      DialogResponse.Messages.toAddress = {}
      DialogResponse.Messages.toAddress.Name = this.viewModel.Patient.FirstName + ' ' + this.viewModel.Patient.LastName;
      DialogResponse.Messages.toAddress.UserId = this.viewModel.Patient.UserId;
      DialogResponse.ForwardReplyMessage = message;
    }
    const ref = this.overlayService.open(content, DialogResponse);
    ref.afterClosed$.subscribe(res => {
    });
  }

  initCDSAlert(){
   // console.log(this.currentPatient);
    if(!this.currentPatient) return;
    this.settingsService.EvalPatientCDSAlerts({patientId:this.currentPatient.PatientId,providerId:this.user.ProviderId})
    .subscribe((resp)=>{
      if(resp.IsSuccess){
        this.alertResult = resp.ListResult as AlertResult[]
        this.alertResult.forEach(alert =>{
          alert.Triggers = JSON.parse(alert.strTriggers) as TriggerResult[]
          let isMet = true;
          alert.Triggers.forEach((trigger)=>{
            isMet = trigger.IsMet && isMet ;
          })
          alert.IsMet = isMet;
        })
   //     console.log(this.alertResult);

      }
    })
  }
  get NoAlerts():string{
    let rtnMessage = 'Clinical Decision Support Alerts for ID Not Found';
    let flag = false;
     this.alertResult.forEach(alert=>{
      flag = alert.IsMet || flag;
    })
    if(!flag) return rtnMessage;
    else return '';
  }

  get ActiveAlerts():AlertResult[]{
    return this.alertResult.filter(f => f.IsMet == true);
  }

  getFormatedDate(date):string{
    return this.datepipe.transform(date,"MM/dd/yyyy");
  }

  SyncPatientChart(){
    this.patientService.SyncChart({ProviderId:this.user.ProviderId}).subscribe(
      {
        next: (resp) =>{
          if(resp.IsSuccess){
            this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP005"]);
          }
        },
        error: (error)=>{

        }
      }
    )
  }

  // Access Permissions

  canView(policyName: string, methodName: string): boolean{
    var permissions = this.authService.permissions();
    if(!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
    if(providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == policyName && fn.MethodName == methodName)
    if(temp.length == 0) return false;
    return temp[0].Allowed;
  }

  MedicationURL(){
    this.drfirstService.PatientUrl(DrFirstStartUpScreens.ManageMedication)
  }

}
