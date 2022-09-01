import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Actions } from 'src/app/_models';
import { Authorizedrepresentative } from 'src/app/_models/authorizedrepresentative';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-addauthorizedrepresentative.dialog',
  templateUrl: './addauthorizedrepresentative.dialog.component.html',
  styleUrls: ['./addauthorizedrepresentative.dialog.component.scss']
})
export class AddauthorizedrepresentativeDialogComponent implements OnInit {
  currentPatient: ProviderPatient;
  authorizedRepresentative :Authorizedrepresentative = new Authorizedrepresentative();
  PhonePattern: any
  constructor(private ref:EHROverlayRef,private authService: AuthenticationService,private patientservice: PatientService,
    private alertmsg: AlertMessage,) { 
    this.PhonePattern = {
      0: {
        pattern:   new RegExp('\\d'),
        symbol: 'X',
      },
    };
  }
 
  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
  }
  cancel() {
    
    this.ref.close(null);
  
}
CreateAuthorizedRepresentative()
{
this.authorizedRepresentative.PatientId = this.currentPatient.PatientId;
this.patientservice.CreateAuthorizedRepresentative(this.authorizedRepresentative).subscribe((resp) => {
  if (resp.IsSuccess) {
    
    this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP0011"]);
    this.cancel();
  }
  else {
     this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP0010"]);
  }
})
}
enableSave()
{
  return !(this.authorizedRepresentative.FirstName != null && this.authorizedRepresentative.FirstName != ""
      && this.authorizedRepresentative.LastName != null && this.authorizedRepresentative.LastName != ""
      && this.authorizedRepresentative.Email != null && this.authorizedRepresentative.Email != ""
      && this.authorizedRepresentative.Active!=null) 
}
}
