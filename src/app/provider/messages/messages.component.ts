import { Component, ElementRef, ViewChild } from '@angular/core';
import { OverlayService } from '../../overlay.service';
import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { NewmessageDialogComponent } from '../../dialogs/newmessage.dialog/newmessage.dialog.component';
import { } from 'src/app/_models/_patient/messages';
import { Actions, User } from 'src/app/_models';
import { MessagesService } from 'src/app/_services/messages.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject } from 'rxjs-compat';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ProvidermessagetopracticeDialogComponent } from 'src/app/dialogs/providermessagetopractice.dialog/providermessagetopractice.dialog.component';
import { ProvidermessagetopatientDialogComponent } from 'src/app/dialogs/providermessagetopatient.dialog/providermessagetopatient.dialog.component';
import { Messages } from 'src/app/_models/_provider/messages';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayReq = "none";
  MessageDialogComponent = NewmessageDialogComponent;
  DialogResponse: Messages = {};
  basedOnClick: false;
  // providerInboxMessages: Messages[] = [];
  messageInbox: Messages = {};
  // providerSentMessages: Messages[] = [];
  sentMessages: Messages = {};
  providerdraftMessages: Messages[] = [];
  draftMessages: Messages = {};
  providerUrgentMessage: [] = [];
  urgentMessages: Messages = {};

  public messageDataSource: MessageDatasource;
  public inboxmessageDataSource: InboxMessageDatasource;
  user?: User;
  inboxBasedOnCondition: boolean = false;
  sentMessage: boolean = false;
  draftMsg: boolean = false;
  urgentMesg: boolean = false;
  displayedColumns = ['To', 'Date'];
  displaycolumnsinbox = ['From', 'Date']
  @ViewChild('searchMessage', { static: true })
  searchMessage: ElementRef;
  ActionTypes = Actions;
  inbox: boolean = false;
  sent: boolean = false;
  draft: boolean = false;
  urgent: boolean = false;
  messagaeDD: any[] = [
    { value: '25', viewValue: '25 Msg' },
    { value: '50', viewValue: '50 Msg' },
    { value: '75', viewValue: '75 Msg' },
    { value: '100', viewValue: '100 Msg' },
  ];
  selected = '25';



  constructor(private overlayService: OverlayService, private messageservice: MessagesService, private authService: AuthenticationService, private alertmsg: AlertMessage) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    this.getProviderInboxMessages();
    // this.getDraftMessages();
    // this.getUrgentMessages();

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
          this.loadMessages();
        })
      )
      .subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadMessages())
      )
      .subscribe();

  }

  getProviderInboxMessages() {
    var reqparams = {
      'UserId': this.user.UserId
    }

    // this.messageservice.ProviderInboxMessages(reqparams).subscribe(response => {


    //   if (response.IsSuccess) {
    //     this.providerInboxMessages = response.ListResult;

    //   }
    // })
    this.inboxmessageDataSource = new InboxMessageDatasource(this.messageservice, reqparams);
    this.inboxmessageDataSource.loadInboxMessages()
    this.inbox = true;
    this.sent = false;
    this.draft = false;
    this.urgent = false;
    this.inboxBasedOnCondition = false;
  }
  loadInboxMessages() {
    this.inboxmessageDataSource.loadInboxMessages(
      this.searchMessage.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

  }



  getProviderInboxMessage(item) {

    this.messageInbox = item
    this.inboxBasedOnCondition = true;
  }

  getProviderSentMessage() {

    var reqparams = {
      'UserId': this.user.UserId
    }
    this.sent = true;
    this.messageDataSource = new MessageDatasource(this.messageservice, reqparams);
    this.messageDataSource.loadMessages();
    this.inbox = false;
    this.sentMessage = false
    this.draft = false;
    this.urgent = false;
  }
  loadMessages() {
    this.messageDataSource.loadMessages(
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
    this.draft = true;
    this.messageservice.DraftMessages(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        this.providerdraftMessages = response.ListResult;

      }
    })
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
      ;
    this.messageservice.UrgentMessages(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        this.providerUrgentMessage = response.ListResult;

      }
    })
    this.inbox = false;
    this.sent = false;
    this.urgent = true;
    this.urgentMesg = false
    this.draft = false;
  }

  getUrgentMessage(item) {
    this.urgentMessages = item;
    this.urgentMesg = true;
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
  DeleteMessages(item) {
    let data = item;
    console.log(data);
    var req = {
      EmailMessageId: item
    }
    this.messageservice.DeleteMessages(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2D002"]);
        this.getProviderInboxMessages();
        this.getProviderSentMessage();
        this.getUrgentMessages();
        this.getDraftMessages();
      }
      else {
        this.alertmsg.displayMessageDailog(ERROR_CODES["E2D001"]);
      }
    })
  }
}
export class MessageDatasource implements DataSource<Messages>{

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




export class InboxMessageDatasource implements DataSource<Messages>{

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