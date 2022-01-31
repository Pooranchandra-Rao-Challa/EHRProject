import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material'

import { LoginRoutingModule } from './login-rounting.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RubyAuthenticationFailedComponenet} from './ruby.authentication.failed.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule
  ],
  declarations: [
    LayoutComponent,
    LoginComponent,
    RubyAuthenticationFailedComponenet
  ]
})
export class LoginModule { }
