import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ReportsComponent } from './reports.component';
//import { CQMReportsComponent } from '../reports/cqm.reports.component';
//import { MUReportsComponent } from '../reports/mu-reports.component';

const routes: Routes = [
    {
        //path: '', component: ReportsComponent,
        children: [
           // { path: 'cqmreports', component: CQMReportsComponent },
           // { path: 'mureports', component: MUReportsComponent },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProviderRoutingModule { }
