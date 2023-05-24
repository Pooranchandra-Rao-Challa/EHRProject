import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ComponentType } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs-compat';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, User } from 'src/app/_models';
import { Attachment } from 'src/app/_models/_provider/LabandImage';
import { MessageDialogInfo, Messages } from 'src/app/_models/_provider/messages';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UPLOAD_URL } from 'src/environments/environment';
import { DirectprovidersDialogComponent } from '../directproviders.dialog/directproviders.dialog.component';

@Component({
  selector: 'app-directmail.dialog',
  templateUrl: './directmail.dialog.component.html',
  styleUrls: ['./directmail.dialog.component.scss']
})
export class DirectmailDialogComponent implements OnInit {
  message?: Messages;
  user: User;
  attachmentSubject: BehaviorSubject<Attachment[]> = new BehaviorSubject<Attachment[]>([]);
  EntityId: string;
  fileUploadUrl?: string;
  fileTypes = ".jpg,.gif,.png,.xml,.pdf"
  fileSize: number = 20;
  httpRequestParams = new HttpParams();
  EntityName: string = "DirectMessage";
  messageDialogData?: MessageDialogInfo;
  ActionTypes = Actions;
  directprovidersDialogComponent = DirectprovidersDialogComponent;

  constructor(private ref: EHROverlayRef,
    private authenticationService: AuthenticationService,
    public overlayService: OverlayService,) {
    this.user = authenticationService.userValue;
    this.fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile');
    this.httpRequestParams = this.httpRequestParams.append("EntityName", this.EntityName);
  }

  ngOnInit(): void {
    if (this.ref.RequestData) this.message = this.ref.RequestData as Messages;
    else this.message = {};
  }

  cancel() {
    // this.message.Subject =this.previousSubject;
    this.ref.close(null);
  }

  public UploadCompleted(data): any {
    if (data.event.body) {
      if (this.message.Attachments == null) this.message.Attachments = [];
      var temp = data.event.body as Attachment
      let attachment: Attachment = {
        EntityId: temp.EntityId,
        EntityName: temp.EntityName,
        AttachmentId: temp.AttachmentId,
        FileName: temp.FileName
      };
      this.message.Attachments.push(attachment);
      this.attachmentSubject.next(this.message.Attachments);
    }
  }

  DeleteAttachment(attachmentId) {
    if (attachmentId) {
      this.message.Attachments.filter(fn => fn.AttachmentId == attachmentId)[0].IsDeleted = true;
    }
  }

  ItemRemoved($event) {
    //console.log($event);
  }

  get Attachments(): Attachment[] {
    if (!this.message.Attachments) this.message.Attachments = [];
    return this.message.Attachments.filter(fn => !fn.IsDeleted);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.directprovidersDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      // this.UpdateView(res.data);
    });
  }

}
