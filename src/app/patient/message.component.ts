import { Component, ElementRef, ViewChild } from '@angular/core';
import { OverlayService } from '../overlay.service';
import {  TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { NewmessageDialogComponent } from '../dialogs/newmessage.dialog/newmessage.dialog.component';

import { PatientService } from '../_services/patient.service';
import { Actions, User } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';
import { MessagesService } from '../_services/messages.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { Messages } from '../_models/_provider/messages';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  displayReq = "none";
  MessageDialogComponent = NewmessageDialogComponent;
  DialogResponse = null;
  messages:Messages;
  basedoncondition:boolean=false;
  user: User;
  ActionTypes = Actions;
  public patientInboxMessageDatasource :  PatientInboxMessageDatasource;
  public patientSentMessagesDatasource : PatientMessageSentDatasource
  inbox: boolean = false;
  sent: boolean = false;
  draft: boolean = false;
  urgent: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchMessage', { static: true })
  searchMessage: ElementRef;
  messageInbox: Messages = {};
  inboxBasedOnCondition:boolean =false;
  displaycolumnsinbox = ['From', 'Date']
  displayedColumns = ['To', 'Date'];
  sentMessages: Messages = {};
  DraftMessages: Messages[];
  sentMessage: boolean = false;
  draftMsg: boolean = false;
  draftMessages:Messages = {};
  UrgentMessage:Messages[];
  urgentMessages:Messages = {};
  urgentMesg:boolean =false;


  constructor(private authenticationService: AuthenticationService,private overlayService :OverlayService,private patientservice:PatientService,
    private messageservice: MessagesService,private alertmsg: AlertMessage) {
    this.user = authenticationService.userValue;
   }

  ngOnInit(): void {
   this.getpatientInboxMessages();
  }
  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.searchMessage.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          //this.page = 0;
          this.paginator.pageIndex = 0;
          this.loadInboxMessages();
        })
      )
      .subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadInboxMessages())
      )
      .subscribe();

  }
  
  openComponentDialogmessage(content: any | ComponentType<any> | string, data,
    action: Actions = this.ActionTypes.add, message) {

    if (action == Actions.view && content === this.MessageDialogComponent) {
      data.ForwardreplyMessage = message;
      this.DialogResponse = data;
      this.DialogResponse.ForwardreplyMessage = data.ForwardreplyMessage;

    }
    else if (action == Actions.add && content === this.MessageDialogComponent) {
      this.DialogResponse = data;

    }

    const ref = this.overlayService.open(content, data);

    ref.afterClosed$.subscribe(res => {

    });

  }
 
  getpatientInboxMessages() {
    var reqparams = {
      'UserId': this.user.UserId
    }
     
    // this.messageservice.ProviderInboxMessages(reqparams).subscribe(response => {


    //   if (response.IsSuccess) {
    //     this.providerInboxMessages = response.ListResult;

    //   }
    // })
    this.patientInboxMessageDatasource = new PatientInboxMessageDatasource(this.messageservice, reqparams);
    this.patientInboxMessageDatasource.loadInboxMessages()
    this.inbox = true;
    this.sent = false;
    this.draft= false;
    this.urgent=false;
  }
  loadInboxMessages()
{
  this.patientInboxMessageDatasource.loadInboxMessages(
    this.searchMessage.nativeElement.value,
    this.sort.active,
    this.sort.direction,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );

}



  getPatientInboxMessage(item) {

    this.messageInbox = item
    this.inboxBasedOnCondition = true;
  }


  // getProviderInboxMessage(item) {

  //   this.messageInbox = item
  //   this.inboxBasedOnCondition = true;
  // }

  getPatientSentMessage() {

    var reqparams = {
      'UserId': this.user.UserId
    }
    this.sent = true;
    this.patientSentMessagesDatasource = new PatientMessageSentDatasource(this.messageservice, reqparams);
    this.patientSentMessagesDatasource.loadMessages();
    this.inbox = false;
    this.sentMessage = false
    this.draft= false;
    this.urgent = false;
  }
  loadMessages() {
    this.patientSentMessagesDatasource.loadMessages(
      this.searchMessage.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  getSentMessage(item) {
    this.sentMessages = item;
    this.sentMessage = true
  }
  getDraftMessages() {
    var reqparams = {
      'UserId': this.user.UserId
    }
    this.messageservice.DraftMessages(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        this.DraftMessages = response.ListResult;

      }
    })
    this.draft = true;
    this.inbox = false;
    this.sent = false;
   
    this.draftMsg = false;
    this.urgent = false;
  }
  getDraftMessage(item) {
    this.draftMessages = item;
    this.draftMsg = true;
  }

  getUrgentMessages() {
    var reqparams = {
      'UserId': this.user.UserId
    }
      
    this.messageservice.UrgentMessages(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        this.UrgentMessage = response.ListResult;

      }
    })
    this.inbox = false;
    this.sent = false;
    this.urgent = true;
    this.urgentMesg = false
    this.draft= false;
  }

  getUrgentMessage(item) {
    this.urgentMessages = item;
    this.urgentMesg = true;
  }

  DeleteMessages(item)
{
 
    var req = {
      EmailMessageId: item
    }
  this.messageservice.DeleteMessages(req).subscribe(resp=>
    {
      if(resp.IsSuccess)
      {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2D002"]);
        this.getpatientInboxMessages();
       this.getPatientSentMessage();
        this.getDraftMessages();
        this.getUrgentMessages();
      }
      else{
        this.alertmsg.displayMessageDailog(ERROR_CODES["E2D001"]);
      }
    })
}
}



