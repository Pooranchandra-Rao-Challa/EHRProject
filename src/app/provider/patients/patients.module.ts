import { LOCALE_ID } from '@angular/core';
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
import { PatientsBreadCrumComponent } from './patients-bread-crum/patients-bread-crum.component';
import { PaginatorDirective } from 'src/app/_directives/pagination.directive'
import { BreadcrumbComponent } from 'src/app/provider/patients/patient.breadcrumb/breadcrumb.component'
import { TreeProcedureComponent } from 'src/app/provider/patients/dental.chart/tree.procedure.component'
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    NgxMaskModule.forRoot(),

  ],
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
    BreadcrumbComponent,
    TreeProcedureComponent,
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
    PatientsBreadCrumComponent,
    PaginatorDirective,
    BreadcrumbComponent,
    TreeProcedureComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' }],
})

export class PatientsModule {
}
