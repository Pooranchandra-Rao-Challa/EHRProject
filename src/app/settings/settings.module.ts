
import {  NgModule } from '@angular/core';
import { PracticeComponent } from './practice.component';
import { ScheduleComponent } from './schedule.component';
import { ErxComponent } from './erx.component';
import { AuditLogComponent } from './auditlog.component';
import { AccessPermissionComponent } from './access.permission.component';
import { PatientSettinsComponent } from './patient.component';
import { ReportsSettingsComponent } from './reports.component';
import { PatientEdnMaterialComponent } from './patientednmaterial.component';
import { MessageSettingsComponent } from './message.component';
import { LabMappingComponent } from './labmapping.component';
import { ClinicDecisionComponent } from './clinicdecision.component';
@NgModule({
  imports: [],
  exports: [PracticeComponent,ScheduleComponent,ErxComponent,AuditLogComponent,
    AccessPermissionComponent,PatientSettinsComponent,ReportsSettingsComponent,
    PatientEdnMaterialComponent,MessageSettingsComponent,LabMappingComponent,
    ClinicDecisionComponent],
  declarations: [PracticeComponent,ScheduleComponent,ErxComponent,AuditLogComponent,
    AccessPermissionComponent,PatientSettinsComponent,ReportsSettingsComponent,
    PatientEdnMaterialComponent,MessageSettingsComponent,LabMappingComponent,
    ClinicDecisionComponent],
  providers: [],
})

export class SettingsModule {
}
