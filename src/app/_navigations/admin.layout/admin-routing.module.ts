import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderlistComponent } from 'src/app/admin/providerlist.component';
import { DashboardComponent } from 'src/app/admin/dashboard/dashboard.component';

//import { CalendarComponent } from '../../calendar/calendar.component';
import { AdminProviderListComponent } from '../../provider/admin/provider.list.component';
import { AdminComponent} from './admin.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      //{ path: "calendar", component: CalendarComponent },
      { path: 'providers', component: AdminProviderListComponent },
      { path: 'providerslist', component: ProviderlistComponent },
      { path: 'dashboard', component: DashboardComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
