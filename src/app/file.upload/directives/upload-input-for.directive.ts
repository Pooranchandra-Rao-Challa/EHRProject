import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from "@angular/core";

/**
 * A material design file upload queue component.
 */
@Directive({
  selector: "input[fileUploadInputFor], div[fileUploadInputFor]",
})
export class FileUploadInputForDirective {
  private _queue: any = null;
  private _element: HTMLElement;
  private _messages: string;
  @Output() public onFileSelected: EventEmitter<File[]> = new EventEmitter<
    File[]
  >();

  constructor(private element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  @Input("fileUploadInputFor")
  set fileUploadQueue(value: any) {
    if (value) {
      this._queue = value;
    }
  }

  @HostListener("change")
  public onChange(): any {
    let files = this.element.nativeElement.files;
    let accept = this.element.nativeElement.accept;
    let size = 20
    if (this.element.nativeElement.size)
      size = Number(this.element.nativeElement.size)
    this.onFileSelected.emit(files);
    for (var i = 0; i < files.length; i++) {      let fileSize = files[i].size;
      let fileType = /\.([^\.]+)$/.exec(files[i].name);
        if(fileType != null && this.IsFileAccepted(size,fileSize,accept,fileType[0]))
          this._queue.add(files[i]);
    }
    this.element.nativeElement.value = "";
  }

  @HostListener("drop", ["$event"])
  public onDrop(event: any): any {
    let files = event.dataTransfer.files;
    this.onFileSelected.emit(files);

    for (var i = 0; i < files.length; i++) {
      this._queue.add(files[i]);
    }
    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.value = "";
  }

  @HostListener("dragover", ["$event"])
  public onDropOver(event: any): any {
    event.preventDefault();
  }

  private IsFileAccepted(size: number,
    fileSize: number,
    acceptTypes: string,
    fileType: string): boolean {
    let m:string ='';
    let flag = false;
    if(fileSize > size * 1024 *1024) m += `The upload file is big, acceptable only ${size}mb`
    if(acceptTypes.indexOf(fileType) < 0 ) m+= `The upload file types are ${acceptTypes}`
    flag = m == ''
    if(!flag)
      this._messages = m
    return flag;
  }
}
