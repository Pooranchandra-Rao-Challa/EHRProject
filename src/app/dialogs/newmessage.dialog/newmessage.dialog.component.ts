import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { User } from 'src/app/_models';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { PatientClinicalProvider } from 'src/app/_models/_patient/patientclinicalprovider';
import { fromEvent, of } from 'rxjs';

@Component({
  selector: 'app-newmessage.dialog',
  templateUrl: './newmessage.dialog.component.html',
  styleUrls: ['./newmessage.dialog.component.scss']
})
export class NewmessageDialogComponent implements OnInit {

  PatientProfile: PatientProfile;
  user: User;
  proceduresData: any;
  filterProcedures: any;

  // procedureInfo: ProceduresInfo = new ProceduresInfo();
  @ViewChild('searchProcedureCode', { static: true }) searchProcedureCode: ElementRef;

  constructor(private patientservise: PatientService, private authenticationService: AuthenticationService, private ref: EHROverlayRef,
) {
    this.user = authenticationService.userValue;
    // console.log(this.user);
  }

  ngOnInit(): void {
    this._filterProcedure();
    //this.getPatientProfile();
    fromEvent(this.searchProcedureCode.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length > 2 && res.length < 8)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe(value =>
      this.filterProcedures=this.filterData(value));
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
  _filterProcedure() {
    var req={
      "ClinicId": this.user.ClinicId,
    }
    //debugger
    this.patientservise.PatientProviders(req)
      .subscribe(resp => {
        //this.isLoading = false;
        if (resp.IsSuccess) {
          this.proceduresData=resp.ListResult;
          // this.filteredProcedures = of(
          //   resp.ListResult as PatientClinicalProvider[]);
        } else {
          this.filterProcedures=of([]);
          this.proceduresData = of([]);
        }
      })
  }
  //filter city on search text
  filterData(searchText: string) {

    var searchData = this.proceduresData.filter(x => (((x.Title+' - '+x.FullName).toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)));
    return searchData
  }
}
