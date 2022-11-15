import { OverlayService } from 'src/app/overlay.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import {
  Component, ElementRef, ViewChild,
} from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, PatientPortalUser, PatientSearch } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
import { Observable } from 'rxjs-compat';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { BehaviorSubject, fromEvent, of } from 'rxjs';
import { PatientRelationShip } from 'src/app/provider/patients/profile/profile.component';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { ComponentType } from 'ngx-toastr';
import { PatientRelationshipDialogComponent } from '../patient.relationship.dialog/patient.relationship.dialog.component';

@Component({
  selector: 'patient-portal-account-dialog',
  templateUrl: './patient.portal.account.dialog.component.html',
  styleUrls: ['./patient.portal.account.dialog.component.scss'],
})
export class PatientPortalAccountComponent {
  patientUser: PatientPortalUser = { PatientHasNoEmail: true };
  emailVerfied?: boolean = null;
  emailVerficationMessage?: string;
  filteredProviderOptions: Observable<any[]>;
  filterPatientOptions: Observable<PatientSearch[]>;
  displayMessage: boolean = true;
  noRecords: boolean = false;
  isLoading: boolean = false;
  patientRelationList: PatientRelationShip[] = [];
  patientRelationListSubject = new BehaviorSubject<PatientRelationShip[]>([]);
  createPatientInvoked: boolean = false;
  emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;
  SearchKey = "";
  deleteSearch: boolean;
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  currentPatient: ProviderPatient;
  ActionTypes = Actions;
  patientRelationshipDialogComponent = PatientRelationshipDialogComponent;

  constructor(private dialogRef: EHROverlayRef, private accountservice: Accountservice,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private overlayService: OverlayService,
    private ref: EHROverlayRef,
    private patientService: PatientService) {
    this.currentPatient = this.authService.viewModel.Patient;
    this.patientUser = dialogRef.data as PatientPortalUser;
    if (this.patientUser == null) this.patientUser = new PatientPortalUser()
    this.patientUser.Username
  }

  ngOnInit(): void {
    this.getPatientRelations();
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.filteredProviderOptions = of([]);
        this.noRecords = false;
        if (event.target.value == '') {
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
    ).subscribe(value => this._filterPatient(value));
  }

  _filterPatient(term) {
    this.isLoading = true;
    this.patientService
      .PatientSearch({
        ProviderId: this.authService.userValue.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.IsSuccess) {
          this.filterPatientOptions = of(
            resp.ListResult as PatientSearch[]);
        }
        else {
          this.filterPatientOptions = of([]);
          this.noRecords = true;
        }
      })
  }

  onPatientSelected(selected) {
    let reqParams: any = {
      'RelationFirstName': selected.option.value.FirstName,
      'RelationLastName': selected.option.value.LastName,
      'RelationShip': selected.option.value.RelationShip,
      'PatientId': selected.option.value.PatientId
    }
    this.patientRelationList.push(reqParams);
    this.patientRelationListSubject.next(this.patientRelationList);
  }

  displayWithPatientSearch(value: PatientSearch): string {
    if (!value) return "";
    return value.Name;
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.patientRelationshipDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
        this.getPatientRelations();
    });
  }

  removeAccessed(item: PatientRelationShip) {
    let reqParams = {
      "PatientId": item.PatientId,
      "PatientRelationShipId": item.RelationPatientId,
    }
    this.patientService.RemovePatientRelationShipAccess(reqParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2PPR001"]);
        this.getPatientRelations();
      }
    });
  }

  getPatientRelations() {
    let reqparam = {
      "PatientId": this.currentPatient.PatientId
    }
    this.patientService.PatientRelations(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.patientRelationList = resp.ListResult;
        this.patientRelationListSubject.next(this.patientRelationList);
      }
      else {
        this.patientRelationList = [];
        this.patientRelationListSubject.next(this.patientRelationList);
      }
    })
  }

  removeSearch() {
    this.SearchKey = " ";
    this.deleteSearch = false;
  }

  cancel() {
    this.dialogRef.close();
  }

  createPatientAccount() {
    this.createPatientInvoked = true;
    if(this.checkValidEmail())
    this.dialogRef.close(this.patientUser);
  }

  checkEmailExistance() {
    if (this.emailPattern.test(this.patientUser.Email))
      this.accountservice.CheckEmailAvailablity({ Email: this.patientUser.Email }).subscribe((resp) => {
        this.emailVerfied = resp.IsSuccess;
        this.emailVerficationMessage = resp.EndUserMessage
      })
    else this.emailVerfied = null;
  }

  checkValidEmail(){
    if(!this.emailPattern.test(this.patientUser.Email)){
      this.patientUser.Email = `no_email@${this.patientUser.Username.toLowerCase()}.com`;
      this.patientUser.PatientHasNoEmail = true;
    }else this.patientUser.PatientHasNoEmail = false;
    return true;
  }

}
