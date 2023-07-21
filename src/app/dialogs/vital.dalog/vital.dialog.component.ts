import { Component, OnInit, Inject, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { VitalInfo } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Observable, combineLatest, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-vital-dialog',
  templateUrl: './vital.dialog.component.html',
  styleUrls: ['./vital.dialog.component.scss']
})
export class VitalDialogComponent implements OnInit {
  VitalInfoFG: FormGroup;
  Vital: VitalInfo = new VitalInfo;
  CollectedTime: string;
  @ViewChild('heightField', { static: true }) heightField: ElementRef;
  @ViewChild('weightField', { static: true }) weightField: ElementRef;
  heightValue$: Observable<number>;
  weightValue$: Observable<number>;
  bmi$: Observable<number>;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private datePipe: DatePipe) {
    this.UpdateVital(ref.RequestData)
  }

  UpdateVital(data: any) {
    this.Vital = new VitalInfo();
    if (data == null) return;

    this.Vital = Object.assign({}, data);
    if (this.Vital.CollectedAt != null)
      this.Vital.CollectedTime = this.datePipe.transform(this.Vital.CollectedAt, "hh:mm a");
  }
  BloodTypes = [
    { Id: 1, BloodType: 'Group A +ve' },
    { Id: 2, BloodType: 'Group B +ve' },
    { Id: 3, BloodType: 'Group AB +ve' },
    { Id: 4, BloodType: 'Group O +ve' },
    { Id: 5, BloodType: 'Group A -ve' },
    { Id: 6, BloodType: 'Group B -ve' },
    { Id: 7, BloodType: 'Group AB -ve' },
    { Id: 8, BloodType: 'Group O -ve' }
  ]

  ngOnInit(): void {


    this.heightValue$ = fromEvent<Event>(this.heightField.nativeElement, 'input')
      .pipe(map(e => +(<HTMLInputElement>e.target).value));
    this.weightValue$ = fromEvent<Event>(this.weightField.nativeElement, 'input')
      .pipe(map(e => +(<HTMLInputElement>e.target).value));
    this.bmi$ = combineLatest([this.heightValue$, this.weightValue$]).pipe(
      map(([h, w]) => this.computeBmi(h, w)),
    )
  }
  collectAtRequired() {
    return !(this.Vital.CollectedAt == null ||
      this.Vital.CollectedTime == null || this.Vital.Height == null ||
      this.Vital.Weight == null ||
      this.Vital.Temperature == null ||
      this.Vital.BPSystolic == null ||
      this.Vital.BPDiastolic == null ||
      this.Vital.O2Saturation == null ||
      this.Vital.Pulse == null ||
      this.Vital.RespiratoryRate == null ||
      this.Vital.BloodType == null)
  }

  private computeBmi(height: number, weight: number): number {
    const bmi = (weight / ((height) * (height))) * 703;
    if (isNaN(bmi)) this.Vital.BMI = null;
    else
      this.Vital.BMI = Number(bmi.toFixed(2));
    return Number(bmi.toFixed(2));
  }

  enableSaveButton() {
    let noCollectionDate = !this.Vital.CollectedAt
    let noCollectionTime = !this.Vital.CollectedTime
    let noBMI = !this.Vital.Height && !this.Vital.Weight;
    let noBP = !this.Vital.BPDiastolic && !this.Vital.BPSystolic;
    let noTemp = !this.Vital.Temperature;
    let noBloodType = !this.Vital.BloodType;
    let noO2 = !this.Vital.O2Saturation;
    let noPulse = !this.Vital.Pulse;
    let norr = !this.Vital.RespiratoryRate;

    if (noCollectionDate && noCollectionTime
      && noBMI && noBP && noTemp && noBloodType && noO2 && noPulse && norr) return true;

    if (!noCollectionDate && noCollectionTime
      && noBMI && noBP && noTemp && noBloodType && noO2 && noPulse && norr) return true;

    if (noCollectionDate && !noCollectionTime
      && noBMI && noBP && noTemp && noBloodType && noO2 && noPulse && norr) return true;

    if ((noCollectionDate || noCollectionTime)
      && (!noBMI || !noBP || !noTemp || !noBloodType || !noO2 || !noPulse || !norr)) {
      if (noCollectionDate) return true;
      if (noCollectionTime) return true;
    }

    if (!noCollectionDate &&
      !noCollectionTime) {
      if (noBMI && noBP && noTemp && noBloodType && noO2 && noPulse && norr) return true;
      if (this.Vital.Weight && !this.Vital.Height) return true;
      if (!this.Vital.Weight && this.Vital.Height) return true;
      if (this.Vital.BPDiastolic && !this.Vital.BPSystolic) return true;
      if (!this.Vital.BPDiastolic && this.Vital.BPSystolic) return true;
      if (noCollectionTime) return true;
      if (noCollectionDate) return true
    }
  }

  closePopup() {
    this.ref.close();
  }

  saveVital() {
    if (this.Vital.CollectedAt != null)
      this.Vital.strCollectedAt = this.datePipe.transform(this.Vital.CollectedAt, "MM/dd/yyyy")
    if (this.Vital.CollectedTime != null)
      this.Vital.strCollectedAt = this.Vital.strCollectedAt + " " + this.Vital.CollectedTime;
    this.Vital.CollectedAt = new Date(this.Vital.strCollectedAt);
    this.ref.close(
      {
        UpdateVital: true,
        data: this.Vital
      }

    );
  }
}
