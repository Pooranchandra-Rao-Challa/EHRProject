import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientChart, User } from 'src/app/_models';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import { MessagesService } from 'src/app/_services/messages.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { MessageDialogInfo, Messages } from 'src/app/_models/_provider/messages';
import { UPLOAD_URL } from 'src/environments/environment'
import { HttpParams } from '@angular/common/http';
import { Attachment } from 'src/app/_models/_provider/LabandImage';
class ToAddress {
  UserId?: string;
  Name?: string;
}
@Component({
  selector: 'app-newmessage.dialog',
  templateUrl: './newmessage.dialog.component.html',
  styleUrls: ['./newmessage.dialog.component.scss']
})
export class NewmessageDialogComponent implements OnInit {

  PatientProfile: PatientProfile;
  EntityName: string = "EmailMessage"
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredToAddressMembers: Observable<ToAddress[]>;
  isLoading: boolean = false;
  user: User;
  messageDialogData?: MessageDialogInfo;
  message?: Messages;
  fileUploadUrl?: string;
  diabledPatientSearch: boolean = false
  displayMessage: boolean = true;
  noRecords: boolean = false;
  fileTypes = ".jpg,.gif,.png"
  fileSize: number = 20;
  EntityId: string;
  httpRequestParams = new HttpParams();
  attachmentSubject: BehaviorSubject<Attachment[]> = new BehaviorSubject<Attachment[]>([]);
  previousMessage: string =""
  previousSubject: string = ""

  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private messageservice: MessagesService,
    private alertmsg: AlertMessage,) {
    this.user = authenticationService.userValue;
    this.messageDialogData = ref.RequestData;
    this.message = this.messageDialogData.Messages;
    this.fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')

    this.httpRequestParams = this.httpRequestParams.append("EntityName", this.EntityName);

    if (this.message == null)
      this.message = {}
  }

  ngOnInit(): void {
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.filteredToAddressMembers = of([]);
        this.noRecords = false;
        if (event.target.value == '') {
          this.displayMessage = true;
        }
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 0)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => {
      if (this.messageDialogData.MessageFor == 'Patient') {
        this._filterPatient(value)
      }
      else if (this.messageDialogData.MessageFor == 'Practice') {
        this._filetrProvider(value)
      }
      else if (this.messageDialogData.MessageFor == 'Forward') {
        this.searchpatient.nativeElement.value = ''
        this.diabledPatientSearch = false
        this._filterPatient(value);

      }
      else if (this.messageDialogData.MessageFor == 'PatientForward') {
        this.searchpatient.nativeElement.value = ''
        this.diabledPatientSearch = false
        this._filetrProvider(value);

      }
      else if (this.messageDialogData.MessageFor == undefined) {
        this.searchpatient.nativeElement.value = ''
      }
    });
  }

  get Title(): string {
    switch (this.messageDialogData.MessageFor) {
      case "Patient":
      case "Practice":
        return "New";
      case "Reply":
      case "PatientReply":
        return "Reply";
      case "Forward":
        return "Forward";
    }
    return "No"
  }
  cancel() {
    this.message.Subject =this.previousSubject;
    this.ref.close(null);
  }
  _filterPatient(term) {
    this.isLoading = true;
    this.patientService
      .PatientSearch({
        ProviderId: this.authenticationService.userValue.ProviderId,
        ClinicId: this.authenticationService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.IsSuccess) {
          this.filteredToAddressMembers = of(
            resp.ListResult as ToAddress[]);
        }
        else {
          this.filteredToAddressMembers = of([]);
          this.noRecords = true;
        }
      })
  }
  _filetrProvider(term) {
    this.isLoading = true;
    let req = { "ClinicId": this.authenticationService.userValue.ClinicId, "SearchTerm": term };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      this.isLoading = false;
      this.displayMessage = false;
      if (resp.IsSuccess) {
        this.filteredToAddressMembers = of(
          resp.ListResult as ToAddress[]);
      }
      else {
        this.filteredToAddressMembers = of([]);
        this.noRecords = true;
      }
    });
  }
  onToAddressSelected(selected) {
    this.message.toAddress = selected.option.value;
    this.message.ToId = selected.option.value.UserId;
  }
  displayWithPatientSearch(value: ToAddress): string {
    if (!value) return "";
    return value.Name;
  }

  InsertMessage(item: boolean, sent: boolean) {
    if (this.message.EmailMessageId != null) {
      this.message.FromId = this.user.UserId;
      this.message.ProviderName = this.user.FirstName;
      this.message.Draft = item;
      this.message.Sent = sent
    }
    else {
      this.message.FromId = this.user.UserId;
      this.message.ProviderName = this.user.FirstName;
      this.message.Draft = item;
      this.message.Sent = sent;
      this.message.ToId = this.messageDialogData.Messages ?
      this.messageDialogData.Messages.toAddress.UserId : this.message.ToId;
    }
    this.messageservice.CreateMessage(this.message).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2D001"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2D001"]);
      }
    });


    this.cancel();
  }

  ngAfterViewInit() {
    if (this.messageDialogData.MessageFor == 'Reply'
      || this.messageDialogData.MessageFor == 'PatientReply'){
        this.previousMessage = this.message.Body;
        this.message.Body = "";
        this.previousSubject = this.message.Subject;
        this.message.Subject ="Re: "+this.message.Subject
      }
    else if (this.messageDialogData.MessageFor == 'Forward'
    || this.messageDialogData.MessageFor == 'PatientForward'){
      this.previousMessage = this.message.Body;
      this.message.Body = "";
      this.previousSubject = this.message.Subject;
      this.message.Subject ="Fw: "+this.message.Subject
    }

  }


  public UploadCompleted(data): any {
    if (data.event.body) {
      if (!this.message.Attachments)
        this.message.Attachments = [];
      this.message.Attachments.push(data.event.body as Attachment);
      this.attachmentSubject.next(this.message.Attachments);
    }
  }
  DeleteAttachment(attachmentId) {
    if (attachmentId) {
      this.message.Attachments.filter(fn => fn.AttachmentId == attachmentId)[0].IsDeleted = true;
    }
  }
  ItemRemoved($event) {
    console.log($event);
  }

  get Attachments(): Attachment[]{
    if(!this.message.Attachments) this.message.Attachments =[]
    return this.message.Attachments.filter(fn => !fn.IsDeleted);
  }
}
