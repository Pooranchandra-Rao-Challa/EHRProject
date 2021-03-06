import { ActivityLogComponent } from './../../patient/activitylog.component';
import { PatientService } from 'src/app/_services/patient.service';
import { FooterComponent } from './../footer.component';
import { NewmessageDialogComponent } from './../../dialogs/newmessage.dialog/newmessage.dialog.component';

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
// import { DayService, WeekService } from '@syncfusion/ej2-angular-schedule';
import { MyhealthComponent } from 'src/app/patient/myhealth.component';
import { MyprofileComponent } from 'src/app/patient/myprofile.component';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { LocationSelectService, ViewChangeService } from '../provider.layout/view.notification.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
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
    MyprofileComponent,
    PatientappointmentDialogComponent,
    NewmessageDialogComponent,
    FooterComponent,
    ActivityLogComponent


  ],
  imports: [
    PatientRoutingModule,
    SharedModule,
    CommonModule,

  ],
  providers: [LocationSelectService,ViewChangeService,PatientService, OverlayService,AlertMessage,PatientNavbarComponent,UtilityService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientModule {
}





