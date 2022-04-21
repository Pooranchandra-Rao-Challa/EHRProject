import { Component, OnInit } from '@angular/core';
import { AvailableTimeSlot, NewAppointment, PatientSearchResults, ScheduledAppointment, UserLocations } from 'src/app/_models/smar.scheduler.data';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';

@Component({
  selector: 'app-upcoming.appointments',
  templateUrl: './upcoming.appointments.component.html',
  styleUrls: ['./upcoming.appointments.component.scss']
})
export class UpcomingAppointmentsComponent implements OnInit {
  AppointmentsOfPatient: NewAppointment[];
  messageToShowTimeSlots: string;
  PatientAppointment: NewAppointment;
  SaveInputDisable: boolean;
  AvaliableTimeSlots: AvailableTimeSlot[]
  SelectedProviderId: string;
  Locations: UserLocations[];
  public flag: boolean = true;
  appointmentTitle: string;
  appointmentId: string;
  Appointments: ScheduledAppointment[];
  public selectedPatient: PatientSearchResults;
  SelectedLocationId: string;

  constructor(private smartSchedulerService: SmartSchedulerService,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  closeExistingAppointment() {
    this.ClearPatientAppointment();
    this.messageToShowTimeSlots = '';
  }

  ClearPatientAppointment() {
    this.PatientAppointment = {};
    this.ClearTimeSlots();
    this.SaveInputDisable = false;
    this.messageToShowTimeSlots = '';
  }

  ClearTimeSlots() {
    this.LoadAppointmentDefalts();
    this.AvaliableTimeSlots = [];
  }

  LoadAppointmentDefalts() {
    this.SaveInputDisable = false;
    if (this.SelectedProviderId == this.authService.userValue.ProviderId)
      this.Locations = JSON.parse(this.authService.userValue.LocationInfo);
    else {
      this.smartSchedulerService.PracticeLocations({ "provider_Id": this.SelectedProviderId })
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.Locations = resp.ListResult as UserLocations[];
          }
        });
    }
  }
  onSelectNewAppointmentofPatientFromEditAppointments() {
    this.flag = false;
    this.appointmentTitle = "Add New Appointment";
    this.ClearPatientAppointment();
    this.confirmIsCancelledAppointment();
    this.PatientAppointment.AppointmentId = this.selectedPatient.AppointmentId;
    this.PatientAppointment.PatientId = this.selectedPatient.PatientId;
    this.PatientAppointment.PatientName = this.selectedPatient.Name;
    this.PatientAppointment.LocationId = this.SelectedLocationId;
    this.PatientAppointment.ProviderId = this.SelectedProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;
    this.PatientAppointment.Startat = new Date();
  }

  PatientAppointments(PatientObj) {
    let req = {
      "PatientId": PatientObj.PatientId
    };

    this.smartSchedulerService.ActiveAppointments(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.confirmIsCancelledAppointment();
        this.AppointmentsOfPatient = resp.ListResult as ScheduledAppointment[];
        //console.log(this.AppointmentsOfPatient);
      }
    });
  }

  confirmIsCancelledAppointment() {
    this.appointmentId = null;
  }
}
