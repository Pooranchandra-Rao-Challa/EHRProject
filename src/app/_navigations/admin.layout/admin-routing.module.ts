import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { CalendarComponent } from '../../calendar/calendar.component';
import { AdminProviderListComponent } from '../../provider/admin/provider.list.component';
import { AdminComponent} from './admin.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      //{ path: "calendar", component: CalendarComponent },
      { path: 'providers', component: AdminProviderListComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
