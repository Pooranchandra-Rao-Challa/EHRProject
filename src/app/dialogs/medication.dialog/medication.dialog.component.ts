
import { MEDLINE_PLUS_URL, MEDLINE_PLUS_RXNORM, MEDLINE_PLUS_SNOMED } from 'src/environments/environment';
import { Drug, DrugGroup, RxNormAPIService, TermTypes } from 'src/app/_services/rxnorm.api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { DiscontinueDialogComponent } from '../discontinue.dialog/discontinue.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { Actions, Medication, PatientChart, GlobalConstants, EducationMaterial } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PatientEducationMaterialDialogComponent } from '../patient.education.material.dialog/patient.education.material.dialog.component';
import Swal from 'sweetalert2';


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
  medications: Observable<DrugGroup[]>;
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
  Dose: string[]
  educationMaterial: EducationMaterial = null;
  filteredRoutes: Observable<string[]>;
  filteredDoseUnits: Observable<string[]>;
  filteredActions: Observable<string[]>;
  filteredDoseTimings: Observable<string[]>;
  filteredQuntityUnits: Observable<string[]>;
  filteredDaysSupplys: Observable<string[]>;
  filteredDoseOthers: Observable<string[]>;
  filteredDrugForm: Observable<string[]>;
  filteredDose: Observable<string[]>;
  @ViewChild('routeInput', { static: true }) routeInput: ElementRef;
  @ViewChild('doseunitInput', { static: true }) doseunitInput: ElementRef;
  @ViewChild('actionInput', { static: true }) actionInput: ElementRef;
  @ViewChild('doseTimingInput', { static: true }) doseTimingInput: ElementRef;
  @ViewChild('quntityUnitInput', { static: true }) quntityUnitInput: ElementRef;
  @ViewChild('daysSupplyInput', { static: true }) daysSupplyInput: ElementRef;
  @ViewChild('doseotherInput', { static: true }) doseotherInput: ElementRef;
  @ViewChild('drugFormInput', { static: true }) drugFormInput: ElementRef;
  @ViewChild('doseInput', { static: true }) doseInput: ElementRef;
  patientDirection: string;
  saveButtonClicked: boolean = false;

  constructor(public overlayService: OverlayService,
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private rxnormService: RxNormAPIService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe) {

  }

  dateChange(e) {
    this.minDateForEndDate = e.value;
  }

  ngOnInit(): void {
    this.Action = GlobalConstants.Action;
    this.DoseTiming = GlobalConstants.DoseTiming;
    this.DoseOther = GlobalConstants.DoseOther;
    this.DoseUnit = GlobalConstants.DoseUnit;
    this.DaysSupply = GlobalConstants.DaysSupply;
    this.QuntityUnit = GlobalConstants.QuntityUnit;
    this.Route = GlobalConstants.Route;
    this.Dose = GlobalConstants.Dose;
    fromEvent(this.routeInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.routeInput.nativeElement.value })
    ).subscribe(value => this._filterRoutes(value));

    fromEvent(this.doseunitInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.doseunitInput.nativeElement.value })
    ).subscribe(value => this._filterDoseUnits(value));

    fromEvent(this.actionInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.actionInput.nativeElement.value })
    ).subscribe(value => this._filterActions(value));

    fromEvent(this.doseTimingInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.doseTimingInput.nativeElement.value })
    ).subscribe(value => this._filterDoseTimings(value));

    fromEvent(this.quntityUnitInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.quntityUnitInput.nativeElement.value })
    ).subscribe(value => this._filterQuntityUnits(value));

    fromEvent(this.daysSupplyInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.daysSupplyInput.nativeElement.value })
    ).subscribe(value => this._filterDaysSupplies(value));


    fromEvent(this.doseotherInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.doseotherInput.nativeElement.value })
    ).subscribe(value => this._filterDoseOthers(value));

    fromEvent(this.drugFormInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.drugFormInput.nativeElement.value })
    ).subscribe(value => this._filterDrugForm(value));

    fromEvent(this.doseInput.nativeElement, 'keyup').pipe(
      startWith(''),
      map((val: KeyboardEvent) => { return this.doseInput.nativeElement.value })
    ).subscribe(value => this._filterDose(value));


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
    this.updateLocalModel(this.ref.RequestData);
    if (this.patientMedication.StartAt) {
      this.minDateForEndDate = new Date(this.patientMedication.StartAt);
    }
  }

  _filterRoutes(value) {
    this.filteredRoutes = of(this.Route.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> a.localeCompare(b)));
  }


  _filterDoseUnits(value) {
    this.filteredDoseUnits = of(this.DoseUnit.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> a.localeCompare(b)));
  }

  _filterActions(value) {
    this.filteredActions = of(this.Action.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> a.localeCompare(b)));
  }

  _filterDoseTimings(value) {
    this.filteredDoseTimings = of(this.DoseTiming.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null));
  }

  _filterQuntityUnits(value) {
    this.filteredQuntityUnits = of(this.QuntityUnit.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> a.localeCompare(b)));
  }

  _filterDaysSupplies(value) {
    this.filteredDaysSupplys = of(this.DaysSupply.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> parseInt(a.replace('days','').replace('day','')) > parseInt(b.replace('days','').replace('day','')) ? 1 : -1  ));
  }

  _filterDoseOthers(value) {
    this.filteredDoseOthers = of(this.DoseOther.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> a.localeCompare(b)));
  }

  _filterDrugForm(value) {
    this.filteredDrugForm = of(this.DoseUnit.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> a.localeCompare(b)));
  }

  _filterDose(value) {
    this.filteredDose = of(this.Dose.filter(option => option.toLowerCase().match(value.toLowerCase()) !== null).sort((a,b)=> {
      let anums = a.split(' ');
      let bnums = b.split(' ')
      let anum = anums.length == 1 ? Number(this.stringfractions[a]) : Number(anums[0]) + Number(this.stringfractions[anums[1]]);
      let bnum = bnums.length == 1 ? Number(this.stringfractions[b]) : Number(bnums[0]) + Number(this.stringfractions[bnums[1]]);
      return anum > bnum ? 1 : -1;
    }));
  }

  stringfractions = {
    '1' : 1,
    '1/2' : 0.5,
    '1/4' : 0.25,
    '3/4' : 0.75,
    '2' : 2,
    '3' : 3,
    '4' : 4,
    '5' : 5,
    '10' : 10,
    '15' : 15
  }

  _filterMedicationNames(term) {

    this.isLoading = true;
    this.rxnormService.Drugs(term)
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.length > 0) {
          this.medications = of(
            (resp as DrugGroup[]));
        } else {
          this.medications = of([]);
          this.noRecords = true;
        }
      });
  }



  evalQuantity() {
    if(this.patientMedication.DaysSupply && this.patientMedication.Dose
      && this.patientMedication.DoseTiming ){
        let daysToSupply = parseInt(this.patientMedication.DaysSupply.replace('Days','').replace('Day',''))
        let dose = this.patientMedication.Dose
      }
//       DaysSupply : "10 days"
// DisplayName : "Clavulanate 25 MG Chewable Tablet [Clavamox]"
// Dose : "2"
// DoseOther: "as directed"
// DoseRoute: "by mouth"
// DoseTiming: "twice a day"
// DoseUnits: "tablet"
// DrugForm: "Tablet"
// DrugName: "Clavulanate 25 MG Chewable Tablet [Clavamox]"
// DrugStrength: "25 MG"


  }
  displayWithMedication(value: Drug): string {
    if (!value) return "";
    return "";
  }

  parseString(regex, text, groupname, startWithReg = null) {
    let startwith = false;
    let textArray = regex.exec(text);
    if (startWithReg != null && startWithReg.test(text)) {
      textArray = regex.exec(text.replace(startWithReg, ""));
    }

    let returnvalue = "";
    if (textArray && textArray.groups) {
      return textArray.groups[groupname];
    }
    else if (textArray) {
      textArray.forEach(element => {
        if (element !== undefined) {
          element = element.replace(/^\s+|\s+$/g, '')
          if (element != '') {
            if (returnvalue != '') returnvalue += '/ ';
            returnvalue += element
          }
        }
      });
      if (returnvalue == undefined || returnvalue == null) returnvalue = '';
      return returnvalue
    }
    else return "";
  }

  DrugTermType(termtype: string): string {
    return TermTypes[termtype]
  }
  onSelectedMedication(selected) {

    let drugname = selected.option.value.Synonym.replace(/^\s+|\s+$/g, '') == '' ? selected.option.value.Name : selected.option.value.Synonym;
    var strength = this.parseString(/(?=\.*)(?<strength>\d+(\.?\d*)\s?(MG|ML|\/|UNT|mg|\s?))/, drugname, 'strength', /^(24 HR)/).replace(/^\s+|\s+$/g, '').replace(/(\/)+$/g, '');
    var brand = this.parseString(/(?<brand>\[\w*(!?[\s\w*_-]*)\])/, selected.option.value.Name, 'brand').replace(/^\s+|\s+$/g, '').replace('[', '').replace(']', '');
    var drugform = this.parseString(/(?<drugform>Tablet|Tablets|Capsule|Capsules|Suspension|Suspensions|Lotion|Foam|Ointment|Cream|Injection|Lancet|Solution|Powder|Spray|Gel|Pack|Packet|Prefilled Syringe|Rectal Suppository|Auto-Injector|Sublingual Film|Pen Injector|Granules|Lozenge|Transdermal System|Medicated Pad|Vaginal Insert|Buccal Film|Sublingual Tablet|Implant|Suspension Powder)/gi, selected.option.value.Name, 'drugform').replace(/^\s+|\s+$/g, '');


    this.patientMedication.DrugName = selected.option.value.Name;
    this.patientMedication.DisplayName = selected.option.value.Synonym;
    this.patientMedication.Rxcui = selected.option.value.rxcui;
    this.patientMedication.BrandName = brand.replace('[', '').replace(']', '');
    this.patientMedication.DrugStrength = strength;
    this.patientMedication.DrugForm = drugform;


    this.NDCList();
    this.CheckEducationMatieal(this.patientMedication.Rxcui);
  }

  NDCList() {

    this.rxnormService.ndclist(this.patientMedication.Rxcui).subscribe((resp) => {
      if (resp.length > 0) {
        this.ndcList = resp;
        this.patientMedication.NDC = this.ndcList.join(',')  //this.patientMedication.NDC == undefined ? resp[0] : this.patientMedication.NDC;
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

    if (this.patientMedication.Rxcui)
      this.CheckEducationMatieal(this.patientMedication.Rxcui);
  }

  cancel(doCanel: boolean = false) {
    if (this.disContinueReasonUpdated && !doCanel) {
      this.alertmsg.displayMessageDailog(ERROR_CODES["M2CM004"]);
    }
    else if (this.disContinueReasonUpdated && doCanel) {
      this.alertmsg.displayMessageDailog(ERROR_CODES["M2CM004"]);

      Swal.fire({
        title: 'The Discontinued reason is active !!!',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save Discontinued reason & Close',
        cancelButtonText: '',
        denyButtonText: 'Ignore Discontined reason & Close',
        customClass: {
          container: 'swal2-container-high-zindex',
          title: 'login-modal-header login-header-font',
          input: 'swal-input',
          denyButton: 'medication-deny-button-sweetalert',
          confirmButton: 'medication-confirm-button-sweetalert'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.CreateMedication();
        } else if (result.isDenied) {
          this.ref.close({
            "UpdatedModal": PatientChart.Medications
          });
        }
      })

    }
    else {
      this.ref.close({
        "UpdatedModal": PatientChart.Medications
      });
    }
  }
  get NDCIDs(): string {
    return this.patientMedication.NDC?.replace(/,/g, ", ")
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.discontinueDialogComponent) {
      reqdata = dialogData;
    } else if (action == Actions.view && content === this.patientEducationMaterialDialogComponent) {
      reqdata = this.educationMaterial;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if (res.data.reason) {
        this.patientMedication.StopAt = res.data.reason.StopAt;
        this.patientMedication.ReasonCode = res.data.reason.Code;
        this.patientMedication.ReasonDescription = res.data.reason.Description;
        this.disContinueReasonUpdated = true;
      }
    });
  }

  CheckEducationMatieal(code: string) {

    if (this.currentPatient)
      this.patientService.CheckEducationMaterial({
        ClinicId: this.authService.userValue.ClinicId,
        PatientId: this.currentPatient.PatientId,
        Code: code
      }).subscribe({
        next: (resp) => {
          if (resp.IsSuccess) {
            this.educationMaterial = resp.Result;
            if (this.educationMaterial.strAttachments)
              this.educationMaterial.Attachments = JSON.parse(this.educationMaterial.strAttachments);

            this.educationMaterial.PatientId = this.currentPatient.PatientId;
          }
        },
        error: (error) => { this.educationMaterial = null },
        complete: () => {

        }
      })
  }

  MedLinePlusUrl(): string {
    if (this.patientMedication.Rxcui)
      return MEDLINE_PLUS_URL(this.patientMedication.Rxcui, MEDLINE_PLUS_RXNORM);
    else return '#';
  }


  CreateMedication() {
    let isAdd = this.patientMedication.MedicationId == undefined;
    this.patientMedication.PatientId = this.currentPatient.PatientId;
    this.patientMedication.ProviderId = this.authService.userValue.ProviderId;
    this.patientMedication.strStartAt = this.datepipe.transform(this.patientMedication.StartAt, "MM/dd/yyyy hh:mm:ss a");
    if (this.patientMedication.StopAt) {
      this.patientMedication.strStopAt = this.datepipe.transform(this.patientMedication.StopAt, "MM/dd/yyyy hh:mm:ss a");
    }

    if (isAdd) {
      this.patientMedication.IsElectronicPrescription = false;
      this.patientMedication.PrescriptionStatus = "recorded";
    }


    this.saveButtonClicked = true;
    this.patientService.CreateMedication(this.patientMedication).subscribe((resp) => {
      this.saveButtonClicked = false;
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
    this.patientMedication.DisplayName = null;
    this.patientMedication.Rxcui = '';
    this.patientMedication.BrandName = '';
    this.patientMedication.DrugStrength = null;
    this.patientMedication.DrugForm = null;
    this.ndcList = [];
  }

  // disableDiscontinue(): boolean{
  //   return this.patientMedication.MedicationId == undefined;
  // }

  DeleteMedication() {
    this.patientService.DeleteMedication(
      {
        MedicationId: this.patientMedication.MedicationId,
        PatientId: this.patientMedication.PatientId,
        ProviderId: this.authService.userValue.ProviderId
      }).subscribe(
        {
          next: (resp) => {
            if (resp.IsSuccess) {
              if (resp.SpecificMessage) {
                this.alertmsg.displayMessageDailog(resp.SpecificMessage);
              } else {
                this.alertmsg.displayMessageDailog(ERROR_CODES["M2CM003"]);
              }
              this.ref.close({
                "UpdatedModal": PatientChart.Medications
              });
            } else {
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2CM002"]);
              this.cancel();
            }
          },
          error: (error) => {
            this.alertmsg.displayErrorDailog(ERROR_CODES["E2CM002"]);
            this.cancel();
          },
          complete: () => {

          }

        });
  }


}
