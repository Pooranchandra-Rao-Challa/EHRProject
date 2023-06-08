import { Drug, RxNormAPIService } from 'src/app/_services/rxnorm.api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { DiscontinueDialogComponent } from '../discontinue.dialog/discontinue.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { Actions, Medication, PatientChart,GlobalConstants } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PatientEducationMaterialDialogComponent } from '../patient.education.material.dialog/patient.education.material.dialog.component';


@Component({
  selector: 'app-medication.dialog',
  templateUrl: './medication.dialog.component.html',
  styleUrls: ['./medication.dialog.component.scss']
})
export class MedicationDialogComponent implements OnInit {
  discontinueDialogComponent = DiscontinueDialogComponent;
  patientEducationMaterialDialogComponent = PatientEducationMaterialDialogComponent;
  ActionTypes = Actions;
  patientMedication: Medication = new Medication();
  currentPatient: ProviderPatient;
  isLoading: boolean = false;
  displayMessage: boolean = true;
  noRecords: boolean = false;
  @ViewChild('searchMedicationName', { static: true }) searchMedicationName: ElementRef;
  medications: Observable<Drug[]>;
  ndcList: string[] = [];
  minDateToAllergy = new Subject<string>();
  minDateForEndDate;
  disContinueReasonUpdated: boolean = false;
  Action: string[]
  DoseTiming: string[]
  DoseOther: string[]
  DoseUnit: string[]
  DaysSupply: string[]
  QuntityUnit: string[]
  Route: string[]
  filteredRoutes: Observable<string[]>;
  filteredDoseUnits: Observable<string[]>;
  filteredActions: Observable<string[]>;
  filteredDoseTimings: Observable<string[]>;
  filteredQuntityUnits: Observable<string[]>;
  filteredDaysSupplys: Observable<string[]>;
  filteredDoseOthers: Observable<string[]>;
  filteredDrugForm: Observable<string[]>;
  @ViewChild('routeInput', { static: true }) routeInput: ElementRef;
  @ViewChild('doseunitInput', { static: true }) doseunitInput: ElementRef;
  @ViewChild('actionInput', { static: true }) actionInput: ElementRef;
  @ViewChild('doseTimingInput', { static: true }) doseTimingInput: ElementRef;
  @ViewChild('quntityUnitInput', { static: true }) quntityUnitInput: ElementRef;
  @ViewChild('daysSupplyInput', { static: true }) daysSupplyInput: ElementRef;
  @ViewChild('doseotherInput', { static: true }) doseotherInput: ElementRef;
  @ViewChild('drugFormInput', { static: true }) drugFormInput: ElementRef;

  constructor(public overlayService: OverlayService,
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private rxnormService: RxNormAPIService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe) {



    this.updateLocalModel(ref.RequestData);
    if (this.patientMedication.StartAt) {
      this.minDateForEndDate = new Date(this.patientMedication.StartAt);
    }
    this.minDateToAllergy.subscribe(minDate => {
      this.minDateForEndDate = new Date(minDate);
    })
  }

  dateChange(e) {
    this.minDateToAllergy.next(e.value.toString());
  }

