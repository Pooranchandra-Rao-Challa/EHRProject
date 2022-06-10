

import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';
import { MatSelectionListChange } from '@angular/material/list'
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, map } from 'rxjs/operators';

import { OverlayService } from '../../overlay.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { UtilityService } from './../../_services/utiltiy.service';
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { PatientDialogComponent } from '../../dialogs/patient.dialog.component';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { UpcomingAppointmentsDialogComponent } from '../../dialogs/upcoming.appointments.dialog/upcoming.appointments.dialog.component';
import { EncounterDialogComponent } from '../../dialogs/encounter.dialog/encounter.dialog.component';

import {
  PatientSearchResults, Actions,
  ScheduledAppointment, AppointmentTypes, NewAppointment,
  UserLocations, Room, AvailableTimeSlot, AppointmentDialogInfo
} from 'src/app/_models/_provider/smart.scheduler.data';

declare const CloseAppointment: any;
declare const OpenSaveSuccessAppointment: any;
declare const CloseSaveSuccessAppointment: any;

export interface PeriodicElement {
  Height: string;
  Weight: string;
  BMI: string;
  BP: string;
  Temperature: string;
  Pulse: string;
  Respiratory_rate: string;
  O2_Saturation: string;
  Blood_type: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Height: '1', Weight: 'Hydrogen', BMI: '1.0079', BP: 'H', Temperature: '1', Pulse: 'Hydrogen', Respiratory_rate: '1.0079', O2_Saturation: 'H', Blood_type: 'gsdb' },
  { Height: '2', Weight: 'Helium', BMI: '4.0026', BP: 'He', Temperature: '2', Pulse: 'Helium', Respiratory_rate: '4.0026', O2_Saturation: 'He', Blood_type: 'shdb' },
];
@Component({
  selector: 'app-smart.schedule',
  templateUrl: './smart.schedule.component.html',
  styleUrls: ['./smart.schedule.component.scss']
})
export class SmartScheduleComponent implements OnInit {
  selectedAppointmentDate: Date;
  selectedWeekday: any;
  selectedAppointmentDateString: string;
  existingappointment: string = "none";
  availableTimeSlots: any[] = [];
  encounterdiagnosesColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX"];
  procedureColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "TOOTH", "SURFACE"];
  vitalsColumns = ["Height", "Weight", "BMI", "BP", "Temperature", "Pulse", "Respiratory_rate", "O2_Saturation", "Blood_type", "actions"];
  EncounterData = "";
  bloodType = [
    { Id: 1, BloodType: 'Group A' },
    { Id: 2, BloodType: 'Group B' },
    { Id: 3, BloodType: 'Group AB' },
    { Id: 4, BloodType: 'Group O' }
  ]
  VitalsData = ELEMENT_DATA;
  NewPatientForm: FormGroup;
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
  SaveInputDisable: boolean;
  OperationMessage: string;
  appointmentTitle: string;
  appointmentId: string;
  locationsubscription: Subscription
  onError: boolean;
  private searchTerms = new Subject<string>();
  ActionsType = Actions

  patientDialogComponent = PatientDialogComponent;
  patientDialogResponse = null;
  appointmentDialogComponent = NewAppointmentDialogComponent;
  appointmentDialogResponse = null;
  upcomingAppointmentsDialogComponent = UpcomingAppointmentsDialogComponent;
  upcomingAppointmentDialogResponse = null;
  encounterDialogComponent = EncounterDialogComponent;
  encounterDialogResponse = null;
  //Auto Search Paramters
  public patients: PatientSearchResults[];
  private patientSearchTerms = new Subject<string>();
  public patientNameOrCellNumber = '';
  public flag: boolean = true;
  public selectedPatient: PatientSearchResults;
  // End of Auto SerachParamters


  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private smartSchedulerService: SmartSchedulerService,
    private locationSelectService: LocationSelectService,

    public overlayService: OverlayService

  ) {

    this.onError = false;

    this.patientSearchTerms
      .pipe(debounceTime(300),  // wait for 300ms pause in events
        distinctUntilChanged())   // ignore if next search term is same as previous
      .subscribe((term) =>
        this.smartSchedulerService
          .SearchPatients({
            ProviderId: this.SelectedProviderId,
            ClinicId: this.authService.userValue.ClinicId,
            SearchTerm: term
          })
          .subscribe(resp => {
            //console.log(this.authService.userValue.ClinicId)
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
                'diplay': 'block',
                'border': '1px #41b6a6 solid'
              };
            } else { this.flag = false; this.psw = {}; }
          })
      );
    this.locationsubscription = this.locationSelectService.getData().subscribe(locationId => {
      this.SelectedLocationId = locationId;
      this.LoadAppointmentDefalts();
    });
  }



  PatinetActions(patient: PatientSearchResults) {
    if (patient.NumberOfAppointments == 0) return Actions.new;
    else return Actions.upcomming;
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {

    this.flag = false;
    this.patientNameOrCellNumber = "";
    let dialogData: any;
    if (content === this.appointmentDialogComponent && action == Actions.new){
      dialogData = this.PatientAppointmentInfoFromSearch(data,action);
    }else if(content === this.appointmentDialogComponent && action == Actions.view){
      dialogData = this.PatientAppointmentInfo(data,action);
    }    else  if (content === this.upcomingAppointmentsDialogComponent){
      dialogData = this.PatientAppointmentInfoFromSearch(data,action);
    } else if(content === this.encounterDialogComponent){
      dialogData = data;

    }

    const ref = this.overlayService.open(content, dialogData);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {

      }
      else if (content === this.patientDialogComponent) {
        this.patientDialogResponse = res.data;
      }
      else if (content === this.appointmentDialogComponent) {
        this.appointmentDialogResponse = res.data;
        this.flag = false;
        this.patientNameOrCellNumber = "";
      }
      else if (content === this.upcomingAppointmentsDialogComponent) {
        this.appointmentDialogResponse = res.data;
        this.flag = false;
        this.patientNameOrCellNumber = "";
      }else if(content == this.encounterDialogComponent){
        this.encounterDialogResponse = res.data;

      }
    });


  }
  PatientAppointmentInfo(appointment: NewAppointment, action?: Actions) {
    let data = {} as AppointmentDialogInfo;
    this.PatientAppointment = {} as NewAppointment;
    this.PatientAppointment.PatientId = appointment.PatientId;
    this.PatientAppointment.PatientName = appointment.PatientName;
    this.PatientAppointment.LocationId = this.SelectedLocationId;
    this.PatientAppointment.ProviderId = this.SelectedProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;
    this.appointmentTitle = "Edit Appointment";
    data.Title = this.appointmentTitle;
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = this.SelectedProviderId;
    data.LocationId = this.SelectedLocationId;
    data.PatientAppointment = this.PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;
    data.PatientAppointment.AppointmentId = appointment.AppointmentId
    data.PatientAppointment.Startat = appointment.Startat
    data.PatientAppointment.AppointmentStatusId = appointment.AppointmentStatusId;
    data.PatientAppointment.AppointmentTypeId = appointment.AppointmentTypeId;
    data.PatientAppointment.RoomId = appointment.RoomId;
    data.PatientAppointment.Notes = appointment.Notes;
    data.status = action;
    return data;
  }
  PatientAppointmentInfoFromSearch(PatientObj: PatientSearchResults, action?: Actions) {
    let data = {} as AppointmentDialogInfo
    this.PatientAppointment = {} as NewAppointment;

    this.selectedPatient = PatientObj as PatientSearchResults;
    if (this.selectedPatient.NumberOfAppointments == 0) {
      this.appointmentTitle = "Add New Appointment";
      data.status = action;
    } else {
      this.PatientAppointments(PatientObj)
      this.appointmentTitle = "Edit Appointment";
      data.AppointmentsOfPatient = this.AppointmentsOfPatient;
      data.status = action
    }

    this.PatientAppointment.PatientId = this.selectedPatient.PatientId;
    this.PatientAppointment.PatientName = this.selectedPatient.Name;
    this.PatientAppointment.LocationId = this.SelectedLocationId;
    this.PatientAppointment.ProviderId = this.SelectedProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;

    data.Title = this.appointmentTitle;
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = this.SelectedProviderId;
    data.LocationId = this.SelectedLocationId;
    data.PatientAppointment = this.PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;

    return data;
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
  filterAppointments() {
    let req = {
      "ClinicId": this.authService.userValue.ClinicId,
      "ProviderId": this.SelectedProviderId,
      "LocationId": this.authService.userValue.CurrentLocation,
      "AppointmentDate": this.selectedAppointmentDate
    };

    this.smartSchedulerService.ActiveAppointments(req).subscribe(resp => {

      if (resp.IsSuccess) {
        console.log(resp.ListResult)
        this.Appointments = resp.ListResult as ScheduledAppointment[];
        this.NoofAppointment = this.Appointments.length;
        console.log(JSON.stringify(this.Appointments));
        console.log(this.Appointments[0].IsCurrent);

      } else {
        this.NoofAppointment = 0;
        this.Appointments = [];
      }

    });
  }

  searchPatient(term: string): void {
    this.flag = true;
    this.patientSearchTerms.next(term);
  }


  PatientAppointments(PatientObj) {
    let req = {
      "PatientId": PatientObj.PatientId
    };

    this.smartSchedulerService.ActiveAppointments(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.confirmIsCancelledAppointment();
        this.AppointmentsOfPatient = resp.ListResult as ScheduledAppointment[];
        return this.AppointmentsOfPatient;
      }
    });
  }

  onAppointmentSave() {
    this.PatientAppointment.AppointmentTime = this.PatientAppointment.TimeSlot.StartDateTime;

    this.SaveInputDisable = true;
    this.smartSchedulerService.CreateAppointment(this.PatientAppointment).subscribe(resp => {
      if (resp.IsSuccess) {
        this.onError = false;
        CloseAppointment();
        this.OperationMessage = resp.EndUserMessage;
        OpenSaveSuccessAppointment();
      }
      else {
        this.onError = true;
        this.OperationMessage = "Appointment is not saved"
        OpenSaveSuccessAppointment();
      }
    });
  }

  onSuccessCloseMessageBox() {
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
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    this.loadDefaults();
    this.LoadAppointmentDefalts();
  }
  selectedCalendarDate(event) {
    this.selectedAppointmentDate = event.value;
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    this.filterAppointments();
  }

  cancelAppointment(appointmentId: string) {
    this.appointmentId = appointmentId;
  }
  confirmIsCancelledAppointment() {
    this.appointmentId = null;
  }
  confirmAppointment() {
    if (this.appointmentId != null) {
      this.smartSchedulerService.ConfirmAppointmentCancellation({ AppointmentId: this.appointmentId })
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.appointmentId = null;
            this.OperationMessage = resp.EndUserMessage;
            //this.ClearPatientAppointment();
            OpenSaveSuccessAppointment();
          }
          else {
            //this.SaveInputDisable = false;
            this.OperationMessage = "Appointment is not saved"
          }
        });
    }
  }

  onProviderChange() {
    this.LoadAppointmentDefalts();
    this.filterAppointments();
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

    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    this.filterAppointments();
  }

  updateAppointmentStatus(appointmentId: string,status: string)
  {
    console.log("appointmentId: "+appointmentId,", status: "+status);

  }
  showAssociateVitals: boolean = true;
  displayVitalsDialog(event) {
    debugger;
    if (event == true) {
      this.showAssociateVitals = true;
    }
    else {
      this.showAssociateVitals = false;
    }
  }

}
