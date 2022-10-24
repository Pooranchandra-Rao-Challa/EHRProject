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

import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { LocationSelectService, ViewChangeService,RecordsChangeService } from '../provider.layout/view.notification.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { PatientPasswordChangeRequestDialogComponent } from 'src/app/dialogs/patient.login.options/patient.securequestion.dialog'
import { OverlayComponent } from '../../overlay/overlay.component';
import { OverlayService } from '../../overlay.service'
import { MessagesService } from 'src/app/_services/messages.service';import { NgxMaskModule } from 'ngx-mask';
import { AttachmentNopreviewComponent } from 'src/app/_components/attachments/attachment.nopreview.component'
import { NotifyMessageService } from 'src/app/_navigations/provider.layout/view.notification.service';


@NgModule({
  exports: [
    MatInputModule,
    AttachmentNopreviewComponent,
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
    ActivityLogComponent,
    PatientPasswordChangeRequestDialogComponent,
    AttachmentNopreviewComponent,
  ],
  imports: [
    PatientRoutingModule,
    SharedModule,
    CommonModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [LocationSelectService,ViewChangeService,PatientService,
    AlertMessage,PatientNavbarComponent,UtilityService,OverlayService,
    SmartSchedulerService,MessagesService,RecordsChangeService,NotifyMessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [PatientPasswordChangeRequestDialogComponent]
})
export class PatientModule {

}





