import { PatientService } from 'src/app/_services/patient.service';
import { DatePipe, PlatformLocation } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  TemplateRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service'
import { Patient, PatientPortalUser, Actions } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PatientPortalAccountComponent } from 'src/app/dialogs/patient.dialog/patient.portal.account.dialog.component';
import { PatientHealthPortalComponent } from 'src/app/dialogs/patient.dialog/patient.health.portal.component';
import { AddressVerificationDialogComponent, AddressValidation } from 'src/app/dialogs/address.verification.dialog/address.verification.dialog.component';
import { Accountservice } from 'src/app/_services/account.service';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ViewChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { Router } from '@angular/router';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { GlobalConstants } from 'src/app/_models/_provider/chart'
import { Moment } from 'moment-timezone';
import * as moment from 'moment';

@Component({
  selector: 'patient-dialog',
  templateUrl: './patient.dialog.component.html',
  styleUrls: ['./patient.dialog.component.scss'],
})
export class PatientDialogComponent {
  @Output() onPatientClose = new EventEmitter();
  @ViewChild('searchFirstName', { static: true }) searchFirstName: ElementRef;
  @ViewChild('searchLastName', { static: true }) searchLastName: ElementRef;
  patientPortalAccountComponent = PatientPortalAccountComponent;
  patientHealthPortalComponent = PatientHealthPortalComponent;
  addressVerificationDialogComponent = AddressVerificationDialogComponent;
  PatientData: Patient = { Gender: 'male' };
  filteredPatients: Observable<ProviderPatient[]>;
  showMatchingPatients: boolean = false;
  hideSaveButton: boolean = false;
  addressIsVarified: boolean = false;
  phonepattern = /^[0-9]{10}/;
  showHourglass: boolean = false;
  saveInvoked: boolean = false;
  PhonePattern: {};
  todayDate: Date;
  url: string;
  States: any;

  constructor(private dialogRef: EHROverlayRef,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage,
    private overlayService: OverlayService,
    private plaformLocation: PlatformLocation,
    private accountservice: Accountservice,
    private pateintService: PatientService,
    private router: Router,
    private viewChangeService: ViewChangeService,
    private datePipe: DatePipe) {
      this.url = `${plaformLocation.protocol}//${plaformLocation.hostname}:${plaformLocation.port}/`;
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    this.todayDate = new Date();
    this.States = GlobalConstants.States;
  }

  dateofbirthFilter = (m: Moment | null): boolean => {
    const day = (m || moment()).day();
    return day !== 0 && day !== 6;
  }

