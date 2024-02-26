

import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit,  ViewChild, } from '@angular/core';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { SuperBill,   GlobalConstants } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { reduceEachTrailingCommentRange } from 'typescript';

@Component({
  selector: 'app-superbill.dialog',
  templateUrl: './superbill.component.html',
  styleUrls: ['./superbill.component.scss']
})
export class SuperbillDialogComponent implements OnInit {

  //encounterInfo: EncounterInfo;
  procedureColumns: string[] = ['PROCEDUREDATE', 'AREAOFORALCAVITY', 'TOOTHSYSTEM', 'TOOTHNUMBERORLETTER', 'TOOTHSURFACE', 'PROCEDURECODE',
    'QTY', 'DESCRIPTION', 'FEE'];
  noOfToothsInRow: number[] = Array.from({ length: 8 }, (_, i) => i + 1);
  noOfRows: number[] = Array.from({ length: 32 / 8 }, (_, i) => i + 1);
  bill: SuperBill = { EncounterInfo: {}, ToothInfo: [] };
  patient:ProviderPatient = {}
  CoveragePlans: { Name: string, Value: string }[] = [{ Name: "Self", Value: "self" }, { Name: "Dental", Value: "dental" }];
  Genders: { Name: string, Value: string }[] = [{ Name: "Male", Value: "male" }, { Name: "Female", Value: "female" }, { Name: "Other", Value: "other" }];
  Releations: { Name: string, Value: string }[] = [{ Name: 'Self', Value: 'self' }, { Name: 'Spouse', Value: 'spouse' }, { Name: 'Dependent child', Value: 'dependent child' }, { Name: 'Other', Value: 'other' }];
  PlaceOfTreatment: { Name: string, Value: string }[] = [{ Name: 'OFFICE', Value: 'office' }, { Name: 'O/P HOSPITAL', Value: 'hospital' }];
  TreatmentReasons: { Name: string, Value: string }[] = [{ Value: 'injury', Name: 'OCCUPATION ILLNESS/INJURY' }, { Value: 'accident', Name: 'AUTO ACCIDENT' }, { Value: 'other', Name: 'OTHER ACCIDENT' }]
  BillCodes: {} = { 'office': 11, 'hospital': 22 };
  States = GlobalConstants.States;
  //firstFee: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  @ViewChild('firstFee', { static: true }) firstFee: ElementRef;
  @ViewChild('secondFee', { static: true }) secondFee: ElementRef;
  @ViewChild('procedureFee', { static: true }) procedureFee: ElementRef;

