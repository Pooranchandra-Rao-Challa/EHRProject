import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment, UPLOAD_URL } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  constructor(private http: HttpClient,private authService: AuthenticationService) {}

  fileName = '';
  uploadNotifier: BehaviorSubject<number> = new BehaviorSubject(0);
  uploadNotifier$: Observable<number> = this.uploadNotifier.asObservable();
  uploadProgress: number;
  uploadSub: Subscription;

  upload(location:string,file:File) {
    const uploadurl = UPLOAD_URL(location);
    console.log(uploadurl);

      if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("file", file, this.fileName);

        const upload$ = this.http.post(uploadurl, formData, {
          reportProgress: true,
          observe: 'events',
          headers: {
						"Authorization": this.authService.userValue.JwtToken
					},
					params: {

					}
        })
          .pipe(
            finalize(() => this.reset())
          );

        this.uploadSub = upload$.subscribe(event => {
          console.log(event);

          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
            this.uploadNotifier.next(this.uploadProgress)
          }
        })
      }


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
