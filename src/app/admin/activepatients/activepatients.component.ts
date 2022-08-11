import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Patient } from 'src/app/_models/_admin/patient';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-activepatients',
  templateUrl: './activepatients.component.html',
  styleUrls: ['./activepatients.component.scss']
})
export class ActivePatientsComponent implements OnInit {

  patientColumns: string[] = ["Name","Email","PatientPortalAccount","Phone","Address","Status"];
  public patientsDataSource: PatientDatasource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('serchFilter') searchPatient: ElementRef;

  pageSize: number = 10;
  page: number = 0;


  constructor(private adminservice: AdminService,private authService: AuthenticationService) {

    //viewModel
  }

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients() {
    var reqdata = {
      Active: true
    }
    this.patientsDataSource = new PatientDatasource(this.adminservice,reqdata);
    this.patientsDataSource.loadPatients();

  }


  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.searchPatient.nativeElement,'keyup')
    .pipe(
        debounceTime(450),
        distinctUntilChanged(),
        tap(() => {
            this.paginator.pageIndex = 0;
            this.loadPatients();
        })
    )
    .subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0
    });

    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadPatients())
        )
        .subscribe();
  }

  loadPatients(){
    this.patientsDataSource.loadPatients(
      this.searchPatient.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
      );
  }

}

export class PatientDatasource implements DataSource<Patient>{

  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private adminservice: AdminService, private queryParams: {}) {
  }
  connect(collectionViewer: CollectionViewer): Observable<Patient[] | readonly Patient[]> {
    return this.patientsSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.patientsSubject.complete();
    this.loadingSubject.complete();
  }

  set Status(status: string) {
    this.queryParams["Status"] = status;
  }

  loadPatients(filter='', sortField = 'FULLNAME',
    sortDirection = 'asc', pageIndex = 0, pageSize = 10) {
    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.queryParams["NameFilter"] = filter;
    this.loadingSubject.next(true);

    this.adminservice.ActivePatients(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(resp => {
        this.patientsSubject.next(resp.ListResult as Patient[])
      });
  }


  get TotalRecordSize(): number {
    if (this.patientsSubject.getValue() && this.patientsSubject.getValue().length > 0){
      return this.patientsSubject.getValue()[0].TotalPatients;
    }

    return 0;
  }

}
