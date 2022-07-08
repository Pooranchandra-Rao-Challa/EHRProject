import { NewmessageDialogComponent } from './../dialogs/newmessage.dialog/newmessage.dialog.component';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import { Component, TemplateRef } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { User, UserLocations, ViewModel } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';
import { ComponentType } from '@angular/cdk/portal';
import { PatientService } from '../_services/patient.service';
import { Appointments } from '../_models/_patient/appointments';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isHealth:boolean=false;
  isAccees:boolean=false;

  displayNew = "none";
  user: User;
  locationsInfo: UserLocations[];
  PatientDialogComponent = PatientappointmentDialogComponent;
  MessageDialogComponent = NewmessageDialogComponent;
  DialogResponse = null;
  PatientUpcomingAppointmentsList: Appointments={};
  PatientUpcomingAppointmentsCount:Appointments={};
  viewModel: ViewModel;

  constructor(private authenticationService: AuthenticationService,private overlayService :OverlayService,private patientservice: PatientService,private router:Router) {

    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo)
    this.viewModel = authenticationService.viewModel;

   }

  ngOnInit(): void {
    this.getPatientUpcomingAppointments();
    $(document).ready(function () {

      $('ul.navbar-nav > li')
              .click(function (e) {
          $('ul.navbar-nav > li')
              .removeClass('active');
          $(this).addClass('active');
      });
  });
  }
  onChangeViewState(view){

    this.authenticationService.SetViewParam("SubView",view);
    this.viewModel = this.authenticationService.viewModel;
    this.router.navigate(
      ['/patient/dashboard'],
    );
  }
  onhealth(){
    this.isAccees=false;
    this.isHealth=true;
  }
  onAcess(){
    this.isHealth=false;
    this.isAccees=true;

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
  openComponentDialogmessage(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
      //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.MessageDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }
  getPatientUpcomingAppointments()
{
  var req={
    //  "PatientId": this.user.PatientId,
    "PatientId":"62385146391cba10c7c20539"
  }
  this.patientservice.PatientUpcomingAppointments(req).subscribe(res=>{
    this.PatientUpcomingAppointmentsCount=res.ListResult[0];
    console.log(this.PatientUpcomingAppointmentsCount.ApptCount)
    this.PatientUpcomingAppointmentsList=res.ListResult;
    console.log(this.PatientUpcomingAppointmentsList);
  })
}
}
