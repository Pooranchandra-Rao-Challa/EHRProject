import { SimplePaginationDirective } from 'src/app/_directives/simple.pagination.directive';
import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { NewmessageDialogComponent } from '../dialogs/newmessage.dialog/newmessage.dialog.component';
import { Actions, User } from 'src/app/_models';
import { MessagesService } from 'src/app/_services/messages.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject } from 'rxjs-compat';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MessageDialogInfo, Messages } from 'src/app/_models/_provider/messages';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { RecordsChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("pagination", { static: true }) pagination: SimplePaginationDirective
  MessageDialogComponent = NewmessageDialogComponent;

  public messageDataSource: MessageDatasource;
  user?: User;
  @ViewChild('searchMessage', { static: true }) searchMessage: ElementRef;
  ActionTypes = Actions;
  messagePerPage: any[] = [
    { value: '25', text: '25 Msg' },
    { value: '50', text: '50 Msg' },
    { value: '75', text: '75 Msg' },
    { value: '100', text: '100 Msg' },
  ];

  currentMessageView: string = 'Inbox';
  currentMessage: Message = null;
  pageSize: number = 25;
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number;

  constructor(
    private recordsChangeService: RecordsChangeService,
    private overlayService: OverlayService,
    private messageService: MessagesService,
    private authService: AuthenticationService,
    private changeDedectionRef: ChangeDetectorRef,
    private alertmsg: AlertMessage) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    this.initMessage(this.currentMessageView);
  }
  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.searchMessage.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          //this.page = 0;
          this.currentPage = 1;
          this.loadMessages();
        })
      )
      .subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.currentPage = 1
    });

    merge(this.sort.sortChange, this.currentPage)
      .pipe(
        tap(() => this.loadMessages())
      )
      .subscribe();
    this.recordsChangeService.getData().subscribe(value => {
      this.totalRecords = value;
      this.initPages();
    })
  }
  ngAfterContentChecked(): void {
    this.changeDedectionRef.detectChanges();
  }

  ngOnDestroy() {
    this.recordsChangeService = null;
  }
  initPages() {

    let records = this.totalRecords;
    this.totalPages = Math.floor(records / this.pageSize) * this.pageSize == records ?
      records / this.pageSize : Math.floor(records / this.pageSize) + 1;
  }

  initMessage(filter: string) {
    var reqparams = {
      UserId: this.user.UserId,
      MessageFilter: filter
    }
    this.messageDataSource = new MessageDatasource(this.recordsChangeService, this.messageService, reqparams);
    this.loadMessages()
  }
  getMessages(filter: string) {
    this.currentMessageView = filter;
    this.messageDataSource.MessageFilter = filter;
    this.currentMessage = null;
    this.currentPage = 1;
    this.pagination.pageNo = 1;
    this.loadMessages()
  }
  isExpand: boolean = true;

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }
  showMessage(message) {
    this.currentMessage = message;
    if(this.currentMessageView == 'Inbox')
    {
 
     this.messageService.ReadInboxMessages(this.currentMessage).subscribe(resp=>
     {  
       
       })
     }
  }
  loadMessages() {
    this.messageDataSource.loadMessages(
      this.searchMessage != null ? this.searchMessage.nativeElement.value : "",
      this.sort.active,
      this.sort.direction,
      this.currentPage - 1,
      this.pageSize
    );
  }
  onPageChange(event) {
    this.currentPage = event;
    this.loadMessages();
  }
  onPageSizeChange(event) {
    this.pageSize = event.value;
    this.initPages();
    this.loadMessages();
  }
  get IsInbox(): boolean {
    return this.currentMessageView == "Inbox"
  }

  get IsSent(): boolean {
    return this.currentMessageView == "Sent"
  }

  get IsDraft(): boolean {
    return this.currentMessageView == "Draft"
  }

  get IsUrgent(): boolean {
    return this.currentMessageView == "Urgent"
  }

  get DisplayedColumns(): string[] {
    return ['From', 'Date']
  }

  openComponentDialogmessage(content: any | ComponentType<any> | string, data,
    action: Actions = this.ActionTypes.add, message: string) {
    let DialogResponse: MessageDialogInfo = {};
    if (action == Actions.view && content === this.MessageDialogComponent) {
      if(message == 'Reply')
      {
      DialogResponse.MessageFor = message
      DialogResponse.Messages = data;
      DialogResponse.Messages.toAddress = {}
      DialogResponse.Messages.toAddress.Name = (data as Messages).ProviderName
      DialogResponse.Messages.toAddress.UserId = (data as Messages).ProviderId
      DialogResponse.ForwardReplyMessage = message;
      }
      else{
        DialogResponse.MessageFor = message
        DialogResponse.Messages = data;
        DialogResponse.Messages.toAddress = {}
        // DialogResponse.Messages.toAddress.Name = (data as Messages)
        // DialogResponse.Messages.toAddress.UserId = (data as Messages).ProviderId
        DialogResponse.ForwardReplyMessage = message;
      }
    }
    else if (action == Actions.add && content === this.MessageDialogComponent) {
      DialogResponse.MessageFor = message;
      DialogResponse.Messages = null;
      DialogResponse.ForwardReplyMessage = null;
    }

    const ref = this.overlayService.open(content, DialogResponse);
    ref.afterClosed$.subscribe(res => {
    });

  }
  DeleteMessages(item) {
    let data = item;
    var req = {
      EmailMessageId: item
    }
    this.messageService.DeleteMessages(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2D002"]);
        this.getMessages(this.currentMessageView);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2D001"]);
      }
    })
  }

}




export class MessageDatasource implements DataSource<Messages>{

  private MessageSentSubject = new BehaviorSubject<Messages[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(
    private recordsChangeService: RecordsChangeService,
    private messageService: MessagesService, private queryParams: {}) {


  }
  connect(collectionViewer: CollectionViewer): Observable<Messages[] | readonly Messages[]> {
    return this.MessageSentSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.MessageSentSubject.complete();
    this.loadingSubject.complete();
  }

  set UserId(id: string) {
    this.queryParams["UserId"] = id;
  }

  set MessageFilter(filter: string) {
    this.queryParams["MessageFilter"] = filter;
  }

  loadMessages(filter = '', sortField = 'Created',
    sortDirection = 'desc', pageIndex = 0, pageSize = 10) {

    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.queryParams["Filter"] = filter;
    this.loadingSubject.next(true);

    this.messageService.Messages(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.MessageSentSubject.next(resp.ListResult as Messages[])
          this.recordsChangeService.sendData(this.MessageSentSubject.getValue()[0].MessagesCount + "");
        }
      });
  }


  get TotalRecordSize(): number {
    if (this.MessageSentSubject.getValue() && this.MessageSentSubject.getValue().length > 0) {
      return this.MessageSentSubject.getValue()[0].MessagesCount;
    }

    return 0;
  }

}

