import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from "@angular/material/list";
import { MatDialogModule} from "@angular/material/dialog"

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormContainerComponent } from './form-container/form-container-component';
//import { FieldControlComponent } from './field-control/field-control-component';

@NgModule({
  declarations: [
    //FormContainerComponent,
    //FieldControlComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatListModule,

  ],
  //exports: [FormContainerComponent, FieldControlComponent],
})
export class TeethSurfaceModule {}
