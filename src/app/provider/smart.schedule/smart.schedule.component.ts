import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';
import { of,  Subscription } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { OverlayService } from 'src/app/overlay.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { PatientDialogComponent } from 'src/app/dialogs/patient.dialog/patient.dialog.component';
import {
  LocationSelectService,
  ViewChangeService
} from '../../_navigations/provider.layout/view.notification.service';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { UpcomingAppointmentsDialogComponent } from '../../dialogs/upcoming.appointments.dialog/upcoming.appointments.dialog.component';
import { EncounterDialogComponent } from '../../dialogs/encounter.dialog/encounter.dialog.component';
import { CompleteAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/complete.appointment.component';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage'
import * as moment from "moment";

import {
   Actions,
  ScheduledAppointment, AppointmentTypes, NewAppointment,
  UserLocations, Room,  AppointmentDialogInfo
} from 'src/app/_models/';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { Router } from '@angular/router';
import { LockedComponent } from 'src/app/dialogs/locked/locked.component';
import { MatExpansionPanel } from '@angular/material/expansion';


@Component({
  selector: 'app-smart.schedule',
  templateUrl: './smart.schedule.component.html',
  styleUrls: ['./smart.schedule.component.scss']
})
export class SmartScheduleComponent implements OnInit {
  selectedAppointmentDate: Date;
  selectedWeekday: any;
  selectedAppointmentDateString: string;
  PracticeProviders: PracticeProviders[];
  Appointments: ScheduledAppointment[];
  NoofAppointment: Number;
  SelectedProviderId: string = "";
  SelectedLocationId: string;
  psw: {};
  AppointmentTypes: AppointmentTypes[]
  PatientAppointment: NewAppointment;
  AppointmentsOfPatient: NewAppointment[];
  Locations: UserLocations[];
  Rooms: Room[];
  SaveInputDisable: boolean;
  OperationMessage: string;
  appointmentTitle: string;
  locationsubscription: Subscription;
  ActionsType = Actions
  lockedComponent = LockedComponent;
  patientDialogComponent = PatientDialogComponent;
  appointmentDialogComponent = NewAppointmentDialogComponent;
  upcomingAppointmentsDialogComponent = UpcomingAppointmentsDialogComponent;
  encounterDialogComponent = EncounterDialogComponent;
  completeAppointmentDialogComponent = CompleteAppointmentDialogComponent;
  @ViewChild('panel1',{static:true}) panel1: MatExpansionPanel;
  @ViewChild('panel2',{static:true}) panel2: MatExpansionPanel;

  togglePanel: number = 0;
  togglePanel2: number = 0
  hasActiveAppointments: boolean = false;
  hasFinishedAppointments:boolean = false;


  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private locationSelectService: LocationSelectService,
    private alertMessage: AlertMessage,
    private overlayService: OverlayService,
    private router: Router,
    private viewChangeService: ViewChangeService
  ) {
    if(this.authService.userValue.UserLocked){
      this.openLockComponentDialog(this.lockedComponent, this.authService.userValue, this.ActionsType.view);
    }

    this.locationsubscription = this.locationSelectService.getData().subscribe(locationId => {
      this.SelectedLocationId = locationId;
      this.LoadAppointmentDefalts();
      this.filterAppointments();
    });
  }

  AppointmentToggleView(){
    this.togglePanel = this.togglePanel == 0 ? 1 : 0;
    this.togglePanel2 = this.togglePanel2 == 1 ? 0 : 1;
  }


  onPatientSelection(appoinment: ScheduledAppointment) {


    this.smartSchedulerService.FilteredPatientsOfProvider({
      "PatientId": appoinment.PatientId,
      "PageIndex": 0,
      "PageSize": 10,
      "SortField": "",
      "SortDirection": "Asc"
    }).pipe(
      catchError(() => of([])),
    )
      .subscribe(resp => {
        if (resp.IsSuccess) {
          let p = (resp.ListResult as ProviderPatient[])[0];
          this.authService.SetViewParam("Patient", p);
          this.authService.SetViewParam("PatientView", "Chart");
          this.authService.SetViewParam("View", "Patients");
          this.viewChangeService.sendData("Patients");
          this.router.navigate(["/provider/patientdetails"]);
        }
      });
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions, status: string = "") {

    let dialogData: any;

    if (content === this.appointmentDialogComponent && action == Actions.view) {
      dialogData = this.PatientAppointmentInfo(data, action);
    }
    else if (content === this.encounterDialogComponent) {
      dialogData = data;
    } else if (content === this.completeAppointmentDialogComponent) {
      let d = data as ScheduledAppointment;
      d.StatusToUpdate = status;
      dialogData = d;
    }

    const ref = this.overlayService.open(content, dialogData);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {

      }
      else if (content === this.appointmentDialogComponent) {
        if (res.data && res.data.refresh) {
          this.filterAppointments();
        }
      }
      else if (content == this.encounterDialogComponent) {
        if (res.data != null && res.data.saved) {
          this.filterAppointments();
        }
      }
      else if (content == this.completeAppointmentDialogComponent) {
        if (res.data != null && res.data.confirmed) {
          this.updateAppointmentStatus(res.data.appointment);
        }
      }
    });


  }

  PatientAppointmentInfo(appointment: NewAppointment, action?: Actions) {
    let data = {} as AppointmentDialogInfo;

    this.PatientAppointment = {} as NewAppointment;
    this.PatientAppointment.PatientId = appointment.PatientId;
    this.PatientAppointment.PatientName = appointment.PatientName;
    this.PatientAppointment.LocationId = appointment.LocationId;
    this.PatientAppointment.ProviderId = appointment.ProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;
    this.appointmentTitle = "Edit Appointment";
    data.Title = this.appointmentTitle;
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = appointment.ProviderId;
    data.LocationId = appointment.LocationId;
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
    data.PatientAppointment.Duration = appointment.Duration;
    data.status = action;
    return data;
  }

  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
    let preq = { "ProviderId": this.authService.userValue.ProviderId };
    this.smartSchedulerService.AppointmentTypes(preq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AppointmentTypes = resp.ListResult as AppointmentTypes[];
      }
    });

    this.filterAppointments();
  }

  LoadAppointmentDefalts() {
    this.SaveInputDisable = false;
    if (this.SelectedProviderId == this.authService.userValue.ProviderId ||
      this.SelectedProviderId == "")
      this.Locations = JSON.parse(this.authService.userValue.LocationInfo);
    else {
      this.smartSchedulerService.ProviderPracticeLocations({"ProviderId":this.SelectedProviderId})
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.Locations = resp.ListResult as UserLocations[];          }
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

  RefreshAppointments(event){
    if(event) this.filterAppointments();
  }
  dialogIsLoading: boolean =false;
  filterAppointments() {
    this.dialogIsLoading = true;
    let req = {
      "ClinicId": this.authService.userValue.ClinicId,
      "ProviderId": this.SelectedProviderId,
      "LocationId": this.SelectedLocationId,
      "AppointmentDate": moment.utc(this.selectedAppointmentDate).toISOString()
    };

    this.smartSchedulerService.ActiveAppointments(req).subscribe(resp => {
      this.dialogIsLoading = false;
      if (resp.IsSuccess) {
        this.Appointments = resp.ListResult as ScheduledAppointment[];
        this.NoofAppointment = this.Appointments.length;
        this.hasActiveAppointments = this.Appointments.filter(fn => fn.IsCurrent).length > 0
        this.hasFinishedAppointments = this.Appointments.filter(fn => fn.IsPast).length > 0
      } else {
        this.NoofAppointment = 0;
        this.Appointments = [];
      }

    });
  }

  ngOnInit(): void {
    this.PatientAppointment = {};
    this.SelectedLocationId = this.authService.userValue.CurrentLocation;
    this.PatientAppointment.ProviderId = this.authService.userValue.ProviderId;
    this.PatientAppointment.LocationId = this.SelectedLocationId;
    //this.SelectedProviderId = this.authService.userValue.ProviderId;
    this.PatientAppointment.Duration = 30;
    this.selectedAppointmentDate = new Date();
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    this.loadDefaults();
    this.LoadAppointmentDefalts();
  }
  selectedCalendarDate(event) {
    this.selectedAppointmentDate = event.value;
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    this.filterAppointments();
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

  updateAppointmentStatusDirect(appointment: ScheduledAppointment,StatusToUpdate: string){
    appointment.StatusToUpdate = StatusToUpdate;
    this.updateAppointmentStatus(appointment);
  }

  updateAppointmentStatus(appointment: ScheduledAppointment) {
    if (appointment.Status != appointment.StatusToUpdate) {
      this.smartSchedulerService.UpdateAppointmentStatus(appointment).subscribe(resp => {
        if (resp.IsSuccess) {
          this.filterAppointments();
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

  openLockComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionsType.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.lockedComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {

    });
  }

    // Access Permissions

    get CanViewEncounter(): boolean{
      var permissions = this.authService.permissions();
      if(!permissions) return false;
      var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
      if(providerpermissions && providerpermissions.length == 1) return true;
      var temp = permissions.filter(fn => fn.PolicyName == "EncounterPolicy" && fn.MethodName == "show")
      if(temp.length == 0) return false;
      return temp[0].Allowed;
    }

}


