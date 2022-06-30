import { ProviderPatient } from 'src/app/_models/_provider/ProviderPatient';
import { ProceduresInfo, REASON_CODES, } from './../../_models/_provider/encounter';
import { filter, map, } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { Observable, of, BehaviorSubject, fromEvent } from 'rxjs';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { MedicalCode } from 'src/app/_models/codes';



@Component({
  selector: 'app-procedure.dialog',
  templateUrl: './procedure.dialog.component.html',
  styleUrls: ['./procedure.dialog.component.scss']
})
export class ProcedureDialogComponent implements OnInit {
  teethNumbers: number[] = [];
  @ViewChild('searchProcedureCode', { static: true }) searchProcedureCode: ElementRef;
  @ViewChild('searchReasonCode', { static: true }) searchReasonCode: ElementRef;
  filteredProcedures: Observable<MedicalCode[]>;
  // filteredReasons: Observable<MedicalCode[]>;
  procedureInfo: ProceduresInfo = new ProceduresInfo();
  patient: ProviderPatient;
  reasonCodes: MedicalCode[] = REASON_CODES;
  selectedCode: string;

  constructor(private overlayref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage) {
    let i = 1;
    while (this.teethNumbers.push(i++) < 32) {
      this.patient = authService.viewModel.Patient;

    }
    if (overlayref.RequestData != null)
      this.procedureInfo = overlayref.RequestData;

  }
  ngOnInit(): void {
    fromEvent(this.searchProcedureCode.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
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

  onReasonSelected(selected) {
    this.procedureInfo.ReasonCode = selected.option.value.Code;
    this.procedureInfo.ReasonDescription = selected.option.value.Description
  }

  onProcedureSelected(selected) {
    this.procedureInfo.Code = selected.option.value.Code;
    this.procedureInfo.Description = selected.option.value.Description;
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
    this.procedureInfo.Surface = 'surface_buccal_v';
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
    this.procedureInfo.Surface = 'surface_incisal';
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
    this.procedureInfo.Surface = 'surface_facial';
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

    this.procedureInfo.Surface = 'surface_lingual_v';
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
    this.procedureInfo.Surface = 'surface_facial_v';
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
    this.procedureInfo.Surface = 'surface_distal';
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
    this.procedureInfo.Surface = 'surface_buccal';
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
    this.procedureInfo.Surface = 'surface_mesial';
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
    this.procedureInfo.Surface = 'surface_lingual';
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
    this.procedureInfo.Surface = 'surface_occlusal';
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
    this.procedureInfo.Surface = 'pit_mesiobuccal';
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
    this.procedureInfo.Surface = 'pit_distobuccal';
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
    this.procedureInfo.Surface = 'pit_mesiolingual';
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
    this.procedureInfo.Surface = 'pit_distolingual';
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
    this.procedureInfo.Surface = 'cusp_mesial';
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
    this.procedureInfo.Surface = 'cusp_distal';
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
    this.procedureInfo.Surface = 'cusp_mesiobuccal';
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
    this.procedureInfo.Surface = 'cusp_distobuccal';
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
    this.procedureInfo.Surface = 'cusp_mesiolingual';
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
    this.procedureInfo.Surface = 'cusp_distolingual';
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


  save() {
    console.log(this.procedureInfo);
    let isAdd = this.procedureInfo.ProcedureId == null;
    this.patientService.CreateProcedure(this.procedureInfo)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.overlayref.close({ "saved": true });
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CP1001" : "M2CP1002"])
        } else {
          this.overlayref.close();
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP1001"])
        }
      });
  }

  enableSave(): boolean {
    return !(this.procedureInfo.Code != null && this.procedureInfo.Code != ""
      && this.procedureInfo.Description != null && this.procedureInfo.Description != ""
      && this.procedureInfo.ServicedAt != null && this.procedureInfo.ToothNo != null
      && this.procedureInfo.Status != null && this.procedureInfo.Status != ""
      && this.procedureInfo.Surface != null && this.procedureInfo.Surface != "");
  }

  _filterProcedure(term) {
    console.log(term);

    this.utilityService.MedicalCodes(term, "CDT/CPT")
      .subscribe(resp => {
        //this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredProcedures = of(
            resp.ListResult as MedicalCode[]);
        } else this.filteredProcedures = of([]);
      })
  }
}

