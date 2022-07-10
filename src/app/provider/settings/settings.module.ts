import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { PracticeComponent } from './practice.component';
import { ScheduleComponent } from './schedule.component';
import { ErxComponent } from './erx.component';
import { AuditLogComponent } from './auditlog.component';
import { AccessPermissionComponent } from './access.permission.component';
import { PatientEdnMaterialComponent } from './patientednmaterial.component';
import { ClinicDecisionComponent } from './clinicdecision.component';
import { SharedModule } from '../../_common/shared';
import { CommonModule } from '@angular/common';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ColorPickerModule } from 'ngx-color-picker';
import { WeekdayFormatPipe } from 'src/app/_pipes/weekday-format-pipe'
import { ToggleFullscreenDirective } from 'src/app/_directives/fullscreen.directive';
import { TimeMaskSettingsDirective} from 'src/app/_directives/input.time.mask.directive.settings'

@NgModule({
  imports: [SharedModule, CommonModule, NgxMaskModule.forRoot(), ColorPickerModule,],
  exports: [PracticeComponent, ScheduleComponent, ErxComponent, AuditLogComponent,
    AccessPermissionComponent,
    PatientEdnMaterialComponent,
    ClinicDecisionComponent,WeekdayFormatPipe,ToggleFullscreenDirective],
  declarations: [PracticeComponent, ScheduleComponent, ErxComponent, AuditLogComponent,
    AccessPermissionComponent,
    PatientEdnMaterialComponent,
    ClinicDecisionComponent,WeekdayFormatPipe,ToggleFullscreenDirective,TimeMaskSettingsDirective],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SettingsModule {
}
