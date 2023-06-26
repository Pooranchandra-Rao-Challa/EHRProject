import { Component, ElementRef, ViewChild } from '@angular/core';
import { OverlayService } from '../../overlay.service';
import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MessagesDatasource } from '../messages/messages.component';
import { Messages } from 'src/app/_models/_provider/messages';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { SimplePaginationDirective } from 'src/app/_directives/simple.pagination.directive';
import { MessageCounts, NotifyMessageService, RecordsChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { MessagesService } from 'src/app/_services/messages.service';
import { Actions, User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DirectmailDialogComponent } from 'src/app/dialogs/directmail.dialog/directmail.dialog.component';
declare var $: any;
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './directmsg.component.html',
  styleUrls: ['./directmsg.component.scss']
})
export class DirectMsgComponent {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("pagination", { static: true }) pagination: SimplePaginationDirective
  @ViewChild('searchMessage', { static: true }) searchMessage: ElementRef;
  displayReq = "none";
  directmailDialogComponent = DirectmailDialogComponent;
  DialogResponse = null;
  public messageDataSource: MessagesDatasource;
  currentMessageView: string = 'Inbox';
  currentMessage: Messages = null;
  pageSize: number = 25;
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number;
  user?: User;
  isExpand: boolean = true;
  messagePerPage: any[] = [
    { value: '25', text: '25 Msg' },
    { value: '50', text: '50 Msg' },
    { value: '75', text: '75 Msg' },
    { value: '100', text: '100 Msg' },
  ];

  constructor(private overlayService: OverlayService,
    private recordsChangeService: RecordsChangeService,
    private messageService: MessagesService,
    private authService: AuthenticationService,
    private notifyMessage: NotifyMessageService,) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    $('#openBtn').click(function () {
      $('#myModal').modal({ show: true });
    })
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
    this.messageDataSource = new MessagesDatasource(this.recordsChangeService, this.messageService, reqparams);
    this.loadMessages()
  }

  showMessage(message: Messages) {
    this.currentMessage = message;
    if (this.currentMessageView == 'Inbox' || this.currentMessageView == 'Urgent') {
      this.messageService.ReadInboxMessages(this.currentMessage).subscribe(resp => {
        if (resp.IsSuccess) {
          this.user.UnReadMails--;
          if (message.Urgent) this.user.UrgentMessages--;
          var counts: MessageCounts = new MessageCounts();
          counts.UnreadCount = this.user.UnReadMails;
          counts.UrgentCount = this.user.UrgentMessages;
          this.notifyMessage.sendData(counts);
          this.authService.updateMessageCounts(counts);
          this.loadMessages();
        }
      })
    }
  }

  loadMessages() {
    this.messageDataSource.loadMessages(
      this.searchMessage != null ? this.searchMessage.nativeElement.value : "",
      this.sort.active,
      this.sort.direction,
      this.currentPage - 1,
      this.pageSize,
      true
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

  get DisplayedColumns(): string[] {
    return ['From', 'Date', 'Attach']
  }

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }

  openComponentDialogMessage(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);
    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
        //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.directmailDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }

  get IsSent(): boolean {
    return this.currentMessageView == "Sent"
  }

  getMessages(filter: string) {
    this.currentMessageView = filter;
    this.messageDataSource.MessageFilter = filter;
    this.currentMessage = null;
    this.currentPage = 1;
    this.pagination.pageNo = 1;
    this.loadMessages()
  }

}
