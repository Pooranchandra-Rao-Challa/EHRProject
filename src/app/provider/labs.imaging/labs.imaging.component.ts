import { UtilityService } from 'src/app/_services/utiltiy.service';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User, } from 'src/app/_models/_account/user';
import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { Actions, PracticeProviders } from 'src/app/_models';
import { OrderDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { OrderResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.result.dialog.component';
import { OrderManualEntryDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.manual.entry.dialog.component';
import { ViewModel } from 'src/app/_models/';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LabResultComponent } from 'src/app/dialogs/lab.imaging.dialog/lab.result.component';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { ImagingResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/imaging.result.dialog.component';
declare var $: any;
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './labs.imaging.component.html',
  styleUrls: ['./labs.imaging.component.scss']
})
export class LabsImagingComponent implements OnInit {

  labImagingColumn: string[] = ['Order', 'Test', 'Type', 'Patient', 'Provider', 'Status', 'LabImagingStatus', 'Created', 'Signed', 'Result'];
  labImagingDataSource: any = [];
  user: User;
  ActionTypes = Actions;
  viewmodel?: ViewModel;
  orderDialogComponent = OrderDialogComponent;
  orderResultDialogComponent = OrderResultDialogComponent;
  labResultComponent = LabResultComponent;
  orderManualEntryDialogComponent = OrderManualEntryDialogComponent;
  imagingResultDialogComponent = ImagingResultDialogComponent;
  labandimaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  public labImageDatasource: LabImageDatasource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  PracticeProviders: PracticeProviders[];
  ResultStatuses: any[];
  OrderStatuses: any[];
  @ViewChild('SearchTest', { static: true }) SearchTest: ElementRef;
  Pagesize: number = 10;
  provider: string;
  result: string;
  status: string;

  constructor(private labImageService: LabsImagingService,
    private authService: AuthenticationService,
    private overlayService: OverlayService,
    private smartSchedulerService: SmartSchedulerService,
    private utilityService: UtilityService) {
    this.user = authService.userValue;
    this.viewmodel = authService.viewModel;

  }

  ngOnInit(): void {
    this.viewmodel.LabandImageView = "Lab";
    this.InitGridView(this.viewmodel.LabandImageView);
    this.loadDefaults();
    this.initImageStatueses();
    this.initOrderStatuses();
  }
  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.SearchTest.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          //this.page = 0;
          this.paginator.pageIndex = 0;
          this.loadLabandImageList();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadLabandImageList())
      )
      .subscribe();
  }
  onChangeView(procedureType: string) {
    this.provider = '';
    this.result = '';
    this.status = '';
    this.SearchTest.nativeElement.value = '';
    this.labImageDatasource.ProviderId = '';
    this.labImageDatasource.OrderStatus = '';
    this.labImageDatasource.ResultStatus = '';

    this.viewmodel.LabandImageView = procedureType;
    this.labImageDatasource.ProcedureType = procedureType;
    this.loadLabandImageList();
  }
  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }
  initImageStatueses() {
    this.utilityService.ResultStatuses().subscribe(resp => {
      this.ResultStatuses = resp.ListResult;
    })

  }

  initOrderStatuses() {
    this.utilityService.OrderStatuses().subscribe(resp => {
      this.OrderStatuses = resp.ListResult;
    })
  }

  onChangeProvider(evtSource) {
    this.labImageDatasource.ProviderId = evtSource.value;
    this.loadLabandImageList();
  }

  onChangeOrderStatus(evtSource) {
    this.labImageDatasource.OrderStatus = evtSource.value;
    this.loadLabandImageList();
  }

  onChangeResultStatus(evtSource) {
    this.labImageDatasource.ResultStatus = evtSource.value;
    this.loadLabandImageList();
  }
  get getToolTip(): string {
    return `Add new ${this.viewmodel.LabandImageView} order`;
  }

  InitGridView(procedureType: string) {
    let reqparams = {
      "ClinicId": this.user.ClinicId,
      "ProcedureType": procedureType,
    }
    this.labImageDatasource = new LabImageDatasource(this.labImageService, reqparams);
    this.loadLabandImageList();
  }

  loadLabandImageList() {
    this.labImageDatasource.loadLabImage(
      this.SearchTest.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  openEditDialog(data: LabProcedureWithOrder) {
    if (this.viewmodel.LabandImageView == "Lab") {
      this.openComponentDialog(this.orderDialogComponent, data, this.ActionTypes.view);
    }else if (this.viewmodel.LabandImageView == "Image") {
      this.openComponentDialog(this.orderDialogComponent, data, this.ActionTypes.view)
    }
  }
  openResultDialog(data: LabProcedureWithOrder) {
    if (this.viewmodel.LabandImageView == "Lab") {
      this.openComponentDialog(this.labResultComponent, data, this.ActionTypes.view)
    } else if (this.viewmodel.LabandImageView == "Image") {
      this.openComponentDialog(this.imagingResultDialogComponent, data, Actions.view)
    }
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.add &&
      content === this.orderDialogComponent &&
      this.viewmodel.LabandImageView == "Lab") {
      this.labandimaging = new LabProcedureWithOrder();
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }
    else if (action == Actions.view &&
      content === this.orderDialogComponent &&
      (this.viewmodel.LabandImageView == "Lab"
      || this.viewmodel.LabandImageView == "Image")) {
      this.labandimaging = dialogData;
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }
    else if (action == Actions.view
      && content === this.labResultComponent
      && this.viewmodel.LabandImageView == "Lab") {
      this.labandimaging = dialogData;
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }
    else if (action == Actions.add
      && content === this.orderDialogComponent
      && this.viewmodel.LabandImageView == "Image") {
      this.labandimaging = new LabProcedureWithOrder();
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }
    else if (action == Actions.view && content === this.imagingResultDialogComponent
      && this.viewmodel.LabandImageView == "Image") {
      this.labandimaging = dialogData;
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      if (content === this.orderDialogComponent
        || content === this.labResultComponent) {
          this.InitGridView(this.viewmodel.LabandImageView);
      }
    });
  }
}

