import { Component, OnInit, TemplateRef, QueryList, ViewChildren, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../overlay.service';
import { PatientDialogComponent } from '../../dialogs/patient.dialog/patient.dialog.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { PatientBreadcurm, ProviderPatient } from 'src/app/_models/_provider/ProviderPatient';
import { Router } from '@angular/router';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { PatientService } from './../../_services/patient.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ViewChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';
declare var $: any;

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit,AfterViewInit {
  customizedspinner: boolean;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('SearchPatient', { static: true })
  searchPatient: ElementRef;
  @ViewChild('patientbreadcrumb', { read: ViewContainerRef, static: true })
  private patientbreadcrumb: ViewContainerRef;
  breadcrumbs: PatientBreadcurm[] = [];
  patientColumns: string[] = ['Image', 'First', 'Middle', 'Last', 'DOB', 'Age', 'ContactInfo', 'LastAccessed', 'Created'];
  public patientsDataSource: PatientDatasource;
  patientDialogComponent = PatientDialogComponent;
  user: User;
  PracticeProviders: PracticeProviders[];
  value: any;
  removedPatientIdsInBreadcurmb: string[]
  constructor(public overlayService: OverlayService,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private router: Router,
    private smartSchedulerService: SmartSchedulerService,
    private viewChangeService: ViewChangeService,
    private cfr: ComponentFactoryResolver) {
    this.user = authService.userValue;
    this.removedPatientIdsInBreadcurmb = authService.viewModel.PatientBreadCrumb

  }

  ngOnInit(): void {

    this.loadPatientProviders();

    this.getPatientsByProvider();

    this.loadBreadcurmData();
  }

  async loadPatientBreadcrumbView() {
    this.patientbreadcrumb.clear();
    const { BreadcrumbComponent } = await import('./patient.breadcrumb/breadcrumb.component');
    let viewcomp = this.patientbreadcrumb.createComponent(
      this.cfr.resolveComponentFactory(BreadcrumbComponent)
    );
    viewcomp.instance.breadcrumbs = this.breadcrumbs;
    viewcomp.instance.navigateTo.subscribe((pbc: PatientBreadcurm) => {
      if (pbc.ViewType == 1) this.onChangeViewState(pbc.Details);
    });
    viewcomp.instance.removePatientInBreadcrumb.subscribe(($event) => {
      this.removePatientBreadcrumbInView($event);
    });
  }

  loadBreadcurmData() {
    this.patientService.LatestUpdatedPatientsUrl({
      ProviderId: this.authService.userValue.ProviderId,
      RemovedPatientIds: this.removedPatientIdsInBreadcurmb
    })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          let patients = resp.ListResult as ProviderPatient[];
          this.breadcrumbs = [];
          let pb: PatientBreadcurm = {
            Name: "Patients",
            ViewType: 0,
            ProviderId: this.authService.userValue.ProviderId
          }
          this.breadcrumbs.push(pb);
          patients.forEach((p) => {
            let pb: PatientBreadcurm = {
              Name: p.FirstName + ' ' + p.LastName,
              DOB: p.Dob,
              ViewType: 1,
              PatientId: p.PatientId,
              ShowRemoveIcon: true,
              Details: p
            }
            this.breadcrumbs.push(pb);
          });
          this.loadPatientBreadcrumbView()
        }
      })
  }

  updateBreadcurmbModel() {

  }

  removePatientBreadcrumbInView(patientId: string) {
    if (this.removedPatientIdsInBreadcurmb == null)
      this.removedPatientIdsInBreadcurmb = [];
    this.removedPatientIdsInBreadcurmb.push(patientId);
    this.authService.SetViewParam('PatientBreadCrumb', this.removedPatientIdsInBreadcurmb);
    this.loadBreadcurmData();
  }

  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.searchPatient.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          //this.page = 0;
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
  onProviderChange(providerId: string){
    this.patientsDataSource.ProviderId = providerId == "All" ? null : providerId;
    this.loadPatients();
  }
  loadPatientProviders() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }

  onChangeViewState(patientview) {
    this.viewChangeService.sendData("Patients");
    this.authService.SetViewParam("View","Patients")
    this.authService.SetViewParam("Patient", patientview);
    this.authService.SetViewParam("PatientView", "Chart");
    this.router.navigate(["/provider/patientdetails"]);
  }

  getPatientsByProvider() {
    let reqparams = {
      "ClinicId": this.user.ClinicId,
      "ProviderId": null,
      "Status": "All"
    }
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.patientsDataSource = new PatientDatasource(this.patientService, reqparams);
    setTimeout(() => {
      this.customizedspinner = false;
      $('body').removeClass('loadactive')
    }, 2000);
    this.patientsDataSource.loadPatients();
  }

  loadPatients() {
    this.patientsDataSource.loadPatients(
      this.searchPatient.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  showInactivePatients(event) {
    this.patientsDataSource.Status = event.checked ? "InActive" :  "All"
    this.loadPatients();
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (content === this.patientDialogComponent) {
        if (res.data != null && res.data.refresh) {
          this.paginator.pageIndex = 0;
          this.loadPatients();
        }
      }
    });
  }
}

export class PatientDatasource implements DataSource<ProviderPatient>{
  customizedspinner: boolean;
  private patientsSubject = new BehaviorSubject<ProviderPatient[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private patientService: PatientService, private queryParams: {}) {


  }
  connect(collectionViewer: CollectionViewer): Observable<ProviderPatient[] | readonly ProviderPatient[]> {
    return this.patientsSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    //collectionViewer.viewChange.
    this.patientsSubject.complete();
    this.loadingSubject.complete();
  }

  set Status(status: string) {
    this.queryParams["Status"] = status;
  }
  set ProviderId(id:string){
    this.queryParams["ProviderId"] = id;
  }

  loadPatients(filter = '', sortField = 'LastAccessed',
    sortDirection = 'desc', pageIndex = 0, pageSize = 10) {
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
        this.patientsSubject.next(resp.ListResult as ProviderPatient[]);
        // setTimeout(() => {
        //   this.customizedspinner = false;
        //   $('body').removeClass('loadactive')
        // }, 1000);
      });
  }


  get TotalRecordSize(): number {
    if (this.patientsSubject.getValue() && this.patientsSubject.getValue().length > 0)
      return this.patientsSubject.getValue()[0].TotalPatients;
    return 0;
  }

}
