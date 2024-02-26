import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AlertMessage } from "src/app/_alerts/alertMessage";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { PatientService } from "src/app/_services/patient.service";
import { EHROverlayRef } from "src/app/ehr-overlay-ref";







@Component({
  selector: 'app-bills',
  templateUrl: './procedures.dialog.component.html',
  styleUrls: ['./procedures.dialog.component.scss']
})
export class ProceduresDialogComponent implements OnInit {
  billId:string = '';
  patientId:string ='';
  procedures: any[] = []
  displayedColumns = ['Proc Date', 'Code', 'Description',
    'Surface','ToothNo', 'Amount', 'Status','Billed'];

  constructor(private overlayref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    private datePipe: DatePipe){

    }
  ngOnInit(): void {
    this.patientId = this.overlayref.RequestData.PatientId
    this.billId = this.overlayref.RequestData.BillId;
    console.log(`billId: ${this.billId}, patientId : ${this.patientId}`);

    this.initPatientProcedures();
  }

  initPatientProcedures(){
    this.patientService.ProceduresForBill(this.patientId).subscribe(resp =>{
      if(resp.IsSuccess){
        console.log(resp);

        this.procedures = resp.ListResult as any[];
      }
      //else this.bill = {};
    });
  }

  closeProcedures() {
    this.overlayref.close({ close: true })
  }

  updateBillProcedurs(){
    console.log(this.procedures);
    this.patientService.UpdateProceduresInBill({Procedures: this.procedures,BillId: this.billId,PatientId:this.patientId}).subscribe(resp =>{
      if(resp.IsSuccess){
        console.log(resp);
        this.overlayref.close({'UpdateView': true})
      }

    })
  }
}

export class BillInfoToUpdate{
  Procedures: any[] = []
  BillId: string
  PatientId: string;
}
