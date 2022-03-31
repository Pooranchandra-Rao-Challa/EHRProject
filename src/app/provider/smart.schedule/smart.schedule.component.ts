import { UtilityService } from './../../_services/utiltiy.service';
import { Pipe } from '@angular/core';
import { formatDate } from '@angular/common';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NewPatient } from '../../_models/newPatient';
import { AuthenticationService } from '../../_services/authentication.service';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/practiceProviders';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TimelineMonthService } from '@syncfusion/ej2-angular-schedule';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';
import { PatientSearchResults, SearchPatient } from 'src/app/_models/smar.scheduler.data';

@Component({
  selector: 'app-smart.schedule',
  templateUrl: './smart.schedule.component.html',
  styleUrls: ['./smart.schedule.component.scss']
})
export class SmartScheduleComponent implements OnInit {
  selectedAppointmentDate: any;
  selectedWeekday: any;
  appointment: string = "none";
  existingappointment: string = "none";
  availableTimeSlots: any[] = [];
  encounterdiagnosesColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX"];
  procedureColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "TOOTH", "SURFACE"];
  EncounterData = "";
  PatientData: NewPatient;
  PhonePattern: any;
  NewPatientForm: FormGroup;
  displayAddress: string;
  displayAddressDialog: boolean;
  addressMessage: string;
  ValidAddressForUse: string;
  PracticeProviders: PracticeProviders[];

  //Auto Search Paramters
  public patients: PatientSearchResults[];
  private patientSearchTerms = new Subject<string>();
  public patientNameOrCellNumber = '';
  public flag: boolean = true;
  public selectedPatient: PatientSearchResults;
  // End of Auto SerachParamters

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private smartSchedulerService: SmartSchedulerService) {

    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    let date = new Date();
    this.PatientData = {
      PatinetHasNoEmail: false
    }

    this.patientSearchTerms
      .pipe(debounceTime(300),  // wait for 300ms pause in events
        distinctUntilChanged())   // ignore if next search term is same as previous
      .subscribe((term) =>
        this.smartSchedulerService
          .SearchPatients({ ProviderId: this.authService.userValue.ProviderId, SearchTerm: term })
          .subscribe(resp => {
            console.log(resp.IsSuccess);
            if (resp.IsSuccess) {
              console.log(JSON.stringify(resp.ListResult));
              this.patients = resp.ListResult; this.flag = true;
              console.log(this.patients);
            } else { this.flag = false; }
          })
      );
  }

  loadDefaults() {
    let req = { "clinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.Result as PracticeProviders[];
      }
    });
  }

  searchPatient(term: string): void {
    this.flag = true;
    this.patientSearchTerms.next(term);
  }
  onselectPatient(PatientObj) {
    if (PatientObj.PatientId != 0) {
      this.selectedPatient = PatientObj;
      this.flag = false;
    }
    else {
      return false;
    }
  }

  buildPatientForm() {
    this.NewPatientForm = this.fb.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      ProviderId: ['new provider'],
      DateofBirth: ['', Validators.required],
      Gender: ['', Validators.required,],
      CellPhone: ['', Validators.required],
      Homephone: [''],
      Email: ['', Validators.required],
      Address: ['']
    });

  }

  ngOnInit(): void {
    this.buildPatientForm();
    this.selectedAppointmentDate = new Date();
    this.selectedWeekday = this.selectedAppointmentDate.toLocaleString('en-us', { weekday: 'long' });
    this.availableTimeSlots = ["08:00 am - 08:30 am", "08:30 am - 09:00 am", "09:00 am - 09:30 am", "09:30 am - 10:00 am", "10:00 am - 10:30 am"];
  }

  selectedCalendarDate(event) {
    this.selectedAppointmentDate = event.value;
    this.selectedAppointmentDate = formatDate(
      this.selectedAppointmentDate,
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
    console.log(JSON.stringify(this.PatientData));

    this.utilityService.CreateNewPatient(this.PatientData).subscribe(resp => {
      if (resp.IsSuccess) {

      }
      else {

      }
    });
  }

  ClearEmailWhenPatientHasNoEmail(event) {
    this.PatientData.Email = "";
  }
  openPopupAddress() {
    this.displayAddress = "block";
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }
  UseValidatedAddress() {
    this.closePopupAddress();
    this.PatientData.Address = this.PatientData.ValidatedAddress;
  }
  VerifyPatientAddress() {
    console.log(this.PatientData.Address);
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      console.log(resp.Result)
      if (resp.IsSuccess) {
        this.PatientData.ValidatedAddress = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"];
        this.ValidAddressForUse = this.PatientData.ValidatedAddress;
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
