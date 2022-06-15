import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { User } from 'src/app/_models';
import { Accountservice } from 'src/app/_services/account.service';
import { VitalInfo } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';


@Component({
  selector: 'app-vital-dialog',
  templateUrl: './vital.dialog.component.html',
  styleUrls: ['./vital.dialog.component.scss']
})
export class VitalDialogComponent {
  VitalInfoFG: FormGroup;
  Vital: VitalInfo = new VitalInfo;
  CollectedTime: string;
  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService) {
    this.UpdateVital(ref.RequestData)
  }

  UpdateVital(data: any) {
    this.Vital = new VitalInfo;
    if (data == null) return;
    this.Vital = data;
    // console.log(this.Vital.CollectedAt.toTimeString().split(' ')[0]);

    this.CollectedTime = this.Vital.CollectedAt.toTimeString().substring(0, 5);
    // console.log(this.Vital);

  }
  BloodTypes = [
    { Id: 1, BloodType: 'Group A' },
    { Id: 2, BloodType: 'Group B' },
    { Id: 3, BloodType: 'Group AB' },
    { Id: 4, BloodType: 'Group O' }
  ]

  closePopup() {
    this.ref.close();
  }
}
