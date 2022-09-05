import { Subject, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Accountservice } from '../_services/account.service';


@Component({
  selector: 'provider-confirmation',
  templateUrl: './provider.confirmation.component.html',
  styleUrls: ['./provider.confirmation.component.scss']
})
export class ProviderConfirmationComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private accountService: Accountservice) { }

  message: string;
  token: string;
/**

} */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });
    this.accountService.ProviderConfirmation({ token: this.token }).subscribe(resp => {
      this.message = resp.EndUserMessage
    });
  }
}
