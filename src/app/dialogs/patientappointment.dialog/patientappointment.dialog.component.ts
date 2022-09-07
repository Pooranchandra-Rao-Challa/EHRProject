import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Appointments } from 'src/app/_models/_patient/appointments';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from '../../_models';
import { PatientService } from '../../_services/patient.service'
//const moment = require('moment');
@Component({
  selector: 'app-patientappointment.dialog',
  templateUrl: './patientappointment.dialog.component.html',
  styleUrls: ['./patientappointment.dialog.component.scss']
})
export class PatientappointmentDialogComponent implements OnInit {
  user: User;
  displayReq = "none";
  Providerdata: any;
  clinicaldata: any;
  requestAppoinments?: Appointments = {}

  minDate = new Date();
  constructor(private ref: EHROverlayRef, private patientservise: PatientService,
    private authenticationService: AuthenticationService,private alertmsg: AlertMessage,
    private datePipe:DatePipe) {
    this.user = authenticationService.userValue
    let data: Appointments = ref.RequestData;
  }

  ngOnInit(): void {
    this.getProviders();
    this.getLocations();
  }
  cancel() {
    this.ref.close(null);
  }

  getLocations() {
    var req = {
      "ClinicId": this.user.ClinicId,
    }
    this.patientservise.PatientLocations(req).subscribe(req => {
      this.clinicaldata = req.ListResult;
    })
  }
  getProviders() {
    var req = {
      "ClinicId": this.user.ClinicId,
    }
    this.patientservise.PatientProviders(req).subscribe(req => {
      this.Providerdata = req.ListResult;
    })
  }
  RequestAppointment(requestAppoinments: Appointments) {
    if(requestAppoinments.AppttDate != null)
    this.requestAppoinments.strStartAt = this.datePipe.transform(this.requestAppoinments.AppttDate,"MM/dd/yyyy");
    this.requestAppoinments.strStartAt = this.requestAppoinments.strStartAt + ' ' + this.requestAppoinments.AppointmentTime;

    requestAppoinments.PatientId = this.user.PatientId;
    requestAppoinments.ClinicId = this.user.ClinicId;
    this.patientservise.RequestPatientAppointment(requestAppoinments).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M3A001"])
        this.cancel();
      }
      else {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M3A002"])
        this.cancel();
      }
    })
  }

  enableSave() {
    return !(
      this.requestAppoinments.ProviderId != null && this.requestAppoinments.ProviderId != ""
      && this.requestAppoinments.LocationId != null && this.requestAppoinments.LocationId != ""
      && this.requestAppoinments.AppointmentTime != null && this.requestAppoinments.AppointmentTime !=""
      && this.requestAppoinments.AppttDate != null 
      
     )


  }

}
