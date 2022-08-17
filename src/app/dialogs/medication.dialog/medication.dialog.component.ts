import { Drug, RxNormAPIService } from 'src/app/_services/rxnorm.api.service';
import { REASON_CODES } from './../../_models/_provider/encounter';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { DiscontinueDialogComponent } from '../discontinue.dialog/discontinue.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { Actions, GlobalConstants, Medication, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { fromEvent, Observable, of } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-medication.dialog',
  templateUrl: './medication.dialog.component.html',
  styleUrls: ['./medication.dialog.component.scss']
})
export class MedicationDialogComponent implements OnInit {
  discontinueDialogComponent = DiscontinueDialogComponent;
  ActionTypes = Actions;
  // medications: GlobalConstants;
  // medicationsFilter: GlobalConstants;
  patientMedication: Medication = new Medication();
  currentPatient: ProviderPatient;
  isLoading: boolean = false;
  displayMessage: boolean = true;
  noRecords: boolean = false;
  @ViewChild('searchMedicationName', { static: true }) searchMedicationName: ElementRef;
  medications: Observable<Drug[]>;
  ndcList: string[] = [];

  constructor(public overlayService: OverlayService,
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private rxnormService: RxNormAPIService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    // this.medications = GlobalConstants.Medication_Names;
    // this.medicationsFilter = this.medications.slice();
    this.currentPatient = this.authService.viewModel.Patient;
    fromEvent(this.searchMedicationName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.medications = of([]);
        this.noRecords = false;
        if(event.target.value == ''){
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
    this.patientMedication = new Medication;
    if (data == null) return;
    this.patientMedication = data;
  }

  cancel() {
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.discontinueDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      this.patientMedication.ReasonDescription = res.data.ReasonDescription;
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
    this.patientMedication.StartAt = new Date(this.datepipe.transform(this.patientMedication.StartAt, "MM/dd/yyyy hh:mm:ss"));
    if(this.patientMedication.StopAt != null){
      this.patientMedication.StopAt = new Date(this.datepipe.transform(this.patientMedication.StopAt, "MM/dd/yyyy hh:mm:ss"));
    }
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
    return !(this.patientMedication.DrugName && this.patientMedication.StartAt)
  }

  deleteMedicationName() {
    this.patientMedication.DrugName = null;
    this.patientMedication.Rxcui = '';
    this.patientMedication.NDC = '';
    this.ndcList = [];
  }
}
