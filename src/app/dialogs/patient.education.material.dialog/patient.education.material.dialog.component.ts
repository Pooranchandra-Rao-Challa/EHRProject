import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { EducationMaterial, User } from 'src/app/_models';

@Component({
  selector: 'app-patient.education.material.dialog',
  templateUrl: './patient.education.material.dialog.component.html',
  styleUrls: ['./patient.education.material.dialog.component.scss']
})
export class PatientEducationMaterialDialogComponent implements OnInit {
  educationMaterial: EducationMaterial;
  currentPatient: ProviderPatient;
  user: User
  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService) {
    if(ref.RequestData)
      this.educationMaterial = ref.RequestData;
    else this.educationMaterial = {};
    this.currentPatient = authService.viewModel.Patient;
    this.user = authService.userValue;
  }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }
}
