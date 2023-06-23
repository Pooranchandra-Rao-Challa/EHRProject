import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Amendment } from 'src/app/_models/_provider/amendments';
import { Attachment } from 'src/app/_models/_provider/LabandImage';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DownloadService } from 'src/app/_services/download.service';
import { PatientService } from 'src/app/_services/patient.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { UPLOAD_URL } from 'src/environments/environment';

@Component({
  selector: 'app-amendments',
  templateUrl: './amendments.component.html',
  styleUrls: ['./amendments.component.scss']
})
export class AmendmentsComponent implements OnInit {
  amendment: Amendment = new Amendment();
  PatientDetails: any = [];
  amendments: Amendment[] = [];
  AmendmentStatusesDD: any = [];
  AmendmentSourcesDD: any = [];
  fileTypes = ".jpg,.gif,.png"
  fileSize: number = 20;
  EntityId: string;
  fileUploadUrl?: string;
  EntityName: string = "Amendment"
  httpRequestParams = new HttpParams();
  attachmentSubject: BehaviorSubject<Attachment[]> = new BehaviorSubject<Attachment[]>([]);
  dataRefreshing: boolean = false;


  constructor(private patientservice: PatientService, private authService: AuthenticationService,
    private alertmsg: AlertMessage, private ulilityservice: UtilityService,
    private downloadService: DownloadService,private datePipe: DatePipe) {
    this.amendment = {}
    this.fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')
    this.httpRequestParams = this.httpRequestParams.append("EntityName", this.EntityName);
  }

  ngOnInit(): void {
    this.dataRefreshing = true;
    this.getPatientDetails();
    this.getAmendmentStatuses();
    this.getAmendmentSources();
    this.getAmendment();
  }
  getPatientDetails() {
    this.PatientDetails = this.authService.viewModel.Patient;
  }
  AmendmentsColumns = ['DateRequested', 'Status', 'Description/Location', 'Scanned']
  todayDateforDateRequested() {
    this.amendment.DateofRequest = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }
  todayDateforDateAcceptedorDenied() {
    this.amendment.DateofAccept = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }
  todayforDateAppended() {
    this.amendment.DateofAppended = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  getAmendment() {
    var reqparam = {
      "PatientId": this.PatientDetails.PatientId
    }
    this.patientservice.AmendmentDetails(reqparam).subscribe((resp) => {
      if(resp.IsSuccess){
        this.amendments = resp.ListResult as Amendment[];
        this.amendments.forEach((amendment) =>{
          amendment.Attachments = JSON.parse(amendment.strAttachments);
          amendment.DateofAccept = this.datePipe.transform(amendment.DateofAccept, "yyyy-MM-dd");
          amendment.DateofAppended = this.datePipe.transform(amendment.DateofAppended, "yyyy-MM-dd");
        });
        this.dataRefreshing = false;
      }else {this.amendments =  []; this.dataRefreshing = false;}
    });
  }

  DownloadAttachment(attachment: Attachment){
    //attachment.forEach(attach=>{
      attachment.EntityName = this.EntityName;
      this.downloadService.DownloadAttachment(attachment);
    //})

  }

  createUpadateAmendment() {
    let isAdd = this.amendment.AmendmentId == undefined;
    this.amendment.PatientId = this.PatientDetails.PatientId;

    this.amendment.DateofRequest = this.datePipe.transform(this.amendment.DateofRequest, "MM/dd/yyyy hh:mm:ss a");

    this.amendment.DateofAccept = this.datePipe.transform(this.amendment.DateofAccept, "MM/dd/yyyy hh:mm:ss a");
    this.amendment.DateofAppended = this.datePipe.transform(this.amendment.DateofAppended, "MM/dd/yyyy hh:mm:ss a");

    this.patientservice.CreateupdateAmendment(this.amendment).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.getAmendment();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2A001" : "M2A002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2A001"]);
      }
    });
  }

  resetDialog() {
    this.amendment = {};
    this.getAmendment();
  }

  onSelectedOfAmendment(item) {
    this.amendment = item;
  }

  deleteAmendment() {
    var reqparam = {
      "AmendmentId": this.amendment.AmendmentId
    }
    this.patientservice.DeleteAmendment(reqparam).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.getAmendment();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2A002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2A001"]);
      }
    });
  }

  getAmendmentStatuses() {
    this.ulilityservice.AmendmentStatuses().subscribe((res) => {
      this.AmendmentStatusesDD = res.ListResult == null ? [] : res.ListResult;
    });
  }

  getAmendmentSources() {
    this.ulilityservice.AmendmentSources().subscribe((res) => {
      this.AmendmentSourcesDD = res.ListResult == null ? [] : res.ListResult;
    });
  }

  enableSave() {
    return !(this.amendment.DateofRequest != null
      && this.amendment.Source != null && this.amendment.Source != ""
      && this.amendment.Status != null && this.amendment.Status != "")
  }

  public UploadCompleted(data): any {
    if (data.event.body) {
      if (this.amendment.Attachments == null) this.amendment.Attachments = [];
      var temp = data.event.body as Attachment
      let attachment:Attachment = {
        EntityId : temp.EntityId,
        EntityName : temp.EntityName,
        AttachmentId : temp.AttachmentId,
        FileName : temp.FileName
      };
      this.amendment.Attachments.push(attachment);
      this.attachmentSubject.next(this.amendment.Attachments);
    }
  }
  DeleteAttachment(attachmentId) {
    //this.removeAttachment(attachmentId);
    if(!this.amendment.Attachments)  this.amendment.Attachments = []
    if (attachmentId) {
      this.amendment.Attachments.filter(fn => fn.AttachmentId == attachmentId)[0].IsDeleted = true;
    }
  }

  ItemRemoved($event) {
  }

  get Attachments(): Attachment[]{
    if(!this.amendment.Attachments)  this.amendment.Attachments = []
    return this.amendment.Attachments.filter(fn => !fn.IsDeleted);
  }
}
