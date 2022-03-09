import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { CalendarComponent } from '../../calendar/calendar.component';
import { DashboardComponent } from '../../patient/dashboard.component';
import { PatientComponent} from './patient.component';

const routes: Routes = [
  {
    path: '', component: PatientComponent,
    children: [
      //{ path: "calendar", component: CalendarComponent },
      { path: 'dashboard', component: DashboardComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PatientRoutingModule { }
