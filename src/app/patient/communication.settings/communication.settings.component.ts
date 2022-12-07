import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communication-settings',
  templateUrl: './communication.settings.component.html',
  styleUrls: ['./communication.settings.component.scss']
})
export class CommunicationSettingsComponent implements OnInit {
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
