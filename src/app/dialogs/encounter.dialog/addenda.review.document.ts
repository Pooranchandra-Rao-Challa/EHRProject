import { AddendaDoc, AddendaDocType, EncounterInfo } from './../../_models/_provider/encounter';
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
import { timeStamp } from 'console';


export class UploadFileProperties {
  FileExtension: string;
  FileName: string;
  Size: number;
  File: any;
}
@Component({
  selector: 'app-addenda-review-doc-dialog',
  templateUrl: './addenda.review.document.html',
  styleUrls: ['./addenda.review.document.scss']
})
export class AddendaReviewDocumentComponent implements OnInit {
  addendaDoc: AddendaDoc;
  encounters: EncounterInfo[];
  addendaDocTypes: AddendaDocType[];
  addendaDocTypeFilter: AddendaDocType[];
  refreshingEncounters: boolean = false;
  Imagedata: string;
  @ViewChild('searchDocType', { static: true }) searchDocType: ElementRef;
  addButtonText: string = '';
  displayMessage: boolean = true;
  selectedDocumentType: AddendaDocType;
  newDocumentType: string;

  constructor(private overlayref: EHROverlayRef,
    private alertmsg: AlertMessage,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private settingsService: SettingsService,
    private datePipe: DatePipe) {
    this.addendaDoc = overlayref.RequestData as AddendaDoc;
  }
  closePopup() {
    this.overlayref.close();
  }
  closePopupWithRefresh() {
    this.overlayref.close({'Refresh': true});
  }

  AssignToMe() {
    this.addendaDoc.SelectedProviderId = this.addendaDoc.ProviderId;
  }
  ngOnInit(): void {
    this.refreshingEncounters = true;
    this.patientService.EncountersForAddendaDoc({ "AddendaDocId": this.addendaDoc.AddendaDocId })
      .subscribe((resp) => {
        console.log(resp);

        if (resp.IsSuccess) {
          this.encounters = resp.ListResult as EncounterInfo[]
          this.refreshingEncounters = false;
        } else this.refreshingEncounters = false;
      })

    this.patientService.AddendaDocumentTypes({ "ClinicId": this.authService.userValue.ClinicId })
      .subscribe((resp) => {
        if (resp.IsSuccess) {
          this.addendaDocTypes = resp.ListResult as AddendaDocType[]
          this.addendaDocTypes.forEach((value) => {
            if (this.addendaDoc.DocTypeId == value.DocTypeId)
              this.selectedDocumentType = value;
          })
        } else {
          this.addendaDocTypes = []
        }
      })
    let a: Attachment = {
      FileName: "",
      AttachmentId: "",
      FullFileName: this.addendaDoc.FileName,
      EntityId: "",
      EntityName: "AddendaDocs"
    }
    this.settingsService.PhotoToBase64String(a).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Imagedata = resp.Result;
      }
    });

    fromEvent(this.searchDocType.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.addendaDocTypeFilter = []
        console.log(event);

        if (event.target.value == '') {
          this.displayMessage = true;
          this.addButtonText = '';
          this.newDocumentType = '';
        }
        return event.target.value;
      })
      // if character length greater then 0
      , filter(res => res.length > 0)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => {
      this.displayMessage = false;
      this.addendaDocTypeFilter = this.addendaDocTypes
          .filter((unit) => unit.DocType.toLowerCase().indexOf(value.toLowerCase()) > -1)

      this.addendaDocTypes.forEach(element => {
        if (value != '' && element.DocType.toLowerCase() != value.toLowerCase()) {
          this.addButtonText = `Add '${value}'`;
          this.newDocumentType = value;
        } else this.addButtonText = ''
      });
      if(this.addendaDocTypes.length == 0){
        this.addButtonText = `Add '${value}'`;
        this.newDocumentType = value;
      }

    });
  }


  AddDocumentType() {
    if (this.newDocumentType != '') {
      this.patientService.CreateAddendaDocType(
        {
          AddendaDocTypeId: null,
          DocType: this.newDocumentType,
          "ClinicId": this.authService.userValue.ClinicId
        }
      ).subscribe((resp) => {
        if (resp.IsSuccess) {
          var addendaDocType: AddendaDocType = {};
          addendaDocType.DocTypeId = resp.Result.C_id;
          addendaDocType.ClinicId = resp.Result.clinic_id;
          addendaDocType.DocType = resp.Result.doc_type;
          this.selectedDocumentType = addendaDocType;
          this.addendaDocTypes.push(addendaDocType);
          this.addButtonText = '';
          this.newDocumentType = '';
          this.showMessage();
        }

      })
    }
  }

  showMessage() {
    Swal.fire({
      title: 'Document Type Saved Successfully.',
      position: 'top',
      background: '#e1dddd',
      timer: 4000,
      timerProgressBar: true,
      width: '500',
      customClass: {
        container: 'swal2-container-high-zindex',
        confirmButton: 'swal2-messaage'
      },
      didOpen: () => {
        Swal.showLoading(Swal.getCloseButton())
      },
    })
  }
  displayDocType(value: AddendaDocType) {
    if(value != null)
    return value.DocType;
  }
  onDocumentTypeSelected(event) {
    this.addButtonText = ''
    this.selectedDocumentType = event.option.value;
    this.addendaDoc.DocType = this.selectedDocumentType.DocType
    this.addendaDoc.DocTypeId = this.selectedDocumentType.DocTypeId
  }

  saveAddendaDocReview(){
    this.addendaDoc.DocType = this.selectedDocumentType.DocType
    this.addendaDoc.DocTypeId = this.selectedDocumentType.DocTypeId
    this.addendaDoc.strServicedDate = this.datePipe.transform(this.addendaDoc.ServicedDate,"MM/dd/yyyy HH:mm:ss")
    this.patientService.UpdateAddendaDoc(this.addendaDoc).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD006'])
        this.closePopupWithRefresh();
      } else {
        this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD003'])
        this.closePopup();
      }
    })
  }

  deleteAddendaDoc(){
    this.patientService.DeleteEncounterAddendaDoc(
      {'AddendaDocId':this.addendaDoc.AddendaDocId,
       'EncounterId':this.addendaDoc.EncounterId}
    ).subscribe((resp)=>{
      if(resp.IsSuccess){
        this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD004'])
        this.closePopupWithRefresh();
      }else{
        this.alertmsg.displayMessageDailog(ERROR_CODES['2CAD005'])
        this.closePopup();
      }
    })
  }
}
