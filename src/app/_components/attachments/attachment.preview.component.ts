import { BehaviorSubject } from 'rxjs';
import { Attachment } from 'src/app/_models/_provider/LabandImage';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-attachment-preview',
  templateUrl: './attachment.preview.component.html',
  styleUrls: ['./attachment.preview.component.scss']
})
export class AttachmentPreviewComponent implements OnInit {

  constructor(
    private labsImagingService: LabsImagingService) {
  }

  private _entityId: string;
  private _entityName: string;
  private _attachments: Attachment[] = [];
  httpRequestParams = new HttpParams();
  attachmentSubject: BehaviorSubject<Attachment[]> = new BehaviorSubject<Attachment[]>([]);
  activeAttachments: Attachment[] = [];

  @Input()
  get EntityId(): string {
    return this._entityId;
  }
  set EntityId(entityId: string) {
    this._entityId = entityId;
    this.httpRequestParams = this.httpRequestParams.append("EntityId", entityId);
  }

  @Input()
  set EntityName(entityName: string) {
    this._entityName = entityName;
    this.httpRequestParams = this.httpRequestParams.append("EntityName", entityName);
  }
  get EntityName(): string {
    return this._entityName;
  }

  @Input()
  set Attachments(attachments: Attachment[]) {
    this._attachments = attachments;
    this.attachmentSubject.next(this._attachments);
  }
  get Attachments(): Attachment[] {
    return this._attachments;
  }

  @Input() acceptImages: boolean = true;
  @Input() acceptDocs: boolean = false;
  @Input() acceptPdf: boolean = false;
  @Input() fileSize: number = 20;

  @Output() onItemsModify = new EventEmitter<Attachment[]>();
  @Input() httpUrl: string;


  ngOnInit(): void {
    this.attachmentSubject.subscribe(attachments => {
      this.activeAttachments = attachments.filter((att) => att.IsDeleted == false);
    });
  }

  UploadCompleted(data) {
    if (data.event.body) {
      if (this.Attachments == null) this.Attachments = [];
      var temp = data.event.body as Attachment
      let attachment:Attachment = {
        EntityId : temp.EntityId,
        EntityName : temp.EntityName,
        AttachmentId : temp.AttachmentId,
        FileName : temp.FileName
      };
      this.Attachments.push(attachment);
      this.attachmentSubject.next(this._attachments);
      this.raiseItemsModified();
    }
  }

  get AcceptedFileTypes(): string {
    if (this.acceptImages && this.acceptPdf && !this.acceptDocs) {
      return ".jpg,.gif,.jpeg,.png,.pdf";
    } else if (this.acceptImages && !this.acceptPdf && !this.acceptDocs) {
      return ".jpg,.gif,.jpeg,.png";
    } else if (!this.acceptImages && this.acceptPdf && !this.acceptDocs) {
      return ".pdf";
    } else if (!this.acceptImages && this.acceptPdf && !this.acceptDocs) {
      return "*.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (!this.acceptImages && !this.acceptPdf && this.acceptDocs) {
      return ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else {
      return ".jpg,.gif,.jpeg, .png";
    }

  }

  get ActiveAttachments(): Attachment[] {
    return this.activeAttachments;
  }

  raiseItemsModified() {
    this.onItemsModify.emit(this.Attachments);
  }

  ItemRemoved(attachmentId) {
    this.removeAttachment(attachmentId);
  }
  removeAttachment(attachmentId) {
    this.Attachments.forEach((value) => {
      if (value.AttachmentId == attachmentId)
        value.IsDeleted = true;
    });
    this.raiseItemsModified();
    this.attachmentSubject.next(this._attachments);
  }
  DeleteAttachment(attachmentId) {
    this.removeAttachment(attachmentId);
    if (attachmentId == this.viewId) {
      this.showImage = false;
      this.Imagedata = undefined;
    }
  }
  showImage: boolean = false;
  Imagedata: string;
  viewId: string;
  showDocument(attachmentId) {
    this.Attachments.forEach((value) => {
      if (value.AttachmentId == attachmentId) {
        if (value.FileName.endsWith(".pdf"))
          return;
        this.labsImagingService.ImagetoBase64String(value).subscribe(resp => {
          this.viewId = attachmentId;
          if (resp.IsSuccess) {
            this.showImage = true;
            this.Imagedata = resp.Result;
          } else {
            this.showImage = false;
          }
        });
      }
    });
  }
}
