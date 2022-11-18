import { ERROR_CODES } from './../../_alerts/alertMessage';
import { AddendaDoc } from './../../_models/_provider/encounter';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, enableProdMode, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { FileUploadService } from 'src/app/_services/file.upload.service';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Attachment } from 'src/app/_models/_provider/LabandImage';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';

export class UploadFileProperties {
  FileExtension: string;
  FileName: string;
  Size: number;
  File: any;
}
@Component({
  selector: 'app-addenda-attach-doc-dialog',
  templateUrl: './addenda.attach.document.html',
  styleUrls: ['./addenda.attach.document.scss']
})
export class AddendaAttachDocumentComponent implements OnInit {

  addendaDocs: AddendaDoc[] = [];
  requestParams: any;
  fileTypes = ".jpg,.gif,.png"
  @Output() PhotoValidatorEvent = new EventEmitter<UploadFileProperties>();
  @ViewChild("fileUpload", { static: true })
  fileUpload: ElementRef;
  files = [];
  patientAddendaColumns: string[] = ['Name', 'Select'];
  uploadingInProgress: boolean = false;

  constructor(private overlayref: EHROverlayRef,
    private alertmsg: AlertMessage,
    private uploadService: FileUploadService,
    private patientService: PatientService,
    authService: AuthenticationService,
    private datePipe: DatePipe) {
    this.requestParams = overlayref.RequestData;
    this.requestParams.FilterDocType = "0"
    this.requestParams.FilterDate = "0"
    console.log(this.requestParams);

  }

  ngOnInit(): void {
    this.PhotoValidatorEvent.subscribe((p: UploadFileProperties) => {
      console.log(p);
      if (this.fileTypes.indexOf(p.FileExtension) > 0 && p.Size < 20 * 1024 * 1024) {
        this.uploadFile(p.File);
      } else {
        this.alertmsg.displayMessageDailog("");
      }
    })
    this.patientAddendaDocs();
  }

  closePopup() {
    this.overlayref.close();
  }

  closePopupWithRefresh() {
    this.overlayref.close({ "Refresh": true });
  }
  patientAddendaDocs() {
    this.patientService.PatientAddendaDocs(this.requestParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.uploadingInProgress = false;
        this.addendaDocs = resp.ListResult;
        console.log(this.addendaDocs);
      } else {
        this.addendaDocs = [];
        this.uploadingInProgress = false;
      }
    })

  }


  uploadFile(file) {
    const formData = new FormData();
    formData.set('AddendaDocs', file, file.name);
    file.inProgress = true;
    this.uploadService.UploadFile(formData, "AddendaDocs", this.requestParams.PatientId).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        this.uploadingInProgress = false;
        return of(`${file.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          let uploadInfo = event.body as Attachment;
          let addendaDoc: AddendaDoc = {};
          addendaDoc.FileName = uploadInfo.FileName;
          addendaDoc.PatientId = this.requestParams.PatientId;
          addendaDoc.strServicedDate = null
          this.patientService.UpdateAddendaDoc(addendaDoc).subscribe(resp => {
            if (resp.IsSuccess) {
              this.patientAddendaDocs();
            } else {
              this.uploadingInProgress = false;
              this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD001'])
            }
          })
        }
      });
  }

  ValidateFileThenUpload(file: any, emitProperties: EventEmitter<UploadFileProperties>) {
    let fileName = file.name;
    let fileExtension = fileName.replace(/^.*\./, '');

    var photoProperties: UploadFileProperties = {
      FileName: fileName,
      FileExtension: fileExtension,
      Size: file.size,
      File: file,
    };
    emitProperties.emit(photoProperties);

  }
  public onChange($event): any {
    if (this.fileUpload.nativeElement.files.length == 1) {
      this.uploadingInProgress = true;
      let file = this.fileUpload.nativeElement.files[0];
      this.ValidateFileThenUpload(file, this.PhotoValidatorEvent);
      this.fileUpload.nativeElement.value = '';
    }
  }

  onSelected(event, source) {
    source.Selected = event.checked;
  }

  attachDocuments() {
    this.addendaDocs.forEach((doc, index) => {
      doc.EncounterId = this.requestParams.EncounterId;
    });
    this.patientService.UpdateAddendaDocs(this.addendaDocs).subscribe(resp => {
      if(resp.IsSuccess){
        this.closePopupWithRefresh()
      }else{
        this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD002'])

      }

    })
  }
}


