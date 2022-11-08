import { filter } from 'rxjs/operators';

import {
  Component,
} from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientPortalUser } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';

@Component({
  selector: 'patient-portal-account-dialog',
  templateUrl: './patient.portal.account.dialog.component.html',
  styleUrls: ['./patient.portal.account.dialog.component.scss'],
})
export class PatientPortalAccountComponent {
  patientUser: PatientPortalUser = { PatientHasNoEmail: true };
  emailVerfied?: boolean = null;
  emailVerficationMessage?: string;
  emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;
  constructor(private dialogRef: EHROverlayRef, private accountservice: Accountservice,) {
    this.patientUser = dialogRef.data as PatientPortalUser;
    if (this.patientUser == null) this.patientUser = new PatientPortalUser()
    this.patientUser.Username
  }
  cancel() {
    this.dialogRef.close();
  }
  createPatientInvoked: boolean = false;
  createPatientAccount() {
    this.createPatientInvoked = true;
    if(this.checkValidEmail())
    this.dialogRef.close(this.patientUser);
  }

  checkEmailExistance() {
    if (this.emailPattern.test(this.patientUser.Email))
      this.accountservice.CheckEmailAvailablity({ Email: this.patientUser.Email }).subscribe((resp) => {
        this.emailVerfied = resp.IsSuccess;
        this.emailVerficationMessage = resp.EndUserMessage
      })
    else this.emailVerfied = null;
  }

  checkValidEmail(){
    if(!this.emailPattern.test(this.patientUser.Email)){
      this.patientUser.Email = `no_email@${this.patientUser.Username.toLowerCase()}.com`;
      this.patientUser.PatientHasNoEmail = true;
    }else this.patientUser.PatientHasNoEmail = false;
    return true;
  }

}
