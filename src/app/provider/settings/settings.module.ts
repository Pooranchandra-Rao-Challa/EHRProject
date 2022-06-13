import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
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
import { SharedModule } from '../../_common/shared';
import { CommonModule } from '@angular/common';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ColorPickerModule } from 'ngx-color-picker';
//import { GroupByPipe } from 'src/app/_pipes/group-by.pipe';
//import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { WeekdayFormatPipe } from 'src/app/_pipes/weekday-format-pipe'
// import { GroupByPipe } from 'src/app/pipes/group-by.pipe';



@NgModule({
  imports: [SharedModule, CommonModule, NgxMaskModule.forRoot(), ColorPickerModule],
  exports: [PracticeComponent, ScheduleComponent, ErxComponent, AuditLogComponent,
    AccessPermissionComponent, PatientSettinsComponent, ReportsSettingsComponent,
    PatientEdnMaterialComponent, MessageSettingsComponent, LabMappingComponent,
    ClinicDecisionComponent,WeekdayFormatPipe],
  declarations: [PracticeComponent, ScheduleComponent, ErxComponent, AuditLogComponent,
    AccessPermissionComponent, PatientSettinsComponent, ReportsSettingsComponent,
    PatientEdnMaterialComponent, MessageSettingsComponent, LabMappingComponent,
    ClinicDecisionComponent,WeekdayFormatPipe],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SettingsModule {
}
