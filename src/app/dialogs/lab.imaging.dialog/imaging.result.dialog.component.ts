import { ImageResultInfo, Attachment } from './../../_models/_provider/LabandImage';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { UPLOAD_URL } from 'src/environments/environment'

@Component({
  selector: 'app-addimagingresultdialog',
  templateUrl: './imaging.result.dialog.component.html',
  styleUrls: ['./imaging.result.dialog.component.scss']
})
export class ImagingResultDialogComponent implements OnInit {

  labandimaging: LabProcedureWithOrder = {};
  EntityName: string = "imageresult";
  fileUploadUrl: string;
  constructor(
    private ref: EHROverlayRef,
    private labsImagingService: LabsImagingService,
    private alertMessage: AlertMessage,
    private datePipe: DatePipe) {

    this.labandimaging = ref.RequestData;
    this.fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')
    if (this.labandimaging.TestResultsOfImages == null)
      this.labandimaging.TestResultsOfImages = new ImageResultInfo();
    this.loadImageResults();
  }

  ngOnInit(): void {
    this.labandimaging.ImageResultId
  }
  cancel() {
    this.ref.close(null);
  }

  SelectToday() {
    this.labandimaging.TestResultsOfImages.ScheduleAt = new Date();
  }

  loadImageResults() {
    this.labsImagingService.ImageResult(this.labandimaging).subscribe(resp => {
      if (resp.IsSuccess) {
        this.labandimaging.TestResultsOfImages = resp.Result;
        if (this.labandimaging.TestResultsOfImages.StrAttachments != null
          && this.labandimaging.TestResultsOfImages.StrAttachments != "")
          this.labandimaging.ImageAttachments =
            JSON.parse(this.labandimaging.TestResultsOfImages.StrAttachments);
        else  this.labandimaging.ImageAttachments = [];
      } else {
        this.labandimaging.TestResultsOfImages = new ImageResultInfo();
        this.labandimaging.ImageAttachments = [];
      }
    })
  }


  saveClicked: boolean = false;
  save() {
    this.saveClicked = true;
    this.labandimaging.TestResultsOfImages.strScheduleAt = this.datePipe.transform(this.labandimaging.TestResultsOfImages.ScheduleAt, "MM/dd/yyyy")
    this.labandimaging.TestResultsOfImages.ScheduleAt = new Date(this.labandimaging.TestResultsOfImages.ScheduleAt)
    this._updateModel();
  }
  sign() {
    this.saveClicked = true;
    this.labandimaging.TestResultsOfImages.strScheduleAt = this.datePipe.transform(this.labandimaging.TestResultsOfImages.ScheduleAt, "MM/dd/yyyy")
    this.labandimaging.TestResultsOfImages.ScheduleAt = new Date(this.labandimaging.TestResultsOfImages.ScheduleAt)
    this.labandimaging.Signed = true;
    this._updateModel();
  }

  _updateModel() {
    let isAdd = this.labandimaging.TestResultsOfImages.ImageResultId == null || this.labandimaging.TestResultsOfImages.ImageResultId == '';

    this.labsImagingService.UpdateImageResult(this.labandimaging).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({ "saved": true });
        this.alertMessage.displayMessageDailog(ERROR_CODES[isAdd ? "M2G1006" : "M2G1007"]);
      } else {
        this.cancel();
        this.alertMessage.displayErrorDailog(ERROR_CODES[isAdd ? "E2G1006" : "E2G1007"]);
      }
    })

  }
  ItemsModified(data) {
    this.labandimaging.ImageAttachments = data;
  }
}
