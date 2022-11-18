import { ProviderPatient } from 'src/app/_models/_provider/ProviderPatient';
import { ProceduresInfo, REASON_CODES, } from './../../_models/_provider/encounter';
import { filter, map, } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { Observable, of, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { MedicalCode } from 'src/app/_models/codes';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-procedure.dialog',
  templateUrl: './procedure.dialog.component.html',
  styleUrls: ['./procedure.dialog.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ]
})
export class ProcedureDialogComponent implements OnInit {
  teethNumbers: number[] = [];
  @ViewChild('searchProcedureCode', { static: true }) searchProcedureCode: ElementRef;
  filteredProcedures: Observable<MedicalCode[]>;
  procedureInfo: ProceduresInfo = new ProceduresInfo();
  patient: ProviderPatient;
  reasonCodes: MedicalCode[];
  reasonCodesFilter: MedicalCode[];
  selectedCode: string;
  isLoading = false;
  procedureStatuses: any;
  displayMessage: boolean = true;
  noRecords: boolean = false;
  minDateToFinish = new Subject<string>();
  minDate: Date;
  endDateForProcedure;
  constructor(private overlayref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe) {
      this.reasonCodes = REASON_CODES;
      this.reasonCodes = this.reasonCodes.map((obj) => ({
        Code: obj.Code,
        Description: obj.Description,
        CodeDescription: obj.Code + ' - ' + obj.Description
      }));
      this.reasonCodesFilter = this.reasonCodes.slice();
    let i = 1;
    while (this.teethNumbers.push(i++) < 32) {
      this.patient = authService.viewModel.Patient;

    }
    if (overlayref.RequestData != null)
      this.procedureInfo = overlayref.RequestData;
    if (this.procedureInfo.Date)
    this.endDateForProcedure = new Date(this.procedureInfo.Date);

    this.minDateToFinish.subscribe(minDate => {
      this.endDateForProcedure = new Date(minDate);
    })
  }



