import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  AppointmentTypes, AvailableTimeSlot, Actions,
  NewAppointment, PatientSearchResults, Room, ScheduledAppointment, UserLocations,
  AppointmentDialogInfo,
  PatientChart
} from 'src/app/_models/';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { fromEvent, Observable, of } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {MessageDialogComponent} from 'src/app/dialogs/alert.dialog/message.dialog.component'
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { CompleteAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/complete.appointment.component';



@Component({
  selector: 'app-newappointment.dialog',
  templateUrl: './newappointment.dialog.component.html',
  styleUrls: ['./newappointment.dialog.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ]
})
export class NewAppointmentDialogComponent implements OnInit, AfterViewInit {
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
  //Appointments: ScheduledAppointment[];
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
  @ViewChild('searchPatient', { static: true }) searchPatient: ElementRef;
  filteredPatients: Observable<PatientSearchResults[]>;
  isLoading: boolean = false;
  data: AppointmentDialogInfo = {};
  showMessage: BehaviorSubject<boolean> = new BehaviorSubject(false);
  showHideMessage$ = this.showMessage.asObservable();
  messageDialogComponent = MessageDialogComponent;
  completeAppointmentDialogComponent = CompleteAppointmentDialogComponent;
  ActionTypes: any;

  constructor(
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private alert: AlertMessage,
    private datePipe: DatePipe,
    private alertMessage: AlertMessage,
    private overlayService : OverlayService) {
    this.data = ref.RequestData;
    this.PatientAppointment = {} as NewAppointment;

    this.PatientAppointment = this.data.PatientAppointment;


    this.appointmentTitle = this.data.Title;
    this.AppointmentTypes = this.data.AppointmentTypes;
    this.PracticeProviders = this.data.PracticeProviders;
    this.Locations = this.data.Locations;
    this.Rooms = this.data.Rooms;
    if (this.Rooms && this.Rooms.length == 1
      && this.PatientAppointment.RoomId == null)
      this.PatientAppointment.RoomId = this.Rooms[0].RoomId;

    if ((this.data.status == Actions.view && this.data.PatientAppointment.AppointmentId != null)
      || (this.PatientAppointment.RoomId != null && this.PatientAppointment.Startat != null &&
        this.PatientAppointment.LocationId != null && this.PatientAppointment.Duration != null)) {
      this.LoadAvailableTimeSlots();
    }
    if (this.PatientAppointment && this.PatientAppointment.Startat != null)
      this.todayDate = this.PatientAppointment.Startat;

  }
  ngAfterViewInit(): void {
    if (this.searchPatient != null)

      fromEvent(this.searchPatient.nativeElement, 'keyup').pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 2 && res.length < 6)
        // Time in milliseconds between key events
        , debounceTime(1000)
        // If previous query is diffent from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe(value => this._filterPatients(value));
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

  _filterPatients(term) {

    this.isLoading = true;
    this.smartSchedulerService
      .SearchPatients({
        ProviderId: this.SelectedProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearchResults[]);
        } else this.filteredPatients = of([]);
      })
  }


  displayWith(value: PatientSearchResults): string {
    if (!value) return "";
    return value.Name;
  }

  onPatientSelected(selected) {
    this.PatientAppointment.PatientName = selected.option.value.Name
    this.PatientAppointment.PatientId = selected.option.value.PatientId;
  }

  LoadAvailableTimeSlots() {

    let ats = {
      "ProviderId": this.PatientAppointment.ProviderId,
      "LocationId": this.PatientAppointment.LocationId,
      "RoomId": this.PatientAppointment.RoomId,
      "Duration": this.PatientAppointment.Duration,
      "RequestDate": this.PatientAppointment.Startat,
      "AppointmentId": this.PatientAppointment.AppointmentId,
      "strRequestDate": this.datePipe.transform(this.PatientAppointment.Startat,"MM/dd/yyyy"),
    };

    this.smartSchedulerService.AvailableTimeSlots(ats).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AvaliableTimeSlots = resp.ListResult as AvailableTimeSlot[];
        this.AvaliableTimeSlots.forEach(obj => {
          if (obj.Selected || (
            (this.data.TimeSlot != null && obj.TimeSlot == this.data.TimeSlot.TimeSlot)
          ))
            this.PatientAppointment.TimeSlot = obj;
        });
        this.showMessage.next(false);
        this.messageToShowTimeSlots == null;
      }
      else {
        this.AvaliableTimeSlots = [];
        this.showMessage.next(true);
        this.messageToShowTimeSlots = "There are no available time slots that match your request. Please try selecting a different date, time, or duration."
      }
    });

  }


  onTimeSlotSelect(slot) {
    this.PatientAppointment.TimeSlot = slot
  }

  onProviderChangeFromAppointmentForm() {
    this.SelectedProviderId = this.PatientAppointment.ProviderId
  }

  close() {
    this.ref.close({ 'closed': true });
  }

  OnLocationChange(event) {
    this.PatientAppointment.LocationId = event.value;
    this.SelectedLocationId = this.PatientAppointment.LocationId;
    this.UpdateRooms();
    this.ClearTimeSlots();
  }
  UpdateRooms() {
    let lreq = { "LocationId": this.SelectedLocationId };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Rooms = resp.ListResult as Room[];
        this.PatientAppointment.RoomId = this.Rooms[0].RoomId;
      } else {
        this.Rooms = [];
        this.PatientAppointment.RoomId = null;
      }
    });
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
        this.AppointmentsOfPatient = resp.ListResult as ScheduledAppointment[];
      }
    });
  }


  viewAppointment(patientapp) {
    this.appointmentTitle = "Edit Appointment";
    this.ClearPatientAppointment();
    this.PatientAppointment = patientapp;
    this.LoadAvailableTimeSlots();
  }


  cancelAppointment() {
    let data: ScheduledAppointment ={};
    data.StatusToUpdate = "Cancelled";
    data.AppointmentId = this.PatientAppointment.AppointmentId;
    data.PatientId = this.PatientAppointment.PatientId;
    data.ClinicId = this.PatientAppointment.ClinicId;

    this.openComponentDialog(this.completeAppointmentDialogComponent,data,Actions.view)
  }

  DiabledAppointmentSave() {
    return !(this.PatientAppointment.Duration != null
      && this.PatientAppointment.LocationId != null
      && this.PatientAppointment.TimeSlot != null
      && this.PatientAppointment.AppointmentTypeId != null
      && this.PatientAppointment.RoomId != null
      && this.PatientAppointment.PatientId != null
      && this.PatientAppointment.ProviderId != null
      && this.PatientAppointment.Notes != null && this.PatientAppointment.Notes !=""
      && this.PatientAppointment.Startat != null) || this.SaveInputDisable;
  }
  onAppointmentSave() {
    this.PatientAppointment.AppointmentTime = this.PatientAppointment.TimeSlot.StartDateTime;
    this.PatientAppointment.strAppointmentTime =
    this.datePipe.transform(this.PatientAppointment.TimeSlot.StartDateTime,"MM/dd/yyyy HH:mm")
    let isAdd = this.PatientAppointment.AppointmentId == null;
    this.SaveInputDisable = true;
    this.smartSchedulerService.CreateAppointment(this.PatientAppointment).subscribe(resp => {
      if (resp.IsSuccess) {
        this.onError = false;
        this.ref.close({ 'refresh': true,
        'UpdatedModal': PatientChart.Appointment });
        this.OperationMessage = resp.EndUserMessage;
        //this.openComponentDialog(this.messageDialogComponent,null,Actions.view);
        //if (this.data.NavigationFrom = )
        this.alert.displayMessageDailog(ERROR_CODES[isAdd ? "M2AA001" : "M2AA002"]);
      }
      else {
        this.onError = true;
        this.OperationMessage = "Appointment is not saved"
        this.alert.displayMessageDailog(ERROR_CODES[isAdd ? "E2AA001" : "E2AA002"]);
      }
    });
  }
  updateAppointmentStatus(appointment: ScheduledAppointment) {
    if (appointment.Status != appointment.StatusToUpdate) {
      this.smartSchedulerService.UpdateAppointmentStatus(appointment).subscribe(resp => {
        this.ref.close({ 'refresh': true });
        if (resp.IsSuccess) {
          if (resp.IsSuccess && resp.Result != 'Error01') {
            this.alertMessage.displayMessageDailog(ERROR_CODES["M2JSAT004"]);
          } else {
            this.alertMessage.displayErrorDailog(ERROR_CODES["E2JSAT002"]);
          }

        }
        else {
          this.alertMessage.displayErrorDailog(ERROR_CODES["E2JSAT003"]);

        }
      });
    }
  }
  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.messageDialogComponent) {
      reqdata = dialogData;
    }
    else{
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if (content == this.completeAppointmentDialogComponent) {
        if (res.data != null && res.data.confirmed) {
          this.updateAppointmentStatus(res.data.appointment);
        }
      }
    });
  }

}
