import { tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User,  } from 'src/app/_models/_account/user';
import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { Actions } from 'src/app/_models';
import { OrderDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { OrderResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.result.dialog.component';
import { EditLabImagingOrderComponent } from 'src/app/dialogs/lab.imaging.dialog/order.edit.lab.imaging.component';
import { OrderManualEntryDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.manual.entry.dialog.component';
import { ViewModel } from 'src/app/_models/';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
declare var $: any;
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './labs.imaging.component.html',
  styleUrls: ['./labs.imaging.component.scss']
})
export class LabsImagingComponent implements OnInit {

  labImagingColumn: string[] = ['Order', 'Test', 'Type', 'Patient', 'Provider', 'Status', 'LabImagingStatus', 'Created'];
  labImagingDataSource: any = [];
  user: User;
  ActionTypes = Actions;
  viewmodel?: ViewModel;
  orderDialogComponent = OrderDialogComponent;
  orderResultDialogComponent = OrderResultDialogComponent;
  editLabImagingOrderComponent = EditLabImagingOrderComponent;
  orderManualEntryDialogComponent = OrderManualEntryDialogComponent;
  labandimaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  public labImageDatasource: LabImageDatasource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private labImageService: LabsImagingService,
    private authService: AuthenticationService,
    public overlayService: OverlayService,) {
    this.user = authService.userValue;
    this.viewmodel = authService.viewModel;

  }

  ngOnInit(): void {
    this.viewmodel.LabandImageView = "Lab";
    this.InitGridView(this.viewmodel.LabandImageView);
  }
  ngAfterViewInit(): void {
    // server-side search
    // fromEvent(this.searchPatient.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       //this.page = 0;
    //       this.paginator.pageIndex = 0;
    //       this.loadPatients();
    //     })
    //   )
    //   .subscribe();
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
  onChangeView(procedureType: string){
    this.viewmodel.LabandImageView = procedureType;
    this.labImageDatasource.ProcedureType = procedureType;
    this.loadLabandImageList();
  }
  InitGridView(procedureType: string)
  {
    let reqparams = {
      "ClinicId": this.user.ClinicId,
      "ProcedureType": procedureType,
    }
    this.labImageDatasource = new LabImageDatasource(this.labImageService, reqparams);
    this.labImageDatasource.loadLabImage();
  }

  loadLabandImageList() {
    //debugger;
    this.labImageDatasource.loadLabImage(
      //this.searchPatient.nativeElement.value,
      '',
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.add && content === this.orderDialogComponent && this.viewmodel.LabandImageView == "Lab") {
      this.labandimaging = new LabProcedureWithOrder();
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }
    else if (action == Actions.add && content === this.orderDialogComponent && this.viewmodel.LabandImageView == "Image") {
      this.labandimaging = new LabProcedureWithOrder();
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }
    else if (action == Actions.add && content === this.orderResultDialogComponent  && this.viewmodel.LabandImageView == "Lab") {
      this.labandimaging = new LabProcedureWithOrder();
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    } else if (action == Actions.add && content === this.orderResultDialogComponent && this.viewmodel.LabandImageView == "Image") {
      this.labandimaging = new LabProcedureWithOrder();
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
    }



    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      if (content === this.orderDialogComponent) {
        if (res != null && res.data != null && res.data.saved) {
          this.InitGridView(this.viewmodel.LabandImageView);
        }
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
    //collectionViewer.viewChange.
    this.labImageSubject.complete();
    this.loadingSubject.complete();
  }


  set ProcedureType(procedureType: string){
    this.queryParams["ProcedureType"] = procedureType;
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
        this.labImageSubject.next(resp.ListResult as LabProcedureWithOrder[])
      });
  }


  get TotalRecordSize(): number {
    if (this.labImageSubject.getValue() && this.labImageSubject.getValue().length > 0)
      return this.labImageSubject.getValue()[0].TotalRecords;
    return 0;
  }

}
