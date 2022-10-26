
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OverlayModule } from '@angular/cdk/overlay';
//import { MouseOverHintDirective } from 'src/app/_directives/mouseover.hint.directive'

import { ProviderNavbarComponent } from '../provider.navbar/provider.navbar.component';
import { ProviderFooterComponent } from '../provider.navbar/provider.footer.component';
import { SharedModule } from '../../_common/shared';
import { ProviderComponent } from './provider.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { SmartScheduleComponent } from '../../provider/smart.schedule/smart.schedule.component';
import { CalendarComponent } from '../../provider/calendar/calendar.component';
import { LocationSelectService, ViewChangeService, RecordsChangeService, PatientUpdateService } from './view.notification.service';

import { UtilityService } from '../../_services/utiltiy.service';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { SettingsModule } from '../../provider/settings/settings.module';
import { PatientsModule } from '../../provider/patients/patients.module'
import { SettingsComponent } from '../../provider/settings/settings.component';
import { LabsImagingComponent } from '../../provider/labs.imaging/labs.imaging.component';
import { DirectMsgComponent } from '../../provider/directmsg/directmsg.component';
import { ErxComponent } from '../../provider/erx/erx.component';
import { BillingComponent } from '../../provider/billing/billing.component';
import { MessagesComponent } from '../../provider/messages/messages.component';

import { IConfig, NgxMaskModule } from 'ngx-mask'
import { NgbDateUSParserFormatter } from '../../_helpers/ngb-date-us-parser-formatter';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumComponent } from '../breadcrum/breadcrum.component';
import { PatientDialogComponent } from 'src/app/dialogs/patient.dialog/patient.dialog.component'
import { AdvancedDirectivesDialogComponent } from '../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SignEncounterNoteComponent } from 'src/app/dialogs/encounter.dialog/sign.encounter.note.component'

import { OverlayComponent } from '../../overlay/overlay.component';
import { OverlayService } from '../../overlay.service'
//import { IConfig, NgxMaskModule } from 'ngx-mask'

import { CategoryreportsComponent } from "../../reports/categoryreports/categoryreports.component";
import { CqmreportsComponent } from "../../reports/cqmreports/cqmreports.component";
import { EncounterlistComponent } from "../../reports/encounterlist/encounterlist.component";
import { MureportsComponent } from "../../reports/mureports/mureports.component";
import { PatientlistComponent } from "../../reports/patientlist/patientlist.component";
import { ProblemlistComponent } from "../../reports/problemlist/problemlist.component";
import { Condition } from "../../reports/cqmreports/viewhelpers/condition.renderer/condition.renderer.component"
import { ConditionpadderPipe } from "../../reports/cqmreports/viewhelpers/conditionpadder.pipe";
import { ConditionformaterPipe } from "../../reports/cqmreports/viewhelpers/conditionformater.pipe";
import { UserDialogComponent } from '../../dialogs/user.dialog/user.dialog.component';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { UpcomingAppointmentsDialogComponent } from '../../dialogs/upcoming.appointments.dialog/upcoming.appointments.dialog.component';
import { AddressVerificationDialogComponent } from '../../dialogs/address.verification.dialog/address.verification.dialog.component';
import { EncounterDialogComponent } from '../../dialogs/encounter.dialog/encounter.dialog.component';
import { SmokingStatusDialogComponent } from '../../dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from '../../dialogs/intervention.dialog/intervention.dialog.component';
import { DropDownSearchComponent } from '../../_components/drop-down-search/drop-down-search.component';
import { AdvancedMedicalCodeModule } from '../../_components/advanced-medical-code-search/advanced-medical-code-module';
import { ChangePasswordDialogComponent } from 'src/app/dialogs/user.dialog/changepassword.dialog.component'
import { LocationDialogComponent } from 'src/app/dialogs/location.dialog/location.dialog.component';
import { VitalDialogComponent } from 'src/app/dialogs/vital.dalog/vital.dialog.component';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
// import { NgxNativeDateModule, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { TeethSurfaceModule } from 'src/app/_components/teeth-surface/teeth-surface.module';
import { PatientPortalAccountComponent } from 'src/app/dialogs/patient.dialog/patient.portal.account.dialog.component'
import { PatientHealthPortalComponent } from 'src/app/dialogs/patient.dialog/patient.health.portal.component'

