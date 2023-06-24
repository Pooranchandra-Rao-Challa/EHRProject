import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { ChartInfo, GlobalConstants, Immunization, PatientChart, PracticeProviders, User, Vaccine, ViewModel } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';

@Component({
  selector: 'app-immunization.dialog',
  templateUrl: './immunization.dialog.component.html',
  styleUrls: ['./immunization.dialog.component.scss']
})
export class ImmunizationDialogComponent implements OnInit {
  patientImmunization: Immunization = new Immunization();
  @ViewChild('searchVaccineCode', { static: true }) searchVaccineCode: ElementRef;
  vaccines: Observable<Vaccine[]>;
  currentPatient: ProviderPatient;
  chartInfo: ChartInfo = new ChartInfo;
  public chartInfoImmunizations = new MatTableDataSource<Immunization>();
  displayMessage: boolean = true;
  isLoading: boolean = false;
  noRecords: boolean = false;
  PracticeProviders: PracticeProviders[];
  LocationAddress: any;
  immManufacturers: GlobalConstants;
  immUnits: GlobalConstants;
  immRoutes: GlobalConstants;
  immBodySites: GlobalConstants;
  immFundingSources: GlobalConstants;
  immRegistryNotifications: GlobalConstants;
  immVfcClasses: GlobalConstants;
  immSourceOfInfo: GlobalConstants;
  immReasonRefuseds: GlobalConstants;
  immReasonRefusedsCode: GlobalConstants;
  user: User;
  viewModel: ViewModel;

  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private settingsService: SettingsService,) {
    this.user = authService.userValue;
    this.viewModel = authService.viewModel;
    this.updateLocalModel(ref.RequestData);
    if (this.patientImmunization.AdministeredAt) {
      this.patientImmunization.AdministeredTime = this.datepipe.transform(this.patientImmunization.AdministeredAt, "hh:mm a");
      this.patientImmunization.AdministeredAt = this.datepipe.transform(new Date(this.patientImmunization.AdministeredAt), "yyyy-MM-dd");
    }
    if (this.patientImmunization.RefusedAt) {
      this.patientImmunization.RefusedAt = new Date(this.patientImmunization.RefusedAt);
    }
  }

  updateLocalModel(data: Immunization) {
    this.patientImmunization = new Immunization;
    if (data == null) return;
    this.patientImmunization = data;
    // this.addBtnWhileSearch = true;
    // this.SearchInterventionCodes('');
  }

  ngAfterViewInit(): void {
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

    // fromEvent(this.searchPatient.nativeElement, 'keyup').pipe(
    //   // get value
    //   map((event: any) => {
    //     this.filteredPatients = of([]);
    //     this.noRecords = false;
    //     if (event.target.value == '') {
    //       this.displayMessage = true;
    //     }
    //     return event.target.value;
    //   })
    //   // if character length greater then 0
    //   , filter(res => res.length > 0)
    //   // Time in milliseconds between key events
    //   , debounceTime(1000)
    //   // If previous query is diffent from current
    //   , distinctUntilChanged()
    //   // subscription for response
    // ).subscribe(value => this._filterPatients(value));
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    this.loadDefaults();
    this.loadLocationsList();
    this.loadGlobalConstants();
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

  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
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

  // get display Location Details
  loadLocationsList() {
    this.LocationAddress = [];
    this.settingsService.PracticeLocations(this.user.ProviderId, this.user.ClinicId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.LocationAddress = resp.ListResult;
      }
    });
  }

  cancel() {
    this.ref.close({
      "UpdatedModal": PatientChart.Immunizations
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

  // Get Immunizations info
  ImmunizationsByPatientId() {
    if (this.currentPatient == null) return;
    this.patientService.ImmunizationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.chartInfo.Immunizations = resp.ListResult;
        this.chartInfoImmunizations.data = this.chartInfo.Immunizations;
      } else this.chartInfo.Immunizations = [];
    });
  }

  displayWithVaccine(value: any): string {
    if (!value) return "";
    else return "";
  }

  onSelectedImmunization(selected) {
    this.patientImmunization.Code = selected.option.value.Code;
    this.patientImmunization.Description = selected.option.value.Description;
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

  CreateImmunizationsAdministered() {
    if (this.currentPatient == null) return;
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
        this.cancel();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCI001" : "M2CCI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCI001"]);
        this.cancel();
      }
    });
  }

  CreateImmunizationsHistorical() {
    if (this.currentPatient == null) return;
    let isAdd = this.patientImmunization.ImmunizationId == undefined;
    this.patientImmunization.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateImmunizationsHistorical(this.patientImmunization).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ImmunizationsByPatientId();
        this.cancel();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCI001" : "M2CCI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCI001"]);
        this.cancel();
      }
    });
  }

  CreateImmunizationsRefused() {
    if (this.currentPatient == null) return;
    let isAdd = this.patientImmunization.ImmunizationId == undefined;
    this.patientImmunization.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateImmunizationsRefused(this.patientImmunization).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ImmunizationsByPatientId();
        this.cancel();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCI001" : "M2CCI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCI001"]);
        this.cancel();
      }
    });
  }

}
