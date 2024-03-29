import { MedicalCode } from 'src/app/_models/codes';
import { ProceduresInfo, User } from 'src/app/_models';
import { DentalChartService } from 'src/app/_services/dentalchart.service';
import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';
import { EncounterDialogComponent } from 'src/app/dialogs/encounter.dialog/encounter.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { Actions } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, filter, finalize, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { TreeProcedureComponent } from './tree.procedure.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DentalChartNotifier } from 'src/app/_navigations/provider.layout/view.notification.service'

declare var $: any;
@Component({
  selector: 'app-dentalchart',
  templateUrl: './dental.chart.component.html',
  styleUrls: ['./dental.chart.component.scss']
})
export class DentalChartComponent implements OnInit, AfterViewInit {
  user: User;
  hoverStartDate: string = 'Start Date';
  hoverEndDate: string = 'End Date';
  AdultPrem: boolean = true;
  ChilPrim: boolean = false;
  displayStyle = "none";
  DentalNumber: number;
  procedureCodeList: any = [];
  currentPatient: ProviderPatient;
  procedureDialogComponent = ProcedureDialogComponent;
  encounterDialogComponent = EncounterDialogComponent;
  ActionTypes = Actions;
  usedProcedures: MedicalCode;
  procedureColumns: string[] = ['SELECT', 'ServicedAt', 'END DATE', 'ToothNo', 'SURFACE', 'CODE', 'Description', 'PROVIDER', 'Status', 'CQM STATUS', 'Encounter'];
  @ViewChild("treeProcedureSearch", { static: false }) treeProcedureSearch: ElementRef;
  @ViewChild("procedureTree", { static: false }) procedureTree: TreeProcedureComponent;
  public procedureDataSource: ProcedureDatasource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataRefreshing: boolean = false;

  constructor(private overlayService: OverlayService,
    private dentalService: DentalChartService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private dentalChartNotifier: DentalChartNotifier) {
    this.user = authService.userValue;
    this.currentPatient = authService.viewModel.Patient;


  }
  ngAfterViewInit(): void {

    if(this.treeProcedureSearch)
    fromEvent(this.treeProcedureSearch.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      //, filter(res => res.length > 2 && res.length < 6)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterProcedure(value));

    if (this.paginator != null)
      this.sort.sortChange.subscribe(() => {
        this.paginator.pageIndex = 0
      });
    if (this.paginator != null)
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadProcedures())
        )
        .subscribe();
    else
      this.sort.sortChange.pipe(tap(() => this.loadProcedures())).subscribe();

  }

  loadProcedures() {
    this.procedureDataSource.loadProcedures(
      this.sort.active,
      this.sort.direction,
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 10
    );
  }
  _filterProcedure(term: string) {
    this.procedureTree.filter.next(term);
  }
  ngOnInit(): void {
    this.dataRefreshing = true;
    this.patientUsedProcedures();
    this.patientProcedureView();
    this.dentalChartNotifier.getData().subscribe({
      next: resp => this.dataRefreshing = false,
      error: (error) => this.dataRefreshing = false
    })
  }

  patientUsedProcedures() {
    this.dentalService.PatientUsedProcedures({ "PatientId": this.currentPatient.PatientId })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.usedProcedures = resp.ListResult;
        }
      })
  }
  patientProcedureView() {
    let reqparams = {
      "PatientId": this.currentPatient.PatientId,
    }
    this.procedureDataSource = new ProcedureDatasource(this.dentalService, reqparams, this.authService, this.dentalChartNotifier);
    this.procedureDataSource.loadProcedures();
  }

  getPatientsByProvider() {

  }

  AdultPerm() {
    this.AdultPrem = true;
    this.ChilPrim = false;
  }

  ChildPrim() {
    this.AdultPrem = false;
    this.ChilPrim = true;
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData: any, actions: Actions = this.ActionTypes.new, ToothNo: number = 0, medicalCode: MedicalCode) {
    let reqData: any;
    if (content === this.procedureDialogComponent) {
      reqData = new ProceduresInfo();
      if (content == this.procedureDialogComponent) {
        reqData = dialogData != null ? dialogData : new ProceduresInfo();
        if (dialogData != null) {
          reqData.PatientId = this.currentPatient.PatientId;
          reqData.ProviderId = this.currentPatient.ProviderId;
          reqData.LocationId = this.authService.userValue.CurrentLocation;
        }
        if (ToothNo > 0) {
          reqData.ToothNo = ToothNo;
          reqData.ViewFrom = "ToothNo";
        }
        if (medicalCode) {
          reqData.Code = medicalCode.Code
          reqData.CodeSystem = medicalCode.CodeSystem
          reqData.Description = medicalCode.Description;
          reqData.ViewFrom = "Tree";
        }
      }
    } else if (content === this.encounterDialogComponent) {
      reqData = dialogData;
      reqData.PatientName = this.authService.viewModel.Patient.FirstName + ' ' + this.authService.viewModel.Patient.LastName;
      reqData.ViewFrom = "ProcedureView";
      reqData["From"] = "ProcedureView";
    }

    const ref = this.overlayService.open(content, reqData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.procedureDialogComponent || content === this.encounterDialogComponent) {
        if (res.data != null && res.data.saved) {
          this.procedureDataSource.loadProcedures();
          this.patientUsedProcedures();
        }
      }
    });
  }

  canelProcedure(procedure: ProceduresInfo) {
    this.dentalService.CancelProcedure(procedure).subscribe(resp => {
      if (resp.IsSuccess) {
        this.procedureDataSource.loadProcedures();
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CP1003"])
      } else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP1002"])
      }
    })
  }

  // Access Permissions

  get CanViewProcedure(): boolean {
    var permissions = this.authService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "ProcedurePolicy" && fn.MethodName == "show")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

}



export class ProcedureDatasource implements DataSource<ProceduresInfo>{
  currentPatient: ProviderPatient
  private proceduresSubject = new BehaviorSubject<ProceduresInfo[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  //public dataRefreshing = true;

  constructor(private dentalService: DentalChartService, private queryParams: {},
    private authService: AuthenticationService,
    private dentalChartNotifier: DentalChartNotifier) {
    this.currentPatient = authService.viewModel.Patient;
  }
  connect(collectionViewer: CollectionViewer): Observable<ProceduresInfo[] | readonly ProceduresInfo[]> {
    return this.proceduresSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.proceduresSubject.complete();
    this.loadingSubject.complete();
  }

  set Status(status: string) {
    this.queryParams["Status"] = status;
  }
  set ProviderId(id: string) {
    this.queryParams["ProviderId"] = id;
  }

  loadProcedures(sortField = 'ServicedAt',
    sortDirection = 'desc', pageIndex = 0, pageSize = 10) {
    this.queryParams["PatientId"] = this.authService.viewModel.Patient.PatientId;
    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.loadingSubject.next(true);


    this.dentalService.PatientProcedureView(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(resp => {
      if (resp.IsSuccess){
        this.proceduresSubject.next(resp.ListResult as ProceduresInfo[]);
        this.dentalChartNotifier.sendData(true);
      }
      else {this.proceduresSubject.next([]);this.dentalChartNotifier.sendData(true);}
    });
  }

  get TotalRecordSize(): number {
    if (this.proceduresSubject.getValue() && this.proceduresSubject.getValue().length > 0)
      return this.proceduresSubject.getValue()[0].TotalRecords;
    return 0;
  }

}