export class LabImageDatasource implements DataSource<LabProcedureWithOrder>{

  private labImageSubject = new BehaviorSubject<LabProcedureWithOrder[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private labImageService: LabsImagingService
    , private queryParams: {}) {


  }
  connect(collectionViewer: CollectionViewer): Observable<LabProcedureWithOrder[] |
    readonly LabProcedureWithOrder[]> {
    return this.labImageSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.labImageSubject.complete();
    this.loadingSubject.complete();
  }


  set ProcedureType(procedureType: string) {
    this.queryParams["ProcedureType"] = procedureType;
  }

  set ProviderId(providerId: string) {
    this.queryParams["ProviderId"] = providerId;
  }

  set OrderStatus(orderStatus: string) {
    this.queryParams["OrderStatus"] = orderStatus;
  }

  set ResultStatus(resultStatus: string) {
    this.queryParams["ResultStatus"] = resultStatus;
  }
  set Filter(filter: string) {
    this.queryParams["Filter"] = filter;
  }

  loadLabImage(filter = '', sortField = 'OrderNumber',
    sortDirection = 'desc', pageIndex = 0, pageSize = 10) {
    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.queryParams["Filter"] = filter;
    this.loadingSubject.next(true);

    this.labImageService.LabandImageList(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(resp => {
      let lis = resp.ListResult as LabProcedureWithOrder[];
      lis.forEach(value => {
        value.Tests = JSON.parse(value.StrTests)
      })
      this.labImageSubject.next(lis);
    });
  }


  get TotalRecordSize(): number {
    if (this.labImageSubject.getValue() && this.labImageSubject.getValue().length > 0)
      return this.labImageSubject.getValue()[0].TotalRecords;
    return 0;
  }

}
