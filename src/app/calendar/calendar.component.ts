import { Component, OnInit } from '@angular/core';
// import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  displayStyle: string = "none"
  // public currentDate: Date = new Date(2022, 1, 22);
  // public newViewMode: View = 'Week';
  constructor() { }

  ngOnInit(): void {
  }

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
  // public eventData: EventSettingsModel = {
  //   dataSource: [{
  //     Id: 1,
  //     Subject: 'Board Meeting',
  //     StartTime: new Date(2021, 7, 13, 9, 0),
  //     EndTime: new Date(2021, 7, 13, 11, 0)
  //   },
  //   {
  //     Id: 2,
  //     Subject: 'Training session on JSP',
  //     StartTime: new Date(2021, 7, 15, 15, 0),
  //     EndTime: new Date(2021, 7, 15, 17, 0)
  //   },
  //   {
  //     Id: 3,
  //     Subject: 'Sprint Planning with Team members',
  //     StartTime: new Date(2021, 7, 25, 9, 30),
  //     EndTime: new Date(2021, 7, 25, 11, 0)
  //   }]
  // }
}
