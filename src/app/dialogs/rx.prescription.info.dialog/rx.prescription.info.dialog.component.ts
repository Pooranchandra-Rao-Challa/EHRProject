import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Allergy, User, UserLocations, ViewModel } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-rx.prescription.info.dialog',
  templateUrl: './rx.prescription.info.dialog.component.html',
  styleUrls: ['./rx.prescription.info.dialog.component.scss']
})
export class RxPrescriptionInfoDialogComponent implements OnInit {
  user: User;
  viewModel: ViewModel;
  patient: ProviderPatient;
  // Locations: UserLocations[];
  patientAllergies: Allergy[] = [];

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,) {
    this.user = authService.userValue;
    this.viewModel = authService.viewModel;
    this.patient = this.viewModel.Patient;
    // this.Locations = JSON.parse(this.authService.userValue.LocationInfo);
    console.log(this.user);

  }

  ngOnInit(): void {
    this.AllergiesByPatientId();
  }

  cancel() {
    this.ref.close(null);
  }

  // Get allergies info
  AllergiesByPatientId() {
    this.patientService.AllergiesByPatientId({ PatientId: this.patient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.patientAllergies = resp.ListResult;
      else this.patientAllergies = [];
      console.log(this.patientAllergies);
    });
  }

}
