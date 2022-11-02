import { element } from 'protractor';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { CCDAData, CCDAParams, ViewModel } from 'src/app/_models';
import { keyframes } from '@angular/animations';

export class localPatientChartInformation {
  SmokingStatus?: boolean;
  ProblemsDX?: boolean;
  MedicationsRX?: boolean;
  MedicationAllergies?: boolean;
  LaboratoryTestsResults?: boolean;
  VitalStats?: boolean;
  CarePlanGoalsInstructions?: boolean;
   Procedures?: boolean;
  CareTeamMembers?: boolean;
}
@Component({
  selector: 'app-ccda.preview.dialog',
  templateUrl: './ccda.preview.dialog.component.html',
  styleUrls: ['./ccda.preview.dialog.component.scss']
})
export class CcdaPreviewDialogComponent implements OnInit {
  c_CDAParams: CCDAParams = new CCDAParams();
  c_CDAData: CCDAData = new CCDAData();
  viewModel: ViewModel;
  patientChartInfo: localPatientChartInformation = new localPatientChartInformation();

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService) {
      this.viewModel = authService.viewModel;
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.CCDAReport();
  }

  CCDAReport() {
    this.c_CDAParams.PatientId = this.viewModel.Patient.PatientId;
    this.patientService.CCDAReport(this.c_CDAParams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.c_CDAData = resp.Result as CCDAData;
      }
    });
  }

  updateLocalModel(data: CCDAParams) {
    this.c_CDAParams = new CCDAParams;
    if (data == null) return;
    this.c_CDAParams = data;
    // this.c_CDAData.PatientChartInformation.forEach(source => {
    //   if()
    // });
  }

  cancel() {
    this.ref.close(null);
  }

}
