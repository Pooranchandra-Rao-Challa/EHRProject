
import { UtilityService } from './../../_services/utiltiy.service';
import { Component, OnInit, ViewChild, Output, Input, EventEmitter, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NewPatient } from '../../_models/newPatient';
import { AuthenticationService } from '../../_services/authentication.service';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/practiceProviders';
import { MatSelectionListChange } from '@angular/material/list'

import { Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';
import {
  PatientSearchResults, SearchPatient,
  ScheduledAppointment, AppointmentTypes, NewAppointment,
  UserLocations, Room, AvailableTimeSlot
} from 'src/app/_models/smar.scheduler.data';
declare const CloseAppointment: any;
declare const OpenSaveSuccessAppointment: any;
declare const CloseSaveSuccessAppointment: any;
@Component({
  selector: 'app-smart.schedule',
  templateUrl: './smart.schedule.component.html',
  styleUrls: ['./smart.schedule.component.scss']
})
export class SmartScheduleComponent implements OnInit {
  selectedAppointmentDate: Date;
  selectedWeekday: any;
  selectedAppointmentDateString: string;
  appointment: string = "none";
  existingappointment: string = "none";
  availableTimeSlots: any[] = [];
  encounterdiagnosesColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX"];
  procedureColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "TOOTH", "SURFACE"];
  EncounterData = "";
  PatientData: NewPatient;
  PhonePattern: any;
  NewPatientForm: FormGroup;
  displayAddress: string;
  displayAddressDialog: boolean;
  addressMessage: string;
  ValidAddressForUse: string;
  PracticeProviders: PracticeProviders[];
  Appointments: ScheduledAppointment[];
  NoofAppointment: Number;
  SelectedProviderId: string;
  SelectedLocationId: string;
  psw: {};
  AppointmentTypes: AppointmentTypes[]
  PatientAppointment: NewAppointment;
  AppointmentsOfPatient: NewAppointment[];
  Locations: UserLocations[];
  Rooms: Room[];
  AvaliableTimeSlots: AvailableTimeSlot[]
  messageToShowTimeSlots: string;
  PeriodsOfTimeSlots: {};
  SaveInputDisable: boolean;
  OperationMessage: string;
  appointmentTitle: string;
  appointmentId:string;


  //Auto Search Paramters
  public patients: PatientSearchResults[];
  private patientSearchTerms = new Subject<string>();
  public patientNameOrCellNumber = '';
  public flag: boolean = true;
  public selectedPatient: PatientSearchResults;
  // End of Auto SerachParamters

  public patientSearchScript: HTMLScriptElement;
  public seachViewCloseScript: "if($('.smartview-patient-search-result').is(':visible')); $(document).click(function(){ $('.smartview-patient-search-result').hide(); });"

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private smartSchedulerService: SmartSchedulerService) {

      this.patientSearchScript = document.createElement("script");
      this.patientSearchScript.type =  "text/javascript"
      //this.patientSearchScript.text =  "$(document).click(function(){ if($('.smartview-patient-search-result').is(':visible')){$('.smartview-patient-search-result').hide();} });"
      document.body.appendChild(this.patientSearchScript);

    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };

    this.PatientData = {
      PatinetHasNoEmail: false
    }

    this.patientSearchTerms
      .pipe(debounceTime(300),  // wait for 300ms pause in events
        distinctUntilChanged())   // ignore if next search term is same as previous
      .subscribe((term) =>
        this.smartSchedulerService
          .SearchPatients({
            ProviderId: this.SelectedProviderId,
            ClinicId: this.authService.userValue.ClinicId,
            SearchTerm: term })
          .subscribe(resp => {
            console.log(this.authService.userValue.ClinicId)
            if (resp.IsSuccess) {
              this.patients = resp.ListResult; this.flag = true;
              let currentHeight = 550;
              if (this.patients.length * 31.5 < 550)
                currentHeight = this.patients.length * 31.5;
              this.psw = {
                'border-radius.px': '4',
                'top.px': (currentHeight + 4) * -1,
                'position': 'absolute',
                'height.px': currentHeight + 4,
                'overflow-y': 'auto',
                'background': 'white',
                'width': 'inherit',
                'diplay':'block',
                'border': '1px #41b6a6 solid'
              };
            } else { this.flag = false; this.psw = {}; }
          })
      );

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

  LoadAppointmentDefalts(){
    this.SaveInputDisable = false;
    this.SelectedProviderId = this.authService.userValue.ProviderId;
    this.SelectedLocationId = this.authService.userValue.CurrentLocation;
    this.Locations = JSON.parse(this.authService.userValue.LocationInfo);
    let lreq = { "LocationId": this.SelectedLocationId };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Rooms = resp.ListResult as Room[];
      }
    });
  }
  onTimeSlotChanged(change: MatSelectionListChange) {
    console.log(change);
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
        this.Appointments =[];
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
    this.smartSchedulerService.AvailableTimeSlots(ats).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AvaliableTimeSlots = resp.ListResult as AvailableTimeSlot[];
        this.AvaliableTimeSlots.forEach(obj => {
          if(obj.Selected)
          this.PatientAppointment.TimeSlot =  obj;
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
  calculateClasses() {
    return "ui-widget";
  }

  searchPatient(term: string): void {
    this.flag = true;
    this.patientSearchTerms.next(term);
  }
  onSelectPatient(PatientObj) {
    this.flag = false;
    this.selectedPatient = PatientObj as PatientSearchResults;
    if(this.selectedPatient.NumberOfAppointments == 0){
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

  ClearPatientAppointment() {
    this.PatientAppointment = {};
    this.ClearTimeSlots();
    this.SaveInputDisable = false;
    this.messageToShowTimeSlots = '';
  }

  PatientAppointments(PatientObj){
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
        CloseAppointment();
        this.OperationMessage = resp.EndUserMessage;
        this.ClearPatientAppointment();
        OpenSaveSuccessAppointment();
      }
      else {
        this.SaveInputDisable = false;
        this.OperationMessage = "Appointment is not saved"
      }
    });
  }

  onSuccessCloseMessageBox(){
    CloseSaveSuccessAppointment();
  }
  buildPatientForm() {
    this.NewPatientForm = this.fb.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      ProviderId: ['new provider'],
      DateofBirth: ['', Validators.required],
      Gender: ['', Validators.required,],
      CellPhone: ['', Validators.required],
      Homephone: [''],
      Email: ['', Validators.required],
      Address: ['']
    });

  }

  ngOnInit(): void {
    this.buildPatientForm();
    this.PatientAppointment = {};
    this.SelectedLocationId = this.authService.userValue.CurrentLocation;
    this.SelectedProviderId = this.authService.userValue.ProviderId;
    this.PatientAppointment.ProviderId = this.SelectedProviderId;
    this.PatientAppointment.LocationId = this.SelectedLocationId;
    this.PatientAppointment.Duration = 30;
    this.selectedAppointmentDate = new Date();
    //this.selectedAppointmentDateString = this.selectedAppointmentDate.toLocaleDateString('en-us', 'MMMM dd yyyy');
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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
      this.loadDefaults();
  }
  ClearTimeSlots() {
    this.AvaliableTimeSlots = [];
  }
  selectedCalendarDate(event) {
    this.selectedAppointmentDate = event.value;
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    this.filterAppointments();
  }

  viewAppointment(patientapp) {
    this.appointmentTitle = "Edit Appointment";
    this.ClearPatientAppointment();
    this.PatientAppointment = patientapp;
    console.log(JSON.stringify(this.PatientAppointment))
    this.LoadAvailableTimeSlots();

  }

  cancelAppointment(appointmentId: string){
    this.appointmentId = appointmentId;
  }
  confirmIsCancelledAppointment(){
    this.appointmentId = null;
  }
  confirmAppointment(){
    if(this.appointmentId != null){
      this.smartSchedulerService.ConfirmAppointmentCancellation({AppointmentId:this.appointmentId})
      .subscribe(resp => {
        if (resp.IsSuccess) {
          //CloseAppointment();
          this.appointmentId = null;
          this.OperationMessage = resp.EndUserMessage;
          this.ClearPatientAppointment();
          OpenSaveSuccessAppointment();
        }
        else {
          //this.SaveInputDisable = false;
          this.OperationMessage = "Appointment is not saved"
        }
      });
    }
  }

  onProviderChange(){
    console.log(this.SelectedProviderId)
    this.filterAppointments();
  }
  openExistingAppointment() {
    this.existingappointment = "block";
  }
  closeExistingAppointment() {
    this.ClearPatientAppointment();
    this.messageToShowTimeSlots = '';
  }

  closeEditAppointment() {
    this.ClearPatientAppointment();
    this.messageToShowTimeSlots = '';
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  DateUpDown(direction: string) {
    if (direction == "moveup")
      this.selectedAppointmentDate.setDate(this.selectedAppointmentDate.getDate() + 1)
    else
      this.selectedAppointmentDate.setDate(this.selectedAppointmentDate.getDate() - 1)

    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    this.filterAppointments();
  }
  UpdatePatient() {
    console.log(JSON.stringify(this.PatientData));
    this.utilityService.CreateNewPatient(this.PatientData).subscribe(resp => {
      if (resp.IsSuccess) {

      }
      else {

      }
    });
  }

  ClearEmailWhenPatientHasNoEmail(event) {
    this.PatientData.Email = "";
  }
  openPopupAddress() {
    this.displayAddress = "block";
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }
  UseValidatedAddress() {
    this.closePopupAddress();
    this.PatientData.Address = this.PatientData.ValidatedAddress;
  }
  VerifyPatientAddress() {
    console.log(this.PatientData.Address);
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      console.log(resp.Result)
      if (resp.IsSuccess) {
        this.PatientData.ValidatedAddress = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"];
        this.ValidAddressForUse = this.PatientData.ValidatedAddress;
        this.addressMessage = resp.EndUserMessage;
        this.openPopupAddress();
        this.displayAddressDialog = false;
      }
      else {
        this.displayAddressDialog = true;
        this.openPopupAddress();
        this.addressMessage = resp.EndUserMessage;
      }
    });
  }
}
