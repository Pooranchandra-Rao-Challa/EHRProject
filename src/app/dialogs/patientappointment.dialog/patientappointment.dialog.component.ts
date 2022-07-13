import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from '../../_models';
import { PatientService } from '../../_services/patient.service'
@Component({
  selector: 'app-patientappointment.dialog',
  templateUrl: './patientappointment.dialog.component.html',
  styleUrls: ['./patientappointment.dialog.component.scss']
})
export class PatientappointmentDialogComponent implements OnInit {
  user: User;
  displayReq = "none";
  hoverDATE:string='Date';
  hoverTime:string='Date';
  Providerdata: any;
  clinicaldata: any;
  constructor(private ref: EHROverlayRef,private patientservise: PatientService,private authenticationService: AuthenticationService) {
    this.user = authenticationService.userValue
   }

  ngOnInit(): void {
    this.getProviders();
    this.getLocations();
  }
  cancel() {
    this.ref.close(null);
  }

  getLocations() {
    var req={
      "ClinicId": this.user.ClinicId,
    }
    this.patientservise.PatientLocations(req).subscribe(req => {
        this.clinicaldata = req.ListResult;
    })
  }
  getProviders() {
    var req={
      "ClinicId": this.user.ClinicId,
    }
    this.patientservise.PatientProviders(req).subscribe(req => {
        this.Providerdata = req.ListResult;
    })
  }
}
