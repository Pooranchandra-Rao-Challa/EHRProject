import { PatientPortalUser } from './../../_models/_account/newPatient';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PatientService } from 'src/app/_services/patient.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { BehaviorSubject } from 'rxjs-compat';
import { PatientRelationShip, PATIENT_RELATIONSHIP } from 'src/app/_models/_provider/patientRelationship';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientChart, PatientWithRelationInfo } from 'src/app/_models';

@Component({
  selector: 'app-patient.relationship.dialog',
  templateUrl: './patient.relationship.dialog.component.html',
  styleUrls: ['./patient.relationship.dialog.component.scss']
})
export class PatientRelationshipDialogComponent implements OnInit {
  selectedPatient: PatientPortalUser;
  selectedPatientInRelation: PatientRelationShip;
  // patientRelationList: PatientRelationShip[] = [];
  // patientRelationListSubject = new BehaviorSubject<PatientRelationShip[]>([]);
  relationship: { Id: string, value: string }[] = PATIENT_RELATIONSHIP;

  constructor(private authService: AuthenticationService,
    private ref: EHROverlayRef,
    private patientService: PatientService,
    private alertmsg: AlertMessage) {
    this.selectedPatientInRelation = (ref.RequestData as PatientWithRelationInfo).patientRelation;
    this.selectedPatient = (ref.RequestData as PatientWithRelationInfo).patientUser;
  }

  ngOnInit(): void {
  }



  cancel() {
    this.ref.close(null);
  }

  savePatientRelation() {
    let reqParams = {
      "PatientId": this.selectedPatient.PatientId,
      "PatientRelationShipId": this.selectedPatientInRelation.RelationPatientId,
      "RelationShip": this.selectedPatientInRelation.RelationShip
    }
    this.patientService.AssignPatientRelationShip(reqParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({
          "Refresh": true,
          "PatientRelation": this.selectedPatientInRelation
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2PPR001"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2PPR002"]);
        this.cancel();
      }
    });

  }

}
