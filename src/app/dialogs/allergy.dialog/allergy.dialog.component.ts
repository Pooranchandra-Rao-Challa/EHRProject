import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment-timezone';
import { fromEvent, Observable, of } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Allergy, GlobalConstants, AllergyType, OnSetAt, SeverityLevel, AllergyNames, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-allergy.dialog',
  templateUrl: './allergy.dialog.component.html',
  styleUrls: ['./allergy.dialog.component.scss']
})
export class AllergyDialogComponent implements OnInit {
  patientAllergy: Allergy = new Allergy();
  currentPatient: ProviderPatient;
  allergyType: AllergyType[];
  severityLevel: SeverityLevel[];
  onsetAt: OnSetAt[];
  allergens: Observable<AllergyNames[]>;
  allergyReaction: GlobalConstants;
  allergyReactionFilter: GlobalConstants;
  isLoading = false;
  displayMessage = true;
  @ViewChild('searchAllergyName', { static: true }) searchAllergyName: ElementRef;

  constructor(private ref: EHROverlayRef,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private authService: AuthenticationService,
    private patientService: PatientService) {
    this.updateLocalModel(ref.RequestData);
    if (this.patientAllergy.StartAt != (null || '' || undefined)) {
      this.patientAllergy.StartAt = moment(this.patientAllergy.StartAt).format('YYYY-MM-DD');
    }
  }

  updateLocalModel(data: Allergy) {
    this.patientAllergy = new Allergy;
    if (data == null) return;
    this.patientAllergy = data;
  }

  ngOnInit(): void {
    this.loadGlobalConstants();
    this.currentPatient = this.authService.viewModel.Patient;
    fromEvent(this.searchAllergyName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 1
      , filter(res => res.length > 2)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterAllergyNames(value));

  }

  _filterAllergyNames(term) {
    this.isLoading = true;
    let reqparams = {
      SearchTearm: term,
    };
    this.patientService.AllergyNames(reqparams)
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.IsSuccess) {
          this.allergens = of(
            resp.ListResult as AllergyNames[]);
        } else this.allergens = of([]);
      });
  }

  displayWithAllergy(value: any): string {
    if (!value) return "";
    return "";
  }

  onSelectedAllergy(selected) {
    debugger;
    this.patientAllergy.AllergenName = selected.option.value.AllergyName;
  }

  deleteAllergyName() {
    this.patientAllergy.AllergenName = null;
  }

  loadGlobalConstants() {
    this.allergyType = Object.values(AllergyType);
    this.severityLevel = Object.values(SeverityLevel);
    this.onsetAt = Object.values(OnSetAt);
    this.allergyReaction = GlobalConstants.AllergyReactions;
    this.allergyReactionFilter = this.allergyReaction.slice();
  }

  cancel() {
    this.ref.close(null);
  }

  CreateAllergies() {
    let isAdd = this.patientAllergy.AlergieId == undefined;
    this.patientAllergy.PatientId = this.currentPatient.PatientId;
    this.patientAllergy.StartAt = this.datepipe.transform(this.patientAllergy.StartAt, "MM/dd/yyyy hh:mm:ss");
    this.patientAllergy.EndAt = this.datepipe.transform(this.patientAllergy.EndAt, "MM/dd/yyyy hh:mm:ss");
    this.patientAllergy.EncounterId = '60d72688391cba0e236c28c8';
    this.patientService.CreateAllergies(this.patientAllergy).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.ref.close({
          "UpdatedModal": PatientChart.Allergies
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CA001" : "M2CA002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CA001"]);
      }
    });
  }

  disableAllergies() {
    return !(this.patientAllergy.AllergenType == undefined ? '' : this.patientAllergy.AllergenType != ''
      && this.patientAllergy.AllergenName == undefined ? '' : this.patientAllergy.AllergenName != ''
        && this.patientAllergy.SeverityLevel == undefined ? '' : this.patientAllergy.SeverityLevel != ''
          && this.patientAllergy.OnSetAt == undefined ? '' : this.patientAllergy.OnSetAt != ''
            && this.patientAllergy.Reaction == undefined ? '' : this.patientAllergy.Reaction != ''
              && this.patientAllergy.StartAt == undefined ? '' : this.patientAllergy.StartAt != '')
  }

  deleteAllergyReaction() {
    this.patientAllergy.Reaction = null;
  }
}
