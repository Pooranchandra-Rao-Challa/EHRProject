import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, AppointmentDialogInfo, AppointmentTypes, NewAppointment, PracticeProviders, Room, User, UserLocations } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NewAppointmentDialogComponent } from '../newappointment.dialog/newappointment.dialog.component';

@Component({
  selector: 'app-appointments.table.dialog',
  templateUrl: './appointments.table.dialog.component.html',
  styleUrls: ['./appointments.table.dialog.component.scss']
})
export class AppointmentsTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public patientAppointments = new MatTableDataSource<NewAppointment>();
  appointmentColumns: string[] = ['StartAt', 'ApptStatus'];
  ActionTypes = Actions;
  newAppointmentDialogComponent = NewAppointmentDialogComponent;
  currentPatient: ProviderPatient;
  PracticeProviders: PracticeProviders[];
  AppointmentTypes: AppointmentTypes[];
  Locations: UserLocations[];
  Rooms: Room[];
  user: User;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private overlayService: OverlayService) {
      this.user = authService.userValue;
      this.updateLocalModel(ref.RequestData);
     }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
  }

  ngAfterViewInit(): void {
    this.patientAppointments.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: NewAppointment) {
    this.patientAppointments.data = [];
    if (data == null) return;
    this.patientAppointments.data = data as NewAppointment[];
    console.log(this.patientAppointments.data);

  }

  cancel(){
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.new && content === this.newAppointmentDialogComponent) {
      reqdata = this.PatientAppointmentInfoForNew(action);
    } else if (action == Actions.view && content === this.newAppointmentDialogComponent) {
      reqdata = this.PatientAppointmentInfoForView(dialogData, action);
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if(res.data != null){
        this.ref.close(res.data);
      }
    });
  }

  PatientAppointmentInfoForNew(action: Actions) {

    let data = {} as AppointmentDialogInfo;
    let PatientAppointment: NewAppointment = {};
    PatientAppointment.PatientId = this.currentPatient.PatientId;
    PatientAppointment.PatientName = this.currentPatient.FirstName + ' ' + this.currentPatient.LastName;
    PatientAppointment.LocationId = this.authService.userValue.CurrentLocation;
    PatientAppointment.ProviderId = this.currentPatient.ProviderId;
    PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    PatientAppointment.Duration = 30;
    data.Title = "New Appointment";
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = this.currentPatient.ProviderId;
    data.LocationId = this.authService.userValue.CurrentLocation;
    data.PatientAppointment = PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;
    data.status = action;
    return data;
  }

  PatientAppointmentInfoForView(appointment: any, action?: Actions) {
    let data = {} as AppointmentDialogInfo;
    let PatientAppointment: NewAppointment = {};

    PatientAppointment = {} as NewAppointment;
    PatientAppointment.PatientId = appointment.PatientId;
    PatientAppointment.PatientName = appointment.PatientName;
    PatientAppointment.LocationId = appointment.LocationId;
    PatientAppointment.ProviderId = appointment.ProviderId;
    PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    PatientAppointment.AppointmentId = appointment.AppointmentId;
    PatientAppointment.AppointmentStatusId = appointment.ApptStatusId;
    PatientAppointment.AppointmentTypeId = appointment.ApptTypeId;
    PatientAppointment.LocationId = appointment.LocationId;
    PatientAppointment.RoomId = appointment.RoomId;
    PatientAppointment.Notes = appointment.Note;
    PatientAppointment.Duration = 30;
    PatientAppointment.Notes = appointment.Note;
    PatientAppointment.Startat = appointment.StartAt
    data.Title = "Edit Appointment";
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = appointment.ProviderId;
    data.LocationId = appointment.LocationId;
    data.PatientAppointment = PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;
    data.status = action;

    return data;
  }
}
