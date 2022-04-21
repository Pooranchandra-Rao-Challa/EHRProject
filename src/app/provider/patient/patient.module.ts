import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../_common/shared';
import { CommonModule } from '@angular/common';
import { PatientComponent } from '../../provider/patient/patient.component';
import { PatientDetailsComponent } from '../../provider/patient/patient.details/patient.details.component';
import { ChartComponent } from '../../provider/patient/chart/chart.component';
import { DentalChartComponent } from './dental.chart/dental.chart.component';
import { ProfileComponent } from './profile/profile.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { AmendmentsComponent } from './amendments/amendments.component';
import { PatientsComponent } from './patients/patients.component';
import { CqmsNotPerformedComponent } from './cqms.not.performed/cqms.not.performed.component';

@NgModule({
  imports: [SharedModule, CommonModule],
  // exports: [PatientComponent, PatientDetailsComponent, ChartComponent, DentalChartComponent],
  declarations: [PatientComponent, PatientDetailsComponent, ChartComponent, DentalChartComponent, ProfileComponent, InsuranceComponent, AmendmentsComponent, PatientsComponent, CqmsNotPerformedComponent],
  providers: [],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PatientModule {
}
