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

import { ProviderNavbarComponent } from '../provider.navbar/provider.navbar.component';
import { ProviderFooterComponent } from '../provider.navbar/provider.footer.component';
import { SharedModule } from '../../_common/shared';
import { ProviderComponent } from './provider.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { SmartScheduleComponent } from '../../provider/smart.schedule/smart.schedule.component';
import { CalendarComponent } from '../../provider/calendar/calendar.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ScheduleModule, DayService, WeekService } from '@syncfusion/ej2-angular-schedule';
import { LocationSelectService } from './location.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { SettingsModule } from '../../settings/settings.module'
import { SettingsComponent } from '../../settings/settings.component'
import { IConfig, NgxMaskModule} from 'ngx-mask'
import { NgbDateUSParserFormatter } from '../../_helpers/ngb-date-us-parser-formatter';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  exports: [
    MatInputModule
  ],
  declarations: [
    ProviderNavbarComponent,
    ProviderFooterComponent,
    ProviderComponent,
    CalendarComponent,
    SmartScheduleComponent,
    SettingsComponent
  ],
  imports: [
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
    ScheduleModule,
    DropDownListModule,
    DateTimePickerModule,
    SettingsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [DayService, WeekService, LocationSelectService, UtilityService,SmartSchedulerService,
    {provide: NgbDateParserFormatter, useClass: NgbDateUSParserFormatter}

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProviderModule {

}
