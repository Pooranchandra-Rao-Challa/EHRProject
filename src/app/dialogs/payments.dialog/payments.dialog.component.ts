import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AlertMessage, ERROR_CODES } from "src/app/_alerts/alertMessage";
import { BillPayment } from "src/app/_models/_provider/encounter";
import { PatientService } from "src/app/_services/patient.service";
import { EHROverlayRef } from "src/app/ehr-overlay-ref";
@Component({
  selector: 'app-bill-payments',
  templateUrl: './payments.dialog.component.html',
  styleUrls: ['./payments.dialog.component.scss']
})
export class PaymentsDialogComponent implements OnInit {
  billId:string = '';
  procedures: any[] = []
  paymentType: string;
  billPayment: BillPayment = {}
  today: Date = new Date()
  TransactionTypes: { Name: string, Value: string }[] = [{ Name: "Payment (-)", Value: "payment" }, { Name: "Charge (+) Adjustment", Value: "positive-adjustment" }
  , { Name: "Charge (-) Adjustment", Value: "negative-adjustment" }];
  PaymentMethods: { Name: string, Value: string }[] = [{Name: "Bill Sent", Value: "bill sent"} ,{ Name: "Received by Card", Value: "received by card" }, { Name: "Cash Receipt", Value: "cash receipt" }
  , { Name: "On-line Receipt", Value: "on-line receipt" } , { Name: "Declined by Patient", Value: "declined by patient" }];


  constructor(private overlayref: EHROverlayRef,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe){

    }
  ngOnInit(): void {

    this.billId = this.overlayref.RequestData.BillId;
    this.paymentType = this.overlayref.RequestData.PaymentType;
    this.billPayment.TransactionType = this.paymentType == 'Payment (-)' ? "payment" : this.paymentType == 'Charge (+) Adjustment' ? "positive-adjustment" : "negative-adjustment"
    if(this.overlayref.RequestData.PaymentItem){
      this.billPayment = this.overlayref.RequestData.PaymentItem;
      this.billId = this.billPayment.BillId;
    }
  }

  closeProcedures() {
    this.overlayref.close({ close: true })
  }

  updatePayments(){
    this.billPayment.BillId = this.billId;

    this.billPayment.strTransactionDate = this.datePipe.transform(this.billPayment.TransactionDate,"MM/dd/yyyy");
    this.patientService.UpdateBillPayment(this.billPayment).subscribe(resp =>{
      if(resp.IsSuccess){
        this.overlayref.close({'UpdateView':true})
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2I1002"])
      }else{
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2I1001"])
      }
    })
  }
}