export class PatientInboxMessageDatasource implements DataSource<Messages>{

  private InboxMessageSentSubject = new BehaviorSubject<Messages[]>([]);
  private InboxloadingSubject = new BehaviorSubject<boolean>(false);
  public Inboxloading$ = this.InboxloadingSubject.asObservable();


  constructor(private messageservice: MessagesService, private queryParams: {}) {


  }
  connect(collectionViewer: CollectionViewer): Observable<Messages[] | readonly Messages[]> {
    return this.InboxMessageSentSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    //collectionViewer.viewChange.
    this.InboxMessageSentSubject.complete();
    this.InboxloadingSubject.complete();
  }
  set UserId(id: string) {
    this.queryParams["UserId"] = id;
  }

  loadInboxMessages(filter = '', sortField = 'LastAccessed',
    sortDirection = 'desc', pageIndex = 0, pageSize = 10) {
    ;
    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.queryParams["Filter"] = filter;
    this.InboxloadingSubject.next(true);

    this.messageservice.InboxMessages(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.InboxloadingSubject.next(false))
    )
      .subscribe(resp => {

        this.InboxMessageSentSubject.next(resp.ListResult as Messages[])
      });
  }


  get TotalRecordSize(): number {
    if (this.InboxMessageSentSubject.getValue() && this.InboxMessageSentSubject.getValue().length > 0)
      return this.InboxMessageSentSubject.getValue()[0].MessagesCount;
    return 0;
  }

}




export class PatientMessageSentDatasource implements DataSource<Messages>{

  private MessageSentSubject = new BehaviorSubject<Messages[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private messageservice: MessagesService, private queryParams: {}) {


  }
  connect(collectionViewer: CollectionViewer): Observable<Messages[] | readonly Messages[]> {
    return this.MessageSentSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    //collectionViewer.viewChange.
    this.MessageSentSubject.complete();
    this.loadingSubject.complete();
  }
  set UserId(id: string) {
    this.queryParams["UserId"] = id;
  }

  loadMessages(filter = '', sortField = 'LastAccessed',
    sortDirection = 'desc', pageIndex = 0, pageSize = 10) {
    ;
    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.queryParams["Filter"] = filter;
    this.loadingSubject.next(true);

    this.messageservice.SentMessages(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(resp => {

        this.MessageSentSubject.next(resp.ListResult as Messages[])
      });
  }


  get TotalRecordSize(): number {
    if (this.MessageSentSubject.getValue() && this.MessageSentSubject.getValue().length > 0)
      return this.MessageSentSubject.getValue()[0].MessagesCount;
    return 0;
  }

}
