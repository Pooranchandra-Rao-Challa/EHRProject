import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CQMReportsComponent } from '../CQMReports/CQMReports.component';
import { SharedModule } from '../Shared/shared';
import { MUReportsComponent } from '../mu-reports/mu-reports.component';
import { LayoutComponent } from './layout.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
    exports: [
        MatInputModule 
    ],
    declarations: [
        NavbarComponent,
        FooterComponent,
        CQMReportsComponent,
        MUReportsComponent,
        LayoutComponent,
        
    ],
    imports: [
        ReportsRoutingModule,
        SharedModule,
        NgxPaginationModule,
        CommonModule,
        MatMenuModule,
        FormsModule,
        NgbModule,
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
        MatAutocompleteModule
    ],
    providers: [

    ]
})
export class ReportsModule {

}