import { PatientService } from 'src/app/_services/patient.service';
import { BillingService } from '../../_services/billing.service';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { AddeditinterventionComponent } from 'src/app/dialogs/addeditintervention/addeditintervention.component';
import { ProviderCodeDatabase } from 'src/app/provider/patients/dental.chart/tree.procedure.component'
import { CompleteAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/complete.appointment.component'
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/en';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DiscontinueDialogComponent } from '../../dialogs/discontinue.dialog/discontinue.dialog.component';
import { PatientScheduleComponent } from 'src/app/provider/smart.schedule/patient.schedule.component';
import { OrderDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.dialog.component';
import { OrderResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.result.dialog.component';
import { LabResultComponent } from 'src/app/dialogs/lab.imaging.dialog/lab.result.component';
import { OrderManualEntryDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.manual.entry.dialog.component';
import { ImagingResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/imaging.result.dialog.component';
import { TestCodeComponent } from 'src/app/dialogs/lab.imaging.dialog/test.code.component';
import { MedicationDialogComponent } from '../../dialogs/medication.dialog/medication.dialog.component';
import { AllergyDialogComponent } from '../../dialogs/allergy.dialog/allergy.dialog.component';
import { RxNormAPIService } from 'src/app/_services/rxnorm.api.service'
import { TobaccoUseDialogComponent } from '../../dialogs/tobacco.use.dialog/tobacco.use.dialog.component';
import { BlockoutDialogComponent } from 'src/app/dialogs/blockout/blockout.dialog.component'
import { LabOrderTestFormatPipe } from 'src/app/_pipes/lab.order.test.pipe'
registerLocaleData(localeIt);
import { InterventionTableDialogComponent } from '../../dialogs/intervention.table.dialog/intervention.table.dialog.component';
import { AllergyTableDialogComponent } from '../../dialogs/allergy.table.dialog/allergy.table.dialog.component';
import { FrequentlyUsedDiagnosesDialogComponent } from '../../dialogs/frequently.used.diagnoses.dialog/frequently.used.diagnoses.dialog.component';
import { AddDiagnosesDialogComponent } from '../../dialogs/add.diagnoses.dialog/add.diagnoses.dialog.component';
import { PatientEducationMaterialDialogComponent } from '../../dialogs/patient.education.material.dialog/patient.education.material.dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGridPlugin from '@fullcalendar/resource-timegrid'; // a plugin!

import { ProvidermessagetopracticeDialogComponent } from 'src/app/dialogs/providermessagetopractice.dialog/providermessagetopractice.dialog.component';
import { ProvidermessagetopatientDialogComponent } from 'src/app/dialogs/providermessagetopatient.dialog/providermessagetopatient.dialog.component';
import { MessagesService } from 'src/app/_services/messages.service';
import { CCdaDialogComponent } from 'src/app/dialogs/c-cda.dialog/c-cda.dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/alert.dialog/message.dialog.component';
import { DiagnosesTableDialogComponent } from 'src/app/dialogs/diagnoses.table.dialog/diagnoses.table.dialog.component';
import { MedicationTableDialogComponent } from 'src/app/dialogs/medication.table.dialog/medication.table.dialog.component';
import { TobaccoUseTableDialogComponent } from 'src/app/dialogs/tobacco.use.table.dialog/tobacco.use.table.dialog.component';
import { SmokingStatusTableDialogComponent } from 'src/app/dialogs/smoking.status.table.dialog/smoking.status.table.dialog.component';
import { AdvancedDirectivesTableDialogComponent } from 'src/app/dialogs/advanced.directives.table.dialog/advanced.directives.table.dialog.component';
import { PastMedicalHistoryDialogComponent } from 'src/app/dialogs/past.medical.history.dialog/past.medical.history.dialog.component';
import { FamilyHealthHistoryDialogComponent } from 'src/app/dialogs/family.health.history.dialog/family.health.history.dialog.component';
import { AuthorizedrepresentativeDialogComponent } from 'src/app/dialogs/authorizedrepresentative.dialog/authorizedrepresentative.dialog.component';
import { AddauthorizedrepresentativeDialogComponent } from 'src/app/dialogs/addauthorizedrepresentative.dialog/addauthorizedrepresentative.dialog.component';
import { EncounterTableDialogComponent } from 'src/app/dialogs/encounter.table.dialog/encounter.table.dialog.component';
import { AppointmentsTableDialogComponent } from 'src/app/dialogs/appointments.table.dialog/appointments.table.dialog.component';
import { FileUploadService } from 'src/app/_services/file.upload.service'
import { AttachmentPreviewComponent } from "src/app/_components/attachments/attachment.preview.component";
import { NotifyMessageService } from "src/app/_navigations/provider.layout/view.notification.service";
import { NotifyProviderHeaderService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { MessagesTableDialogComponent } from 'src/app/dialogs/messages.table.dialog/messages.table.dialog.component';
import { ViewMessageDialogComponent } from 'src/app/dialogs/view.message.dialog/view.message.dialog.component';
import { PraticeAdduserDialogComponent } from 'src/app/dialogs/pratice.adduser.dialog/pratice.adduser.dialog.component';


//import { AttachmentNopreviewComponent } from 'src/app/_components/attachments/attachment.nopreview.component'
//import { AttachmentComponent } from 'src/app/_components/attachments/attachment.component'
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin
]);

@NgModule({
  exports: [
    MatInputModule,
    FullCalendarModule,
    PatientDialogComponent,
    AdvancedDirectivesDialogComponent,
    SmokingStatusDialogComponent,
    InterventionDialogComponent,
    SmartScheduleComponent,
    NewAppointmentDialogComponent,
    PatientPortalAccountComponent,
    AdvancedMedicalCodeModule,
    TeethSurfaceModule,
    AddeditinterventionComponent,
    DiscontinueDialogComponent,
    MedicationDialogComponent,
    AllergyDialogComponent,
    LabOrderTestFormatPipe,
    PatientScheduleComponent,
    TobaccoUseDialogComponent,
    BlockoutDialogComponent,
    InterventionTableDialogComponent,
    AllergyTableDialogComponent,
    FrequentlyUsedDiagnosesDialogComponent,
    AddDiagnosesDialogComponent,
    PatientEducationMaterialDialogComponent,
    CCdaDialogComponent,
    MessageDialogComponent,
    DiagnosesTableDialogComponent,
    MedicationTableDialogComponent,
    TobaccoUseTableDialogComponent,
    SmokingStatusTableDialogComponent,
    AdvancedDirectivesTableDialogComponent,
    PastMedicalHistoryDialogComponent,
    FamilyHealthHistoryDialogComponent,
    AuthorizedrepresentativeDialogComponent,
    AddauthorizedrepresentativeDialogComponent,
    EncounterTableDialogComponent,
    AppointmentsTableDialogComponent,
    AttachmentPreviewComponent,
    MessagesTableDialogComponent,
    ViewMessageDialogComponent,
    //AttachmentNopreviewComponent,
    //AttachmentComponent,
    PraticeAdduserDialogComponent

  ],
  declarations: [
    ProviderNavbarComponent,
     ProviderFooterComponent,
    ProviderComponent,
    CalendarComponent,
    SmartScheduleComponent,
    SettingsComponent,
    // PatientComponent,
    LabsImagingComponent,
    BreadcrumComponent,
    DirectMsgComponent,
    ErxComponent,
    BillingComponent,
    MessagesComponent,

    CategoryreportsComponent,
    CqmreportsComponent,
    EncounterlistComponent,
    MureportsComponent,
    EncounterlistComponent,
    PatientlistComponent,
    ProblemlistComponent,
    Condition,
    ConditionpadderPipe,
    ConditionformaterPipe,
    BlockoutDialogComponent,
    //PatientDetailsComponent,
    PatientDialogComponent,
    AdvancedDirectivesDialogComponent,
    DiscontinueDialogComponent,
    MedicationDialogComponent,
    AllergyDialogComponent,
    TobaccoUseDialogComponent,
    OverlayComponent,
    //  MouseOverHintDirective,
    UserDialogComponent,
    NewAppointmentDialogComponent,
    UpcomingAppointmentsDialogComponent,
    AddressVerificationDialogComponent,
    EncounterDialogComponent,
    SmokingStatusDialogComponent,
    InterventionDialogComponent,
    DropDownSearchComponent,
    ChangePasswordDialogComponent,
    LocationDialogComponent,
    VitalDialogComponent,
    PatientPortalAccountComponent,
    PatientHealthPortalComponent,
    AddeditinterventionComponent,
    ProcedureDialogComponent,
    SignEncounterNoteComponent,
    OrderDialogComponent,
    OrderResultDialogComponent,
    LabResultComponent,
    OrderManualEntryDialogComponent,
    ImagingResultDialogComponent,
    TestCodeComponent,
    PatientScheduleComponent,
    LabOrderTestFormatPipe,
    ProvidermessagetopatientDialogComponent,
    ProvidermessagetopracticeDialogComponent,
    InterventionTableDialogComponent,
    AllergyTableDialogComponent,
    FrequentlyUsedDiagnosesDialogComponent,
    AddDiagnosesDialogComponent,
    PatientEducationMaterialDialogComponent,
    CCdaDialogComponent,
    MessageDialogComponent,
    DiagnosesTableDialogComponent,
    MedicationTableDialogComponent,
    TobaccoUseTableDialogComponent,
    SmokingStatusTableDialogComponent,
    AdvancedDirectivesTableDialogComponent,
    PastMedicalHistoryDialogComponent,
    FamilyHealthHistoryDialogComponent,
    AuthorizedrepresentativeDialogComponent,
    AddauthorizedrepresentativeDialogComponent,
    EncounterTableDialogComponent,
    AppointmentsTableDialogComponent,
    AttachmentPreviewComponent,
    MessagesTableDialogComponent,
    ViewMessageDialogComponent,
    PraticeAdduserDialogComponent
    
   // AttachmentNopreviewComponent,
   // AttachmentComponent

  ],
  imports: [
    FullCalendarModule,
    OverlayModule,
    ProviderRoutingModule,
    SharedModule,
    NgxPaginationModule,
    CommonModule,
    MatMenuModule,
    FormsModule,
    NgbModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    MatPaginatorModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatSelectFilterModule,
    MatTableExporterModule,
    Ng2OrderModule,
    MatAutocompleteModule,
    // ScheduleModule,
    // DateTimePickerModule,
    SettingsModule,
    PatientsModule,
    AdvancedMedicalCodeModule,
    TeethSurfaceModule,
    NgxMatTimepickerModule,
    // MatFileUploadModule,
    NgxMaskModule.forRoot(),

  ],
  providers: [LocationSelectService, ViewChangeService, RecordsChangeService, PatientUpdateService,
    UtilityService, SmartSchedulerService, OverlayService, PatientService, BillingService,
    AlertMessage, RxNormAPIService, MessagesService,
    FileUploadService,
    NotifyMessageService,
    NotifyProviderHeaderService,
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    ProviderCodeDatabase,
    { provide: NgbDateParserFormatter, useClass: NgbDateUSParserFormatter }

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [OverlayComponent, PatientDialogComponent,
    AdvancedDirectivesDialogComponent, SmokingStatusDialogComponent,
    InterventionDialogComponent,
    NewAppointmentDialogComponent,
    EncounterDialogComponent,
    UserDialogComponent,
    PatientPortalAccountComponent,
    ProcedureDialogComponent,
    AddressVerificationDialogComponent,
    SignEncounterNoteComponent,
    PatientHealthPortalComponent,
    DiscontinueDialogComponent,
    MedicationDialogComponent,
    AllergyDialogComponent,
    TobaccoUseDialogComponent,
    CompleteAppointmentDialogComponent,
    OrderManualEntryDialogComponent,
    OrderResultDialogComponent,
    OrderDialogComponent,
    LabResultComponent,
    ImagingResultDialogComponent,
    TestCodeComponent,
    ProvidermessagetopatientDialogComponent,
    ProvidermessagetopracticeDialogComponent,
    BlockoutDialogComponent,
    TestCodeComponent,
    InterventionTableDialogComponent,
    AllergyTableDialogComponent,
    FrequentlyUsedDiagnosesDialogComponent,
    AddDiagnosesDialogComponent,
    PatientEducationMaterialDialogComponent,
    CCdaDialogComponent,
    MessageDialogComponent,
    DiagnosesTableDialogComponent,
    MedicationTableDialogComponent,
    TobaccoUseTableDialogComponent,
    SmokingStatusTableDialogComponent,
    AdvancedDirectivesTableDialogComponent,
    PastMedicalHistoryDialogComponent,
    FamilyHealthHistoryDialogComponent,
    EncounterTableDialogComponent,
    AppointmentsTableDialogComponent,
    MessagesTableDialogComponent,
    ViewMessageDialogComponent,
    PraticeAdduserDialogComponent]
})
export class ProviderModule {

}
