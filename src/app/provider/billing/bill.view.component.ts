import { BehaviorSubject } from 'rxjs';
import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AlertMessage } from "src/app/_alerts/alertMessage";
import { Actions, BillView } from "src/app/_models";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { PatientService } from "src/app/_services/patient.service";
import { ComponentType } from '@angular/cdk/portal';
import { ProceduresDialogComponent } from 'src/app/dialogs/procedure.dialog/procedures.dialog.component';
import { PaymentsDialogComponent } from 'src/app/dialogs/payments.dialog/payments.dialog.component';

import { OverlayService } from 'src/app/overlay.service';


@Component({
  selector: 'app-bill.view',
  templateUrl: './bill.view.component.html',
  styleUrls: ['./bill.view.component.scss']
})
export class BillViewComponent implements OnInit {

  billId: string =  '' //'5c5b2a02bc61172824b11f78' //'62469d2e391cba0a3bf15fd6'; // '5c5b2a02bc61172824b11f78'
  patientId:string = '';
  bill: BillView = {};
  billItems: BillItems[] = [];
  bsBillImtes: BehaviorSubject<BillItems[]> = new BehaviorSubject<BillItems[]>([]);
  displayedColumns = ['Transaction Date', 'Proc Date', 'Patient', 'Code', 'Description',
    'Provider', 'Amount','First Fee','Second Fee','Total Fee','Payments', 'Running Balance'];
  proceduresDialog = ProceduresDialogComponent;
  paymentDialog = PaymentsDialogComponent;
  totalPayment: number = 0;
  totalFee: number = 0;
  InsurancePortion: number = 0;
  PatientPortion: number = 0;
  Portion0to30: number = 0;
  Portion30to60:number = 0;
  Portion61to90: number = 0;
  Portion90plus: number = 0;
  finalBalance: number = 0;
  positiveWriteOff: number = 0
  negativeWriteOff: number =0

  constructor(public authService: AuthenticationService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private alertmsg: AlertMessage,
    private overlayService: OverlayService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.bill = {};
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.billId = params.get('id');
      this.patientId = params.get('PId');
    })
    this.initBillView();
  }

  initBillView(){
    this.patientService.BillView(this.billId).subscribe(resp =>{
      if(resp.IsSuccess){
        this.billItems = []
        this.bill = resp.Result as BillView;
        this.bill.Phones = JSON.parse(this.bill.strPhones);
        this.bill.Procedures = JSON.parse(this.bill.strProcedures);
        this.bill.Payments = JSON.parse(this.bill.strPayments);
        console.log(this.bill);
        let runningBalance: number = 0;
        runningBalance+=Number(this.bill.TotalFee);
        this.totalFee = runningBalance;
        this.Portion90plus = this.totalFee;
        this.bill.Procedures.forEach(element => {
            this.billItems.push({
              ProcedureDate : element.StartDate,
              PatientName: element.PatientName,
              ProviderName: element.ProviderName,
              ProcedureId: element.ProcedureId,
              ProcFee: element.Fee,
              Code: element.Code,
              Description: element.Description
            })
        });
        this.billItems.push({
          TransactionDate: this.bill.BillDate,
          PatientName: this.bill.PatientName,
          ProviderName: this.bill.ProviderName,
          FirstFee: this.bill.FirstFee,
          SecondFee: this.bill.SecondFee,
          TotalFee: this.bill.TotalFee,
          Description: "Other Billing Amount"
        });
        if(!this.bill.Payments) this.bill.Payments = [];
        this.bill.Payments.forEach(payment =>{
          let amount = 0;
          if(payment.TransactionType == "payment") {
            amount = Number(payment.Amount) * -1;
            this.totalPayment += amount
          }
          else if(payment.TransactionType == "positive-adjustment"){
            amount = Number(payment.Amount)
            this.positiveWriteOff += amount
          }
          else if(payment.TransactionType == "negative-adjustment") {
            amount = Number(payment.Amount) * -1;
            this.negativeWriteOff += amount
          }
          runningBalance += amount
          this.finalBalance = this.totalFee + this.totalPayment
          this.PatientPortion = this.finalBalance + this.positiveWriteOff + this.negativeWriteOff - this.InsurancePortion;
          this.billItems.push({
            TransactionDate: payment.TransactionDate,
            PatientName: this.bill.PatientName,
            ProviderName: this.bill.ProviderName,
            Payments: amount,
            Description: payment.TransactionType
          });
        });
        if(this.bill.Payments.length == 0){
          this.finalBalance = this.totalFee + this.totalPayment
          this.PatientPortion = this.finalBalance + this.positiveWriteOff + this.negativeWriteOff - this.InsurancePortion;
        }

        this.billItems.push({
          TransactionDate: this.bill.BillDate,
          PatientName: this.bill.PatientName,
          ProviderName: this.bill.ProviderName,
          RunningBalance: runningBalance,
          Description: "Total Amount"
        });


        console.log(this.billItems);
        this.bsBillImtes.next(this.billItems);
      }else this.bill = {};
    });
  }
  openPatientAllProcedures() {
    this.openComponentDialog(this.proceduresDialog,{PatientId: this.patientId, BillId:this.billId}, Actions.view);
  }

  openPayments(paymentType:string){
    this.openComponentDialog(this.paymentDialog,{PatientId: this.patientId, BillId:this.billId, PaymentType:paymentType}, Actions.view);
  }

  closePayment(){
    history.back();
  }
  clearFeeTerms(){
    this.totalPayment = 0;
    this.totalFee = 0;
    this.InsurancePortion = 0;
    this.PatientPortion = 0;
    this.Portion0to30 = 0;
    this.Portion30to60 = 0;
    this.Portion61to90 = 0;
    this.Portion90plus = 0;
    this.finalBalance = 0;
    this.positiveWriteOff = 0
  this.negativeWriteOff =0
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {

    const ref = this.overlayService.open(content, data, true);
    ref.afterClosed$.subscribe(res => {
      if (content === this.proceduresDialog) {

        if (res.data && res.data.UpdateView) {
          this.clearFeeTerms();
          this.initBillView();
        }
      }else if (content === this.paymentDialog) {

        if (res.data && res.data.UpdateView) {
          this.clearFeeTerms();
          this.initBillView();
        }
      }
    });
  }

}

export class BillItems{

  TransactionDate?: Date;
  ProcedureDate?: Date;
  ProcedureId?: string;
  PaymentId?: string;
  PatientName?: string;
  Code?: string;
  Description?: string;
  ProviderName?: string;
  FirstFee?: number;
  SecondFee?: number;
  TotalFee?: number;
  ProcFee?:number;
  Payments?: number;
  RunningBalance?: number;
}
