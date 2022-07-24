import { MedicalCode } from 'src/app/_models/codes';
import { ProceduresInfo } from 'src/app/_models';
import { DentalChartService } from 'src/app/_services/dentalchart.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { Actions } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { reflectNameOfDeclaration } from '@angular/compiler-cli/src/ngtsc/reflection';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-dentalchart',
  templateUrl: './dental.chart.component.html',
  styleUrls: ['./dental.chart.component.scss']
})
export class DentalChartComponent implements OnInit {
  hoverStartDate:string='Start Date';
  hoverEndDate:string='End Date';
  AdultPrem: boolean = true;
  ChilPrim: boolean = false;
  displayStyle = "none";
  DentalNumber: number;
  procedureCodeList: any = [];
  currentPatient: ProviderPatient
  procedureDialogComponent = ProcedureDialogComponent;
  ActionTypes = Actions
  usedProcedures: MedicalCode;
  procedureColumns: string[] = ['SELECT', 'START DATE', 'END DATE', 'TOOTH', 'SURFACE', 'CODE', 'DESCRIPTION', 'PROVIDER', 'STATUS', 'CQM STATUS','Encounter'];

  //patientProceduresView = new BehaviorSubject<ProceduresInfo[]> ([]);
  procedureDataSource: ProcedureDatasource;

  constructor(private overlayService: OverlayService,
    private dentalService: DentalChartService,
    private authService: AuthenticationService) {
      this.currentPatient = authService.viewModel.Patient;
    }

  ngOnInit(): void {
    this.patientUsedProcedures();
    this.patientProcedureView();
  }

  patientUsedProcedures(){
    this.dentalService.PatientUsedProcedures({"PatientId" : this.currentPatient.PatientId })
      .subscribe(resp =>
        {
          if(resp.IsSuccess){
            this.usedProcedures = resp.ListResult;
          }
        })
  }
  patientProcedureView(){
    // this.dentalService.PatientProcedureView({"PatientId" : this.currentPatient.PatientId })
    //   .subscribe(resp =>
    //     {
    //       if(resp.IsSuccess){
    //         this.patientProceduresView.next(resp.ListResult as ProceduresInfo[]);
    //       }
    //     })
    let reqparams = {
      "PatientId": this.currentPatient.PatientId,
    }
    this.procedureDataSource = new ProcedureDatasource(this.dentalService, reqparams);
    this.procedureDataSource.loadPatients();
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
    dialogData, actions: Actions = this.ActionTypes.new,ToothNo: number=0,medicalCode: MedicalCode) {
      let reqData: ProceduresInfo
      if(content == this.procedureDialogComponent){
        reqData = new ProceduresInfo();
        reqData.PatientId = this.currentPatient.PatientId;
        reqData.ProviderId = this.currentPatient.ProviderId;
        reqData.LocationId = this.authService.userValue.CurrentLocation;

        if(ToothNo>0){
          reqData.ToothNo = ToothNo ;
          reqData.ViewFrom = "ToothNo";

        }
        if(medicalCode){
          reqData.Code = medicalCode.Code
          reqData.CodeSystem = medicalCode.CodeSystem
          reqData.Description = medicalCode.Description;
          reqData.ViewFrom = "Tree";
        }
      }

    const ref = this.overlayService.open(content, reqData);

    ref.afterClosed$.subscribe(res => {
      if (content === this.procedureDialogComponent) {
        if (res.data != null && res.data.saved) {
          this.patientProcedureView();
        }
      }
    });
  }
}



export class ProcedureDatasource implements DataSource<ProceduresInfo>{

  private proceduresSubject = new BehaviorSubject<ProceduresInfo[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(private dentalService: DentalChartService, private queryParams: {}) {


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
  set ProviderId(id:string){
    this.queryParams["ProviderId"] = id;
  }

  loadPatients(filter = '', sortField = 'LastAccessed',
    sortDirection = 'desc', pageIndex = 0, pageSize = 10) {
    this.queryParams["SortField"] = sortField;
    this.queryParams["SortDirection"] = sortDirection;
    this.queryParams["PageIndex"] = pageIndex;
    this.queryParams["PageSize"] = pageSize;
    this.loadingSubject.next(true);


    this.dentalService.PatientProcedureView(this.queryParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(resp => {

        this.proceduresSubject.next(resp.ListResult as ProceduresInfo[])
      });
  }


  get TotalRecordSize(): number {
    if (this.proceduresSubject.getValue() && this.proceduresSubject.getValue().length > 0)
      return this.proceduresSubject.getValue()[0].TotalProcedures;
    return 0;
  }

}
