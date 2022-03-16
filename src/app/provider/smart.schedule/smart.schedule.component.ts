import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-smart.schedule',
  templateUrl: './smart.schedule.component.html',
  styleUrls: ['./smart.schedule.component.scss']
})
export class SmartScheduleComponent implements OnInit {
  selectedDate: any;
  selectedWeekday: any;
  displayStyle: string = "none";
  appointment: string = "none";
  existingappointment: string = "none";
  availableTimeSlots: any[] = [];
  displayedColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX"];
  displayedColumns1 = ["CODE", "CODE SYSTEM", "DESCRIPTION", "TOOTH", "SURFACE"];
  data = "";
  showStorage: any;
  constructor() {
    this.showStorage = localStorage.getItem("providerlocation");
    console.log(this.showStorage);

  }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.selectedWeekday = this.selectedDate.toLocaleString('en-us', { weekday: 'long' });
    this.availableTimeSlots = ["08:00 am - 08:30 am", "08:30 am - 09:00 am", "09:00 am - 09:30 am", "09:30 am - 10:00 am", "10:00 am - 10:30 am"];
  }
  selectedTab = "Tab1";

  makeActive(tab: string) {
    this.selectedTab = tab;
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
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
  openAppointment() {
    this.appointment = "block";
  }
  closeAppointment() {
    this.appointment = "none";
  }
  openExistingAppointment() {
    this.existingappointment = "block";
  }
  closeExistingAppointment() {
    this.existingappointment = "none";
  }
}
