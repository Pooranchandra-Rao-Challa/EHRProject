import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AlertMessage } from "src/app/_alerts/alertMessage";
import { BillPayment } from "src/app/_models/_provider/encounter";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { PatientService } from "src/app/_services/patient.service";
import { EHROverlayRef } from "src/app/ehr-overlay-ref";







@Component({
  selector: 'app-bill-payments',
  templateUrl: './payments.dialog.component.html',
  styleUrls: ['./payments.dialog.component.scss']
})
export class PaymentsDialogComponent implements OnInit {
  billId:string = '';
  patientId:string ='';
  paymentId:string ='';
  procedures: any[] = []
  paymentType: string;
  billPayment: BillPayment = {}
  today: Date = new Date()
  TransactionTypes: { Name: string, Value: string }[] = [{ Name: "Payment (-)", Value: "payment" }, { Name: "Charge (+) Adjustment", Value: "positive-adjustment" }
  , { Name: "Charge (-) Adjustment", Value: "negative-adjustment" }];
  PaymentMethods: { Name: string, Value: string }[] = [{ Name: "Card Payment", Value: "card payment" }, { Name: "Cash Payment", Value: "cash payment" }
  , { Name: "On-line Payment", Value: "on-line payment" } ];


  constructor(private overlayref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe){

    }
  ngOnInit(): void {
    this.patientId = this.overlayref.RequestData.PatientId
    this.billId = this.overlayref.RequestData.BillId;
    this.paymentType = this.overlayref.RequestData.PaymentType;
    console.log(`billId: ${this.billId}, patientId : ${this.patientId}, paymentType: ${this.paymentType}`);
    this.billPayment.TransactionType = this.paymentType == 'Payment (-)' ? "payment" : this.paymentType == 'Charge (+) Adjustment' ? "positive-adjustment" : "negative-adjustment"
    this.initPatientProcedures();
  }

  initPatientProcedures(){

  }

  closeProcedures() {
    this.overlayref.close({ close: true })
  }

  updatePayments(){
    this.billPayment.BillId = this.billId;
    this.billPayment.PaymentId = this.paymentId;
    this.billPayment.strTransactionDate = this.datePipe.transform(this.billPayment.TransactionDate,"MM/dd/yyyy");
    this.patientService.UpdateBillPayment(this.billPayment).subscribe(resp =>{
      if(resp.IsSuccess){

        this.overlayref.close({'UpdateView':true})
      }
    })
  }
}


