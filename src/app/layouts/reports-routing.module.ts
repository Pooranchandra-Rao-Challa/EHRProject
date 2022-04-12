import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsComponent } from './reports.component';
import { AuthGuard } from "../_helpers/auth.guard";
//import { CategoryreportsComponent } from "../reports/categoryreports/categoryreports.component";
import { CqmreportsComponent } from "../reports/cqmreports/cqmreports.component";
import { EncounterlistComponent } from "../reports/encounterlist/encounterlist.component";
import { MureportsComponent } from "../reports/mureports/mureports.component";
import { PatientlistComponent } from "../reports/patientlist/patientlist.component";
import { ProblemlistComponent } from "../reports/problemlist/problemlist.component";
//import { CalendarComponent } from '../provider/calendar/calendar.component';

const routes: Routes = [
  {
    path: '', component: ReportsComponent,
    children: [
      { path: "cqmreports", component: CqmreportsComponent },
      { path: "problemlist", component: ProblemlistComponent },
      { path: "patientlist", component: PatientlistComponent },
      { path: "encounterlist", component: EncounterlistComponent },
      { path: "mureports", component: MureportsComponent },
     // { path: "categoryreports", component: CategoryreportsComponent }
    ],
    canActivate: [AuthGuard],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportsRoutingModule { }
