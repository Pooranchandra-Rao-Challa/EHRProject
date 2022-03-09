import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from '../../calendar/calendar.component';
import { SmartSchedulerComponent } from '../../provider/smart.scheduler.component';
import { ProviderComponent} from './provider.component';

const routes: Routes = [
  {
    path: '', component: ProviderComponent,
    children: [
      { path: "calendar", component: CalendarComponent },
      { path: 'smartscheduler', component: SmartSchedulerComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProviderRoutingModule { }
