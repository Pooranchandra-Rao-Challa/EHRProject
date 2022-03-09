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
import { Accountserviceendpoint } from './_services/account.endpoint.service';
import { EndpointBase } from './_services/endpoint.base.service';
import { EhrInterceptor } from './_helpers';
import { AuthenticationService } from './_services/authentication.service';
import { HomeComponent } from './account/home.comonent';
import { DownloadService } from "./_services/download.service";
import { IdService } from "./_helpers/_id.service";
import { AuthGuard } from "./_helpers/auth.guard";

@NgModule({
  exports: [

  ],
  declarations: [
    AppComponent,

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
