import { Component, OnInit } from '@angular/core';
import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import { L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

L10n.load({
  'en-US': {
    'schedule': {
      'saveButton': 'Save Appointment',
      'cancelButton': 'Cancel',
      'deleteButton': 'Delete',
      'newEvent': 'Add New Appointment',
    },
  }
});

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  displayStyle: string = "none"
  nameTitle: { titleId: number; titleName: string; }[];
  // public currentDate: Date = new Date(2022, 1, 22);
  // public newViewMode: View = 'Week';
  constructor() { }

  ngOnInit(): void {
    this.patientDropdown();
    this.nameTitle = [
      { titleId: 1, titleName: 'Dr' },
      { titleId: 2, titleName: 'Mr' },
      { titleId: 3, titleName: 'Ms' },
      { titleId: 4, titleName: 'Mrs' },
    ];
    let sportsData: { [key: string]: Object }[] = [
      { Id: 'game1', Game: 'Badminton' },
      { Id: 'game2', Game: 'Football' },
      { Id: 'game3', Game: 'Tennis' }
    ];

    //initiate the DropDownList
    let dropDownListObject: DropDownList = new DropDownList({
      // bind the sports Data to datasource property
      dataSource: sportsData,
      // maps the appropriate column to fields property
      fields: { text: 'Game', value: 'Id' },
      //set the placeholder to DropDownList input
      placeholder: "Select a game"
    });
    //render the component
    dropDownListObject.appendTo('#ddlelement');
  }

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
  public setView: View[] = ["Day", "Week"];
  public dateParser(data: string) {
    return new Date(data);
  }
  // public statusFields: Object = { text: 'StatusText', value: 'StatusText' };
  // public StatusData: Object[] = [
  //   { StatusText: 'New' },
  //   { StatusText: 'Request' }
  // ];
  public data: string[] = ['New', 'Request', 'Unset'];



  patientDropdown() {
    let sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];

    // initialize DropDownList component
    let dropDownListObject: DropDownList = new DropDownList({
      //set the data to dataSource property
      dataSource: sportsData,
      // set placeholder to DropDownList input element
      placeholder: "Select a game"
    });

    // render initialized DropDownList
    dropDownListObject.appendTo('#PatientName');
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
