import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { AdvancedDirective } from '../../_models/_provider/chart';
import { PatientService } from '../../_services/patient.service';
import { DatePipe } from "@angular/common";
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { Router } from '@angular/router';
import { PatientChart } from '../../_models/_provider/chart';
const moment = require('moment');
@Component({
  selector: 'app-advanced.directives.dialog',
  templateUrl: './advanced.directives.dialog.component.html',
  styleUrls: ['./advanced.directives.dialog.component.scss']
})
export class AdvancedDirectivesDialogComponent implements OnInit {
  advDirective: AdvancedDirective;
  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private router: Router) {

    this.updateLocalModel(ref.RequestData);
    if (this.advDirective.RecordAt != (null || '' || undefined)) {
      this.advDirective.RecordAt = moment(this.advDirective.RecordAt).format('YYYY-MM-DD');
    }
  }

  ngOnInit(): void {
  }

  todayDate() {
    this.advDirective.RecordAt = moment(new Date()).format('YYYY-MM-DD');
  }

  cancel() {
    //this.resetDialog();
    this.ref.close(null);
  }

  updateLocalModel(data: AdvancedDirective) {
    this.advDirective = new AdvancedDirective;
    if (data == null) return;
    this.advDirective = data;
  }

  resetDialog() {
    // console.log(this.advDirective);
    this.advDirective = new AdvancedDirective;
    this.ref.close({
      "UpdatedModal": PatientChart
    });
    // console.log(this.advDirective);
  }

  CreateAdvancedDirectives(reqparams) {
    let isAdd = this.advDirective.AdvancedDirectiveId == (null || '' || undefined);
    reqparams.RecordAt = this.datepipe.transform(this.advDirective.RecordAt, "MM/dd/yyyy hh:mm:ss");
    this.patientService.CreateAdvancedDirectives(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        // this.cancel();
        this.ref.close({
          "UpdatedModal": PatientChart
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CAD001" : "M2CAD002"]);
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CAD001"]);
      }
    });
  }
}
