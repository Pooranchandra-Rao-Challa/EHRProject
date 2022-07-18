import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Amendments } from 'src/app/_models/_provider/amendments';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-amendments',
  templateUrl: './amendments.component.html',
  styleUrls: ['./amendments.component.scss']
})
export class AmendmentsComponent implements OnInit {
  amendment:Amendments = new Amendments();
  PatientDetails: any = [];
  amendmentlist:any=[];
  
  constructor(private patientservice: PatientService,private authService: AuthenticationService,private alertmsg: AlertMessage,) { 
    this.amendment=[] as Amendments 
    console.log(this.amendment);
  }

  ngOnInit(): void {
    this.getPatientDetails();
    this.GetAmendment();
  }
  getPatientDetails() {
    this.PatientDetails = this.authService.viewModel.Patient;
  }
  AmendmentsColumns=['DateRequested','Status','Description/Location','Scanned']
  Status: any[] = [
    { value: 'Requested', viewValue: 'Requested' },
    { value: 'Accepted', viewValue: 'Accepted' },
    { value: 'Denied', viewValue: 'Denied' },
  ];
  Source: any[] = [
    { value: 'Pratice', viewValue: 'Pratice' },
    { value: 'Patient', viewValue: 'Patient' },
    { value: 'Organization', viewValue: 'Organization' },
    { value: 'Other', viewValue: 'Other' },
  ];
  todayDateforDateRequested() {
    this.amendment.DateofRequest = moment(new Date()).format('YYYY-MM-DD');
  }
  todayDateforDateAcceptedorDenied()
  {
    this.amendment.DateofAccept= moment(new Date()).format('YYYY-MM-DD');
  }
  todayforDateAppended()
  {
    this.amendment.DateofAppended= moment(new Date()).format('YYYY-MM-DD');
  }

GetAmendment()
{
  debugger
  var reqparam = {
    "PatientId": this.PatientDetails.PatientId
  }
  this.patientservice.AmendmentDetails(reqparam).subscribe((resp) => {
    this.amendmentlist=resp.ListResult== null ? [] : resp.ListResult;
    console.log(this.amendment);
    
  });
  }


 CreateUpadateAmendment()
 {
   debugger;
   
   let isAdd = this.amendment.AmendmentId == undefined;
  this.amendment.PatientId = this.PatientDetails.PatientId;
    this.patientservice.CreateupdateAmendment(this.amendment).subscribe((resp)=>{
      if (resp.IsSuccess) {
        this.GetAmendment();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2A001" : "M2A002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2A001"]);
      }
    });
  
  
  
 }
 resetDialog(){
   debugger;
   this.amendment=new Amendments();
 }
 basedonid(item)
 {
   this.amendment=item;
}
deleteAmendment()
{
  var reqparam = {
    "AmendmentId": this.amendment.AmendmentId
  }
  this.patientservice.DeleteAmendment(reqparam).subscribe((resp) => {  
    if (resp.IsSuccess) {
      this.GetAmendment();
      this.alertmsg.displayMessageDailog(ERROR_CODES[ "M2A003"]);
    }
    else{
      this.alertmsg.displayErrorDailog(ERROR_CODES["E2A001"]);
    }
  });
  this.GetAmendment();
}
}
