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
import { ProviderlistComponent } from 'src/app/admin/providerlist.component';

@NgModule({
  exports: [
    MatInputModule
  ],
  declarations: [
    AdminSidebarComponent,
    AdminNavbarComponent,
    AdminComponent,
    ProviderlistComponent
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
  ],
  providers: [DayService, WeekService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {

}
