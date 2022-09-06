import { Component, ComponentFactoryResolver, ElementRef, ViewChild } from '@angular/core';
import { Accountservice } from 'src/app/_services/account.service';
import { EmailedUrls } from 'src/app/_models/emailed.urls'


@Component({
  selector: 'app-email-urls',
  templateUrl: './emailed.url.component.html',
  styleUrls: ['./emailed.url.component.scss']
})
export class EmailedUrlsComponent {

  @ViewChild('iframe', { static: true })
  iframe: ElementRef;
  doc;
  element;
  constructor(private accountService: Accountservice) {
    this.InitUrls();
  }
  emaildUrls: EmailedUrls[]
  emailedColumns: string[] = ['Name', 'FunctionalName', 'Created'];
  selectedEmail: EmailedUrls = null;
  InitUrls() {
    this.accountService.EmailedUrls().subscribe(resp => {
      if (resp.IsSuccess) {
        this.emaildUrls = resp.ListResult as EmailedUrls[];
      }
    })
  }
  onLoad(iframe) {
    this.doc = iframe.contentDocument || iframe.contentWindow;
    console.log(iframe.contentDocument);

  }
  async loadHtmlView(pkey: number) {
    this.emaildUrls.forEach((data, i) => {
      if (data.Pkey == pkey) {
        this.selectedEmail = data;
        if (this.element)
          this.doc.body.removeChild(this.element)
        this.element = document.createRange().createContextualFragment(this.selectedEmail?.Html);

        this.doc.body.appendChild(this.element);

      }
    }
    )
  }
}
