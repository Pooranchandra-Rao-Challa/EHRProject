import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, Diagnosis, DiagnosisDpCodes, EncounterInfo, PatientChart } from 'src/app/_models';
import { MedicalCode } from 'src/app/_models/codes';
import { BehaviorSubject } from 'rxjs'
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { AddDiagnosesDialogComponent } from '../add.diagnoses.dialog/add.diagnoses.dialog.component';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-frequently.used.diagnoses.dialog',
  templateUrl: './frequently.used.diagnoses.dialog.component.html',
  styleUrls: ['./frequently.used.diagnoses.dialog.component.scss']
})
export class FrequentlyUsedDiagnosesDialogComponent implements OnInit {
  diagnosesInfo = new BehaviorSubject<Diagnosis[]>([]);
  DxCodes: DiagnosisDpCodes[];
  frequentlyUsedDiagnoses: Diagnosis = new Diagnosis();
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  encounterInfo: EncounterInfo = new EncounterInfo;
  ActionTypes = Actions;
  addDiagnosesDialogComponent = AddDiagnosesDialogComponent;
  currentPatient: ProviderPatient;
  updatedModelNo: number;

  constructor(public overlayService: OverlayService,
    private ref: EHROverlayRef,
    private patientService: PatientService,
    private authService: AuthenticationService) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    this.DxCodes = Object.values(DiagnosisDpCodes);
  }

  updateLocalModel(data: Diagnosis) {
    this.frequentlyUsedDiagnoses = new Diagnosis;
    if (data == null) return;
    this.frequentlyUsedDiagnoses = data;
  }

  cancel() {
    if (this.updatedModelNo < 0) {
      this.ref.close(null);
    }
    else {
      this.ref.close({
        "UpdatedModal": PatientChart.Diagnoses,
        "DiagnosesList": this.frequentlyUsedDiagnoses
      });
    }
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.addDiagnosesDialogComponent) {
      reqdata = dialogData;
      this.frequentlyUsedDiagnoses.IsEditable = false;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      this.UpdateView(res.data);
    });
  }

  UpdateView(data) {
    if (data == null) return;
    this.updatedModelNo = data.UpdatedModal;
    if (data.UpdatedModal == PatientChart.Diagnoses) {
      this.DiagnosesByPatientId();
    }
  }

  optionChangedForDiagnosis(value: MedicalCode) {
    this.frequentlyUsedDiagnoses.Code = value.Code;
    this.frequentlyUsedDiagnoses.CodeSystem = value.CodeSystem;
    this.frequentlyUsedDiagnoses.Description = value.Description;
    this.openComponentDialog(this.addDiagnosesDialogComponent, this.frequentlyUsedDiagnoses, this.ActionTypes.view);
  }

  // Get diagnoses info
  DiagnosesByPatientId() {
    this.patientService.DiagnosesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.frequentlyUsedDiagnoses = resp.ListResult;
    });
  }

}