  ngOnInit(): void {
    this.Action = GlobalConstants.Action;
    this.DoseTiming = GlobalConstants.DoseTiming;
    this.DoseOther = GlobalConstants.DoseOther;
    this.DoseUnit = GlobalConstants.DoseUnit;
    this.DaysSupply = GlobalConstants.DaysSupply;
    this.QuntityUnit = GlobalConstants.QuntityUnit;
    this.Route = GlobalConstants.Route;

    fromEvent(this.routeInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.routeInput.nativeElement.value })
    ).subscribe(value => this._filterRoutes(value));

    fromEvent(this.doseunitInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.doseunitInput.nativeElement.value })
    ).subscribe(value => this._filterDoseUnits(value));

    fromEvent(this.actionInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.actionInput.nativeElement.value })
    ).subscribe(value => this._filterActions(value));

    fromEvent(this.doseTimingInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.doseTimingInput.nativeElement.value })
    ).subscribe(value => this._filterDoseTimings(value));

    fromEvent(this.quntityUnitInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.quntityUnitInput.nativeElement.value })
    ).subscribe(value => this._filterQuntityUnits(value));

    fromEvent(this.daysSupplyInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.daysSupplyInput.nativeElement.value })
    ).subscribe(value => this._filterDaysSupplies(value));


    fromEvent(this.doseotherInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.doseotherInput.nativeElement.value })
    ).subscribe(value => this._filterDoseOthers(value));

    fromEvent(this.drugFormInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val:KeyboardEvent) => {return this.drugFormInput.nativeElement.value })
    ).subscribe(value => this._filterDrugForm(value));


    this.currentPatient = this.authService.viewModel.Patient;
    fromEvent(this.searchMedicationName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.medications = of([]);
        this.noRecords = false;
        if (event.target.value == '') {
          this.displayMessage = true;
        }
        return event.target.value;
      })
      // if character length greater than or equals to 1
      , filter(res => res.length >= 1)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterMedicationNames(value));
    this.NDCList();
  }

  _filterRoutes(route){
    this.filteredRoutes = of(this.Route.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }


  _filterDoseUnits(route){
    this.filteredDoseUnits = of(this.DoseUnit.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }

  _filterActions(route){
    this.filteredActions = of(this.Action.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }

  _filterDoseTimings(route){
    this.filteredDoseTimings = of(this.DoseTiming.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }

  _filterQuntityUnits(route){
    this.filteredQuntityUnits = of(this.QuntityUnit.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }

  _filterDaysSupplies(route){
    this.filteredDaysSupplys = of(this.DaysSupply.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }

  _filterDoseOthers(route){
    this.filteredDoseOthers = of(this.DoseOther.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }

  _filterDrugForm(route){
    this.filteredDrugForm = of(this.DoseUnit.filter(option => option.toLowerCase().match(route.toLowerCase()) !== null));
  }


  _filterMedicationNames(term) {
    this.isLoading = true;
    this.rxnormService.Drugs(term)
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.length > 0) {
          this.medications = of(
            resp as Drug[]);
        } else {
          this.medications = of([]);
          this.noRecords = true;
        }
      });
  }

  displayWithMedication(value: Drug): string {
    if (!value) return "";
    return "";
  }

  onSelectedMedication(selected) {
    this.patientMedication.DrugName = selected.option.value.Name;
    this.patientMedication.Rxcui = selected.option.value.rxcui;
    this.NDCList();
  }

  NDCList() {
    this.rxnormService.ndclist(this.patientMedication.Rxcui).subscribe((resp) => {
      if (resp.length > 0) {
        this.ndcList = resp;
        this.patientMedication.NDC = this.patientMedication.NDC == undefined ? resp[0] : this.patientMedication.NDC;
      }
      else {
        this.patientMedication.NDC = '';
      }
    });
  }

  updateLocalModel(data: Medication) {
    this.patientMedication = {};
    if (data == null) return;
    this.patientMedication = data;

  }

  cancel(doCanel:boolean=false) {
    if(this.disContinueReasonUpdated && !doCanel){
      this.alertmsg.displayMessageDailog(ERROR_CODES["M2CM004"]);
    }else{
      this.ref.close({
        "UpdatedModal": PatientChart.Medications
      });
    }
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.discontinueDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      this.patientMedication.ReasonDescription = res.data.ReasonDescription;
      this.disContinueReasonUpdated = true;
    });
  }

  // DrugNames(searchTerm: any) {
  //   this.rxnormService.Drugs().subscribe((resp) => {
  //     if (resp.IsSuccess) {

  //     }
  //   })
  // }

  CreateMedication() {
    let isAdd = this.patientMedication.MedicationId == undefined;
    this.patientMedication.PatientId = this.currentPatient.PatientId;
    this.patientMedication.ProviderId = this.authService.userValue.ProviderId;
    this.patientMedication.strStartAt = this.datepipe.transform(this.patientMedication.StartAt, "MM/dd/yyyy hh:mm:ss a");
    if (this.patientMedication.StopAt) {
      this.patientMedication.strStopAt = this.datepipe.transform(this.patientMedication.StopAt, "MM/dd/yyyy hh:mm:ss a");
    }
    this.patientMedication.PrescriptionStatus = "recorded";
    this.patientMedication.IsElectronicPrescription = false;
    this.patientService.CreateMedication(this.patientMedication).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.Medications
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CM001" : "M2CM002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CM001"]);
        this.cancel();
      }
    });
  }

  disableMedication() {
    return !(this.patientMedication.DrugName && this.patientMedication.StartAt);
  }

  deleteMedicationName() {
    this.patientMedication.DrugName = null;
    this.patientMedication.Rxcui = '';
    this.patientMedication.NDC = '';
    this.ndcList = [];
  }

  disableDiscontinue(): boolean{
    return this.patientMedication.MedicationId == undefined;
  }

  DeleteMedication(){
    this.patientService.DeleteMedication(
      {MedicationId: this.patientMedication.MedicationId,
      PatientId: this.patientMedication.PatientId,
      ProviderId: this.authService.userValue.ProviderId}).subscribe(
        {
          next: (resp)=>{
            if(resp.IsSuccess){
              if(resp.SpecificMessage){
                this.alertmsg.displayMessageDailog(resp.SpecificMessage);
              }else{
                this.alertmsg.displayMessageDailog(ERROR_CODES["M2CM003"]);
              }
              this.ref.close({
                "UpdatedModal": PatientChart.Medications
              });
            }else{
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2CM002"]);
              this.cancel();
            }
          },
          error: (error)=>{
            this.alertmsg.displayErrorDailog(ERROR_CODES["E2CM002"]);
            this.cancel();
          },
          complete: () =>{

          }

        });
  }
}