  constructor(private overlayref: EHROverlayRef, public authService: AuthenticationService,
    private patientService: PatientService,
    private overlayService: OverlayService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.setLocalVariables();
    this.initBillItems(this.bill.EncounterInfo.EncounterId, this.bill.EncounterInfo.PatientId);
    this.patientService.PatientProfile({ "PatientId": this.bill.EncounterInfo.PatientId })
      .subscribe((resp) => {
        if (resp.IsSuccess) {
          this.patient = resp.Result as ProviderPatient;
        }
      });
    fromEvent(this.firstFee.nativeElement, 'keyup').pipe(
       // get value
       map((event: any) => {
        return event.target.value;
      })
    ).subscribe((value) =>{
      this.CalculateTotalCost( );
    });

    fromEvent(this.secondFee.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
       return event.target.value;
     })
   ).subscribe((value) =>{
     this.CalculateTotalCost( );
   })

  }

  RelationChanged(relation){
    if(relation.value == "self"){
      this.bill.Coverage.FirstName =  this.patient.FirstName
      this.bill.Coverage.LastName = this.patient.LastName;
      this.bill.Coverage.MiddleInitials = this.patient.MiddleName;
      this.bill.Coverage.DateofBirth = new Date(this.patient.Dob);
      this.bill.Coverage.Gender = this.patient.Gender;

    }else {
      this.bill.Coverage.FirstName =  "";
      this.bill.Coverage.LastName = "";
      this.bill.Coverage.MiddleInitials = "";
    }
  }
  get ProcedureCost(): number{
    var rtnValue: number = 0;
    this.bill.EncounterInfo.CompletedProcedures.forEach( value => {
      rtnValue += Number(value.Fee)
    })
    this.bill.TotalFee = Number(this.bill.FirstFee ?  this.bill.FirstFee : 0) + Number(this.bill.SecondFee ?  this.bill.SecondFee : 0) + Number(rtnValue)
    return rtnValue;
  }

  CalculateTotalCost(){
    var rtnValue: number = 0;
    this.bill.EncounterInfo.CompletedProcedures.forEach( value => {
      rtnValue += Number(value.Fee)
    })
    this.bill.TotalFee = Number(this.bill.FirstFee ?  this.bill.FirstFee : 0) + Number(this.bill.SecondFee ?  this.bill.SecondFee : 0) + Number(rtnValue)
  }

  getToothState(i: number) {
    return this.bill.ToothInfo[i].Available;
  }

  closeSuperbill() {
    this.overlayref.close({ close: true })
  }

  initBillItems(encounterId: string, patientId: string) {
    this.patientService.PatientBill(encounterId, patientId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.copyBill(resp.Result as SuperBill);
      }
    })
  }

  copyBill(b: SuperBill) {
    this.bill.BillDate = b.BillDate;
    this.bill.AccidentedAt = b.AccidentedAt
    this.bill.AppliancedAt = b.AppliancedAt;
    this.bill.FirstFee = b.FirstFee;
    this.bill.SecondFee = b.SecondFee;
    this.bill.TotalFee = b.TotalFee;
    this.bill.Id = b.Id;
    this.bill.Place = b.Place;
    this.bill.Months = b.Months;
    this.bill.State = b.State;
    this.bill.Orthodontic = b.Orthodontic;
    this.bill.TreatmentReason = b.TreatmentReason;
    if(b.Coverage) this.bill.Coverage = b.Coverage;
    if(b.ToothInfo)  this.bill.ToothInfo = b.ToothInfo;
    if(b.Procedures) this.bill.Procedures = b.Procedures;
    if(b.Insurance) this.bill.Insurance = b.Insurance;
    console.log(new Date(this.bill.Insurance.DateOfBirth.split(' ')[0]));

    if(this.bill.Insurance.DateOfBirth && this.bill.Insurance.DateOfBirth.split(' ')[0]) this.bill.Insurance.dob = new Date(this.bill.Insurance.DateOfBirth.split(' ')[0]);
    if(b.Payer) this.bill.Payer = b.Payer;
    console.log(b);

  }

  setLocalVariables() {
    if(this.overlayref.data.encounterInfo!= null)
      this.bill.EncounterInfo = this.overlayref.data.encounterInfo;
    if (this.bill.ToothInfo == null || this.bill.ToothInfo.length == 0) {
      this.bill.ToothInfo = Array.from({ length: 32 }, (_, i) => i + 1).map((i) => { return { BillId: this.bill.Id, ToothNumber: i, Available: true } });
    }
    this.bill.Coverage = {};
  }

  get billLabel() {
    let encounter = this.bill.EncounterInfo;
    return `${this.datePipe.transform(encounter.ServicedAt, "dd MMM, yyyy")}${encounter.ServiceEndAt != null ? " - " + this.datePipe.transform(encounter.ServiceEndAt, "dd MMM, yyyy") : ""} ${encounter.VisitReason != null ? " - " + encounter.VisitReason : ""}`
  }

  onSaveBill(){
    console.log(this.bill);
    this.bill.ToothInfo.forEach(ti => ti.BillId = this.bill.Id);
    this.bill.strAppliancedAt =  this.datePipe.transform(this.bill.AppliancedAt,"MM/dd/yyyy");
    this.bill.strAccidentedAt =  this.datePipe.transform(this.bill.AccidentedAt,"MM/dd/yyyy");
    this.bill.strBillDate =  this.datePipe.transform(this.bill.BillDate,"MM/dd/yyyy");
    this.patientService.CreateProgressNoteBill(this.bill).subscribe(resp =>{
      if(resp.IsSuccess){
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2I1001"])
        this.overlayref.close({'UpdateView':true});
      }


    })
  }
}
