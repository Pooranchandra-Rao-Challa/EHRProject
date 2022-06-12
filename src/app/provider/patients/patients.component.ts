import { Component, OnInit, TemplateRef, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../overlay.service';
import { PatientDialogComponent } from '../../dialogs/patient.dialog.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models';
import { PageEvent } from "@angular/material/paginator";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ProviderPatient } from 'src/app/_models/_provider/ProviderPatient';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { SmartScheduleComponent } from '../smart.schedule/smart.schedule.component';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { patientService } from './../../_services/patient.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
//import { StylePaginatorDirective} from 'src/app/_directives/style-paginator.directive';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild('style-paginator', { static: true }) paginatorDirective: StylePaginatorDirective;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('SearchPatient') searchPatient: ElementRef;

  patientColumns: string[] = ['Image', 'First', 'Middle', 'Last', 'DOB', 'Age', 'ContactInfo', 'LastAccessed', 'Created'];
  public patientsDataSource: PatientDatasource;

  filteredPatients: any;
  searchName: any;
  patientDialogComponent = PatientDialogComponent;
  dialogResponse = null;
  user: User;
  pageSize = 10;
  page = 0;
  inactivePatients: any[] = [];
  PracticeProviders: PracticeProviders[];
  keys = 'FirstName,MobilePhone';
  value: any;
  @ViewChild('filter', { static: false }) filter: ElementRef;
  constructor(public overlayService: OverlayService,
    private patientService: patientService,
    private authService: AuthenticationService,
    private router: Router,
    private smartSchedulerService: SmartSchedulerService) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    //console.log(this.paginator);

    //this.paginator = this.paginatorDirective.matPag;
    this.loadPatientProviders();
    this.getPatientsByProvider();
  }

  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.searchPatient.nativeElement,'keyup')
    .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.page = 0;

           // this.paginator.pageIndex = 0;
            this.loadPatients();
        })
    )
    .subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.page = 0;
      //this.paginator.pageIndex = 0
    });

    this.sort.sortChange
    .pipe(
      tap(() => this.loadPatients())
    ).subscribe();

    // merge(this.sort.sortChange, this.paginator.page)
    //     .pipe(
    //         tap(() => this.loadPatients())
    //     )
    //     .subscribe();
  }

  loadPatientProviders() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
        console.log(this.PracticeProviders);
      }
    });
  }

  onChangeViewState(patientview) {

    this.authService.SetViewParam("Patient",patientview);
    this.authService.SetViewParam("PatientView","Chart");
    this.router.navigate(["/provider/patientdetails"]);
  }

  getPatientsByProvider() {
    let reqparams = {
      "ClinicId": this.user.ClinicId,
      "ProviderId": this.user.ProviderId
    }
    this.patientsDataSource = new PatientDatasource(this.patientService,reqparams);
    this.patientsDataSource.loadPatients();
  }

  pageChange(currentPage){
    this.page = currentPage;
    this.loadPatients();
  }

  onPageEvent = ($event) => {
    this.page = $event.pageIndex;
    this.pageSize = $event.pageSize;
  }

  loadPatients(){
    this.patientsDataSource.loadPatients(
      this.searchPatient.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      // this.paginator.pageIndex,
      // this.paginator.pageSize
      this.page,
      this.pageSize
      );
  }

  showInactivePatients(event) {
    if (event.checked == true) {
      //this.inactivePatients = this.patientsDataSource.data.filter(a => a.active === false);
      //this.patientsList.data = this.inactivePatients;
    }
    else {
      //this.patientsList.data = this.patientsDataSource.data;
    }
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
    if (content === this.patientDialogComponent) {
        this.dialogResponse = res.data;
      }
    });
  }
}

export class PatientDatasource implements DataSource<ProviderPatient>{

  private patientsSubject = new BehaviorSubject<ProviderPatient[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private patientService: patientService,private queryParams: {}){


  }
  connect(collectionViewer: CollectionViewer): Observable<ProviderPatient[] | readonly ProviderPatient[]> {
    return this.patientsSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    //collectionViewer.viewChange.
    this.patientsSubject.complete();
    this.loadingSubject.complete();
  }

  loadPatients( filter = '', sortField = 'LastAccessed',
                sortDirection = 'asc', pageIndex = 0, pageSize = 10) {
        this.queryParams["SortField"] = sortField;
        this.queryParams["SortDirection"] = sortDirection;
        this.queryParams["PageIndex"] = pageIndex;
        this.queryParams["PageSize"] = pageSize;
        this.queryParams["Filter"] = filter;


        this.loadingSubject.next(true);

        this.patientService.FilteredPatientsOfProvider(this.queryParams).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(resp => {
          this.patientsSubject.next(resp.ListResult as ProviderPatient[])
        });
    }


    get TotalRecordSize():number{
      if(this.patientsSubject.getValue() && this.patientsSubject.getValue().length>0)
        return this.patientsSubject.getValue()[0].TotalPatients;
      return 0;
    }

}
