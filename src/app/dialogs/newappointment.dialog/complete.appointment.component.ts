import {
  Component,
} from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ScheduledAppointment } from 'src/app/_models';

@Component({
  selector: 'complete-appointment-dialog',
  templateUrl: './complete.appointment.component.html',
  styleUrls: ['./complete.appointment.component.scss'],
})
export class CompleteAppointmentDialogComponent{
  appointment: ScheduledAppointment;
  constructor(private dialogRef: EHROverlayRef,){
    this.appointment  = dialogRef.data as ScheduledAppointment;
  }
  cancel(){
    this.dialogRef.close({'confirmed':false});
  }
  confirm(){
    this.dialogRef.close({'confirmed':true,'appointment': this.appointment});
  }
}
