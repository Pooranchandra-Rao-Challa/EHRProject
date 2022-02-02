
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportsRoutingModule } from "./reports-routing.module";
import { CategoryreportsComponent } from "../reports/categoryreports/categoryreports.component";
import { CqmreportsComponent } from "../reports/cqmreports/cqmreports.component";
import { EncounterlistComponent } from "../reports/encounterlist/encounterlist.component";
import { MureportsComponent } from "../reports/mureports/mureports.component";
import { PatientlistComponent } from "../reports/patientlist/patientlist.component";
import { ProblemlistComponent } from "../reports/problemlist/problemlist.component";
import { Condition } from "../reports/cqmreports/viewhelpers/condition.renderer/condition.renderer.component"
import { SharedModule } from "../_common/shared";
import { NavbarComponent } from "../_navigations/navbar.component";
import { ConditionpadderPipe } from "../reports/cqmreports/viewhelpers/conditionpadder.pipe";
import { ConditionformaterPipe } from "../reports/cqmreports/viewhelpers/conditionformater.pipe";
import { FooterComponent } from "../_navigations/footer.component";
import { ReportsComponent } from "./reports.component";


@NgModule({
  exports: [],
  declarations: [
    ReportsComponent,
    NavbarComponent,
    CategoryreportsComponent,
    CqmreportsComponent,
    EncounterlistComponent,
    MureportsComponent,
    EncounterlistComponent,
    PatientlistComponent,
    ProblemlistComponent,
    Condition,
    ConditionpadderPipe,
    ConditionformaterPipe,
    FooterComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
  ],
})
export class ReportsModule {

}