  ngAfterViewInit() {
    fromEvent(this.searchFirstName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length >= 0)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatient());
    fromEvent(this.searchLastName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length >= 0)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatient());
  }

  _filterPatient() {
    if (this.PatientData.FirstName || this.PatientData.LastName || this.PatientData.DateofBirth) {
      this.pateintService
        .MatchingPatients({
          SearchFirstName: this.PatientData.FirstName ? this.PatientData.FirstName : '',
          SearchLastName: this.PatientData.LastName ? this.PatientData.LastName : '',
          SearchDOB: this.PatientData.DateofBirth ? this.datePipe.transform(this.PatientData.DateofBirth, "yyyy-MM-dd") : '',
          ProviderId: this.authService.userValue.ProviderId
        })
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.filteredPatients = of(
              resp.ListResult as ProviderPatient[]);
            this.showMatchingPatients = true;
          } else {
            this.filteredPatients = of([]);
            this.showMatchingPatients = false;
          }
        });
    }
    else {
      this.filteredPatients = of([]);
      this.showMatchingPatients = false;
    }
  }

  dismiss() {
    this.showMatchingPatients = false;
  }

  onChangeViewState(patientview) {
    this.dialogRef.close({
      'refresh': true
    });
    this.viewChangeService.sendData("Patients");
    this.authService.SetViewParam("View", "Patients")
    this.authService.SetViewParam("Patient", patientview);
    this.authService.SetViewParam("PatientView", "Chart");
    this.router.navigate(["/provider/patientdetails"]);
  }

  cancel() {
    this.dialogRef.close({ 'refresh': true });
  }

  enableSave() {
    return !(this.PatientData.FirstName != null && this.PatientData.FirstName != ""
      && this.PatientData.LastName != null && this.PatientData.LastName != ""
      && this.PatientData.DateofBirth != null
      && this.PatientData.Gender != null && this.PatientData.Gender != ""
    )
  }
  showAddress: boolean = false;
  VerifyPatientAddress() {
    this.showHourglass = true;
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      let av = new AddressValidation();
      this.showHourglass = false;
      this.showAddress = true;
      if (resp.IsSuccess) {
        av.IsValid = true;
        av.Address = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"]
        av.ValidatedAddress = resp.Result;
      }
      else {
        av.IsValid = false;

        this.PatientData.City = resp.Result.City;
        this.PatientData.State =  resp.Result.State;
        this.PatientData.StreetAddress = resp.Result.StreetAddress;
        this.PatientData.Zipcode =  resp.Result.ZipCode;
      }
      this.openComponentDialog(this.addressVerificationDialogComponent, av, Actions.view);
    });
  }

  UseValidatedAddress() {
    this.PatientData.City = this.PatientData.AddressResult.components.city_name;
    this.PatientData.State = this.PatientData.AddressResult.components.state_abbreviation;
    this.PatientData.StreetAddress = this.PatientData.AddressResult.delivery_line_1;
    this.PatientData.Zipcode = this.PatientData.AddressResult.components.zipcode;
    this.PatientData.Address = this.PatientData.ValidatedAddress;
  }

  UpdatePatient() {
    this.hideSaveButton = true;
    this.saveInvoked = true;
    if (this.PatientData.StreetAddress == null || this.PatientData.StreetAddress == "") {
      if (this.PatientData.ValidatedAddress != null && this.PatientData.ValidatedAddress != "")
        this.PatientData.StreetAddress = this.PatientData.ValidatedAddress;
      else if (this.PatientData.Address != null && this.PatientData.Address != "")
        this.PatientData.StreetAddress = this.PatientData.Address;
    }
    this.PatientData.LocationId = this.authService.userValue.CurrentLocation;
    this.PatientData.ProviderId = this.authService.userValue.ProviderId;
    this.PatientData.ClinicId = this.authService.userValue.ClinicId;
    this.PatientData.strDateofBirth = this.datePipe.transform(this.PatientData.DateofBirth, "MM/dd/yyyy");

    this.utilityService.CreatePatient(this.PatientData).subscribe(resp => {
      this.saveInvoked = false;
      if (resp.IsSuccess) {
        if (resp.Result != null) {

          let patientPortalUser = resp.Result as PatientPortalUser;
          this.openComponentDialog(this.patientPortalAccountComponent,
            patientPortalUser, Actions.view)
        }
        else {
          this.cancel();
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP001"])
        }
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP001"])
      }
    });

  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.patientPortalAccountComponent && action == Actions.view) {
      dialogData = data;
    } else if (content === this.patientHealthPortalComponent && action == Actions.view) {
      dialogData = data;
    } else if (content === this.addressVerificationDialogComponent && action == Actions.view) {
      dialogData = data;
    }
    const ref = this.overlayService.open(content, dialogData,true);
    ref.afterClosed$.subscribe(res => {
      if (content === this.patientPortalAccountComponent) {
        if (res.data != null) {
          this.utilityService.CreatePatientAccount(res.data).subscribe(resp => {
            if (resp.IsSuccess) {
              this.openComponentDialog(this.patientHealthPortalComponent,
                res.data, Actions.view);
            } else {
              this.cancel();
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
            }
          });
        }
      }
      else if (content === this.patientHealthPortalComponent) {
        this.cancel();
      }
      else if (content === this.addressVerificationDialogComponent) {
        if (res.data && res.data.useThis.UseAddress) {
          this.PatientData.AddressResult = res.data.useThis.ValidatedAddress;
          this.PatientData.ValidatedAddress = res.data.useThis.Address;
          this.addressIsVarified = true;
          this.UseValidatedAddress();
        } else if (res.data && !res.data.useThis.UseAddress) {
          this.PatientData.City = res.data.useThis.ValidatedAddress.components.city_name;
          this.PatientData.State = res.data.useThis.ValidatedAddress.components.state_abbreviation;
          this.PatientData.StreetAddress = res.data.useThis.ValidatedAddress.delivery_line_1;
          this.PatientData.Zipcode = res.data.useThis.ValidatedAddress.components.zipcode;
          //this.PatientData.Address = this.PatientData.ValidatedAddress;
        }
      }
    });
  }
}
