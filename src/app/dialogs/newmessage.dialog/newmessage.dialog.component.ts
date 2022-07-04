import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { ProceduresInfo, User } from 'src/app/_models';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { Observable,fromEvent, of  } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { PatientClinicalProvider } from 'src/app/_models/_patient/patientclinicalprovider';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
@Component({
  selector: 'app-newmessage.dialog',
  templateUrl: './newmessage.dialog.component.html',
  styleUrls: ['./newmessage.dialog.component.scss']
})
export class NewmessageDialogComponent implements OnInit {

  PatientProfile: PatientProfile;
  user: User;
  filteredProcedures: any;
  searchProcedures: any;

  // procedureInfo: ProceduresInfo = new ProceduresInfo();
  @ViewChild('searchProcedureCode', { static: true }) searchProcedureCode: ElementRef;

  constructor(private patientservise: PatientService, private authenticationService: AuthenticationService, private ref: EHROverlayRef,
) {
    this.user = authenticationService.userValue;
    // console.log(this.user);
  }

  ngOnInit(): void {
    //this.getPatientProfile();
    fromEvent(this.searchProcedureCode.nativeElement, 'keyup').pipe(
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
    ).subscribe(value => this._filterProcedure(value));
  }

  cancel() {
    this.ref.close(null);
  }
  displayWith(value: PatientClinicalProvider): string {
    if (!value) return "";
    return value.Title + "-" + value.FirstName;
  }
  // onProcedureSelected(selected) {
  //   this.PatientClinicalProvider.Title = selected.option.value.Code;
  //   this.PatientClinicalProvider.FirstName = selected.option.value.Description;
  // }
  _filterProcedure(term) {
    var req={
      "ClinicId": this.user.ClinicId,
    }
    debugger
    this.patientservise.PatientProviders(req)
      .subscribe(resp => {
        //this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredProcedures=resp.ListResult;
          // this.filteredProcedures = of(
          //   resp.ListResult as PatientClinicalProvider[]);
          this.searchProcedures=this.filteredProcedures.filter(x=>(x.Title+' -')==term.trim())
        } else {
          this.searchProcedures=of([]);
          this.filteredProcedures = of([]);
        }
      })
  }
}
