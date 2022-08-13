import { ImageResultInfo } from './../../_models/_provider/LabandImage';
import { DatePipe } from '@angular/common';
import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { LabsImagingService } from 'src/app/_services/labsimaging.service';

@Component({
  selector: 'app-addimagingresultdialog',
  templateUrl: './imaging.result.dialog.component.html',
  styleUrls: ['./imaging.result.dialog.component.scss']
})
export class ImagingResultDialogComponent implements OnInit {

  labandimaging: LabProcedureWithOrder = {};

  constructor(
    private ref: EHROverlayRef,
    private labsImagingService: LabsImagingService,
    private alertMessage: AlertMessage,
    private datePipe: DatePipe) {

    this.labandimaging = ref.RequestData;
    console.log(this.labandimaging);

    if (this.labandimaging.TestResultsOfImages == null){
      this.labandimaging.TestResultsOfImages = {};
      this.loadImageResults();
    }


  }

  ngOnInit(): void {

  }
  cancel() {
    this.ref.close(null);
  }

  SelectToday(){
    this.labandimaging.TestResultsOfImages.ScheduleAt = new Date();
  }

  loadImageResults(){
    this.labsImagingService.ImageResult(this.labandimaging).subscribe(resp => {
      if(resp.IsSuccess){
        this.labandimaging.TestResultsOfImages = resp.Result
        console.log( this.labandimaging.TestResultsOfImages);

      }else{
        this.labandimaging.TestResultsOfImages = {}
      }
    })
  }

  copyResults(){
    let r1: ImageResultInfo = {};
    r1.Exam = this.labandimaging.TestResultsOfImages.Exam;
    r1.Comparison = this.labandimaging.TestResultsOfImages.Comparison;
    r1.Findings = this.labandimaging.TestResultsOfImages.Findings;
    r1.History = this.labandimaging.TestResultsOfImages.History;
    r1.ImageResultId = this.labandimaging.TestResultsOfImages.ImageResultId;
    r1.Impression = this.labandimaging.TestResultsOfImages.Impression;
    r1.LabProcedureId = this.labandimaging.TestResultsOfImages.LabProcedureId;
    r1.RadioPharmaceutical = this.labandimaging.TestResultsOfImages.RadioPharmaceutical;
    r1.RequestedBy = this.labandimaging.TestResultsOfImages.RequestedBy;
    r1.ScheduleAt = this.labandimaging.TestResultsOfImages.ScheduleAt;
    r1.Technique = this.labandimaging.TestResultsOfImages.Technique;
    r1.strScheduleAt = this.labandimaging.TestResultsOfImages.strScheduleAt;
    this.labandimaging.TestResultsOfImages = r1;
  }

  saveClicked: boolean = false;
  save(){
    this.saveClicked = true;
    this.labandimaging.TestResultsOfImages.strScheduleAt = this.datePipe.transform(this.labandimaging.TestResultsOfImages.ScheduleAt,"MM/dd/yyyy")
    this.labandimaging.TestResultsOfImages.ScheduleAt = new Date(this.labandimaging.TestResultsOfImages.ScheduleAt)
    this._updateModel();
  }
  sign(){
    this.saveClicked = true;
    this.labandimaging.TestResultsOfImages.strScheduleAt = this.datePipe.transform(this.labandimaging.TestResultsOfImages.ScheduleAt,"MM/dd/yyyy")
    this.labandimaging.TestResultsOfImages.ScheduleAt = new Date(this.labandimaging.TestResultsOfImages.ScheduleAt)
    this.labandimaging.Signed = true;
    this._updateModel();
  }

  _updateModel(){

    this.copyResults();
    let isAdd = this.labandimaging.TestResultsOfImages.ImageResultId == null || this.labandimaging.TestResultsOfImages.ImageResultId == '';

    this.labsImagingService.UpdateImageResult(this.labandimaging).subscribe(resp =>{
      if(resp.IsSuccess){
        this.ref.close({ "saved": true });
        this.alertMessage.displayMessageDailog(ERROR_CODES[isAdd ? "M2G1006" : "M2G1007"]);
      }else{
        this.cancel();
        this.alertMessage.displayErrorDailog(ERROR_CODES[isAdd ? "E2G1006" : "E2G1007"]);
      }
    })

  }
}
