import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification.settings',
  templateUrl: './notification.settings.component.html',
  styleUrls: ['./notification.settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit {
  PhonePattern: {};

  constructor() {
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
   }

  ngOnInit(): void {
  }

}
