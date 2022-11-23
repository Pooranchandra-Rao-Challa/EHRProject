import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { AdvancedDirective } from '../../_models/_provider/chart';
import { PatientService } from '../../_services/patient.service';
import { DatePipe } from "@angular/common";
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { PatientChart } from '../../_models/_provider/chart';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProviderPatient } from '../../_models/_provider/Providerpatient';
@Component({
  selector: 'app-advanced.directives.dialog',
  templateUrl: './advanced.directives.dialog.component.html',
  styleUrls: ['./advanced.directives.dialog.component.scss']
})
export class AdvancedDirectivesDialogComponent implements OnInit {
  advDirective: AdvancedDirective;
  currentPatient: ProviderPatient;

  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private authService: AuthenticationService) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
  }

  todayDate() {
    this.advDirective.RecordAt = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  }

  disableadvDirective() {
    return !(this.advDirective.RecordAt && this.advDirective.Notes)
  }

  cancel() {
    this.ref.close({
      "UpdatedModal": PatientChart.AdvancedDirectives
    });
  }

  updateLocalModel(data: AdvancedDirective) {
    this.advDirective = new AdvancedDirective;
    if (data == null) return;
    this.advDirective = data;
  }

  CreateAdvancedDirectives() {
    let isAdd = this.advDirective.AdvancedDirectiveId == "";
    this.advDirective.PatientId = this.currentPatient.PatientId;
    this.advDirective.RecordAt = this.datepipe.transform(this.advDirective.RecordAt, "MM/dd/yyyy hh:mm:ss a");
    this.patientService.CreateAdvancedDirectives(this.advDirective).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.AdvancedDirectives
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
