import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
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
//import { PatientNavbarComponent } from "../patient.navbar/patient.navbar.component";
import { AdminNavbarComponent } from "../admin.navbar/admin.navbar.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminSidebarComponent } from "../admin.sidebar/admin.sidebar.component";
import { AdminComponent } from './admin.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ScheduleModule,DayService, WeekService} from '@syncfusion/ej2-angular-schedule';

import { DashboardComponent } from 'src/app/admin/dashboard/dashboard.component';
import { AdminPracticeComponent } from 'src/app/admin/admin-practice/admin-practice.component';

import { AdminService } from '../../_services/admin.service';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProviderlistComponent } from '../../admin/providerlist/providerlist.component';
import { AdminsettingComponent } from 'src/app/admin/adminsetting/adminsetting.component';
import { AdminsComponent } from 'src/app/admin/admins/admins.component';
import { WeeklyUpdatedComponent } from 'src/app/admin/weekly-updated/weekly-updated.component';
import { BreadcrumComponent } from '../admin.breadcrum/admin.breadcrum.component';
import { ActivepatientComponent } from 'src/app/admin/activepatient/activepatient.component';
import { InactivepatientComponent } from 'src/app/admin/inactivepatient/inactivepatient.component';
import { EditdefaultmessageComponent } from 'src/app/admin/editdefaultmessage/editdefaultmessage.component';
import { SectionNewComponent } from 'src/app/admin/section-new/section-new.component';

@NgModule({
  exports: [
    MatInputModule,
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
    ActivepatientComponent,
    InactivepatientComponent,
    EditdefaultmessageComponent,
    SectionNewComponent
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
    ScheduleModule,
    DropDownListModule,
    DateTimePickerModule,
    // Ng2SearchPipeModule
  ],
  providers: [DayService, WeekService,AdminService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {

}
