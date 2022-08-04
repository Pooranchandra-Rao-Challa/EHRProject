import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Appointments } from 'src/app/_models/_patient/appointments';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from '../../_models';
import { PatientService } from '../../_services/patient.service'
const moment = require('moment');
@Component({
  selector: 'app-patientappointment.dialog',
  templateUrl: './patientappointment.dialog.component.html',
  styleUrls: ['./patientappointment.dialog.component.scss']
})
export class PatientappointmentDialogComponent implements OnInit {
  user: User;
  displayReq = "none";
  hoverDATE: string = 'Date';
  hoverTime: string = 'Date';
  Providerdata: any;
  clinicaldata: any;
  requestAppoinments?: Appointments = {}


  constructor(private ref: EHROverlayRef, private patientservise: PatientService, private authenticationService: AuthenticationService,private alertmsg: AlertMessage,) {
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
    requestAppoinments.StartAt= moment(requestAppoinments.AppttDate).format('YYYY-MM-DD ')+ moment(requestAppoinments.AppointmentTime, "HH:mm:ss").format("hh:mm:ss");
    requestAppoinments.PatientId = this.user.PatientId;
    requestAppoinments.ClinicId = this.user.ClinicId;
    // requestAppoinments.StartAt = this.requestAppoinments.AppointmentTime 
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
      && this.requestAppoinments.AppointmentTime != null 
      && this.requestAppoinments.AppttDate != null 
     )


  }

}
