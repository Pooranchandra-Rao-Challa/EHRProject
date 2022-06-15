import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { SmokingStatus } from 'src/app/_models/_provider/chart';
import { PatientService } from '../../_services/patient.service';
import { DatePipe } from "@angular/common";
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProviderPatient } from '../../_models/_provider/Providerpatient';
import { PatientChart } from '../../_models/_provider/chart';
const moment = require('moment');

@Component({
  selector: 'app-smoking.status.dialog',
  templateUrl: './smoking.status.dialog.component.html',
  styleUrls: ['./smoking.status.dialog.component.scss']
})
export class SmokingStatusDialogComponent implements OnInit {
  smokingStatus: SmokingStatus;
  currentPatient: ProviderPatient;

  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private authService: AuthenticationService) {
    this.updateLocalModel(ref.RequestData);
    if (this.smokingStatus.EffectiveFrom != (null || '' || undefined)) {
      this.smokingStatus.EffectiveFrom = moment(this.smokingStatus.EffectiveFrom).format('YYYY-MM-DD');
    }
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
  }

  todayDate() {
    this.smokingStatus.EffectiveFrom = new Date;
  }

  disablesmokingStatus() {
    return !(this.smokingStatus.Status != undefined
      && this.smokingStatus.EffectiveFrom != undefined)
  }

  cancel() {
    this.ref.close(null);
  }

  updateLocalModel(data: SmokingStatus) {
    this.smokingStatus = new SmokingStatus;
    if (data == null) return;
    this.smokingStatus = data;
  }

  CreateSmokingStatus() {
    let isAdd = this.smokingStatus.SmokingStatusId == "";
    this.smokingStatus.PatientId = this.currentPatient.PatientId;
    this.patientService.CreateSmokingStatus(this.smokingStatus).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.SmokingStatus
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CSS001" : "M2CSS002"]);
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CSS001"]);
      }
    });
  }

}
