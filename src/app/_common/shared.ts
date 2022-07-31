import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GroupByPipe } from "../_pipes/group-by.pipe";
import { FilterPipe } from "../_pipes/search-filter.pipe";
import { SearchPipe } from '../_pipes/search-filter.pipe';
import { QuickAppProMaterialModule } from "./material";
import { TimeMaskDirective } from 'src/app/_directives/input.time.mask.directive'
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
    TimeMaskDirective
  ],
  declarations: [GroupByPipe, FilterPipe, SearchPipe, TimeMaskDirective],
  entryComponents: []
})
export class SharedModule { }
