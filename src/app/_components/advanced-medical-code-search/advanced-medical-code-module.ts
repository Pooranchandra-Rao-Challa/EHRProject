import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from "@angular/material/list";
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormContainerComponent } from './form-container/form-container-component';
import { FieldControlComponent } from './field-control/field-control-component';

@NgModule({
  declarations: [
    FormContainerComponent,
    FieldControlComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatListModule,
    MatAutocompleteModule
  ],
  exports: [FormContainerComponent, FieldControlComponent],
})
export class AdvancedMedicalCodeModule {}
