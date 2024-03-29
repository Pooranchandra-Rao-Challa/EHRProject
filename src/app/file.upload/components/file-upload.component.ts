import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { ReplaySubject, BehaviorSubject, Subscription } from "rxjs";
import {
  HttpHeaders,
  HttpParams,
  HttpClient,
  HttpEventType,
} from "@angular/common/http";
import { FileUploadQueueService } from "../service/file-upload-queue.service";
import { IUploadProgress } from "../file-upload.type";
import { User } from "src/app/_models/_account/user";

@Component({
  selector: "file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit, OnDestroy {
  private uploadProgressSubject = new ReplaySubject<IUploadProgress>();
  uploadProgress$ = this.uploadProgressSubject.asObservable();

  private uploadInProgressSubject = new BehaviorSubject<boolean>(false);
  uploadInProgress$ = this.uploadInProgressSubject.asObservable();

  public subs = new Subscription();

  /* Http request input bindings */
  @Input()
  httpUrl: string;

  @Input()
  httpRequestHeaders:
    | HttpHeaders
    | {
      [header: string]: string | string[];
    };

  @Input()
  httpRequestParams:
    | HttpParams
    | {
      [param: string]: string | string[];
    };

  @Input()
  fileAlias: string;

  private _file: any;
  private _id: number;
  private _attachmentId: string;

  @Input()
  get file(): any {
    return this._file;
  }
  set file(file: any) {
    this._file = file;
  }

  @Input()
  set id(id: number) {
    this._id = id;
  }
  get id(): number {
    return this._id;
  }

  @Input()
  fileUploadAriaLabel = "File Upload";

  @Input()
  cancelAriaLabel = "Cancel File Upload";

  /** Output  */
  @Output() removeEvent = new EventEmitter<FileUploadComponent>();
  @Output() onUpload = new EventEmitter<{ file: string, event: any }>();
  @Output() onItemRemove = new EventEmitter<string>();


  jwtToken: string;

  constructor(
    private HttpClient: HttpClient,
    private fileUploadQueueService: FileUploadQueueService
  ) {
    const queueInput = this.fileUploadQueueService.getInputValue();
    if (queueInput) {
      this.httpUrl = this.httpUrl || queueInput.httpUrl;
      this.httpRequestHeaders =
        this.httpRequestHeaders || queueInput.httpRequestHeaders;
      this.httpRequestParams =
        this.httpRequestParams || queueInput.httpRequestParams;
      this.fileAlias = this.fileAlias || queueInput.fileAlias;

      this.jwtToken = (JSON.parse(localStorage.getItem('user')) as User).JwtToken;
      this.httpRequestHeaders = new HttpHeaders();
      this.httpRequestHeaders = this.httpRequestHeaders.append("Authorization",this.jwtToken);
    }
  }

  ngOnInit() {
    this.uploadProgressSubject.next({
      progressPercentage: 0,
      loaded: 0,
      total: this._file.size,
    });
  }

  public upload(): void {
    this.uploadInProgressSubject.next(true);
    // How to set the alias?
    let formData = new FormData();
    formData.set(this.fileAlias, this._file, this._file.name);
    this.subs.add(
      this.HttpClient.post(this.httpUrl, formData, {
        headers: this.httpRequestHeaders,
        observe: "events",
        params: this.httpRequestParams,
        reportProgress: true,
        responseType: "json",
      }).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgressSubject.next({
              progressPercentage: Math.floor(
                (event.loaded * 100) / event.total
              ),
              loaded: event.loaded,
              total: event.total,
            });
          }
          if(event.body){
            this._attachmentId = event.body.AttachmentId;
            this.removeEvent.emit(this);
          }
          this.onUpload.emit({ file: this._file, event: event });
        },
        (error: any) => {
          this.uploadInProgressSubject.next(false);
          this.onUpload.emit({ file: this._file, event: event });
        },
        () => this.uploadInProgressSubject.next(false)
      )
    );
  }

  public remove(): void {
    this.subs.unsubscribe();
    this.removeEvent.emit(this);
    if(this._attachmentId)
      this.onItemRemove.emit(this._attachmentId)
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
