import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment, UPLOAD_URL } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Attachment } from '../_models/_provider/LabandImage';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  constructor(private httpClient: HttpClient,private authService: AuthenticationService) {}

  fileName = '';
  uploadNotifier: BehaviorSubject<number> = new BehaviorSubject(0);
  uploadNotifier$: Observable<number> = this.uploadNotifier.asObservable();
  uploadProgress: number;
  uploadSub: Subscription;
  httpRequestHeaders: HttpHeaders;
  httpRequestParams: HttpParams;

  // upload(location:string,file:File) {
  //   const uploadurl = UPLOAD_URL(location);
  //     if (file) {
  //       this.fileName = file.name;
  //       const formData = new FormData();
  //       formData.append("file", file, this.fileName);

  //       const upload$ = this.http.post(uploadurl, formData, {
  //         reportProgress: true,
  //         observe: 'events',
  //         headers: {
	// 					"Authorization": this.authService.userValue.JwtToken
	// 				},
	// 				params: {

	// 				}
  //       })
  //         .pipe(
  //           finalize(() => this.reset())
  //         );

  //       this.uploadSub = upload$.subscribe(event => {
  //         if (event.type == HttpEventType.UploadProgress) {
  //           this.uploadProgress = Math.round(100 * (event.loaded / event.total));
  //           this.uploadNotifier.next(this.uploadProgress)
  //         }
  //       })
  //     }


  // }

  public UploadFile(file: FormData, entityName: string, EntityId: string) {
    let fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')
    this.httpRequestParams = new HttpParams();
    this.httpRequestParams = this.httpRequestParams.append("EntityName", entityName);
    this.httpRequestParams = this.httpRequestParams.append("EntityId", EntityId);
    // this.fileName = file.name;
    //     const formData = new FormData();
    //     formData.append("file", file, this.fileName);
    return this.httpClient.post<Attachment>(
      fileUploadUrl,
      file, // Send the File Blob as the POST body.
      {
        headers: this.httpRequestHeaders,
        observe: "events",
        params: this.httpRequestParams,
        reportProgress: true,
        responseType: "json",
      }
    );
  }
  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
    this.uploadNotifier.next(0);
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
