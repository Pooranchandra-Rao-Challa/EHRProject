import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GroupByPipe } from "../_pipes/group-by.pipe";
import { FilterPipe } from "../_pipes/search-filter.pipe";
import { QuickAppProMaterialModule } from "./material";

@NgModule({
  imports: [
    QuickAppProMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    QuickAppProMaterialModule,
    GroupByPipe,
    FilterPipe,

  ],
  declarations: [GroupByPipe,FilterPipe],
  entryComponents: []
})
export class SharedModule { }
