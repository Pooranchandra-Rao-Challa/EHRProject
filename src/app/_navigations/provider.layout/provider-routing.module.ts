import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from '../../provider/calendar/calendar.component';
import { SmartScheduleComponent } from '../../provider/smart.schedule/smart.schedule.component';
import { ProviderComponent } from './provider.component';

const routes: Routes = [
  {
    path: '', component: ProviderComponent,
    children: [
      { path: "calendar", component: CalendarComponent },
      { path: 'smartschedule', component: SmartScheduleComponent },

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProviderRoutingModule { }
