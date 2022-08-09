import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PatientSearch, PracticeProviders, User } from 'src/app/_models';
 import { Messages } from 'src/app/_models/_provider/messages';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { MessagesService } from 'src/app/_services/messages.service';
import { PatientService } from 'src/app/_services/patient.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
class ToAddress {
  UserId?: string;
  Name?: string;
}
@Component({
  selector: 'app-providermessagetopatient.dialog',
  templateUrl: './providermessagetopatient.dialog.component.html',
  styleUrls: ['./providermessagetopatient.dialog.component.scss']
})
export class ProvidermessagetopatientDialogComponent implements OnInit {

  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredPatients: Observable<ToAddress[]>;
  isLoading: boolean = false;
  providerMessage: Messages = new Messages();
  user: User;
  messageFor?: any;
  editMessageFor?: any
  constructor(private ref: EHROverlayRef, private patientService: PatientService, private authenticationService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService, private messageservice: MessagesService,
    private alertmsg: AlertMessage,) {
    this.user = authenticationService.userValue;

    this.messageFor = ref.RequestData;
    console.log(ref.RequestData);

    this.Upadateviewmodel(this.messageFor);

  }

  ngOnInit(): void {
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 && res.length < 6)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => {
      if (this.messageFor == 'Patient') {
        this._filterPatient(value)
      }
      else if (this.messageFor == 'Practice') {
        this._filetrProvider()
      }


      else if (this.providerMessage.ForwardreplyMessage == 'Forward') {
        this.searchpatient.nativeElement.value = ''
        this.diabledPatientSearch = false
        this._filterPatient(value);

      }
      else if (this.providerMessage.ForwardreplyMessage == undefined) {
        this.searchpatient.nativeElement.value = ''
      }

    });


  }
  cancel() {
    this.ref.close(null);
  }
  _filterPatient(term) {
    console.log(term)
    this.isLoading = true;
    this.patientService
      .PatientSearch({
        ProviderId: this.authenticationService.userValue.ProviderId,
        ClinicId: this.authenticationService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        console.log(resp);

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
        console.log(resp.ListResult);

      }
    });
  }
  onPatientSelected(selected) {

    this.providerMessage.CurrentPatient = selected.option.value;
    this.providerMessage.ToId = selected.option.value.UserId;

  }
  displayWithPatientSearch(value: ToAddress): string {
    if (!value) return "";
    return value.Name;
  }

  InsertMessage(item: boolean, sent: boolean) {

    if (this.providerMessage.EmailMessageId != null) {
      this.providerMessage.FromId = this.user.UserId;
      this.providerMessage.ProviderName = this.user.FirstName;
      console.log(this.providerMessage);
      this.providerMessage.Draft = item;
      this.providerMessage.Body = this.providerMessage.ReplyMessage;
      this.providerMessage.Sent = sent
    }
    else {
      this.providerMessage.FromId = this.user.UserId;
      this.providerMessage.ProviderName = this.user.FirstName;
      console.log(this.providerMessage);
      this.providerMessage.Draft = item;
      this.providerMessage.Sent = sent
    }
    this.messageservice.CreateMessage(this.providerMessage).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2D001"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2D001"]);
      }
    });


    this.cancel();
  }
  Upadateviewmodel(data) {
    this.providerMessage = new Messages
    if (data == 'Patient') {
      this.providerMessage = new Messages;
    }
    else if (data == 'Practice') {
      this.providerMessage = new Messages;
    }
    else if (data.ForwardreplyMessage == 'Reply') {
      this.providerMessage = data;
    }
    else if (data.ForwardreplyMessage == 'Forward') {
      this.providerMessage = data;
    }
    else {
      this.providerMessage = data;

    }

  }
  diabledPatientSearch: boolean = false
  ngAfterViewInit() {
    if (this.providerMessage.ForwardreplyMessage == 'Reply') {
      this.searchpatient.nativeElement.value = this.providerMessage.PatientName;
      this.diabledPatientSearch = true;
    }
  }
}
