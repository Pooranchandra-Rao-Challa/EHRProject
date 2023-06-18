import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from 'src/app/provider/settings/settings.component';
import { CalendarComponent } from '../../provider/calendar/calendar.component';
import { SmartScheduleComponent } from '../../provider/smart.schedule/smart.schedule.component';
import { ProviderComponent } from './provider.component';
import { LabsImagingComponent } from 'src/app/provider/labs.imaging/labs.imaging.component';
import { PatientsComponent } from '../../provider/patients/patients.component';
import { PatientDetailsComponent } from '../../provider/patients/patient.details/patient.details.component';
import { DirectMsgComponent } from '../../provider/directmsg/directmsg.component';
import { ErxComponent } from '../../provider/erx/erx.component';
import { BillingComponent } from '../../provider/billing/billing.component';
import { MessagesComponent } from '../../provider/messages/messages.component';
import { CategoryreportsComponent } from "../../reports/categoryreports/categoryreports.component";
import { AuthGuard } from 'src/app/_helpers/auth.guard';

const routes: Routes = [
  {
    path: '', component: ProviderComponent,canActivateChild: [AuthGuard],
    children: [
      { path: "calendar", component: CalendarComponent,  },
      { path: 'smartschedule', component: SmartScheduleComponent, },
      { path: 'settings', component: SettingsComponent, },
      { path: 'patients', component: PatientsComponent,  },
      { path: 'patientdetails', component: PatientDetailsComponent, },
      { path: 'directmsg', component: DirectMsgComponent, },
      { path: 'erx', component: ErxComponent,  },
      { path: 'billing', component: BillingComponent, },
      { path: 'messages', component: MessagesComponent,  },
      { path: 'labsimaging', component: LabsImagingComponent,  },
      { path: 'categoryreports', component: CategoryreportsComponent,  }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProviderRoutingModule { }
