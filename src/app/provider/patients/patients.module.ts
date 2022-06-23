import { BreadcrumComponent } from './../../_navigations/breadcrum/breadcrum.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../_common/shared';
import { CommonModule } from '@angular/common';
import { PatientsComponent } from './patients.component';
import { PatientDetailsComponent } from './patient.details/patient.details.component';
import { ChartComponent } from './chart/chart.component';
import { DentalChartComponent } from './dental.chart/dental.chart.component';
import { ProfileComponent } from './profile/profile.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { AmendmentsComponent } from './amendments/amendments.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { CqmsNotPerformedComponent } from './cqms.not.performed/cqms.not.performed.component';
import { SearchPipe } from '../../_pipes/search-filter.pipe';
import { PatientsBreadCrumComponent } from './patients-bread-crum/patients-bread-crum.component';
import { PaginatorDirective } from 'src/app/_directives/pagination.directive'
import { BreadcrumbComponent} from 'src/app/provider/patients/patient.breadcrumb/breadcrumb.component'

// import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [SharedModule, CommonModule],
  exports: [
    PatientsComponent,
    PatientDetailsComponent,
    ChartComponent,
    DentalChartComponent,
    ProfileComponent,
    InsuranceComponent,
    AmendmentsComponent,
    ResetPasswordComponent,
    CqmsNotPerformedComponent,
    PaginatorDirective,
    BreadcrumbComponent
  ],
  declarations: [
    PatientsComponent,
    PatientDetailsComponent,
    ChartComponent,
    DentalChartComponent,
    ProfileComponent,
    InsuranceComponent,
    AmendmentsComponent,
    ResetPasswordComponent,
    CqmsNotPerformedComponent,
    SearchPipe,
    PatientsBreadCrumComponent,
    PaginatorDirective,
    BreadcrumbComponent
  ],
  providers: [],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PatientsModule {
}
