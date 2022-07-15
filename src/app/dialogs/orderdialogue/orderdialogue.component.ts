import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientSearchResults, ProceduresInfo } from 'src/app/_models';
import { Labandimaging } from 'src/app/_models/_provider/LabandImage';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';

@Component({
  selector: 'app-orderdialogue',
  templateUrl: './orderdialogue.component.html',
  styleUrls: ['./orderdialogue.component.scss']
})
export class OrderdialogueComponent implements OnInit {
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredPatients: Observable<PatientSearchResults[]>;
  // procedureInfo: ProceduresInfo = new ProceduresInfo();
  orderTypeDD = [{ value: 'Lab', viewValue: 'Lab' }, { value: 'Imaging', viewValue: 'Imaging' }]
  labingimagingattchements: FormGroup;
  labLabImageStatusesDD: any = [];
  LabImageOrderStatusesDD: any[];
  PracticeProviders: PracticeProviders[];
  labandimaging?: Labandimaging = new Labandimaging();
  public selectedPatient: PatientSearchResults[];
  isLoading = false;
  constructor(private ref: EHROverlayRef, private fb: FormBuilder, private utilityservice: UtilityService, private smartSchedulerService: SmartSchedulerService,
    private authService: AuthenticationService,) {
    console.log(ref.RequestData);

    this.labandimaging = ref.RequestData as Labandimaging;
  }

  ngOnInit(): void {
    this.getLabImageStatuses();
    this.getLabImageOrderStatuses();
    this.loadDefaults();
    this.pageloadevent();
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
  _filterPatient(term) {
    console.log(term);
    this.isLoading = true;
    this.smartSchedulerService
      .SearchPatients({
        ProviderId: this.authService.userValue.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearchResults[]);
        } else this.filteredPatients = of([]);
      })
  }
  onPatientSelected(selected) {
    this.labandimaging.ProviderId = selected.option.value.ProviderId;
    this.labandimaging.PatientId = selected.option.value.PatientId;
    this.labandimaging.DateofBirth = selected.option.value.DateofBirth;
    this.labandimaging.Sex = selected.option.value.Gender;
    this.labandimaging.Age = selected.option.value.Age;

  }
  displayWithPatientSearch(value: PatientSearchResults): string {

    if (!value) return "";
    return value.Name;
  }
  cancel() {
    this.ref.close();
    this.labandimaging = new Labandimaging;
  }
  pageloadevent() {
    this.labingimagingattchements = this.fb.group({
      testorder: this.fb.array([]),
      attachments: this.fb.array([])
    })
  }
  get testorder() {
    return this.labingimagingattchements.get('testorder') as FormArray
  }
  testorders() {
    this.testorder.push(
      this.newtestorder());
  }
  newtestorder() {

    return this.fb.group({
      code: "",
      test: ""
    })
  }
  removetestorder(i: number) {
    this.testorder.removeAt(i);
  }
  get attachments() {
    return this.labingimagingattchements.get('attachments') as FormArray
  }

  attachements() {
    this.attachments.push(
      this.newattachedfile());
  }

  newattachedfile() {
    return this.fb.group({
      file: "",
    })
  }
  removeattachemnt(i: number) {

    this.attachments.removeAt(i);
  }
  getLabImageStatuses() {
    this.utilityservice.LabImageStatuses().subscribe(resp => {
      this.labLabImageStatusesDD = resp.ListResult;
      console.log(this.labLabImageStatusesDD);

    })

  }
  getLabImageOrderStatuses() {
    this.utilityservice.LabImageOrderStatuses().subscribe(resp => {
      this.LabImageOrderStatusesDD = resp.ListResult;
      console.log(this.LabImageOrderStatusesDD);

    })

  }
  loadDefaults() {
    debugger;
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }
}
