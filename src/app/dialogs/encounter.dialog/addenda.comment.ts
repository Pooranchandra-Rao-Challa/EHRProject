import { Component, ElementRef, OnInit, TemplateRef, ViewChild, enableProdMode, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';
import { Attachment } from 'src/app/_models/_provider/LabandImage';
import { SettingsService } from 'src/app/_services/settings.service';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AddendaComment } from 'src/app/_models';


export class UploadFileProperties {
  FileExtension: string;
  FileName: string;
  Size: number;
  File: any;
}
@Component({
  selector: 'app-addenda-comment-dialog',
  templateUrl: './addenda.comment.html',
  styleUrls: ['./addenda.comment.scss']
})
export class AddendaCommentComponent implements OnInit {

  addendaComment: AddendaComment = {};

  constructor(private overlayref: EHROverlayRef,
    private alertmsg: AlertMessage,
    private patientService: PatientService){
      this.addendaComment = overlayref.RequestData as AddendaComment;
      this.addendaComment.Source = "Doctor";
    }

  ngOnInit(): void {}

  closePopup() {
    this.overlayref.close();
  }
  closePopupWithRefresh() {
    this.overlayref.close({'Refresh': true});
  }

  CancelAddendum(){

  }
  AcceptAddendum(){
    this.addendaComment.Action = 'Accept';
    this.UpdateAddendum();
  }
  DenyAddendum(){
    this.addendaComment.Action = 'Deny';
    this.UpdateAddendum();
  }
  UpdateAddendum(){
    this.patientService.CreateAddendum(this.addendaComment).subscribe((resp)=>{
      if(resp.IsSuccess){
        this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD007'])
        this.closePopupWithRefresh();
      }else{
        this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD008'])
        this.closePopup()
      }
    })
  }
}
