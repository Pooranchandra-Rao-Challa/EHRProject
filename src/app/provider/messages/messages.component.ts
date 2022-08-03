import { Component, ElementRef, ViewChild } from '@angular/core';
import { OverlayService } from '../../overlay.service';
import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { NewmessageDialogComponent } from '../../dialogs/newmessage.dialog/newmessage.dialog.component';
import {  } from 'src/app/_models/_patient/messages';
import { User } from 'src/app/_models';
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
import { ProviderMessages } from 'src/app/_models/_provider/messages';
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
  toPatientdialogComponent = ProvidermessagetopatientDialogComponent;
  toPracticeMessageDialog = ProvidermessagetopracticeDialogComponent
  DialogResponse = null;
  basedOnClick: false;
  providerInboxMessages: ProviderMessages[] = [];
  messageInbox: ProviderMessages = {};
  // providerSentMessages: ProviderMessages[] = [];
  sentMessages: ProviderMessages = {};
  providerdraftMessages: ProviderMessages[] = [];
  draftMessages = {};
  providerUrgentMessage: [] = [];
  urgentMessages = {};
  public messageDataSource: MessageDatasource;
  user?: User;
  inboxBasedOnCondition: boolean = false;
  sentMessage: boolean = false;
  draftMsg: boolean = false;
  urgentMesg: boolean = false;

  displayedColumns = ['To', 'Date'];

  @ViewChild('SearchMessage', { static: true })
  searchMessage: ElementRef;
  constructor(private overlayService: OverlayService, private messageservice: MessagesService, private authService: AuthenticationService) {
    this.user = authService.userValue;

  }

  ngOnInit(): void {
    this.getProviderInboxMessages();
    this.getProviderSentMessage();
    this.getDraftMessages();
    this.getUrgentMessages();
  }
  ngAfterViewInit(): void {
    debugger;
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
    debugger;
    this.messageservice.ProviderInboxMessages(reqparams).subscribe(response => {


      if (response.IsSuccess) {
        this.providerInboxMessages = response.ListResult;
        console.log(this.providerInboxMessages);
      }
    })
  }

  getProviderInboxMessage(item) {

    this.messageInbox = item
    this.inboxBasedOnCondition = true;
  }

  getProviderSentMessage() {
    debugger
    var reqparams = {
      'UserId': this.user.UserId
    }

    this.messageDataSource = new MessageDatasource(this.messageservice, reqparams);
    this.messageDataSource.loadMessages();
  }
  loadMessages() {
    debugger;
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
    debugger;
    this.messageservice.ProviderDraftMessages(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        this.providerdraftMessages = response.ListResult;
        console.log(this.providerInboxMessages);
      }
    })
  }
  getDraftMessage(item) {
    this.draftMessages = item;
    this.draftMsg = true;
  }
  getUrgentMessages() {
    var reqparams = {
      'UserId': this.user.UserId
    }
    debugger;
    this.messageservice.ProviderUrgentMessages(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        this.providerUrgentMessage = response.ListResult;
        console.log(this.providerInboxMessages);
      }
    })
  }

  getUrgentMessage(item) {
    this.urgentMessages = item;
    this.urgentMesg = true;
  }

  openComponentDialogmessage(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
        //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.toPatientdialogComponent) {
        this.DialogResponse = res.data;
      }
      else if (content === this.toPracticeMessageDialog) {
        this.DialogResponse = res.data;
      }
    });
  }



}
export class MessageDatasource implements DataSource<ProviderMessages>{

  private MessageSentSubject = new BehaviorSubject<ProviderMessages[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private messageservice: MessagesService, private queryParams: {}) {


  }
  connect(collectionViewer: CollectionViewer): Observable<ProviderMessages[] | readonly ProviderMessages[]> {
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
    debugger;
    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.queryParams["Filter"] = filter;
    this.loadingSubject.next(true);

    this.messageservice.ProviderSentMessages(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(resp => {

        this.MessageSentSubject.next(resp.ListResult as ProviderMessages[])
      });
  }


  get TotalRecordSize(): number {
    if (this.MessageSentSubject.getValue() && this.MessageSentSubject.getValue().length > 0)
      return this.MessageSentSubject.getValue()[0].MessagesCount;
    return 0;
  }

}
