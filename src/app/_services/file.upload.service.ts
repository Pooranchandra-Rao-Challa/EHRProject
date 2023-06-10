import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import {  UPLOAD_URL } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Attachment } from '../_models/_provider/LabandImage';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {


  constructor(private httpClient: HttpClient,private authService: AuthenticationService) {
    this.jwtToken = this.authService.userValue.JwtToken;
    this.httpRequestHeaders = new HttpHeaders();
    this.httpRequestHeaders = this.httpRequestHeaders.append("Authorization",this.jwtToken);

  }

  fileName = '';
  uploadNotifier: BehaviorSubject<number> = new BehaviorSubject(0);
  uploadNotifier$: Observable<number> = this.uploadNotifier.asObservable();
  uploadProgress: number;
  uploadSub: Subscription;
  httpRequestHeaders: HttpHeaders;
  httpRequestParams: HttpParams;
  jwtToken: string;

  public UploadFile(file: FormData, entityName: string, EntityId: string) {
    let fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')
    this.httpRequestParams = new HttpParams();
    this.httpRequestParams = this.httpRequestParams.append("EntityName", entityName);
    this.httpRequestParams = this.httpRequestParams.append("EntityId", EntityId);
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
  DeleteFile(attchment: Attachment){
    let fileDeleteUrl = UPLOAD_URL('api/upload/DeleteAttachment');
    return this.httpClient.post<any>(fileDeleteUrl,attchment);
  }
}
