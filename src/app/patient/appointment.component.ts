import { Component } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import {  TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { PatientService } from '../_services/patient.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Actions, User } from '../_models';
import { Appointments } from '../_models/_patient/appointments';
import { connect } from 'http2';


@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  user: User;
  isPast:boolean=false;
  isUpcoming:boolean=true;
  displayReq = "none";
  PatientDialogComponent = PatientappointmentDialogComponent;
  DialogResponse = null;
  PatientPastAppointmentsList: Appointments
  PatientUpcomingAppointmentsList: Appointments
  ActionTypes = Actions;
  

  constructor(private overlayService :OverlayService,private patientservice: PatientService,private authenticationService: AuthenticationService,) {
    this.user = authenticationService.userValue
    // this.locationsInfo = JSON.parse(this.user.LocationInfo)
  }

  ngOnInit(): void {
    this.getPatientUpcomingAppointments();
    this.getPatientPastAppointments();


  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string, dialogData, action?: Actions) {
    debugger;
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      let reqdata: any;
      if (action == Actions.view && content === this.PatientDialogComponent) {
        reqdata = dialogData;
      }
     
    
      const ref = this.overlayService.open(content, reqdata);
      ref.afterClosed$.subscribe(res => {
      });
    });
  }

  onUpcoming(){
    this.isUpcoming=true;
    this.isPast=false;
  }
  onPast(){
    this.isUpcoming=false;
    this.isPast=true;
  }
getPatientPastAppointments()
{
  var req={
     "PatientId": this.user.PatientId,
  }
  this.patientservice.PatientPastAppointments(req).subscribe(res=>{
    this.PatientPastAppointmentsList=res.ListResult;
    console.log(this.PatientPastAppointmentsList);
  })
}

getPatientUpcomingAppointments()
{
  var req={
    "PatientId": this.user.PatientId,
  }
  this.patientservice.PatientUpcomingAppointments(req).subscribe(res=>{
    this.PatientUpcomingAppointmentsList=res.ListResult;
   
  })
}


}

