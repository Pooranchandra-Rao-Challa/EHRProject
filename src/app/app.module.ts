import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './_common/shared';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';*/


import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Accountservice } from './_services/account.service';
import { Accountserviceendpoint } from './_services/account.endpoint.service';
import { EndpointBase } from './_services/endpoint.base.service';
import { EhrInterceptor } from './_helpers';
import { AuthenticationService } from './_services/authentication.service';
import { HomeComponent } from './account/home.comonent';
import { DownloadService } from "./_services/download.service";
import { IdService } from "./_helpers/_id.service";
import { AuthGuard } from "./_helpers/auth.guard";
//import { RubyAuthenticationFailedComponenet } from "./login/ruby.authentication.failed.component";

@NgModule({
  exports: [
    //MatInputModule
  ],
  declarations: [
    AppComponent,
    // HomeComponent,
    //RubyAuthenticationFailedComponenet
  ],
  imports: [

    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    CommonModule,

    /*
    ToastrModule.forRoot(),
    SharedModule,
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
    MatAutocompleteModule
    */
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: EhrInterceptor, multi: true },
    Accountservice,
    DownloadService,
    DatePipe,
    Accountserviceendpoint,
    AuthenticationService,
    EndpointBase,
    IdService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
