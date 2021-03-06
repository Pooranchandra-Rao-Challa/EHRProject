import { Component } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import {  TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { PatientService } from '../_services/patient.service';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models';
import { Appointments } from '../_models/_patient/appointments';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  user: User

  isPast:boolean=false;
  isUpcoming:boolean=true;
  displayReq = "none";
  PatientDialogComponent = PatientappointmentDialogComponent;
  DialogResponse = null;
  PatientPastAppointmentsList: Appointments
  PatientUpcomingAppointmentsList: Appointments

  constructor(private overlayService :OverlayService,private patientservice: PatientService,private authenticationService: AuthenticationService,) {
    this.user = authenticationService.userValue
    // this.locationsInfo = JSON.parse(this.user.LocationInfo)
  }

  ngOnInit(): void {
    this.getPatientUpcomingAppointments();
    this.getPatientPastAppointments();

  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
      //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.PatientDialogComponent) {
        this.DialogResponse = res.data;
      }
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
    console.log(this.PatientUpcomingAppointmentsList);
  })
}
}

