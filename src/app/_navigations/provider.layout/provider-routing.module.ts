import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from 'src/app/settings/settings.component';

import { CalendarComponent } from '../../provider/calendar/calendar.component';
import { SmartScheduleComponent } from '../../provider/smart.schedule/smart.schedule.component';
import { ProviderComponent } from './provider.component';
import {LabsImagingComponent } from 'src/app/provider/labs.imaging/labs.imaging.component';

const routes: Routes = [
  {
    path: '', component: ProviderComponent,
    children: [
      { path: "calendar", component: CalendarComponent },
      { path: 'smartschedule', component: SmartScheduleComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'labsimaging', component: LabsImagingComponent }, 
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProviderRoutingModule { }
