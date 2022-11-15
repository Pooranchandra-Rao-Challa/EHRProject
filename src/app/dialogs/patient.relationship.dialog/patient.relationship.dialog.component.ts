import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PatientService } from 'src/app/_services/patient.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { BehaviorSubject } from 'rxjs-compat';
import { PatientRelationShip, PATIENT_RELATIONSHIP } from 'src/app/_models/_provider/patientRelationship';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientChart } from 'src/app/_models';

@Component({
  selector: 'app-patient.relationship.dialog',
  templateUrl: './patient.relationship.dialog.component.html',
  styleUrls: ['./patient.relationship.dialog.component.scss']
})
export class PatientRelationshipDialogComponent implements OnInit {
  selectedPatient: ProviderPatient;
  selectedPatientRelation: PatientRelationShip;
  // patientRelationList: PatientRelationShip[] = [];
  // patientRelationListSubject = new BehaviorSubject<PatientRelationShip[]>([]);
  relationship: { Id: string, value: string }[] = PATIENT_RELATIONSHIP;

  constructor(private authService: AuthenticationService,
    private ref: EHROverlayRef,
    private patientService: PatientService,
    private alertmsg: AlertMessage) {
    this.selectedPatient = this.authService.viewModel.Patient;
    this.updateLocalModel(ref.RequestData);
   }

  ngOnInit(): void {
  }

  updateLocalModel(data: PatientRelationShip) {
    this.selectedPatientRelation = new PatientRelationShip;
    if (data == null) return;
    this.selectedPatientRelation = data;
  }

  cancel() {
    this.ref.close(null);
  }

  // getPatientRelations() {
  //   let reqparam = {
  //     "PatientId": this.selectedPatient.PatientId
  //   }
  //   this.patientService.PatientRelations(reqparam).subscribe(resp => {
  //     if (resp.IsSuccess) {
  //       this.patientRelationList = resp.ListResult;
  //       this.patientRelationListSubject.next(this.patientRelationList);
  //     }
  //   })
  // }

  savePatientRelation() {
    let reqParams = {
      "PatientId": this.selectedPatient.PatientId,
      "PatientRelationShipId": this.selectedPatientRelation.PatientId,
      "RelationShip": this.selectedPatient.RelationShip
    }
    this.patientService.AssignPatientRelationShip(reqParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.PatientRelationship
        });        this.alertmsg.displayMessageDailog(ERROR_CODES["M2PPR001"]);
        // this.getPatientRelations();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2PPR002"]);
      }
    });
    this.cancel();
  }

}
