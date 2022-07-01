
import {
  Component,
} from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientPortalUser } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'patient-portal-account-dialog',
  templateUrl: './patient.portal.account.dialog.component.html',
  styleUrls: ['./patient.portal.account.dialog.component.scss'],
})
export class PatientPortalAccountComponent{
  patientUser:  PatientPortalUser;
  constructor(private dialogRef: EHROverlayRef,){
    this.patientUser = dialogRef.data  as PatientPortalUser;
    if(this.patientUser ==null) this.patientUser =  new PatientPortalUser()
    this.patientUser.Username
  }
  cancel(){
    this.dialogRef.close();
  }
  createPatientAccount(){
    console.log(this.patientUser);

    this.dialogRef.close(this.patientUser);
  }
}
