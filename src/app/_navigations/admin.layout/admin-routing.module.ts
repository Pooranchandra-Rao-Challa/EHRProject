import { WeeklyUpdatedComponent } from './../../admin/weekly-updated/weekly-updated.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminsComponent } from 'src/app/admin/admins/admins.component';
import { AdminsettingComponent } from 'src/app/admin/adminsetting/adminsetting.component';
import { CommunicationsettingsComponent } from 'src/app/admin/communicationsettings/communicationsettings.component';
import { DefaultmessagesComponent } from 'src/app/admin/defaultmessages/defaultmessages.component';
import { DashboardComponent } from '../../admin/dashboard/dashboard.component';
import { ProviderlistComponent } from '../../admin/providerlist/providerlist.component';
//import { CalendarComponent } from '../../calendar/calendar.component';
import { AdminProviderListComponent } from '../../provider/admin/provider.list.component';
import { AdminComponent} from './admin.component';
import { AdminPracticeComponent } from 'src/app/admin/admin-practice/admin-practice.component';
import { ActivepatientComponent } from 'src/app/admin/activepatient/activepatient.component';
import { InactivepatientComponent } from 'src/app/admin/inactivepatient/inactivepatient.component';
import { EditdefaultmessageComponent } from 'src/app/admin/editdefaultmessage/editdefaultmessage.component';
import { BillingComponent } from 'src/app/admin/billing/billing.component';
import { ReportsComponent } from 'src/app/admin/reports/reports.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      //{ path: "calendar", component: CalendarComponent },
      { path: 'providers', component: AdminProviderListComponent },
      { path: 'providerslist', component: ProviderlistComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admins', component: AdminsComponent },
      { path: 'defaultmessage', component: DefaultmessagesComponent },
      { path: 'setting', component: AdminsettingComponent},
      { path: 'communication', component: CommunicationsettingsComponent },
      { path: 'practice', component: AdminPracticeComponent },
      { path: 'weeklyupdates', component: WeeklyUpdatedComponent },
      { path: 'activepatient', component: ActivepatientComponent },
      { path: 'inactivepatient', component: InactivepatientComponent },
      { path: 'editdefaultmessage', component: EditdefaultmessageComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'reports', component: ReportsComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
