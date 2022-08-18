import { I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selectedReaction: string[] = [];
  noRecords: boolean = false;

  constructor(private ref: EHROverlayRef,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private authService: AuthenticationService,
    private patientService: PatientService,
    private datePipe: DatePipe
    ) {
    this.updateLocalModel(ref.RequestData);
    if (this.patientAllergy.StartAt != (null || '' || undefined)) {
      this.patientAllergy.StartAt = this.datepipe.transform(this.patientAllergy.StartAt, "yyyy-MM-dd");
    }
    if (this.patientAllergy.EndAt != (null || '' || undefined)) {
      this.patientAllergy.EndAt = this.datepipe.transform(this.patientAllergy.EndAt, "yyyy-MM-dd");
    }
  }

  updateLocalModel(data: Allergy) {
    this.patientAllergy = new Allergy;
    if (data == null) return;
    this.patientAllergy = data;
    if (data.Reaction != undefined) {
      this.selectedReaction = data.Reaction.split(",");
      this.patientAllergy.Reaction = this.selectedReaction.toString();
    }
  }

  ngOnInit(): void {
    this.loadGlobalConstants();
    this.currentPatient = this.authService.viewModel.Patient;
    fromEvent(this.searchAllergyName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.allergens = of([]);
        this.noRecords = false;
        if(event.target.value == ''){
          this.displayMessage = true;
        }
        return event.target.value;
      })
      // if character length greater or equals to 1
      , filter(res => res.length >= 1)
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
        } else {
          this.allergens = of([]);
          this.noRecords = true;
        }
      });
  }

  displayWithAllergy(value: any): string {
    if (!value) return "";
    return "";
  }

  onSelectedAllergy(selected) {
    this.patientAllergy.AllergenName = selected.option.value.AllergyName;
  }

  onSelectedAllergyReaction(selected) {
    if (this.selectedReaction.length > 0) {
      this.selectedReaction.push(selected);
      this.patientAllergy.Reaction = this.selectedReaction.map(function (val) { return val; }).join(',');
    }
    else {
      this.selectedReaction = new Array(selected);
      this.patientAllergy.Reaction = this.selectedReaction.map(function (val) { return val; }).join(',');
    }
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
    // this.ref.close(null);
    this.ref.close({
      "UpdatedModal": PatientChart.Allergies
    });
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

  deleteAllergyReaction(i) {
    // this.selectedReaction.splice(this.selectedReaction.indexOf(selected), 1);
    this.selectedReaction.splice(i, 1);
    this.patientAllergy.Reaction = this.selectedReaction.toString();
  }

  disableAllergies() {
    return !(this.patientAllergy.AllergenType && this.patientAllergy.AllergenName && this.patientAllergy.SeverityLevel && this.patientAllergy.OnSetAt
            && this.patientAllergy.StartAt && this.patientAllergy.Reaction)
  }
}
