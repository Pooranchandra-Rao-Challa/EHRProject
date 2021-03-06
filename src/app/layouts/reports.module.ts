
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
//import { ReportsRoutingModule } from "./reports-routing.module";
//import { CategoryreportsComponent } from "../reports/categoryreports/categoryreports.component";
//import { CqmreportsComponent } from "../reports/cqmreports/cqmreports.component";
//import { EncounterlistComponent } from "../reports/encounterlist/encounterlist.component";
//import { MureportsComponent } from "../reports/mureports/mureports.component";
//import { PatientlistComponent } from "../reports/patientlist/patientlist.component";
//import { ProblemlistComponent } from "../reports/problemlist/problemlist.component";
//import { SharedModule } from "../_common/shared";
//import { Condition } from "../reports/cqmreports/viewhelpers/condition.renderer/condition.renderer.component"
//import { NavbarComponent } from "../_navigations/navbar.component";
//import { ConditionpadderPipe } from "../reports/cqmreports/viewhelpers/conditionpadder.pipe";
//import { ConditionformaterPipe } from "../reports/cqmreports/viewhelpers/conditionformater.pipe";
//import { FooterComponent } from "../_navigations/footer.component";
//import { ReportsComponent } from "./reports.component";


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrModule } from 'ngx-toastr';
//import { SharedModule } from './_common/shared';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  exports: [],
  declarations: [
    /*ReportsComponent,
    NavbarComponent,
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
    FooterComponent,*/
  ],
  imports: [
    CommonModule,
    //ReportsRoutingModule,
    //SharedModule,
    ToastrModule.forRoot(),
    // SharedModule,
    NgxPaginationModule,
    MatMenuModule,
    FormsModule,
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
    MatInputModule,

  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsModule {

}
