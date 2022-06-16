import { TableUtil } from './../../reports/tableUtil';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ChangeEventArgs, PopupEventArgs } from '@syncfusion/ej2-angular-dropdowns';
// import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import { L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormBuilder, FormGroup } from "@angular/forms";

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
  appointmentForm: FormGroup;
  availableTimeSlots: string[];
  // public currentDate: Date = new Date(2022, 1, 22);
  // public newViewMode: View = 'Week';
  color = '#ff00ff';
  message = 'Empty';
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.availableTimeSlots = ["08:00 am - 08:30 am", "08:30 am - 09:00 am", "09:00 am - 09:30 am", "09:30 am - 10:00 am", "10:00 am - 10:30 am"];
  }

  AppointmentForm() {
    this.appointmentForm = this.fb.group({
      patient: [''],
      provider: [''],
      appointmentType: [''],
      notes: [''],
      location: [''],
    });
  }

  onSubmitAppointmentForm() {
    if (this.appointmentForm.invalid) {
      return;
    }
    var appointmentlist = {
      patient: this.appointmentForm.value.patient,
      provider: this.appointmentForm.value.provider,
      appointmentType: this.appointmentForm.value.appointmentType,
      notes: this.appointmentForm.value.notes,
      location: this.appointmentForm.value.location
    };
    var appointmentData = appointmentlist;
  }

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
  // public setView: View[] = ["Day", "Week"];
  public dateParser(data: string) {
    return new Date(data);
  }

  public data: string[] = ['New', 'Request', 'Unset'];

  public statusFields: Object = { text: 'StatusText', value: 'StatusText' };

  public StatusData: Object[] = [
    { StatusText: 'New', Id: 1 },
    { StatusText: 'Requested', Id: 2 },
    { StatusText: 'Confirmed', Id: 3 }
  ];

  public eventTypeFields: Object = { text: 'EventTypeText', value: 'EventTypeValue' };
  // Datasource definition for custom dropdown
  public EventTypeData: Object[] = [
    { EventTypeText: 'Check up', EventTypeValue: 'check-up' },
    { EventTypeText: 'Consulting', EventTypeValue: 'consulting' },
    { EventTypeText: 'Operation', EventTypeValue: 'operation' }
  ];
  public onChange(args: ChangeEventArgs) {
    if (!isNullOrUndefined(args.value))
      alert("Event type: " + args.value);
  }


  public selectedDate: Date = new Date(2018, 1, 15);
  // public eventSettings: EventSettingsModel = {
  //   dataSource: [
  //     {
  //       Id: 1,
  //       Notes: 'Explosion of Betelgeuse Star',
  //       StartTime: new Date(2018, 1, 15, 9, 30),
  //       EndTime: new Date(2018, 1, 15, 11, 0)
  //     }, {
  //       Id: 2,
  //       Notes: 'Thule Air Crash Report',
  //       StartTime: new Date(2018, 1, 12, 12, 0),
  //       EndTime: new Date(2018, 1, 12, 14, 0)
  //     }, {
  //       Id: 3,
  //       Notes: 'Blue Moon Eclipse',
  //       StartTime: new Date(2018, 1, 13, 9, 30),
  //       EndTime: new Date(2018, 1, 13, 11, 0)
  //     }, {
  //       Id: 4,
  //       Notes: 'Meteor Showers in 2018',
  //       StartTime: new Date(2018, 1, 14, 13, 0),
  //       EndTime: new Date(2018, 1, 14, 14, 30)
  //     }]
  // };
}

