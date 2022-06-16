import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import {
  AppointmentTypes, AvailableTimeSlot, Actions,
  NewAppointment, PatientSearchResults, Room, ScheduledAppointment, UserLocations,
  AppointmentDialogInfo
} from 'src/app/_models/';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { EHROverlayRef } from '../../ehr-overlay-ref';
// import { TimelineMonthService } from '@syncfusion/ej2-angular-schedule';
declare const CloseAppointment: any;
declare const OpenSaveSuccessAppointment: any;

@Component({
  selector: 'app-newappointment.dialog',
  templateUrl: './newappointment.dialog.component.html',
  styleUrls: ['./newappointment.dialog.component.scss']
})
export class NewAppointmentDialogComponent implements OnInit {
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
  todayDate: Date = new Date();
  myHolidayFilter: boolean;

  constructor(
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService) {
    let data: AppointmentDialogInfo = ref.RequestData;
    this.PatientAppointment = {} as NewAppointment;
    // console.log(this.PatientAppointment);

    this.PatientAppointment = data.PatientAppointment;
    // console.log(this.PatientAppointment);
    this.appointmentTitle = data.Title;
    this.AppointmentTypes = data.AppointmentTypes;
    this.PracticeProviders = data.PracticeProviders;
    this.Locations = data.Locations;
    this.Rooms = data.Rooms;
    if (this.Rooms.length == 1)
      this.PatientAppointment.RoomId = this.Rooms[0].RoomId;

    if (data.status == Actions.view && data.PatientAppointment.AppointmentId != null) {
      this.LoadAvailableTimeSlots();
    }

  }

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

  LoadAvailableTimeSlots() {
    let ats = {
      "LocationId": this.PatientAppointment.LocationId,
      "RoomId": this.PatientAppointment.RoomId,
      "Duration": this.PatientAppointment.Duration,
      "RequestDate": this.PatientAppointment.Startat,
      "AppointmentId": this.PatientAppointment.AppointmentId
    };
    this.PatientAppointment.TimeSlot = null;
    this.smartSchedulerService.AvailableTimeSlots(ats).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AvaliableTimeSlots = resp.ListResult as AvailableTimeSlot[];
        this.AvaliableTimeSlots.forEach(obj => {
          if (obj.Selected)
            this.PatientAppointment.TimeSlot = obj;
        });
        // console.log(this.PatientAppointment.TimeSlot);
        this.messageToShowTimeSlots = null;
      }
      else {
        this.messageToShowTimeSlots = "There are no available time slots that match your request. Please try selecting a different date, time, or duration."
      }
    });

  }

  confirmAppointment() {
    if (this.appointmentId != null) {
      this.smartSchedulerService.ConfirmAppointmentCancellation({ AppointmentId: this.appointmentId })
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.appointmentId = null;
            //this.OperationMessage = resp.EndUserMessage;

            //OpenSaveSuccessAppointment();
          }
          else {
            //this.SaveInputDisable = false;
            //this.OperationMessage = "Appointment is not saved"
          }
        });
    }
  }
  onTimeSlotSelect(slot) {
    this.PatientAppointment.TimeSlot = slot
  }

  onProviderChangeFromAppointmentForm() {
    this.SelectedProviderId = this.PatientAppointment.ProviderId
    // console.log(this.SelectedProviderId)

  }

  close() {
    this.ref.close(null);
  }

  ClearTimeSlots() {
    this.AvaliableTimeSlots = [];
    this.PatientAppointment.TimeSlot = null;
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


  viewAppointment(patientapp) {
    this.appointmentTitle = "Edit Appointment";
    this.ClearPatientAppointment();
    this.PatientAppointment = patientapp;
    // console.log(JSON.stringify(this.PatientAppointment))
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
    // console.log(JSON.stringify(this.PatientAppointment));
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
