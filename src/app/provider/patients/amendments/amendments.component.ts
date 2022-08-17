import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Amendments } from 'src/app/_models/_provider/amendments';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';

@Component({
  selector: 'app-amendments',
  templateUrl: './amendments.component.html',
  styleUrls: ['./amendments.component.scss']
})
export class AmendmentsComponent implements OnInit {
  amendment: Amendments = new Amendments();
  PatientDetails: any = [];
  amendmentlist: any = [];
  AmendmentStatusesDD: any = [];
  AmendmentSourcesDD: any = [];

  constructor(private patientservice: PatientService, private authService: AuthenticationService, 
    private alertmsg: AlertMessage, private ulilityservice: UtilityService, private datePipe:DatePipe) {
    this.amendment = [] as Amendments
  }

  ngOnInit(): void {
    this.getPatientDetails();
    this.getAmendmentStatuses();
    this.getAmendmentSources();
    this.getAmendment();
  }
  getPatientDetails() {
    this.PatientDetails = this.authService.viewModel.Patient;
  }
  AmendmentsColumns = ['DateRequested', 'Status', 'Description/Location', 'Scanned']
  todayDateforDateRequested() {
    this.amendment.DateofRequest = this.datePipe.transform(new Date(),"yyyy-MM-dd");
  }
  todayDateforDateAcceptedorDenied() {
    this.amendment.DateofAccept = this.datePipe.transform(new Date(),"yyyy-MM-dd");
  }
  todayforDateAppended() {
    this.amendment.DateofAppended = this.datePipe.transform(new Date(),"yyyy-MM-dd");
  }

  getAmendment() {
    var reqparam = {
      "PatientId": this.PatientDetails.PatientId
    }
    this.patientservice.AmendmentDetails(reqparam).subscribe((resp) => {
      this.amendmentlist = resp.ListResult == null ? [] : resp.ListResult;
    });
  }


  createUpadateAmendment() {
    let isAdd = this.amendment.AmendmentId == undefined;
    this.amendment.PatientId = this.PatientDetails.PatientId;
    this.patientservice.CreateupdateAmendment(this.amendment).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.getAmendment();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2A001" : "M2A002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2A001"]);
      }
    });



  }
  resetDialog() {
    
    this.amendment = new Amendments();
    this.getAmendment();
    
  }
  basedonid(item) {
    this.amendment = item;
  }
  deleteAmendment() {
    var reqparam = {
      "AmendmentId": this.amendment.AmendmentId
    }
    this.patientservice.DeleteAmendment(reqparam).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.getAmendment();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2A002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2A001"]);
      }
    });
   
  }
  getAmendmentStatuses() {
    this.ulilityservice.AmendmentStatuses().subscribe((res) => {
      this.AmendmentStatusesDD = res.ListResult == null ? [] : res.ListResult;

    })

  }
  getAmendmentSources() {
    this.ulilityservice.AmendmentSources().subscribe((res) => {
      this.AmendmentSourcesDD = res.ListResult == null ? [] : res.ListResult;
    })
  }
}
