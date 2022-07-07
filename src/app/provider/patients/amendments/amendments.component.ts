import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { Amendments } from 'src/app/_models/_provider/amendments';

@Component({
  selector: 'app-amendments',
  templateUrl: './amendments.component.html',
  styleUrls: ['./amendments.component.scss']
})
export class AmendmentsComponent implements OnInit {
  amendment:Amendments = new Amendments();
  constructor() { }

  ngOnInit(): void {
  }
  AmendmentsColumns=['DateRequested','Status','Description/Location','Scanned']
  Status: any[] = [
    { value: 'Requested', viewValue: 'Requested' },
    { value: 'Accepted', viewValue: 'Accepted' },
    { value: 'Denied', viewValue: 'Denied' },
  ];
  Source: any[] = [
    { value: 'Pratice', viewValue: 'Pratice' },
    { value: 'Patient', viewValue: 'Patient' },
    { value: 'Organization', viewValue: 'Organization' },
    { value: 'Other', viewValue: 'Other' },
  ];
  todayDateforDateRequested() {
    this.amendment.DateRequested = moment(new Date()).format('YYYY-MM-DD');
  }
  todayDateforDateAcceptedorDenied()
  {
    this.amendment.DateAcceptedorDenied= moment(new Date()).format('YYYY-MM-DD');
  }
  todayforDateAppended()
  {
    this.amendment.DateAppended= moment(new Date()).format('YYYY-MM-DD');
  }

}
