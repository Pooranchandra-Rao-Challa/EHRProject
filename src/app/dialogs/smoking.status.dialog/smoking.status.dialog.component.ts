import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { SmokingStatus } from 'src/app/_models/_provider/chart';
import { patientService } from '../../_services/patient.service';
import { DatePipe } from "@angular/common";
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

const moment = require('moment');

@Component({
  selector: 'app-smoking.status.dialog',
  templateUrl: './smoking.status.dialog.component.html',
  styleUrls: ['./smoking.status.dialog.component.scss']
})
export class SmokingStatusDialogComponent implements OnInit {
  smokingStatus: SmokingStatus = {} as SmokingStatus;

  constructor(private ref: EHROverlayRef,
    private patientService: patientService,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage) {
    let data: SmokingStatus = ref.RequestData;
    this.smokingStatus = data;
    if (data.EffectiveFrom != (null || '' || undefined)) {
      this.smokingStatus.EffectiveFrom = moment(data.EffectiveFrom).format('YYYY-MM-DD');
    }
  }

  ngOnInit(): void {
  }

  todayDate() {
    this.smokingStatus.EffectiveFrom = moment(new Date()).format('YYYY-MM-DD');
  }

  cancel() {
    this.ref.close(null);
  }

  CreateSmokingStatus() {
    let isAdd = this.smokingStatus.SmokingStatusId == (null || '' || undefined);
    this.smokingStatus.EffectiveFrom = this.datepipe.transform(this.smokingStatus.EffectiveFrom, "MM/dd/yyyy hh:mm:ss");
    this.patientService.CreateSmokingStatus(this.smokingStatus).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.cancel();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CSS001" : "M2CSS002"]);
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CSS001"]);
      }
    });
  }

}
