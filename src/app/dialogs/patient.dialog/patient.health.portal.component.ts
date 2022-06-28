import {
  Component,
} from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientPortalUser } from 'src/app/_models/_account/NewPatient';

@Component({
  selector: 'patient-health-portal-dialog',
  templateUrl: './patient.health.portal.component.html',
  styleUrls: ['./patient.health.portal.component.scss'],
})
export class PatientHealthPortalComponent{

  patientUser: PatientPortalUser;
  constructor(private dialogRef: EHROverlayRef,){
    this.patientUser = dialogRef.data //as PatientPortalUser;
    if(this.patientUser ==null) this.patientUser =  {}//new PatientPortalUser()
    this.patientUser.Username
  }
  cancel(){
    this.dialogRef.close();
  }

  downloadInviteasPDF(){
    this.dialogRef.close({'download':true,patientUser: this.patientUser });
  }

  sendInviteToEmailAddress(){
    this.dialogRef.close({'sendemail':true,patientUser: this.patientUser });
  }
}
