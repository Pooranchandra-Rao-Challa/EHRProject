import { Component, OnInit, TemplateRef } from '@angular/core';
import { AvailableTimeSlot, NewAppointment,Actions,
        AppointmentDialogInfo, PatientSearchResults,
        ScheduledAppointment, UserLocations } from 'src/app/_models/smart.scheduler.data';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../overlay.service';
import { A } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-upcoming.appointments.dialog',
  templateUrl: './upcoming.appointments.dialog.component.html',
  styleUrls: ['./upcoming.appointments.dialog.component.scss']
})
export class UpcomingAppointmentsDialogComponent implements OnInit {
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
  data: AppointmentDialogInfo
  newAppointmentDialogComponent = NewAppointmentDialogComponent;
  appointmentDialogResponse: any;

  constructor(
    private ref: EHROverlayRef,
    private smartSchedulerService: SmartSchedulerService,
    private overlayService: OverlayService) {
      this.data = ref.RequestData;
      this.PatientAppointments(this.data.PatientAppointment.PatientId)
    }

  ngOnInit(): void {
  }


  close() {
    this.ref.close(null);
  }



  PatientAppointments(PatientId) {
    let req = {
      "PatientId": PatientId
    };

    this.smartSchedulerService.ActiveAppointments(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AppointmentsOfPatient = resp.ListResult as ScheduledAppointment[];
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

  ViewAppointment(content,status,patientapp?:NewAppointment) {
    if(status == 'view') {
      this.data.status = Actions.view;
      this.data.Title = "Edit Appointment";
      this.data.PatientAppointment.AppointmentId = patientapp.AppointmentId
      this.data.PatientAppointment.Startat = patientapp.Startat
      this.data.PatientAppointment.AppointmentStatusId = patientapp.AppointmentStatusId;
      this.data.PatientAppointment.AppointmentTypeId = patientapp.AppointmentTypeId;
      this.data.PatientAppointment.Notes = patientapp.Notes;
    }
    else {
      this.data.status = Actions.new;
      this.data.Title = "Add New Appointment";
    }

    this.ref.close("upcomming dialog closed");
    this.openComponentDialog(content);
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string ) {
    const ref = this.overlayService.open(content,this.data );
    ref.afterClosed$.subscribe(res => {
       if (content === this.newAppointmentDialogComponent) {
        this.appointmentDialogResponse = res.data;
      }

    });


  }
}
