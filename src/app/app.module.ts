import { DentalChartService } from './_services/dentalchart.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Accountservice } from './_services/account.service';
import { SettingsService } from './_services/settings.service';
import { APIEndPoint } from './_services/api.endpoint.service';
import { EndpointBase } from './_services/endpoint.base.service';
import { EhrInterceptor } from './_helpers';
import { AuthenticationService } from './_services/authentication.service';
import { DownloadService } from "./_services/download.service";
import { IdService } from "./_helpers/_id.service";
import { AuthGuard } from "./_helpers/auth.guard";
import { LabsImagingService } from './_services/labsimaging.service';
import { CqmsNotPerformedComponent } from './provider/patients/cqms.not.performed/cqms.not.performed.component';
import { CQMNotPerformedService } from './_services/cqmnotperforemed.service';
//import { ToggleFullscreenDirective } from 'src/app/_directives/fullscreen.directive';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS }
from '@angular/material-moment-adapter';
import { CustomMomentDateAdapter } from 'src/app/_common/custom.date.adapter';


// HttpClientModule is only needed if you want to log on server or if you want to inspect sourcemaps

@NgModule({
  exports: [
  // ToggleFullscreenDirective
  ],
  declarations: [
    AppComponent,

  // ToggleFullscreenDirective,

  ],
  imports: [
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: EhrInterceptor, multi: true },
    Accountservice,
    SettingsService,
    DownloadService,
    DatePipe,
    APIEndPoint,
    AuthenticationService,
    EndpointBase,
    IdService,
    AuthGuard,
    LabsImagingService,
    DentalChartService,
    CQMNotPerformedService,
    { provide: MomentDateAdapter, useClass: CustomMomentDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
