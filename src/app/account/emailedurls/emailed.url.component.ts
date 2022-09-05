import { Component, ComponentFactoryResolver, ElementRef, ViewChild } from '@angular/core';
import { Accountservice } from 'src/app/_services/account.service';
import { EmailedUrls } from 'src/app/_models/emailed.urls'


@Component({
  selector: 'app-email-urls',
  templateUrl: './emailed.url.component.html',
  styleUrls: ['./emailed.url.component.scss']
})
export class EmailedUrlsComponent {


  @ViewChild('divhtmlview', { static: true })
  private divhtmlview: ElementRef;


  constructor(private accountService: Accountservice) {
    this.InitUrls();
  }
  emaildUrls: EmailedUrls[]
  emailedColumns: string[] = ['Name','FunctionalName', 'Created'];
  selectedEmail: EmailedUrls = null;
  InitUrls() {
    this.accountService.EmailedUrls().subscribe(resp => {
      if (resp.IsSuccess) {
        this.emaildUrls = resp.ListResult as EmailedUrls[];
      }
    })
  }

  async loadHtmlView(pkey: number) {
    console.log(pkey);
    console.log(this.divhtmlview);
    this.emaildUrls.forEach((data, i) => {
      if (data.Pkey == pkey) {
        console.log(data.Html);

        this.selectedEmail = data;
      }
    }
    )

    // this.htmlviewref.clear();
    // const { ChartComponent } = await import('../chart/chart.component');
    // let viewcomp = this.chartviewcontainerref.createComponent(
    //   this.cfr.resolveComponentFactory(ChartComponent)
    // );
    // viewcomp.changeDetectorRef.detectChanges();

  }
}
