import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { User } from 'src/app/_models';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-newmessage.dialog',
  templateUrl: './newmessage.dialog.component.html',
  styleUrls: ['./newmessage.dialog.component.scss']
})
export class NewmessageDialogComponent implements OnInit {

  PatientProfile: PatientProfile;
  user: User;

  constructor(private patientservise: PatientService, private authenticationService: AuthenticationService, private ref: EHROverlayRef) {
    this.user = authenticationService.userValue;
    // console.log(this.user);
  }

  ngOnInit(): void {
    //this.getPatientProfile();
  }

  // getPatientProfile(reqparam?) {
  //   var req={
  //     "PatientId": this.user.PatientId,
  //   }
  //   this.patientservise.PatientProfileByPatientId(req).subscribe(resp => {
  //     debugger;
  //     if (resp.IsSuccess) {
  //       this.PatientProfile=resp.ListResult[0];
  //     }
  //   });
  // }
  cancel() {
    this.ref.close(null);
  }

}
