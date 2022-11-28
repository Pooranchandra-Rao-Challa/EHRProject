import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgbDropdownConfig]
})
export class AppComponent {
  title = 'EHRProject';
  constructor(){
  }

}
