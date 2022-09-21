import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { User } from 'src/app/_models';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { fromEvent, Observable, of } from 'rxjs';
import { MessagesService } from 'src/app/_services/messages.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { MessageDialogInfo, Messages } from 'src/app/_models/_provider/messages';
import { UPLOAD_URL } from 'src/environments/environment'
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
  EntityName: string = "Message"
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredToAddressMembers: Observable<ToAddress[]>;
  isLoading: boolean = false;
  user: User;
  messageDialogData?: MessageDialogInfo;
  message?: Messages;
  fileUploadUrl?: string;
  diabledPatientSearch: boolean = false

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

    if (this.message == null)
      this.message = {}
  }

  ngOnInit(): void {
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.filteredToAddressMembers = of([]);
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
        this._filetrProvider()
      }
      else if (this.messageDialogData.MessageFor == 'Forward') {
        this.searchpatient.nativeElement.value = ''
        this.diabledPatientSearch = false
        this._filterPatient(value);

      }
      else if (this.messageDialogData.MessageFor == 'PatientForward') {
        this.searchpatient.nativeElement.value = ''
        this.diabledPatientSearch = false
        this._filetrProvider();

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
        if (resp.IsSuccess) {
          this.filteredToAddressMembers = of(
            resp.ListResult as ToAddress[]);
        } else this.filteredToAddressMembers = of([]);
      })
  }
  _filetrProvider() {
    debugger
    let req = { "ClinicId": this.authenticationService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.filteredToAddressMembers = of(
          resp.ListResult as ToAddress[]);

      }
    });
  }
  onPatientSelected(selected) {
    this.message.toAddress = selected.option.value;
    this.message.ToId = selected.option.value.UserId;
  }
  displayWithPatientSearch(value: ToAddress): string {
    if (!value) return "";
    return value.Name;
  }

  InsertMessage(item: boolean, sent: boolean) {
    debugger
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
      this.message.ToId = this.messageDialogData.Messages.toAddress.UserId;
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
      || this.messageDialogData.MessageFor == 'PatientReply')
      this.diabledPatientSearch = true;
  }

  ItemsModified(data) {
    this.message.Attachments = data;
  }
}
