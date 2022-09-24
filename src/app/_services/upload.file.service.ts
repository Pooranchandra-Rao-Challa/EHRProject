import { Attachment } from './../_models/_provider/LabandImage';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UPLOAD_URL } from 'src/environments/environment'

@Injectable()
export class UploadService {
  httpRequestHeaders: HttpHeaders;
  httpRequestParams: HttpParams;

	// I initialize the upload service.
	constructor(private httpClient: HttpClient ) {
		this.httpClient = httpClient;
	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I upload the given file to the remote server. Returns a Promise.
	public uploadFile(file: FormData, entityName: string, EntityId: string = null)  {
    let fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')
    this.httpRequestParams = new HttpParams();
    this.httpRequestParams = this.httpRequestParams.append("EntityName", entityName);
    if(EntityId != null)
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
