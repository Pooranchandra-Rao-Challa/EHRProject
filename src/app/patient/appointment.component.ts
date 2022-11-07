import { Component } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { PatientService } from '../_services/patient.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Actions, User, UserLocations } from '../_models';
import { Appointments } from '../_models/_patient/appointments';
import { connect } from 'http2';
import { UtilityService } from '../_services/utiltiy.service';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';


@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  user: User;
  userlocation: UserLocations;
  isPast: boolean = false;
  isUpcoming: boolean = true;
  displayReq = "none";
  PatientDialogComponent = PatientappointmentDialogComponent;
  DialogResponse = null;
  PatientPastAppointmentsList: Appointments[]
  PatientUpcomingAppointmentsList: Appointments[]
  ActionTypes = Actions;
  RequestAppoinments: Appointments = {}
  Providerdata: any;
  clinicaldata: any;
  selectedAppointmentDate: Date;
  selectedWeekday: any;
  selectedAppointmentDateString: string;
  constructor(private overlayService: OverlayService, private patientservice: PatientService, private authenticationService: AuthenticationService, private utilityService: UtilityService,
    private alertmsg: AlertMessage,) {
    this.user = authenticationService.userValue
    this.RequestAppoinments.LocationId;
    // this.locationsInfo = JSON.parse(this.user.LocationInfo)
  }
  ngOnInit(): void {

    this.getProviders();
    this.getLocations();
    this.getPatientUpcomingAppointments();
    this.getPatientPastAppointments();
    this.selectedAppointmentDate = new Date(new Date().toLocaleDateString());
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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
        this.getPatientPastAppointments();
        this.getPatientUpcomingAppointments();
      }
    });
  }
  onUpcoming() {
    this.isUpcoming = true;
    this.isPast = false;
  }
  onPast() {
    this.isUpcoming = false;
    this.isPast = true;
  }
  getPatientPastAppointments() {
    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientservice.PatientPastAppointments(req).subscribe(res => {
      this.PatientPastAppointmentsList = res.ListResult;
      this.PatientPastAppointmentsList?.map((e) => {

        if (e.ApptStatus == 'Cancelled') {
          e.class = "StatusCancelled";
        }
      })

    })
  }

  getPatientUpcomingAppointments() {

    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientservice.PatientUpcomingAppointments(req).subscribe(res => {
      this.PatientUpcomingAppointmentsList = res.ListResult;
      this.PatientUpcomingAppointmentsList?.map((e) => {

        if (e.ApptStatus == 'Not Confirmed') {
          e.ApptStatus = 'Pending';
          e.class = "Statusnotconfirmed";

        }
        else if (e.ApptStatus == 'Confirmed') {
          e.ApptStatus = 'Waiting';
          e.class = "Statusconfirmed"

        }
        else if(e.ApptStatus == 'Scheduled')
        {
          e.ApptStatus = 'Scheduled';
          e.class = "Statusconfirmed"

        }
        else if(e.ApptStatus == 'In-Progress')
        {
          e.ApptStatus = 'In-Progress';
          e.class = "Statusconfirmed"
        }
        else if (e.ApptStatus == 'Cancelled') {
          e.ApptStatus = 'Cancelled';
          e.class = "StatusCancelled";

        }
      });

    })
  }

  // reschedule(item) {
  //   this.RequestAppoinments = item;
  //   this.RequestAppoinments.LocationId = item.LocationId
  // }
  getLocations() {
    var req = {
      "ClinicId": this.user.ClinicId,
    }
    this.patientservice.PatientLocations(req).subscribe(req => {
      this.clinicaldata = req.ListResult;
    })
  }
  getProviders() {
    var req = {
      "ClinicId": this.user.ClinicId,
    }
    this.patientservice.PatientProviders(req).subscribe(req => {
      this.Providerdata = req.ListResult;
    })
  }

  CancelAppoinments(AppointmentId) {
    var req = {
      'ClinicId': this.user.ClinicId,
      'AppointmentId': AppointmentId

    }
    this.patientservice.CancelPatientAppoinment(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M3A002"])
        this.getPatientPastAppointments();
        this.getPatientUpcomingAppointments();
      }
      else {
        this.alertmsg.displayMessageDailog(ERROR_CODES["E3A001"])
      }
    })
  }

  // getGeneralSchedule() {
  //   let reqparams = {
  //     clinicId: this.user.ClinicId
  //   };
  //   this.settingsService.Generalschedule(reqparams).subscribe((resp) => {
  //     if (resp.IsSuccess) {
  //       if (resp.ListResult.length == 1)
  //         this.generalSchedule = resp.ListResult[0];
  //     }
  //   })
  // }
}
