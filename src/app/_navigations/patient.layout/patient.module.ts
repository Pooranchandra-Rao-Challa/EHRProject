import { MessageComponent } from './../../patient/message.component';
import { DocumentComponent } from './../../patient/document.component';
import { AppointmentComponent } from './../../patient/appointment.component';
import { DashboardComponent } from './../../patient/dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../_common/shared';
import { PatientNavbarComponent } from "../patient.navbar/patient.navbar.component";
import { PatientRoutingModule } from "./patient-routing.module";
import { PatientComponent } from './patient.component';
import { DayService, WeekService } from '@syncfusion/ej2-angular-schedule';
import { MyhealthComponent } from 'src/app/patient/myhealth.component';
import { MyprofileComponent } from 'src/app/patient/myprofile.component';




@NgModule({
  exports: [
    MatInputModule
  ],
  declarations: [
    PatientNavbarComponent,
    PatientComponent,
    DashboardComponent,
    AppointmentComponent,

    DocumentComponent,
    MessageComponent,
    MyhealthComponent,
    MyprofileComponent
  ],
  imports: [
    PatientRoutingModule,
    SharedModule,
    CommonModule,

  ],
  providers: [DayService, WeekService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientModule {
}




