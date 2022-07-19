import { WeeklyUpdatedComponent } from './../../admin/weekly-updated/weekly-updated.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminsComponent } from 'src/app/admin/admins/admins.component';
import { AdminsettingComponent } from 'src/app/admin/adminsetting/adminsetting.component';
import { CommunicationsettingsComponent } from 'src/app/admin/communicationsettings/communicationsettings.component';
import { DefaultMessagesComponent } from 'src/app/admin/defaultmessages/defaultmessages.component';
import { DashboardComponent } from '../../admin/dashboard/dashboard.component';
import { ProviderlistComponent } from '../../admin/providerlist/providerlist.component';
//import { CalendarComponent } from '../../calendar/calendar.component';
//import { AdminProviderListComponent } from '../../provider/admin/provider.list.component';
import { AdminComponent} from './admin.component';
import { AdminPracticeComponent } from 'src/app/admin/admin-practice/admin-practice.component';
import { ActivePatientsComponent } from 'src/app/admin/activepatients/activepatients.component';
import { InActivePatientsComponent } from 'src/app/admin/inactivepatients/inactivepatients.component';
import { EditDefaultMessageComponent } from 'src/app/admin/editdefaultmessage/editdefaultmessage.component';
import { BillingComponent } from 'src/app/admin/billing/billing.component';
import { ReportsComponent } from 'src/app/admin/reports/reports.component';
import { SectionNewComponent } from 'src/app/admin/section-new/section-new.component';
import { ImportPatientsComponent } from 'src/app/admin/import-patients/import-patients.component';
import { ImportEncountersComponent } from 'src/app/admin/import-encounters/import-encounters.component';
import { ListImportedDataComponent } from 'src/app/admin/list-imported-data/list-imported-data.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      //{ path: "calendar", component: CalendarComponent },
      //{ path: 'providers', component: AdminProviderListComponent },
      { path: 'providerslist', component: ProviderlistComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admins', component: AdminsComponent },
      { path: 'defaultmessage', component: DefaultMessagesComponent },
      { path: 'setting', component: AdminsettingComponent},
      { path: 'communication', component: CommunicationsettingsComponent },
      { path: 'practice', component: AdminPracticeComponent },
      { path: 'weeklyupdates', component: WeeklyUpdatedComponent },
      { path: 'activepatient', component: ActivePatientsComponent },
      { path: 'inactivepatient', component: InActivePatientsComponent },
      { path: 'editdefaultmessage', component: EditDefaultMessageComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'sectionnew', component: SectionNewComponent },
      { path: 'importpatient', component: ImportPatientsComponent },
      { path: 'importencounter', component: ImportEncountersComponent },
      { path: 'importeddata', component: ListImportedDataComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
