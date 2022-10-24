import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions } from 'src/app/_models';
import { Authorizedrepresentative } from 'src/app/_models/authorizedrepresentative';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AddauthorizedrepresentativeDialogComponent } from '../addauthorizedrepresentative.dialog/addauthorizedrepresentative.dialog.component';

@Component({
  selector: 'app-authorizedrepresentative.dialog',
  templateUrl: './authorizedrepresentative.dialog.component.html',
  styleUrls: ['./authorizedrepresentative.dialog.component.scss']
})
export class AuthorizedrepresentativeDialogComponent implements OnInit {
  ActionTypes = Actions;
  addauthorizedRepresentativeDialogComponent = AddauthorizedrepresentativeDialogComponent;
  currentPatient: ProviderPatient;
  athorizedRepresentatives: Authorizedrepresentative[] = [];
  constructor(private ref:EHROverlayRef, public overlayService: OverlayService,private authService: AuthenticationService,
    private patientservice: PatientService,) {
      this.currentPatient = this.authService.viewModel.Patient;
      // this.getauthorizedrepresentatives();
    }

  ngOnInit(): void {
    this.getauthorizedrepresentatives();
  }
  cancel() {

      this.ref.close(null);

}
openComponentDialog(content: any | ComponentType<any> | string,
  dialogData, action: Actions = this.ActionTypes.add) {
  let reqdata: any;
  if (action == Actions.view && content === this.addauthorizedRepresentativeDialogComponent) {
    reqdata = dialogData;
  }

  const ref = this.overlayService.open(content, reqdata);
  ref.afterClosed$.subscribe(res => {

    this.getauthorizedrepresentatives();

  });

}

getauthorizedrepresentatives()
{
  var reqparam = {
    "PatientId": this.currentPatient.PatientId
  }
  this.patientservice.AuthorizedRepresentatives(reqparam).subscribe((resp)=>
  {
    if(resp.IsSuccess)
    {
      this.athorizedRepresentatives = resp.ListResult;
    }

  })
}
}
