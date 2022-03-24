import { MessageComponent } from './../../patient/message.component';
import { AppointmentComponent } from './../../patient/appointment.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { CalendarComponent } from '../../calendar/calendar.component';
import { DashboardComponent } from '../../patient/dashboard.component';
import { PatientComponent} from './patient.component';
import { MyprofileComponent } from 'src/app/patient/myprofile.component';
import { MyhealthComponent } from 'src/app/patient/myhealth.component';
import { DocumentComponent } from 'src/app/patient/document.component';

const routes: Routes = [
  {
    path: '', component: PatientComponent,
    children: [
      //{ path: "calendar", component: CalendarComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'appointment', component: AppointmentComponent },
      { path: 'document', component: DocumentComponent },
      { path: 'message', component: MessageComponent },
      { path: 'health', component: MyhealthComponent },
      { path: 'profile', component: MyprofileComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PatientRoutingModule { }
