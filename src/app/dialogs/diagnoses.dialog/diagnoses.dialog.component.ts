import { I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ComponentType } from 'ngx-toastr';
import { Subject } from 'rxjs-compat';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Actions, Diagnosis, DiagnosisDpCodes, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { PatientEducationMaterialDialogComponent } from '../patient.education.material.dialog/patient.education.material.dialog.component';

@Component({
  selector: 'app-add.diagnoses.dialog',
  templateUrl: './diagnoses.dialog.component.html',
  styleUrls: ['./diagnoses.dialog.component.scss']
})
export class AddDiagnosesDialogComponent implements OnInit {
  patientDiagnoses: Diagnosis = {};
  DxCodes: DiagnosisDpCodes[];
  currentPatient: ProviderPatient;
  patientEducationMaterialDialogComponent = PatientEducationMaterialDialogComponent;
  ActionTypes = Actions;
  minDateToFinish = new Subject<string>()
  endDateForDiagnosis: Date;
  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    public overlayService: OverlayService) {
    this.updateLocalModel(ref.RequestData);
    if (this.patientDiagnoses.StartAt) {
      this.endDateForDiagnosis = new Date(this.patientDiagnoses.StartAt);
    }
    if (this.patientDiagnoses.StopAt != (null || '' || undefined)) {
      this.patientDiagnoses.StopAt = this.datepipe.transform(this.patientDiagnoses.StopAt, "yyyy-MM-dd");
    }
    this.minDateToFinish.subscribe(minDate => {
      this.endDateForDiagnosis = new Date(minDate);
    })
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    this.DxCodes = Object.values(DiagnosisDpCodes);
  }

  updateLocalModel(data: Diagnosis) {
    this.patientDiagnoses = {};
    if (data == null) return;
    this.patientDiagnoses = data;
  }

  cancel() {
    // this.ref.close(null);
    this.ref.close({
      "UpdatedModal": PatientChart.Diagnoses,
    });
  }

  todayStartAt() {
    this.patientDiagnoses.StartAt = new Date();
    let val = this.patientDiagnoses.StartAt;
    this.minDateToFinish.next(val.toString());
  }
  todayStopAt() {
    this.patientDiagnoses.StopAt = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  }
  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }

  CreateDiagnosis() {
    let isAdd = this.patientDiagnoses.DiagnosisId == undefined;
    this.patientDiagnoses.PatientId = this.currentPatient.PatientId;
    this.patientDiagnoses.Acute = true;
    this.patientDiagnoses.Terminal = false;
    this.patientDiagnoses.Referral = false;
    this.patientDiagnoses.Primary = false;
    this.patientDiagnoses.ProviderId = this.currentPatient.ProviderId;
    this.patientDiagnoses.StartAt = new Date(this.datepipe.transform(this.patientDiagnoses.StartAt, "yyyy-MM-dd", "en-US"));
    this.patientDiagnoses.strStartAt = this.datepipe.transform(this.patientDiagnoses.StartAt, "MM/dd/yyyy hh:mm:ss a", "en-US")
    this.patientDiagnoses.StopAt = this.datepipe.transform(this.patientDiagnoses.StopAt, "MM/dd/yyyy hh:mm:ss a", "en-US");
    let reqparams = {}
    Object.assign(reqparams,this.patientDiagnoses);
    console.log(reqparams);

    this.patientService.CreateDiagnosis(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.Diagnoses,
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CD001" : "M2CD002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CD001"]);
        this.cancel();
      }
    });
  }

  disableDiagnosis() {
    return !(this.patientDiagnoses.CodeSystem && this.patientDiagnoses.Code &&
      this.patientDiagnoses.Description && this.patientDiagnoses.StartAt
      && this.patientDiagnoses.Note)
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.patientEducationMaterialDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
    });
  }

  DeleteDiagnosis(){
    this.patientService.DeleteDiagnosis(
      {DiagnosisId: this.patientDiagnoses.DiagnosisId,
      PatinetId: this.patientDiagnoses.PatientId,
      ProviderId: this.authService.userValue.ProviderId}).subscribe(
        {
          next: (resp)=>{
            if(resp.IsSuccess){
              this.alertmsg.displayMessageDailog(ERROR_CODES["M2CD003"]);
              this.cancel();
            }else{
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2CD002"]);
              this.cancel();
            }
          },
          error: (error)=>{
            this.alertmsg.displayErrorDailog(ERROR_CODES["E2CD002"]);
            this.cancel();
          },
          complete: () =>{

          }

        });
  }

}
