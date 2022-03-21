import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-smart.schedule',
  templateUrl: './smart.schedule.component.html',
  styleUrls: ['./smart.schedule.component.scss']
})
export class SmartScheduleComponent implements OnInit {
  selectedDate: any;
  selectedWeekday: any;
  appointment: string = "none";
  existingappointment: string = "none";
  availableTimeSlots: any[] = [];
  encounterdiagnosesColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX"];
  procedureColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "TOOTH", "SURFACE"];
  data = "";
  constructor() {
  }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.selectedWeekday = this.selectedDate.toLocaleString('en-us', { weekday: 'long' });
    this.availableTimeSlots = ["08:00 am - 08:30 am", "08:30 am - 09:00 am", "09:00 am - 09:30 am", "09:30 am - 10:00 am", "10:00 am - 10:30 am"];
  }

  selectedCalendarDate(event) {
    this.selectedDate = event.value;
    this.selectedDate = formatDate(
      this.selectedDate,
      "dd MMM yyyy",
      "en-US"
    );
    this.selectedWeekday = event.value.toLocaleString('en-us', { weekday: 'long' });
  }

  openAppointment() {
    this.appointment = "block";
  }
  openExistingAppointment() {
    this.existingappointment = "block";
  }
  closeExistingAppointment() {
    this.existingappointment = "none";
  }
}
