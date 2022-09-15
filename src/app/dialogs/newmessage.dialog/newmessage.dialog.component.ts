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
  proceduresData: any;
  filterProcedures: any;

  // procedureInfo: ProceduresInfo = new ProceduresInfo();
  // @ViewChild('searchProcedureCode', { static: true }) searchProcedureCode: ElementRef;
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredPatients: Observable<ToAddress[]>;
  isLoading: boolean = false;
  providerMessage: Messages = new Messages();
  user: User;
  messageDialogData?: MessageDialogInfo;
  editMessageFor?: any

  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private messageservice: MessagesService,
    private alertmsg: AlertMessage,) {
    this.user = authenticationService.userValue;
    this.messageDialogData = ref.RequestData;

    if (this.messageDialogData.Messages == null)
      this.messageDialogData.Messages = {}
    //this.Upadateviewmodel(this.messageFor);

  }

  ngOnInit(): void {
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.filteredPatients = of([]);
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
          this.filteredPatients = of(
            resp.ListResult as ToAddress[]);
        } else this.filteredPatients = of([]);
      })
  }
  _filetrProvider() {
    let req = { "ClinicId": this.authenticationService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.filteredPatients = of(
          resp.ListResult as ToAddress[]);

      }
    });
  }
  onPatientSelected(selected) {
    this.messageDialogData.Messages.toAddress = selected.option.value;
    this.messageDialogData.Messages.ToId = selected.option.value.UserId;
  }
  displayWithPatientSearch(value: ToAddress): string {
    if (!value) return "";
    return value.Name;
  }

  InsertMessage(item: boolean, sent: boolean) {

    if (this.messageDialogData.Messages.EmailMessageId != null) {
      this.messageDialogData.Messages.FromId = this.user.UserId;
      this.messageDialogData.Messages.ProviderName = this.user.FirstName;
      this.messageDialogData.Messages.Draft = item;
      this.messageDialogData.Messages.Body = this.providerMessage.ReplyMessage;
      this.messageDialogData.Messages.Sent = sent
    }
    else {
      this.messageDialogData.Messages.FromId = this.user.UserId;
      this.messageDialogData.Messages.ProviderName = this.user.FirstName;
      this.messageDialogData.Messages.Draft = item;
      this.messageDialogData.Messages.Sent = sent
    }
    this.messageservice.CreateMessage(this.messageDialogData.Messages).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2D001"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2D001"]);
      }
    });


    this.cancel();
  }
  // Upadateviewmodel(data) {
  //   this.providerMessage = new Messages
  //   if (data == 'Patient') {
  //     this.providerMessage = new Messages;
  //   }
  //   else if (data == 'Practice') {
  //     this.providerMessage = new Messages;
  //   }
  //   else if (data.ForwardreplyMessage == 'Reply') {
  //     this.providerMessage = data;
  //   }
  //   else if (data.ForwardreplyMessage == 'Forward') {
  //     this.providerMessage = data;
  //   }
  //   else if(data.ForwardreplyMessage == 'PatientReply')
  //   {
  //     this.providerMessage = data;
  //   }
  //   else if(data.ForwardreplyMessage) {
  //     this.providerMessage = data;
  //   }

  // }
  diabledPatientSearch: boolean = false
  ngAfterViewInit() {
    if (this.messageDialogData.MessageFor == 'Reply') {
      this.searchpatient.nativeElement.value = this.providerMessage.PatientName;
      this.diabledPatientSearch = true;
    }
    else if (this.messageDialogData.MessageFor == 'PatientReply') {
      this.searchpatient.nativeElement.value = this.providerMessage.ProviderName;
      this.diabledPatientSearch = true;
    }
  }

}
