import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-rounting.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RubyAuthenticationFailedComponenet } from './ruby.authentication.failed.component';
import { RegistrationComponent } from "../account/registration.component";
import { HomeComponent } from "../account/home.comonent";
import { SharedModule } from '../_common/shared';
import { IConfig, NgxMaskModule} from 'ngx-mask'


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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
*/

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    LayoutComponent,
    LoginComponent,
    RubyAuthenticationFailedComponenet,
    RegistrationComponent,
    HomeComponent
  ]
})
export class LoginModule { }
