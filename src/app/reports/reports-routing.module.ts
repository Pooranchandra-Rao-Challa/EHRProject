import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
//import { CQMReportsComponent } from '../CQMReports/CQMReports.component';
//import { MUReportsComponent } from '../mu-reports/mu-reports.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        /*children: [
            { path: 'cqmreports', component: CQMReportsComponent },
            { path: 'mureports', component: MUReportsComponent },
        ]*/
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportsRoutingModule { }
