import { REASON_CODES } from './../../_models/_provider/encounter';
import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { DiscontinueDialogComponent } from '../discontinue.dialog/discontinue.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { Actions, GlobalConstants, Medication, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'app-medication.dialog',
  templateUrl: './medication.dialog.component.html',
  styleUrls: ['./medication.dialog.component.scss']
})
export class MedicationDialogComponent implements OnInit {
  discontinueDialogComponent = DiscontinueDialogComponent;
  ActionTypes = Actions;
  medications: GlobalConstants;
  medicationsFilter: GlobalConstants;
  patientMedication: Medication = new Medication();
  currentPatient: ProviderPatient;

  constructor(public overlayService: OverlayService,
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.medications = GlobalConstants.Medication_Names;
    this.medicationsFilter = this.medications.slice();
    this.currentPatient = this.authService.viewModel.Patient;
  }

  updateLocalModel(data: Medication) {
    this.patientMedication = new Medication;
    if (data == null) return;
    this.patientMedication = data;
  }

  cancel() {
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.discontinueDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      this.patientMedication.ReasonDescription = res.data.ReasonDescription;
    });
  }

  CreateMedication() {
    let isAdd = this.patientMedication.MedicationId == undefined;
    this.patientMedication.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateMedication(this.patientMedication).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.Medications
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CM001" : "M2CM002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CM001"]);
        this.cancel();
      }
    });
  }

  disableMedication() {
    return !(this.patientMedication.DrugName == undefined ? '' : this.patientMedication.DrugName != ''
      && this.patientMedication.StartAt == undefined ? '' : this.patientMedication.StartAt.toString() != '')
  }
}
