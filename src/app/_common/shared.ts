import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GroupByPipe } from "../_pipes/group-by.pipe";
import { FilterPipe } from "../_pipes/search-filter.pipe";
import { SearchPipe } from '../_pipes/search-filter.pipe';
import { QuickAppProMaterialModule } from "./material";
import { TimeMaskDirective } from 'src/app/_directives/input.time.mask.directive'
import { MouseOverHintDirective } from 'src/app/_directives/mouseover.hint.directive'
import { SimplePaginationDirective } from 'src/app/_directives/simple.pagination.directive'
import { npiValidatorDirective } from 'src/app/_directives/npi.validator.directive'

//import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    QuickAppProMaterialModule,
    //FullCalendarModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    QuickAppProMaterialModule,
    //FullCalendarModule,
    GroupByPipe,
    FilterPipe,
    SearchPipe,
    TimeMaskDirective,
    SimplePaginationDirective,
    npiValidatorDirective,
    MouseOverHintDirective
  ],
  declarations: [GroupByPipe, FilterPipe, SearchPipe, TimeMaskDirective,
    MouseOverHintDirective,SimplePaginationDirective,npiValidatorDirective],
  entryComponents: []
})
export class SharedModule { }
