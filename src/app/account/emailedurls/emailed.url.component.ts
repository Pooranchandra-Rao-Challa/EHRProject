import { Component } from '@angular/core';
import { Accountservice } from 'src/app/_services/account.service';
import { EmailedUrls} from 'src/app/_models/emailed.urls'


@Component({
  selector: 'app-email-urls',
  templateUrl: './emailed.url.component.html',
  styleUrls: ['./emailed.url.component.scss']
})
export class EmailedUrlsComponent {
    constructor(private accountService: Accountservice){}
    emaildUrls: EmailedUrls
    emailedColumns: string[] = ['FunctionalName', 'Errors', 'Created','Active'];
    InitUrls(){
      this.accountService.EmailedUrls().subscribe(resp =>{
        if(resp.IsSuccess){
          this.emaildUrls = resp.ListResult;
        }
      })
    }
}
