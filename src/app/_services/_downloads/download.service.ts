import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpRequest } from '@angular/common/http'
import { download, Download } from './download'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { SAVER, Saver } from './saver.provider'

/**
 *
 * Import in module like this
 *
 *  import { SAVER, getSaver } from './saver.provider'
 *
 * user is component like this
 * download$: Observable<Download>


  constructor(private downloads: DownloadService,
              @Inject(DOCUMENT) private document: Document) {}

  download({name, url}: {name: string, url: string}) {
    this.download$ = this.downloads.download(url, name)


    in html file like  this

    <mat-card>
	<div class="file">
		<p>{{ slides.name }}</p>
		<button (click)="download(slides)" mat-raised-button color="primary">Download</button>
	</div>
	<mat-progress-bar *ngIf="download$ | async as download"
		[mode]="download.state == 'PENDING' ? 'buffer' : 'determinate'"
    [value]="download.progress">
	</mat-progress-bar>
</mat-card>
  }
 */
@Injectable({providedIn: 'root'})
export class DownloadService {

  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver
  ) {
  }

  download(url: string, filename?: string): Observable<Download> {
    return this.http.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(download(blob => this.save(blob, filename)))
  }


  blob(url: string, filename?: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }
}
