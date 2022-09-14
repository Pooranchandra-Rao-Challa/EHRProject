import {
  Component,
  ChangeDetectionStrategy,
  ContentChildren,
  forwardRef,
  OnDestroy,
  OnChanges,
  QueryList,
  SimpleChanges,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { Subscription, Observable, merge } from "rxjs";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { startWith } from "rxjs/operators";
import { FileUploadQueueService } from "../service/file-upload-queue.service";
import { FileUploadComponent } from "./file-upload.component";

@Component({
  selector: "file-upload-queue",
  templateUrl: "./file-upload-queue.component.html",
  styleUrls: ["./file-upload-queue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FileUploadQueueService],
})
export class FileUploadQueueComponent implements OnChanges, OnDestroy {
  @ContentChildren(forwardRef(() => FileUploadComponent))
  fileUploads: QueryList<FileUploadComponent>;

  /** Subscription to remove changes in files. */
  private _fileRemoveSubscription: Subscription | null;

  /** Subscription to changes in the files. */
  private _changeSubscription: Subscription;

  /** Combined stream of all of the file upload remove change events. */
  get fileUploadRemoveEvents(): Observable<FileUploadComponent> {
    return merge(
      ...this.fileUploads.map((fileUpload) => fileUpload.removeEvent)
    );
  }

  public files: Array<any> = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.fileUploadQueueService.initialize({
      httpUrl: changes["httpUrl"] ? changes["httpUrl"].currentValue : undefined,
      httpRequestHeaders: changes["httpRequestHeaders"]
        ? changes["httpRequestHeaders"].currentValue
        : undefined,
      httpRequestParams: changes["httpRequestParams"]
        ? changes["httpRequestParams"].currentValue
        : undefined,
      fileAlias: changes["fileAlias"]
        ? changes["fileAlias"].currentValue
        : undefined,
    });
  }

  constructor(
    private fileUploadQueueService: FileUploadQueueService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  /* Http request input bindings */
  @Input()
  httpUrl: string;

  @Input()
  httpRequestHeaders:
    | HttpHeaders
    | {
      [header: string]: string | string[];
    } = new HttpHeaders();

  @Input()
  httpRequestParams:
    | HttpParams
    | {
      [param: string]: string | string[];
    } = new HttpParams();

  @Input()
  fileAlias: string = "file";

  @Input()
  uploadAllColor = "primary";

  @Input()
  uploadAllLabel = "Upload All";

  @Input()
  removeAllColor = "primary";

  @Input()
  removeAllLabel = "Remove All";

  ngAfterViewInit() {
    // When the list changes, re-subscribe
    this._changeSubscription = this.fileUploads.changes
      .pipe(startWith(null))
      .subscribe(() => {
        if (this._fileRemoveSubscription) {
          this._fileRemoveSubscription.unsubscribe();
        }
        this._listenTofileRemoved();
      });
  }

  private _listenTofileRemoved(): void {
    this._fileRemoveSubscription = this.fileUploadRemoveEvents.subscribe(
      (event: FileUploadComponent) => {
        this.files.splice(event.id, 1);
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  add(file: any) {
    this.files.push(file);
    this.changeDetectorRef.markForCheck();
  }

  public uploadAll() {
    this.fileUploads.forEach((fileUpload) => {
      fileUpload.upload();
    });
  }

  public removeAll() {
    this.files.splice(0, this.files.length);
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    if (this._changeSubscription) this._changeSubscription.unsubscribe();
    if (this._fileRemoveSubscription)
      this._fileRemoveSubscription.unsubscribe();

    if (this.files) {
      this.removeAll();
    }
  }
}
