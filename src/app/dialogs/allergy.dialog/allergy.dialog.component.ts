import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Allergy, GlobalConstants, AllergyType, OnSetAt, SeverityLevel, AllergyNames, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';

@Component({
  selector: 'app-allergy.dialog',
  templateUrl: './allergy.dialog.component.html',
  styleUrls: ['./allergy.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  //@ViewChild('searchAllergyName', { static: true }) searchAllergyName: ElementRef;
  selectedReaction: string[] = [];
  noRecords: boolean = false;
  minDateToFinish = new Subject<string>();
  minDateForEndDate;

  @ViewChild('cdkSearchAllergyName', { static: true }) cdkSearchAllergyName: ElementRef;
  filteredOptions: AllergyNames[] =[];
  public height: string;

  constructor(private ref: EHROverlayRef,
    public datepipe: DatePipe,
    private alertmsg: AlertMessage,
    private authService: AuthenticationService,
    private patientService: PatientService) {
    this.updateLocalModel(ref.RequestData);
    if (this.patientAllergy.StartAt != (null || '' || undefined)) {
      this.patientAllergy.StartAt = this.datepipe.transform(this.patientAllergy.StartAt, "yyyy-MM-dd");
      this.minDateForEndDate = new Date(this.patientAllergy.StartAt);
    }
    if (this.patientAllergy.EndAt != (null || '' || undefined)) {
      this.patientAllergy.EndAt = this.datepipe.transform(this.patientAllergy.EndAt, "yyyy-MM-dd");
    }
    this.minDateToFinish.subscribe(minDate => {
      this.minDateForEndDate = new Date(minDate);
    })
  }

  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }

  updateLocalModel(data: Allergy) {
    this.patientAllergy = {};
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
    fromEvent(this.cdkSearchAllergyName.nativeElement,'keyup').pipe(
      map((event:any) => {
        this.filteredOptions = [];
        this.noRecords = false;
        if (event.target.value == '') {
          this.displayMessage = true;
        }
        return event.target.value;
      }),
      filter(searchInput => searchInput.length >= 3)
      , debounceTime(200)
      // If previous query is diffent from current
      //, distinctUntilChanged()
      // subscription for response
    ).subscribe(searchText => this._filterAllergyNames2(searchText));



    // fromEvent(this.searchAllergyName.nativeElement, 'keyup').pipe(
    //   // get value
    //   map((event: any) => {
    //     this.allergens = of([]);
    //     this.noRecords = false;
    //     if (event.target.value == '') {
    //       this.displayMessage = true;
    //     }
    //     return event.target.value;
    //   })
    //   // if character length greater or equals to 1
    //   , filter(res => res.length >= 3)
    //   // Time in milliseconds between key events
    //   , debounceTime(300)
    //   // If previous query is diffent from current
    //   , distinctUntilChanged()
    //   // subscription for response
    // ).subscribe(value => this._filterAllergyNames(value));
  }


  _filterAllergyNames2(term) {
    this.isLoading = true;
    this.displayMessage = false;
    let reqparams = {
      SearchTearm: term,
    };
    this.patientService.AllergyNames(reqparams)
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredOptions = (resp.ListResult as AllergyNames[]).sort((a,b)=> b.AllergyName.localeCompare(a.AllergyName));
        } else {
          this.filteredOptions = [];
          this.noRecords = true;
          this.displayMessage = true;
        }

        if (this.filteredOptions.length < 4) {
          this.height = this.filteredOptions.length * 50 + "px";
        } else {
          this.height = "200px";
        }

      });
  }



  // _filterAllergyNames(term) {
  //   this.isLoading = true;
  //   let reqparams = {
  //     SearchTearm: term,
  //   };
  //   this.patientService.AllergyNames(reqparams)
  //     .subscribe(resp => {
  //       this.isLoading = false;
  //       this.displayMessage = false;
  //       if (resp.IsSuccess) {
  //         this.allergens = of(
  //           resp.ListResult as AllergyNames[]);
  //       } else {
  //         this.allergens = of([]);
  //         this.noRecords = true;
  //       }
  //     });
  // }

  public handleKeyboardEvent(event: MatAutocompleteSelectedEvent): void {


    if (event.source.isOpen) {
      ((event.option as any)
        ._element as ElementRef).nativeElement.scrollIntoView();
    }
  }

  displayWithAllergy(value: any): string {
    if (!value) return "";
    return "";
  }

  onSelectedAllergy(selected) {


    this.patientAllergy.AllergenName = selected.option.value.AllergyName;
  }

  onSelectedAllergyReaction(selected) {
    if(!this.selectedReaction) this.selectedReaction = [];
    if (selected) {
      this.selectedReaction.push(selected);
      this.patientAllergy.Reaction = this.selectedReaction.toString();
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
    this.ref.close({
      "UpdatedModal": PatientChart.Allergies
    });
  }

  CreateAllergies() {
    let isAdd = this.patientAllergy.AllergyId == undefined;
    this.patientAllergy.PatientId = this.currentPatient.PatientId;
    this.patientAllergy.StartAt = this.datepipe.transform(this.patientAllergy.StartAt, "MM/dd/yyyy hh:mm:ss a");
    this.patientAllergy.EndAt = this.datepipe.transform(this.patientAllergy.EndAt, "MM/dd/yyyy hh:mm:ss a");
    this.patientAllergy.ProviderId =  this.authService.userValue.ProviderId;

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
    this.selectedReaction.splice(i, 1);
    this.patientAllergy.Reaction = this.selectedReaction.toString();
  }

  disableAllergies() {
    return !(this.patientAllergy.AllergenType && this.patientAllergy.AllergenName && this.patientAllergy.SeverityLevel && this.patientAllergy.OnSetAt
      && this.patientAllergy.StartAt && this.patientAllergy.Reaction)
  }

  deleteAllergy(){
    this.patientService.DeleteAllergy({AllergyId: this.patientAllergy.AllergyId,
    ProviderId: this.authService.userValue.ProviderId,
    PatientId: this.patientAllergy.PatientId}).subscribe(
      {
        next: (resp)=>{
          if(resp.IsSuccess){
            this.alertmsg.displayMessageDailog(ERROR_CODES["M2CA003"]);
            this.cancel();
          }else{
            this.alertmsg.displayErrorDailog(ERROR_CODES["E2CA002"]);
            this.cancel();
          }
        },
        error: (error)=>{
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CA002"]);
          this.cancel();
        },
        complete: () =>{

        }

      });
  }

  get canDeleteAllergy(): boolean{
    return !(this.patientAllergy.AllergyId == null || this.patientAllergy.AllergyId == '' || this.patientAllergy.AllergyId == undefined)
  }


}
