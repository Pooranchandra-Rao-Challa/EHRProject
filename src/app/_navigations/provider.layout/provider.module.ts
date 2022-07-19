
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
import { MouseOverHintDirective } from 'src/app/_directives/mouseover.hint.directive'

import { ProviderNavbarComponent } from '../provider.navbar/provider.navbar.component';
import { ProviderFooterComponent } from '../provider.navbar/provider.footer.component';
import { SharedModule } from '../../_common/shared';
import { ProviderComponent } from './provider.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { SmartScheduleComponent } from '../../provider/smart.schedule/smart.schedule.component';
import { CalendarComponent } from '../../provider/calendar/calendar.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
// import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
// import { ScheduleModule, DayService, WeekService } from '@syncfusion/ej2-angular-schedule';
import { LocationSelectService, ViewChangeService } from './location.service';
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

import { OrderDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.dialog.component';
import { OrderResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.result.dialog.component';
import { EditLabImagingOrderComponent } from 'src/app/dialogs/lab.imaging.dialog/order.edit.lab.imaging.component';
import { OrderManualEntryDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.manual.entry.dialog.component';
import { ImagingResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/imaging.result.dialog.component';
import { TestCodeComponent } from 'src/app/dialogs/lab.imaging.dialog/test.code.component';
import { RxNormAPIService } from 'src/app/_services/rxnorm.api.service'

//import { TimeMaskDirective } from 'src/app/_directives/input.time.mask.directive'
registerLocaleData(localeIt);
@NgModule({
  exports: [
    MatInputModule,
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
    //PatientsComponent,
    //PatientDetailsComponent,
    PatientDialogComponent,
    AdvancedDirectivesDialogComponent,
    DiscontinueDialogComponent,
    OverlayComponent,
    MouseOverHintDirective,
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
    EditLabImagingOrderComponent,
    OrderManualEntryDialogComponent,
    ImagingResultDialogComponent,
    TestCodeComponent,
    //TimeMaskDirective,
  ],
  imports: [

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
    DropDownListModule,
    // DateTimePickerModule,
    SettingsModule,
    PatientsModule,
    AdvancedMedicalCodeModule,
    TeethSurfaceModule,
    NgxMatTimepickerModule,
    NgxMaskModule.forRoot(),

  ],
  providers: [LocationSelectService, ViewChangeService,
    UtilityService, SmartSchedulerService, OverlayService, PatientService, BillingService,
     AlertMessage, RxNormAPIService,
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
    CompleteAppointmentDialogComponent,
    OrderManualEntryDialogComponent,
    OrderResultDialogComponent,
    OrderDialogComponent,
    EditLabImagingOrderComponent,
    ImagingResultDialogComponent,
    TestCodeComponent]
})
export class ProviderModule {

}
