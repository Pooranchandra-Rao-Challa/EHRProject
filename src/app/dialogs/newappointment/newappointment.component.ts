import { Component, OnInit } from '@angular/core';
import { AppointmentTypes, AvailableTimeSlot, NewAppointment, PatientSearchResults, Room, ScheduledAppointment, UserLocations } from 'src/app/_models/smar.scheduler.data';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/practiceProviders';
declare const CloseAppointment: any;
declare const OpenSaveSuccessAppointment: any;

@Component({
  selector: 'app-newappointment',
  templateUrl: './newappointment.component.html',
  styleUrls: ['./newappointment.component.scss']
})
export class NewappointmentComponent implements OnInit {
  PatientAppointment: NewAppointment;
  SaveInputDisable: boolean;
  SelectedProviderId: string;
  SelectedLocationId: string;
  Locations: UserLocations[];
  Rooms: Room[];
  AvaliableTimeSlots: AvailableTimeSlot[]
  messageToShowTimeSlots: string;
  PracticeProviders: PracticeProviders[];
  AppointmentTypes: AppointmentTypes[]
  selectedAppointmentDate: Date;
  Appointments: ScheduledAppointment[];
  NoofAppointment: Number;
  appointmentTitle: string;
  public flag: boolean = true;
  public selectedPatient: PatientSearchResults;
  AppointmentsOfPatient: NewAppointment[];
  appointmentId: string;
  PeriodsOfTimeSlots: {};
  onError: boolean;
  OperationMessage: string;

  constructor(private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService) { }

  ngOnInit(): void {
    this.PeriodsOfTimeSlots = [
      { Text: '15 min', Value: 15 },
      { Text: "30 min", Value: 30 },
      { Text: "45 min", Value: 45 },
      { Text: "1 hour", Value: 60 },
      { Text: "1 hour 15 min", Value: 75 },
      { Text: "1 hour 30 min", Value: 90 },
      { Text: "1 hour 45 min", Value: 105 },
      { Text: "2 hours", Value: 120 },
      { Text: "2 hours 15 min", Value: 135 },
      { Text: "2 hours 30 min", Value: 150 },
      { Text: "2 hours 45 min", Value: 165 },
      { Text: "3 hours", Value: 180 },
      { Text: "Full Day", Value: 1440 }];
  }

  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
    let preq = { "ProviderId": this.SelectedProviderId };
    this.smartSchedulerService.AppointmentTypes(preq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AppointmentTypes = resp.ListResult as AppointmentTypes[];
      }
    });


    this.filterAppointments();
  }

  filterAppointments() {
    let req = {
      "ClinicId": this.authService.userValue.ClinicId,
      "ProviderId": this.SelectedProviderId,
      "LocationId": this.authService.userValue.CurrentLocation,
      "AppointmentDate": this.selectedAppointmentDate
    };
    console.log(JSON.stringify(req))
    this.smartSchedulerService.ActiveAppointments(req).subscribe(resp => {
      console.log(resp.IsSuccess)
      if (resp.IsSuccess) {
        console.log(resp.ListResult)
        this.Appointments = resp.ListResult as ScheduledAppointment[];
        this.NoofAppointment = this.Appointments.length;
      } else {
        this.NoofAppointment = 0;
        this.Appointments = [];
      }

    });
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
    let lreq = { "LocationId": this.SelectedLocationId };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Rooms = resp.ListResult as Room[];
        this.PatientAppointment.RoomId = this.Rooms[0].RoomId;
      }
    });
  }

  LoadAvailableTimeSlots() {
    let ats = {
      "LocationId": this.PatientAppointment.LocationId,
      "RoomId": this.PatientAppointment.RoomId,
      "Duration": this.PatientAppointment.Duration,
      "RequestDate": this.PatientAppointment.Startat,
      "AppointmentId": this.PatientAppointment.AppointmentId
    };
    console.log(ats);
    this.smartSchedulerService.AvailableTimeSlots(ats).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AvaliableTimeSlots = resp.ListResult as AvailableTimeSlot[];
        this.AvaliableTimeSlots.forEach(obj => {
          if (obj.Selected)
            this.PatientAppointment.TimeSlot = obj;
        });
        console.log(this.PatientAppointment.TimeSlot);
        this.messageToShowTimeSlots = null;
      }
      else {
        this.messageToShowTimeSlots = "There are no available time slots that match your request. Please try selecting a different date, time, or duration."
      }
    });

  }

  onTimeSlotSelect(slot) {
    this.PatientAppointment.TimeSlot = slot
  }

  onProviderChangeFromAppointmentForm() {
    this.SelectedProviderId = this.PatientAppointment.ProviderId
    console.log(this.SelectedProviderId)
    this.LoadAppointmentDefalts();
  }

  ClearTimeSlots() {
    this.LoadAppointmentDefalts();
    this.AvaliableTimeSlots = [];
  }

  ClearPatientAppointment() {
    this.PatientAppointment = {};
    this.ClearTimeSlots();
    this.SaveInputDisable = false;
    this.messageToShowTimeSlots = '';
  }

  closeEditAppointment() {
    this.ClearPatientAppointment();
    this.messageToShowTimeSlots = '';
  }

  onSelectPatient(PatientObj) {
    this.flag = false;
    this.selectedPatient = PatientObj as PatientSearchResults;
    if (this.selectedPatient.NumberOfAppointments == 0) {
      this.appointmentTitle = "Add New Appointment";
      this.confirmIsCancelledAppointment();
      this.ClearPatientAppointment();
      this.PatientAppointment.AppointmentId = this.selectedPatient.AppointmentId;
      this.PatientAppointment.PatientId = this.selectedPatient.PatientId;
      this.PatientAppointment.PatientName = this.selectedPatient.Name;
      this.PatientAppointment.LocationId = this.SelectedLocationId;
      this.PatientAppointment.ProviderId = this.SelectedProviderId;
      this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
      this.PatientAppointment.Duration = 30;
    }
    else this.PatientAppointments(this.selectedPatient)
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

  viewAppointment(patientapp) {
    this.appointmentTitle = "Edit Appointment";
    this.ClearPatientAppointment();
    this.PatientAppointment = patientapp;
    console.log(JSON.stringify(this.PatientAppointment))
    this.LoadAvailableTimeSlots();
  }

  confirmIsCancelledAppointment() {
    this.appointmentId = null;
  }

  cancelAppointment(appointmentId: string) {
    this.appointmentId = appointmentId;
  }

  DiabledAppointmentSave() {
    return !(this.PatientAppointment.Duration != null
      && this.PatientAppointment.LocationId != null
      && this.PatientAppointment.TimeSlot != null
      && this.PatientAppointment.AppointmentTypeId != null
      && this.PatientAppointment.RoomId != null
      && this.PatientAppointment.Startat != null) || this.SaveInputDisable
    //console.log(retfalg);
  }

  onAppointmentSave() {
    this.PatientAppointment.AppointmentTime = this.PatientAppointment.TimeSlot.StartDateTime;
    console.log(JSON.stringify(this.PatientAppointment));
    this.SaveInputDisable = true;
    this.smartSchedulerService.CreateAppointment(this.PatientAppointment).subscribe(resp => {
      if (resp.IsSuccess) {
        this.onError = false;
        CloseAppointment();
        this.OperationMessage = resp.EndUserMessage;
        this.ClearPatientAppointment();
        OpenSaveSuccessAppointment();
      }
      else {
        this.onError = true;
        this.OperationMessage = "Appointment is not saved"
        OpenSaveSuccessAppointment();
      }
    });
  }
}
