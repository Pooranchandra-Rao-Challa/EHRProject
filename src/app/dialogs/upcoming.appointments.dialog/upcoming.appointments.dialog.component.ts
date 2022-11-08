import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NewAppointment,Actions,
        AppointmentDialogInfo,
        ScheduledAppointment, } from 'src/app/_models';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../overlay.service';
import { CompleteAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/complete.appointment.component';


@Component({
  selector: 'app-upcoming.appointments.dialog',
  templateUrl: './upcoming.appointments.dialog.component.html',
  styleUrls: ['./upcoming.appointments.dialog.component.scss']
})
export class UpcomingAppointmentsDialogComponent implements OnInit {
  AppointmentsOfPatient: NewAppointment[];
  appointmentId: string;
  data: AppointmentDialogInfo
  newAppointmentDialogComponent = NewAppointmentDialogComponent;
  completeAppointmentDialogComponent = CompleteAppointmentDialogComponent;
  appointmentDialogResponse: any;
  dialogIsLoading: boolean = true;
  constructor(
    private ref: EHROverlayRef,
    private smartSchedulerService: SmartSchedulerService,
    private alertMessage: AlertMessage,
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
      this.dialogIsLoading = true;
      if (resp.IsSuccess) {
        this.AppointmentsOfPatient = resp.ListResult as ScheduledAppointment[];
        //console.log(this.AppointmentsOfPatient);

        this.dialogIsLoading = false;
      }
    });
  }


  ViewAppointment(content,status,patientapp?:NewAppointment) {
    if(status == 'view') {
      this.data.status = Actions.view;
      this.data.Title = "Edit Appointment";
      this.data.PatientAppointment.AppointmentId = patientapp.AppointmentId
      this.data.PatientAppointment.ProviderId = patientapp.ProviderId
      this.data.PatientAppointment.Startat = patientapp.Startat
      this.data.PatientAppointment.AppointmentStatusId = patientapp.AppointmentStatusId;
      this.data.PatientAppointment.AppointmentTypeId = patientapp.AppointmentTypeId;
      this.data.PatientAppointment.Notes = patientapp.Notes;
      this.data.PatientAppointment.RoomId = patientapp.RoomId;
      this.data.PatientAppointment.Duration = patientapp.Duration;
    }
    else {
      this.data.status = Actions.new;
      this.data.Title = "Add New Appointment";
    }
    this.openComponentDialog(content,this.data);
  }

  cancelAppointment(patientapp: ScheduledAppointment) {
    let data: ScheduledAppointment ={};
    data.StatusToUpdate = "Cancelled";
    data.AppointmentId = patientapp.AppointmentId;
    data.PatientId = patientapp.PatientId;
    data.ClinicId = patientapp.ClinicId;

    this.openComponentDialog(this.completeAppointmentDialogComponent,data,Actions.view)
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string, dialogData, action: Actions = Actions.add ) {

    const ref = this.overlayService.open(content,dialogData );
    ref.afterClosed$.subscribe(res => {
       if (content === this.newAppointmentDialogComponent) {
        if(res.data && res.data.saved){
          this.ref.close({'saved':true});
        } else if(res.data && res.data.closed){
          this.ref.close({'closed':true});
        }else if(res.data && res.data.refresh){
          this.ref.close({'closed':true});
        }
      }
      else if (content == this.completeAppointmentDialogComponent) {
        if (res.data != null && res.data.confirmed) {
          this.updateAppointmentStatus(res.data.appointment);
        }
      }
    });
  }

  updateAppointmentStatus(patientapp: ScheduledAppointment) {
    patientapp.StatusToUpdate = 'Cancelled';
    if (patientapp.Status != patientapp.StatusToUpdate) {
      this.smartSchedulerService.UpdateAppointmentStatus(patientapp).subscribe(resp => {
        if (resp.IsSuccess) {
          this.dialogIsLoading = true;
          this.PatientAppointments(this.data.PatientAppointment.PatientId);
          this.alertMessage.displayMessageDailog(ERROR_CODES["M2JSAT005"]);
        }
        else {
          this.alertMessage.displayErrorDailog(ERROR_CODES["E2JSAT004"]);
        }
      });
    }

  }
}
