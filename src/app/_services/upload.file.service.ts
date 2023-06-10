import { Attachment } from './../_models/_provider/LabandImage';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UPLOAD_URL } from 'src/environments/environment'
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UploadService {
  httpRequestHeaders: HttpHeaders;
  httpRequestParams: HttpParams;
  jwtToken: string;

  // I initialize the upload service.
  constructor(private httpClient: HttpClient,
    private authService: AuthenticationService) {
    this.httpClient = httpClient;
    this.jwtToken = this.authService.userValue.JwtToken;
    this.httpRequestHeaders = new HttpHeaders();
    this.httpRequestHeaders = this.httpRequestHeaders.append("Authorization",this.jwtToken);
  }


  // I upload the given file to the remote server. Returns a Promise.
  public uploadFile(file: FormData, entityName: string, EntityId: string = null) {
    let fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')
    this.httpRequestParams = new HttpParams();
    this.httpRequestParams = this.httpRequestParams.append("EntityName", entityName);
    if (EntityId != null)
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

}
