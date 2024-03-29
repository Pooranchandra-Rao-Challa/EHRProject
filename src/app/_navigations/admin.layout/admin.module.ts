import { PatientService } from 'src/app/_services/patient.service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { SharedModule } from '../../_common/shared';
import { AdminNavbarComponent } from "../admin.navbar/admin.navbar.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminSidebarComponent } from "../admin.sidebar/admin.sidebar.component";
import { AdminComponent } from './admin.component';
import { DashboardComponent } from 'src/app/admin/dashboard/dashboard.component';
import { AdminPracticeComponent } from 'src/app/admin/admin-practice/admin-practice.component';
import { AdminService } from '../../_services/admin.service';
import { ActivePipe } from 'src/app/_pipes/search-filter.pipe';
import { ProviderlistComponent } from '../../admin/providerlist/providerlist.component';
import { AdminsettingComponent } from 'src/app/admin/adminsetting/adminsetting.component';
import { AdminsComponent } from 'src/app/admin/admins/admins.component';
import { WeeklyUpdatedComponent } from 'src/app/admin/weekly-updated/weekly-updated.component';
import { BreadcrumComponent } from '../admin.breadcrum/admin.breadcrum.component';
import { ActivePatientsComponent } from 'src/app/admin/activepatients/activepatients.component';
import { InActivePatientsComponent } from 'src/app/admin/inactivepatients/inactivepatients.component';
import { EditDefaultMessageComponent } from 'src/app/admin/editdefaultmessage/editdefaultmessage.component';
import { ReportsComponent } from 'src/app/admin/reports/reports.component';
import { BillingComponent } from 'src/app/admin/billing/billing.component';
import { SectionNewComponent } from 'src/app/admin/section-new/section-new.component';
import { ListImportedDataComponent } from 'src/app/admin/list-imported-data/list-imported-data.component';
import { ImportPatientsComponent } from 'src/app/admin/import-patients/import-patients.component';
import { ImportEncountersComponent } from 'src/app/admin/import-encounters/import-encounters.component';
import { Reset2FAComponent} from 'src/app/admin/dashboard/reset.2fa.component';
import { TwoFAToggleComponent} from 'src/app/admin/admins/twofa.toggle.component';
import { UserStatusToggleComponent} from 'src/app/admin/dashboard/user.activate.component';


import { CKEditorModule } from 'ckeditor4-angular';
import { OverlayService } from 'src/app/overlay.service';
import { AddUserDialogComponent } from 'src/app/dialogs/adduser.dialog/adduser.dialog.component';
import { DefaultMessagesComponent } from 'src/app/admin/defaultmessages/defaultmessages.component';
import { CommunicationsettingsComponent } from 'src/app/admin/communicationsettings/communicationsettings.component';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { AdminPaginatorDirective } from 'src/app/_directives/admin.patinator.directive'
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { IConfig, NgxMaskModule } from 'ngx-mask'
import { UploadService } from 'src/app/_services/upload.file.service';
import { EhrInterceptor } from 'src/app/_helpers';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  exports: [
    MatInputModule,
    AdminPaginatorDirective
  ],
  declarations: [
    AdminSidebarComponent,
    AdminNavbarComponent,
    AdminComponent,
    ProviderlistComponent,
    DashboardComponent,
    AdminPracticeComponent,
    BreadcrumComponent,
    AdminsettingComponent,
    AdminsComponent,
    WeeklyUpdatedComponent,
    ActivePatientsComponent,
    InActivePatientsComponent,
    EditDefaultMessageComponent,
    BillingComponent,
    ReportsComponent,
    SectionNewComponent,
    AddUserDialogComponent,
    ListImportedDataComponent,
    ImportPatientsComponent,
    ImportEncountersComponent,
    DefaultMessagesComponent,
    CommunicationsettingsComponent,
    Reset2FAComponent,
    TwoFAToggleComponent,
    UserStatusToggleComponent,
    AdminPaginatorDirective,
    ActivePipe
  ],
  imports: [
    AdminRoutingModule,
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
    CKEditorModule,
    NgxMaskModule.forRoot(),
    // Ng2SearchPipeModule
  ],
  providers: [AdminService,UploadService,
    OverlayService, AlertMessage, PatientService,UtilityService,
    { provide: HTTP_INTERCEPTORS, useClass: EhrInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {

}
