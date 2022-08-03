import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientSearch, User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-providermessagetopatient.dialog',
  templateUrl: './providermessagetopatient.dialog.component.html',
  styleUrls: ['./providermessagetopatient.dialog.component.scss']
})
export class ProvidermessagetopatientDialogComponent implements OnInit {

  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredPatients: Observable<PatientSearch[]>;
  isLoading: boolean = false;
  providerMessage:ProviderMessage;
  user: User;
  constructor( private ref: EHROverlayRef, private patientService: PatientService, private authenticationService: AuthenticationService) { 
    this.user = authenticationService.userValue;
  }

  ngOnInit(): void {
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 && res.length < 6)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatient(value));
  }
  cancel() {
    this.ref.close(null);
  }
  _filterPatient(term) {
    this.isLoading = true;
    this.patientService
      .PatientSearch({
        ProviderId: this.authenticationService.userValue.ProviderId,
        ClinicId: this.authenticationService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearch[]);
        } else this.filteredPatients = of([]);
      })
  }
  onPatientSelected(selected) {
    this.providerMessage.CurrentPatient = selected.option.value;

  }
  displayWithPatientSearch(value: PatientSearch): string {
    if (!value) return "";
    return value.Name;
  }
  
}
export class ProviderMessage {
  CurrentPatient?: PatientSearch = new PatientSearch();
}