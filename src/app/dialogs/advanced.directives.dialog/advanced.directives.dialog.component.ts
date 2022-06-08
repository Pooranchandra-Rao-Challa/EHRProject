import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { AdvancedDirectives } from '../../_models/chart';
import { patientService } from '../../_services/patient.service';
import { DatePipe } from "@angular/common";
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advanced.directives.dialog',
  templateUrl: './advanced.directives.dialog.component.html',
  styleUrls: ['./advanced.directives.dialog.component.scss']
})
export class AdvancedDirectivesDialogComponent implements OnInit {
  advDirective: AdvancedDirectives = {} as AdvancedDirectives;

  constructor(private ref: EHROverlayRef,
    private patientService: patientService,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private router: Router) {
    let data: AdvancedDirectives = ref.RequestData;
    this.advDirective = data;
    // this.advDirective.RecordAt = new Date(data.RecordAt).toString();
  }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }

  CreateAdvancedDirectives(reqparams) {
    let isAdd = this.advDirective.AdvancedDirectiveId == null;
    reqparams.RecordAt = this.datepipe.transform(this.advDirective.RecordAt, "MM/dd/yyyy hh:mm:ss");
    this.patientService.CreateAdvancedDirectives(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CAD001" : "M2CAD002"]);
        this.cancel();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CAD001"]);
        this.cancel();
      }
    });
  }

}
