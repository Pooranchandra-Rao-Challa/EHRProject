import { Validators } from '@angular/forms';
import { ProviderPatient } from 'src/app/_models/_provider/ProviderPatient';
import { ProceduresInfo } from './../../_models/_provider/encounter';
import { filter, map, } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { Observable, of, BehaviorSubject, fromEvent } from 'rxjs';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { MedicalCode } from 'src/app/_models/codes';
import { MatOption } from '@angular/material/core/option';

const REASON_CODES =[
  {'Code':'105480006','Description':'Refusal of treatment by patient (situation)'},
  {'Code':'183944003','Description':'Procedure refused (situation)'},
  {'Code':'183945002','Description':'Procedure refused for religious reason (situation)'},
  {'Code':'413310006','Description':'Patient non-compliant - refused access to services (situation)'},
  {'Code':'413311005','Description':'Patient non-compliant - refused intervention / support (situation)'},
  {'Code':'413312003','Description':'Patient non-compliant - refused service (situation)'},
  {'Code':'183932001','Description':'Procedure contraindicated (situation)'},
  {'Code':'397745006','Description':'Medical contraindication (finding)'},
  {'Code':'407563006','Description':'Treatment not tolerated (situation)'},
  {'Code':'428119001','Description':'Procedure not indicated (situation)'},
  {'Code':'59037007','Description':'Drug intolerance'},
  {'Code':'62014003','Description':'Adverse reaction to drug'}
];



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

    // fromEvent(this.searchReasonCode.nativeElement, 'keyup').pipe(
    //   // get value
    //   map((event: any) => {
    //     return event.target.value;
    //   })
    //   // if character length greater then 2
    //   , filter(res => res.length > 2 && res.length < 6)
    //   // Time in milliseconds between key events
    //   , debounceTime(1000)
    //   // If previous query is diffent from current
    //   , distinctUntilChanged()
    //   // subscription for response
    // ).subscribe(value => this._filterReason(value))
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

  onReasonSelected(selected){
    this.procedureInfo.ReasonCode = selected.option.value.Code;
    this.procedureInfo.ReasonDescription = selected.option.value.Description
  }

  onProcedureSelected(selected){
    this.procedureInfo.Code = selected.option.value.Code;
    this.procedureInfo.Description = selected.option.value.Description;
  }
  private BuccalV$ = new BehaviorSubject(false);
  get BuccalV(): boolean {
    return this.BuccalV$.value;
  }
  set BuccalV(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Buccal V');
    v ? this.procedureInfo.Surfaces.push('Buccal V')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.BuccalV$.next(v);
  }
  private Incisal$ = new BehaviorSubject(false);
  get Incisal(): boolean {
    return this.Incisal$.value;
  }
  set Incisal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Incisal');
    v ? this.procedureInfo.Surfaces.push('Incisal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.Incisal$.next(v);
  }

  private Facial$ = new BehaviorSubject(false);
  get Facial(): boolean {
    return this.Facial$.value;
  }
  set Facial(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Facial');
    v ? this.procedureInfo.Surfaces.push('Facial')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.Facial$.next(v);
  }

  private LingualV$ = new BehaviorSubject(false);
  get LingualV(): boolean {
    return this.LingualV$.value;
  }
  set LingualV(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Lingual V');
    v ? this.procedureInfo.Surfaces.push('Lingual V')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.LingualV$.next(v);
  }

  private FacialV$ = new BehaviorSubject(false);
  get FacialV(): boolean {
    return this.FacialV$.value;
  }
  set FacialV(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Facial V');
    v ? this.procedureInfo.Surfaces.push('Facial V')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.FacialV$.next(v);
  }

  private Distal$ = new BehaviorSubject(false);
  get Distal(): boolean {
    return this.Distal$.value;
  }
  set Distal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Distal');
    v ? this.procedureInfo.Surfaces.push('Distal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.Distal$.next(v);
  }

  private Buccal$ = new BehaviorSubject(false);
  get Buccal(): boolean {
    return this.Buccal$.value;
  }
  set Buccal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Buccal');
    v ? this.procedureInfo.Surfaces.push('Buccal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.Buccal$.next(v);
  }

  private Mesial$ = new BehaviorSubject(false);
  get Mesial(): boolean {
    return this.Mesial$.value;
  }
  set Mesial(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Mesial');
    v ? this.procedureInfo.Surfaces.push('Mesial')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.Mesial$.next(v);
  }


  private Lingual$ = new BehaviorSubject(false);
  get Lingual(): boolean {
    return this.Lingual$.value;
  }
  set Lingual(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Lingual');
    v ? this.procedureInfo.Surfaces.push('Lingual')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.Lingual$.next(v);
  }

  private Occlusal$ = new BehaviorSubject(false);
  get Occlusal(): boolean {
    return this.Occlusal$.value;
  }
  set Occlusal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Occlusal');
    v ? this.procedureInfo.Surfaces.push('Occlusal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.Occlusal$.next(v);
  }

  private PitMesiobuccal$ = new BehaviorSubject(false);
  get PitMesiobuccal(): boolean {
    return this.PitMesiobuccal$.value;
  }
  set PitMesiobuccal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Pit:Mesiobuccal');
    v ? this.procedureInfo.Surfaces.push('Pit:Mesiobuccal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.PitMesiobuccal$.next(v);
  }

  private PitDistobuccal$ = new BehaviorSubject(false);
  get PitDistobuccal(): boolean {
    return this.PitDistobuccal$.value;
  }
  set PitDistobuccal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Pit:Distobuccal');
    v ? this.procedureInfo.Surfaces.push('Pit:Distobuccal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.PitDistobuccal$.next(v);
  }


  private PitMesiolingual$ = new BehaviorSubject(false);
  get PitMesiolingual(): boolean {
    return this.PitMesiolingual$.value;
  }
  set PitMesiolingual(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Pit:Mesiolingual');
    v ? this.procedureInfo.Surfaces.push('Pit:Mesiolingual')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.PitMesiolingual$.next(v);
  }


  private PitDistolingual$ = new BehaviorSubject(false);
  get PitDistolingual(): boolean {
    return this.PitDistolingual$.value;
  }
  set PitDistolingual(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Pit:Distolingual');
    v ? this.procedureInfo.Surfaces.push('Pit:Distolingual')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.PitDistolingual$.next(v);
  }


  private CuspMesial$ = new BehaviorSubject(false);
  get CuspMesial(): boolean {
    return this.CuspMesial$.value;
  }
  set CuspMesial(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Cusp:Mesial');
    v ? this.procedureInfo.Surfaces.push('Cusp:Mesial')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.CuspMesial$.next(v);
  }


  private CuspDistal$ = new BehaviorSubject(false);
  get CuspDistal(): boolean {
    return this.CuspDistal$.value;
  }
  set CuspDistal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Cusp:Distal');
    v ? this.procedureInfo.Surfaces.push('Cusp:Distal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.CuspDistal$.next(v);
  }


  private CuspMesiobuccal$ = new BehaviorSubject(false);
  get CuspMesiobuccal(): boolean {
    return this.CuspMesiobuccal$.value;
  }
  set CuspMesiobuccal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Cusp:Mesiobuccal');
    v ? this.procedureInfo.Surfaces.push('Cusp:Mesiobuccal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.CuspMesiobuccal$.next(v);
  }


  private CuspDistobuccal$ = new BehaviorSubject(false);
  get CuspDistobuccal(): boolean {
    return this.CuspDistobuccal$.value;
  }
  set CuspDistobuccal(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Cusp:Distobuccal');
    v ? this.procedureInfo.Surfaces.push('Cusp:Distobuccal')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.CuspDistobuccal$.next(v);
  }


  private CuspMesiolingual$ = new BehaviorSubject(false);
  get CuspMesiolingual(): boolean {
    return this.CuspMesiolingual$.value;
  }
  set CuspMesiolingual(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Cusp:Mesiolingual');
    v ? this.procedureInfo.Surfaces.push('Cusp:Mesiolingual')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.CuspMesiolingual$.next(v);
  }


  private CuspDistolingual$ = new BehaviorSubject(false);
  get CuspDistolingual(): boolean {
    return this.CuspDistolingual$.value;
  }
  set CuspDistolingual(v: boolean) {
    let i = this.procedureInfo.Surfaces.indexOf('Cusp:Distolingual');
    v ? this.procedureInfo.Surfaces.push('Cusp:Distolingual')
      : this.procedureInfo.Surfaces.splice(i, 1);
    this.CuspDistolingual$.next(v);
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

  // _filterReason(value){
  //   const filterValue = value.toLowerCase();
  //   this.filteredReasons =  of(this.reasonCodes.filter(option => option.Code.toLowerCase().indexOf(filterValue) === 0
  //   || option.Description.toLowerCase().indexOf(filterValue) === 0));
  // }
}

