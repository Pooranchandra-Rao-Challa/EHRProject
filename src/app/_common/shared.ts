import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GroupByPipe } from "../_pipes/group-by.pipe";
import { QuickAppProMaterialModule } from "./material";

@NgModule({
  imports: [
    QuickAppProMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    QuickAppProMaterialModule,
    GroupByPipe

  ],
  declarations: [GroupByPipe],
  entryComponents: []
})
export class SharedModule { }
