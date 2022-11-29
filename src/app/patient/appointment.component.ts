import { NewAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/newappointment.dialog.component';
import { Component, Input, TemplateRef, OnDestroy } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { PatientService } from '../_services/patient.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Actions, AppointmentDialogInfo, AppointmentTypes, GeneralSchedule, NewAppointment, PracticeProviders, Room, User, UserLocations } from '../_models';
import { Appointments } from '../_models/_patient/appointments';
import { UtilityService } from '../_services/utiltiy.service';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';
import { SettingsService } from './../_services/settings.service';
import { SmartSchedulerService } from '../_services/smart.scheduler.service';
declare var $: any;

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
  appointmentDialogComponent = NewAppointmentDialogComponent;
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
  generalSchedule: GeneralSchedule = {} as GeneralSchedule;
  @Input() PatientAppointment: NewAppointment;
  @Input() PracticeProviders: PracticeProviders[];
  @Input() AppointmentTypes: AppointmentTypes[];
  @Input() Locations: UserLocations[];
  @Input() Rooms: Room[];
  SaveInputDisable: boolean;
  SelectedProviderId: string = "";
  customizedspinner: boolean;

  constructor(private overlayService: OverlayService, private patientservice: PatientService, private authenticationService: AuthenticationService, private utilityService: UtilityService,
    private alertmsg: AlertMessage, private settingsService: SettingsService, private smartSchedulerService: SmartSchedulerService,) {
    this.user = authenticationService.userValue
    this.RequestAppoinments.LocationId;
  }

  ngOnInit(): void {
    this.GeneralScheduleInfo();
    this.getProviders();
    this.getLocations();
    this.getPatientUpcomingAppointments();
    this.getPatientPastAppointments();
    this.selectedAppointmentDate = new Date(new Date().toLocaleDateString());
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    if (!this.generalSchedule.PatientRescedule) {
      this.alertmsg.displayMessageDailog(ERROR_CODES["E3A002"]);
    } else {

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
        else if (e.ApptStatus == 'Scheduled') {
          e.ApptStatus = 'Scheduled';
          e.class = "Statusconfirmed"
        }
        else if (e.ApptStatus == 'In-Progress') {
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

  GeneralScheduleInfo() {
    let reqparams = {
      clinicId: this.user.ClinicId
    };
    this.settingsService.Generalschedule(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        if (resp.ListResult.length == 1)
          this.generalSchedule = resp.ListResult[0];
      }
    })
  }

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

  CancelAppoinments(Appt) {
    if (this.isPatientEligibleToModifyAppointment(Appt))
      this.confirmCancelAppointment(Appt.AppointmentId);
  }

  isPatientEligibleToModifyAppointment(Appt): boolean {
    if (!this.generalSchedule.PatientRescedule) {
      this.alertmsg.displayMessageDailog(ERROR_CODES["E3A002"]);
      return false;
    } else {
      var startTime = new Date(Appt.StartAt);
      var todayDate = new Date();
      var diffInTime = (startTime.getTime() - todayDate.getTime()) / (1000 * 3600)
      if (diffInTime > 0 && diffInTime <= this.generalSchedule.RescheduleTime) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["E3A002"]);
        return false;
      }
      else {
        return true;
      }
    }
  }


  ResheduleAppoinment(Appt) {
    if (this.isPatientEligibleToModifyAppointment(Appt)) {
      this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
      // let dialogData = this.PatientAppointmentInfo(Appt, Actions.view);
      this.PatientAppointment = {} as NewAppointment;
      this.loadDefaults(Appt);
      setTimeout(() => {
        this.openPatientAppointmentComponentDialog(this.appointmentDialogComponent, Appt, this.ActionTypes.view);
        this.customizedspinner = false;
        $('body').removeClass('loadactive')
      }, 1000);
    }
  }

  openPatientAppointmentComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions, status: string = "") {
    let dialogData = this.PatientAppointmentInfo(data, Actions.view);
    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
    });
  }

  PatientAppointmentInfo(appointment: Appointments, action?: Actions) {
    let data = {} as AppointmentDialogInfo;
    this.PatientAppointment.PatientId = appointment.PatientId;
    this.PatientAppointment.PatientName = appointment.PatientName;
    this.PatientAppointment.LocationId = appointment.LocationId;
    this.PatientAppointment.ProviderId = appointment.ProviderId;
    this.PatientAppointment.ClinicId = this.authenticationService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;

    data.Title = "Edit Appointment";
    data.ClinicId = this.authenticationService.userValue.ClinicId;
    data.ProviderId = appointment.ProviderId;
    data.LocationId = appointment.LocationId;
    data.PatientAppointment = this.PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;
    data.PatientAppointment.AppointmentId = appointment.AppointmentId;
    data.PatientAppointment.Startat = appointment.StartAt;
    data.PatientAppointment.AppointmentStatusId = appointment.ApptStatusId;
    data.PatientAppointment.AppointmentTypeId = appointment.ApptTypeId;
    data.PatientAppointment.RoomId = appointment.RoomId;
    data.PatientAppointment.Notes = appointment.Note;
    data.status = action;
    data.NavigationFrom = "Smart Schedule"
    data.IsCancelBtn = true;
    return data;
  }

  loadDefaults(Appt: NewAppointment) {
    let req = { "ClinicId": this.authenticationService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
    let preq = { "ProviderId": Appt.ProviderId };
    this.smartSchedulerService.AppointmentTypes(preq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AppointmentTypes = resp.ListResult as AppointmentTypes[];
      }
    });

    this.smartSchedulerService.ProviderPracticeLocations({ "ProviderId": Appt.ProviderId })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.Locations = resp.ListResult as UserLocations[];
        }
      });

    let lreq = { "LocationId": Appt.LocationId };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Rooms = resp.ListResult as Room[];
        this.PatientAppointment.RoomId = this.Rooms[0].RoomId;
      }
    });
  }

  confirmCancelAppointment(AppointmentId) {
    var req = {
      'ClinicId': this.user.ClinicId,
      'AppointmentId': AppointmentId
    }
    this.patientservice.CancelPatientAppoinment(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M3A002"]);
        this.getPatientPastAppointments();
        this.getPatientUpcomingAppointments();
      }
      else {
        this.alertmsg.displayMessageDailog(ERROR_CODES["E3A001"]);
      }
    })
  }

  // alertMessage() {
  //   if (this.generalSchedule.ConcurrentApps == false) {
  //     this.alertmsg.displayMessageDailog(ERROR_CODES["E3A002"]);
  //   }
  // }

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