  ngOnInit(): void {
    fromEvent(this.searchProcedureCode.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.filteredProcedures = of([])
        this.noRecords = true;
        if (event.target.value == '') {
          this.displayMessage = true;
        }
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 && res.length < 6)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterProcedure(value));
    this._procedureStatuses();
    this.setSelectedValue();
  }
  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }
  cancel() {
    this.overlayref.close()
  }
  displayWith(value: MedicalCode): string {
    if (!value) return "";
    return value.Code + "-" + value.Description;
  }
  displayReason(value: MedicalCode): string {
    if (!value) return "";
    return value.Code + "-" + value.Description;
  }

  onReasonSelected(reason) {
    this.procedureInfo.ReasonCode = reason.Code;
    this.procedureInfo.ReasonDescription = reason.Description
  }

  onProcedureSelected(selected) {
    this.procedureInfo.Code = selected.option.value.Code;
    this.procedureInfo.Description = selected.option.value.Description;
    this.procedureInfo.CodeSystem = selected.option.value.CodeSystem;
  }
  /**
   *
surface_buccal_v
surface_facial_v
surface_mesial
surface_incisal
surface_distal
surface_lingual
surface_facial
surface_buccal
surface_occlusal
surface_lingual_v


pit_mesiobuccal
pit_mesiolingual
pit_distobuccal
pit_distolingual


cusp_mesial
cusp_mesiobuccal
cusp_mesiolingual
cusp_distal
cusp_distobuccal
cusp_distolingual */
  private BuccalV$ = new BehaviorSubject(false);
  get BuccalV(): boolean {
    return this.BuccalV$.value;
  }
  set BuccalV(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Buccal V');
    // v ? this.procedureInfo.Surfaces.push('Buccal V')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_buccal_v';
    this.clearAll();
    this.BuccalV$.next(v);
  }
  private Incisal$ = new BehaviorSubject(false);
  get Incisal(): boolean {
    return this.Incisal$.value;
  }
  set Incisal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Incisal');
    // v ? this.procedureInfo.Surfaces.push('Incisal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_incisal';
    this.clearAll();
    this.Incisal$.next(v);
  }

  private Facial$ = new BehaviorSubject(false);
  get Facial(): boolean {
    return this.Facial$.value;
  }
  set Facial(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Facial');
    // v ? this.procedureInfo.Surfaces.push('Facial')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_facial';
    this.clearAll();
    this.Facial$.next(v);
  }

  private LingualV$ = new BehaviorSubject(false);
  get LingualV(): boolean {
    return this.LingualV$.value;
  }
  set LingualV(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Lingual V');
    // v ? this.procedureInfo.Surfaces.push('Lingual V')
    //   : this.procedureInfo.Surfaces.splice(i, 1);

    this.procedureInfo.Place = 'surface_lingual_v';
    this.clearAll();
    this.LingualV$.next(v);
  }

  private FacialV$ = new BehaviorSubject(false);
  get FacialV(): boolean {
    return this.FacialV$.value;
  }
  set FacialV(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Facial V');
    // v ? this.procedureInfo.Surfaces.push('Facial V')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_facial_v';
    this.clearAll();
    this.FacialV$.next(v);
  }

  private Distal$ = new BehaviorSubject(false);
  get Distal(): boolean {
    return this.Distal$.value;
  }
  set Distal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Distal');
    // v ? this.procedureInfo.Surfaces.push('Distal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_distal';
    this.clearAll();
    this.Distal$.next(v);
  }

  private Buccal$ = new BehaviorSubject(false);
  get Buccal(): boolean {
    return this.Buccal$.value;
  }
  set Buccal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Buccal');
    // v ? this.procedureInfo.Surfaces.push('Buccal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_buccal';
    this.clearAll();
    this.Buccal$.next(v);
  }

  private Mesial$ = new BehaviorSubject(false);
  get Mesial(): boolean {
    return this.Mesial$.value;
  }
  set Mesial(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Mesial');
    // v ? this.procedureInfo.Surfaces.push('Mesial')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_mesial';
    this.clearAll();
    this.Mesial$.next(v);
  }


  private Lingual$ = new BehaviorSubject(false);
  get Lingual(): boolean {
    return this.Lingual$.value;
  }
  set Lingual(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Lingual');
    // v ? this.procedureInfo.Surfaces.push('Lingual')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_lingual';
    this.clearAll();
    this.Lingual$.next(v);
  }

  private Occlusal$ = new BehaviorSubject(false);
  get Occlusal(): boolean {
    return this.Occlusal$.value;
  }
  set Occlusal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Occlusal');
    // v ? this.procedureInfo.Surfaces.push('Occlusal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'surface_occlusal';
    this.clearAll();
    this.Occlusal$.next(v);
  }

  private PitMesiobuccal$ = new BehaviorSubject(false);
  get PitMesiobuccal(): boolean {
    return this.PitMesiobuccal$.value;
  }
  set PitMesiobuccal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Pit:Mesiobuccal');
    // v ? this.procedureInfo.Surfaces.push('Pit:Mesiobuccal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'pit_mesiobuccal';
    this.clearAll();
    this.PitMesiobuccal$.next(v);
  }

  private PitDistobuccal$ = new BehaviorSubject(false);
  get PitDistobuccal(): boolean {
    return this.PitDistobuccal$.value;
  }
  set PitDistobuccal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Pit:Distobuccal');
    // v ? this.procedureInfo.Surfaces.push('Pit:Distobuccal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'pit_distobuccal';
    this.clearAll();
    this.PitDistobuccal$.next(v);
  }


  private PitMesiolingual$ = new BehaviorSubject(false);
  get PitMesiolingual(): boolean {
    return this.PitMesiolingual$.value;
  }
  set PitMesiolingual(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Pit:Mesiolingual');
    // v ? this.procedureInfo.Surfaces.push('Pit:Mesiolingual')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'pit_mesiolingual';
    this.clearAll();
    this.PitMesiolingual$.next(v);
  }


  private PitDistolingual$ = new BehaviorSubject(false);
  get PitDistolingual(): boolean {
    return this.PitDistolingual$.value;
  }
  set PitDistolingual(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Pit:Distolingual');
    // v ? this.procedureInfo.Surfaces.push('Pit:Distolingual')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'pit_distolingual';
    this.clearAll();
    this.PitDistolingual$.next(v);
  }


  private CuspMesial$ = new BehaviorSubject(false);
  get CuspMesial(): boolean {
    return this.CuspMesial$.value;
  }
  set CuspMesial(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Cusp:Mesial');
    // v ? this.procedureInfo.Surfaces.push('Cusp:Mesial')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'cusp_mesial';
    this.clearAll();
    this.CuspMesial$.next(v);
  }


  private CuspDistal$ = new BehaviorSubject(false);
  get CuspDistal(): boolean {
    return this.CuspDistal$.value;
  }
  set CuspDistal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Cusp:Distal');
    // v ? this.procedureInfo.Surfaces.push('Cusp:Distal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'cusp_distal';
    this.clearAll();
    this.CuspDistal$.next(v);
  }


  private CuspMesiobuccal$ = new BehaviorSubject(false);
  get CuspMesiobuccal(): boolean {
    return this.CuspMesiobuccal$.value;
  }
  set CuspMesiobuccal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Cusp:Mesiobuccal');
    // v ? this.procedureInfo.Surfaces.push('Cusp:Mesiobuccal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'cusp_mesiobuccal';
    this.clearAll();
    this.CuspMesiobuccal$.next(v);
  }


  private CuspDistobuccal$ = new BehaviorSubject(false);
  get CuspDistobuccal(): boolean {
    return this.CuspDistobuccal$.value;
  }
  set CuspDistobuccal(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Cusp:Distobuccal');
    // v ? this.procedureInfo.Surfaces.push('Cusp:Distobuccal')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'cusp_distobuccal';
    this.clearAll();
    this.CuspDistobuccal$.next(v);
  }


  private CuspMesiolingual$ = new BehaviorSubject(false);
  get CuspMesiolingual(): boolean {
    return this.CuspMesiolingual$.value;
  }
  set CuspMesiolingual(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Cusp:Mesiolingual');
    // v ? this.procedureInfo.Surfaces.push('Cusp:Mesiolingual')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'cusp_mesiolingual';
    this.clearAll();
    this.CuspMesiolingual$.next(v);
  }


  private CuspDistolingual$ = new BehaviorSubject(false);
  get CuspDistolingual(): boolean {
    return this.CuspDistolingual$.value;
  }
  set CuspDistolingual(v: boolean) {
    // let i = this.procedureInfo.Surfaces.indexOf('Cusp:Distolingual');
    // v ? this.procedureInfo.Surfaces.push('Cusp:Distolingual')
    //   : this.procedureInfo.Surfaces.splice(i, 1);
    this.procedureInfo.Place = 'cusp_distolingual';
    this.clearAll();
    this.CuspDistolingual$.next(v);
  }

  clearAll() {
    this.BuccalV$.next(false);
    this.Facial$.next(false);
    this.Incisal$.next(false);
    this.LingualV$.next(false);
    this.FacialV$.next(false);
    this.Distal$.next(false);
    this.Buccal$.next(false);
    this.Mesial$.next(false);
    this.Lingual$.next(false);
    this.Occlusal$.next(false);

    this.PitMesiobuccal$.next(false);
    this.PitDistobuccal$.next(false);
    this.PitMesiolingual$.next(false);
    this.PitDistolingual$.next(false);

    this.CuspMesial$.next(false);
    this.CuspDistal$.next(false);
    this.CuspMesiobuccal$.next(false);
    this.CuspDistobuccal$.next(false);
    this.CuspMesiolingual$.next(false);
    this.CuspDistolingual$.next(false);

  }
  /**
   *
   *
  this.procedureInfo.Place == "surface_buccal_v"
  this.procedureInfo.Place == "surface_facial_v"
  this.procedureInfo.Place == "surface_mesial"
  this.procedureInfo.Place == "surface_incisal"
  this.procedureInfo.Place == "surface_distal"
  this.procedureInfo.Place == "surface_lingual"
  this.procedureInfo.Place == "surface_facial"
  this.procedureInfo.Place == "surface_buccal"
  this.procedureInfo.Place == "surface_occlusal"
  this.procedureInfo.Place == "surface_lingual_v"


  this.procedureInfo.Place == "pit_mesiobuccal"
  this.procedureInfo.Place == "pit_mesiolingual"
  this.procedureInfo.Place == "pit_distobuccal"
  this.procedureInfo.Place == "pit_distolingual"


  this.procedureInfo.Place == "cusp_mesial"
  this.procedureInfo.Place == "cusp_mesiobuccal"
  this.procedureInfo.Place == "cusp_mesiolingual"
  this.procedureInfo.Place == "cusp_distal"
  this.procedureInfo.Place == "cusp_distobuccal"
  this.procedureInfo.Place == "cusp_distolingual"
  */
  setSelectedValue() {
    this.BuccalV$.next(this.procedureInfo.Place == "surface_buccal_v");
    this.Facial$.next(this.procedureInfo.Place == "surface_facial");
    this.Incisal$.next(this.procedureInfo.Place == "surface_incisal");
    this.LingualV$.next(this.procedureInfo.Place == "surface_lingual_v");
    this.FacialV$.next(this.procedureInfo.Place == "surface_facial_v");
    this.Distal$.next(this.procedureInfo.Place == "surface_distal");
    this.Buccal$.next(this.procedureInfo.Place == "surface_buccal");
    this.Mesial$.next(this.procedureInfo.Place == "surface_mesial");
    this.Lingual$.next(this.procedureInfo.Place == "surface_lingual");
    this.Occlusal$.next(this.procedureInfo.Place == "surface_occlusal");

    this.PitMesiobuccal$.next(this.procedureInfo.Place == "pit_mesiobuccal");
    this.PitDistobuccal$.next(this.procedureInfo.Place == "pit_distobuccal");
    this.PitMesiolingual$.next(this.procedureInfo.Place == "pit_mesiolingual");
    this.PitDistolingual$.next(this.procedureInfo.Place == "pit_distolingual");

    this.CuspMesial$.next(this.procedureInfo.Place == "cusp_mesial");
    this.CuspDistal$.next(this.procedureInfo.Place == "cusp_distal");
    this.CuspMesiobuccal$.next(this.procedureInfo.Place == "cusp_mesiobuccal");
    this.CuspDistobuccal$.next(this.procedureInfo.Place == "cusp_distobuccal");
    this.CuspMesiolingual$.next(this.procedureInfo.Place == "cusp_mesiolingual");
    this.CuspDistolingual$.next(this.procedureInfo.Place == "cusp_distolingual");

  }


  save() {
    let isAdd = this.procedureInfo.ProcedureId == null;
    this.procedureInfo.PatientId = this.patient.PatientId;
    if (this.procedureInfo.ProviderId)
      this.procedureInfo.ProviderId = this.patient.ProviderId;
    this.procedureInfo.LocationId = this.authService.userValue.CurrentLocation;
    this.procedureInfo.strDate = this.datePipe.transform(this.procedureInfo.Date, "MM/dd/yyyy")
    this.procedureInfo.strEndDate = this.datePipe.transform(this.procedureInfo.EndDate, "MM/dd/yyyy")
    this.procedureInfo.strReasonStartDate = this.datePipe.transform(this.procedureInfo.ReasonStartDate, "MM/dd/yyyy")


    this.patientService.CreateProcedure(this.procedureInfo)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.overlayref.close({ "saved": true });
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CP1001" : "M2CP1002"]);
        } else {
          this.overlayref.close();
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP1001"]);
        }
      });
  }

  enableSave(): boolean {
    return !(this.procedureInfo.Code != null && this.procedureInfo.Code != ""
      && this.procedureInfo.Description != null && this.procedureInfo.Description != ""
      && this.procedureInfo.Date != null && this.procedureInfo.ToothNo != null
      && this.procedureInfo.Status != null && this.procedureInfo.Status != ""
      && this.procedureInfo.Place != null && this.procedureInfo.Place != "");
  }


  _filterProcedure(term) {

    this.isLoading = true;
    this.utilityService.MedicalCodes(term, "CDT/CPT")
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.IsSuccess) {
          this.filteredProcedures = of(
            resp.ListResult as MedicalCode[]);
        } else this.filteredProcedures = of([]);
        {
          this.noRecords = true;
        }
      })
  }


  _procedureStatuses() {
    this.utilityService.ProcedureStatues()
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.procedureStatuses = resp.ListResult;
        }
      })
  }
}

