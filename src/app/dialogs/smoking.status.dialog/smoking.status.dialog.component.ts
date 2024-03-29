import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { SmokingStatus } from 'src/app/_models/_provider/chart';
import { PatientService } from '../../_services/patient.service';
import { DatePipe } from "@angular/common";
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProviderPatient } from '../../_models/_provider/Providerpatient';
import { PatientChart } from '../../_models/_provider/chart';

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
      this.smokingStatus.EffectiveFrom = this.datepipe.transform(this.smokingStatus.EffectiveFrom, "yyyy-MM-dd");
    }
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
  }

  todayDate() {
    this.smokingStatus.EffectiveFrom = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    //moment(new Date()).format('YYYY-MM-DD');
  }

  disablesmokingStatus() {
    return !(this.smokingStatus.Status && this.smokingStatus.EffectiveFrom);
  }

  cancel() {
    this.ref.close({
      "UpdatedModal": PatientChart.SmokingStatus
    });
  }

  updateLocalModel(data: SmokingStatus) {
    this.smokingStatus = new SmokingStatus;
    if (data == null) return;
    this.smokingStatus = data;
  }

  CreateSmokingStatus() {
    let isAdd = this.smokingStatus.SmokingStatusId == undefined;
    this.smokingStatus.PatientId = this.currentPatient.PatientId;
    this.smokingStatus.EffectiveFrom = this.datepipe.transform(this.smokingStatus.EffectiveFrom, "MM/dd/yyyy hh:mm:ss a");
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
