import { Observable } from 'rxjs';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AvailableTimeSlot, NewAppointment,Actions,
        AppointmentDialogInfo, PatientSearchResults,
        ScheduledAppointment, UserLocations } from 'src/app/_models';
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
  appointmentId: string;
  data: AppointmentDialogInfo
  newAppointmentDialogComponent = NewAppointmentDialogComponent;
  appointmentDialogResponse: any;
  dialogIsLoading: boolean = false;
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
      this.dialogIsLoading = true;
      if (resp.IsSuccess) {
        this.AppointmentsOfPatient = resp.ListResult as ScheduledAppointment[];
        this.dialogIsLoading = false;
      }
    });
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
      this.data.PatientAppointment.RoomId = patientapp.RoomId;
    }
    else {
      this.data.status = Actions.new;
      this.data.Title = "Add New Appointment";
    }
    this.openComponentDialog(content);
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string ) {
    const ref = this.overlayService.open(content,this.data );
    ref.afterClosed$.subscribe(res => {
       if (content === this.newAppointmentDialogComponent) {
        if(res.data && res.data.saved){
          this.ref.close({'saved':true});
        } else if(res.data && res.data.closed){
          this.ref.close({'closed':true});
        }
      }
    });


  }
}
