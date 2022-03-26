import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NewPatient } from '../../_models/newPatient';
import { AuthenticationService } from '../../_services/authentication.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  EncounterData = "";
  PatinetData: NewPatient;
  PhonePattern: any;
  NewPatinetForm: FormGroup;

  displayAddress: string;
  displayAddressDialog: boolean;
  addressMessage: string;
  ValidAddressForUse: string;
  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilityService: UtilityService) {
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    let date = new Date();
    this.PatinetData = {
      PatientId: "",
      FirstName: "FirstName",
      LastName: "LastName",
      MiddleName: "MiddleName",
      DateofBirth: { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() },
      Gender: "male",
      CellPhone: "9894839403",
      Homephone: "8493820394",
      Email: "pcraochallas@calibrage.in",
      Address: "",
      PatinetHasNoEmail: false
    }
  }
  // buildPatientForm() {
  //   this.NewPatinetForm = this.fb.group({
  //     FirstName: ['', Validators.required],
  //     MiddleName: [''],
  //     LastName: ['', Validators.required],
  //     ProviderId: ['new provider'],
  //     DateofBirth: ['', Validators.required],
  //     Gender: ['', Validators.required,],
  //     CellPhone: ['', Validators.required],
  //     Homephone: [''],
  //     Email: ['', Validators.required],
  //     Address: ['']
  //   });

  // }

  ngOnInit(): void {
    // this.buildPatientForm();
    this.selectedDate = new Date();
    this.selectedWeekday = this.selectedDate.toLocaleString('en-us', { weekday: 'long' });
    this.availableTimeSlots = ["08:00 am - 08:30 am", "08:30 am - 09:00 am", "09:00 am - 09:30 am", "09:30 am - 10:00 am", "10:00 am - 10:30 am"];
  }

  selectedCalendarDate(event) {
    this.selectedDate = event.value;
    this.selectedDate = formatDate(
      this.selectedDate,
      "MM ddd yyyy",
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
  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
  UpdatePatient() {
    console.log(this.PatinetData);
  }

  ClearEmailWhenPatientHasNoEmail(event) {
    this.PatinetData.Email = "";
  }
  openPopupAddress() {
    this.displayAddress = "block";
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }
  UseValidatedAddress() {
    this.closePopupAddress();
    this.PatinetData.Address = this.PatinetData.ValidatedAddress;
  }
  VerifyPatientAddress() {
    console.log(this.PatinetData.Address);
    this.utilityService.VerifyAddress(this.PatinetData.Address).subscribe(resp => {
      console.log(resp.Result)
      if (resp.IsSuccess && resp.Result != null) {
        this.PatinetData.ValidatedAddress = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"];
        this.ValidAddressForUse = this.PatinetData.ValidatedAddress;
        this.addressMessage = resp.EndUserMessage;
        this.openPopupAddress();
        this.displayAddressDialog = false;
      }
      else {
        this.displayAddressDialog = true;
        this.openPopupAddress();
        this.addressMessage = resp.EndUserMessage;
      }
    });
  }
}
