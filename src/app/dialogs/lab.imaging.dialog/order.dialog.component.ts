
import { PatientService } from 'src/app/_services/patient.service';
import { MedicalCode } from 'src/app/_models/codes';
import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, Observable, of } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, PatientSearch, UserLocations, } from 'src/app/_models';
import { Attachment, LabProcedureWithOrder, TestOrder } from 'src/app/_models/_provider/LabandImage';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { TestCode, TestCodeComponent } from './test.code.component';
import { OverlayService } from 'src/app/overlay.service';
import { FileUploadService } from 'src/app/_services/file.upload.service';
import { DatePipe } from '@angular/common'
import { UPLOAD_URL } from 'src/environments/environment'
import { HttpParams } from '@angular/common/http';
import { DownloadService } from 'src/app/_services/download.service';
import { SettingsService } from 'src/app/_services/settings.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order.dialog.component.html',
  styleUrls: ['./order.dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredPatients: Observable<PatientSearch[]>;
  orderTypeDD = [{ value: 'Lab', viewValue: 'Lab' }, { value: 'Imaging', viewValue: 'Imaging' }]
  formGroups: FormGroup;
  OrderStatuses: any = [];
  ResultStatuses: any[] = [];
  PracticeProviders: PracticeProviders[] = [];
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  isLoading: boolean = false;
  filteredOptions: Observable<MedicalCode[]>;
  testCodeComponent = TestCodeComponent;
  orderingFacilities: UserLocations[] = [];
  saveClicked: boolean = false;
  diabledPatientSearch: boolean = false;
  EntityName: string = "laborder"
  fileUploadUrl: string;
  norecords: boolean = false
  showImage: boolean = false;
  httpRequestParams = new HttpParams();
  fileSize: number = 20
  AcceptedFileTypes: string = ".jpg,.gif,.jpeg,.png,.pdf";


  constructor(private ref: EHROverlayRef,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private smartSchedulerService: SmartSchedulerService,
    private pateintService: PatientService,
    private labsImagingService: LabsImagingService,
    private alertMessage: AlertMessage,
    private authService: AuthenticationService,
    private overlayService: OverlayService,
    private patientService: PatientService,
    private settingsService: SettingsService,
    private datePipe: DatePipe) {
    this.labandImaging = ref.RequestData as LabProcedureWithOrder;

    this.httpRequestParams = this.httpRequestParams.append("EntityName", this.EntityName);
    if (this.labandImaging.LabProcedureId)
      this.httpRequestParams = this.httpRequestParams.append("EntityId", this.labandImaging.LabProcedureId);


    this.fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')

    if (this.labandImaging.CurrentPatient == null)
      this.labandImaging.CurrentPatient = new PatientSearch();
    this.labandImaging.ProcedureType = this.labandImaging.View;
    this.orderingFacilities = JSON.parse(this.authService.userValue.LocationInfo) as UserLocations[];


    if (this.labandImaging.StrAttachments != undefined)
      this.labandImaging.Attachments = JSON.parse(this.labandImaging.StrAttachments) as Attachment[];
    else this.labandImaging.Attachments = [];

    if (this.labandImaging.ReceivedAt) {
      this.labandImaging.ReceivedAt = this.datePipe.transform(this.labandImaging.ReceivedAt, "yyyy-MM-dd");
    }
  }


  ngOnInit(): void {
    this.updatePatientInfo();
    this.InitOrderStatuses();
    this.InitResultStatuses();
    this.loadDefaults();
    this.initFormGroups();
    this.initTestOrderGrid();
    this.diabledPatientSearch = this.labandImaging.CurrentPatient != null;
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.norecords = false
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatient(value));
  }
  _filterPatient(term) {
    this.isLoading = true;
    this.pateintService
      .PatientSearch({
        ProviderId: this.authService.userValue.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearch[]);
        } else {
          this.filteredPatients = of([]);
          this.norecords = true
        }
      })
  }

  // ngAfterViewInit() {
  //   if (this.labandImaging.CurrentPatient != null &&
  //     this.labandImaging.CurrentPatient.Name != null) {
  //     this.searchpatient.nativeElement.value = this.labandImaging.CurrentPatient.Name;
  //     this.diabledPatientSearch = true;
  //   }

  // }
  onPatientSelected(selected) {
    this.labandImaging.CurrentPatient = selected.option.value;
    this.labandImaging.PatientId = this.labandImaging.CurrentPatient.PatientId;
    this.labandImaging.PatientName = this.labandImaging.CurrentPatient.Name;
    this.labandImaging.PrimaryPhone = this.labandImaging.CurrentPatient.PrimaryPhone;
  }
  displayWithPatientSearch(value: PatientSearch): string {
    if (!value) return "";
    return value.Name;
  }
  cancel() {
    this.ref.close(null);
  }
  initFormGroups() {
    this.formGroups = this.fb.group({
      orders: this.fb.array([]),
      //attachments: this.fb.array([])
    })
  }
  get orders() {

    return this.formGroups.get('orders') as FormArray
  }
  addLabOrder(order: TestOrder = {}) {
    this.orders.push(this.newOrder(order));
  }
  removeLabOrder(index: number) {
    this.orders.controls.splice(index, 1).forEach(ctrl => {
      if (isNaN(ctrl.get("TestOrderId").value)) {
        if (this.labandImaging.RemovedTestOrderIds == null) this.labandImaging.RemovedTestOrderIds = [];
        this.labandImaging.RemovedTestOrderIds.push(ctrl.get("TestOrderId").value)
      }
    });
  }
  newOrder(order: TestOrder = {}) {
    return this.fb.group({
      Code: order.Code,
      Test: order.Test,
      TestOrderId: order.TestOrderId
    })
  }

  updatePatientInfo() {
    this.patientService
      .PatientSearch({
        PatientId: this.labandImaging.PatientId
      })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          let pat = resp.ListResult as PatientSearch[];
          if (pat.length > 0) {
            this.labandImaging.CurrentPatient = pat[0];
          } else {
            this.labandImaging.CurrentPatient = new PatientSearch()
          }
        }

      })
  }

  initTestOrderGrid() {
    if (this.labandImaging.Tests != null)
      this.labandImaging.Tests.forEach(order => {
        this.addLabOrder(order);
      })
  }



  // get attachments() {
  //   return this.formGroups.get('attachments') as FormArray
  // }

  // attachements() {
  //   this.attachments.push(
  //     this.addAttachment());
  // }

  // addAttachment() {
  //   return this.fb.group({
  //     file: "",
  //   })
  // }
  // removeAttachemnt(index: number) {
  //   this.attachments.removeAt(index);
  // }

  InitOrderStatuses() {
    this.utilityService.OrderStatuses().subscribe(resp => {
      this.OrderStatuses = resp.ListResult;
    })
  }
  InitResultStatuses() {
    this.utilityService.ResultStatuses().subscribe(resp => {
      this.ResultStatuses = resp.ListResult;
    })

  }
  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }
  enableSave() {
    return !(this.labandImaging.CurrentPatient != null
      && this.labandImaging.ProcedureType != null && this.labandImaging.ProcedureType != ""
      && this.labandImaging.LabName != null && this.labandImaging.LabName != ""
      && this.labandImaging.OrderStatus != null && this.labandImaging.OrderStatus != ""
      && this.labandImaging.ScheduledAt != null && this.labandImaging.ScheduledAt != ""
      && this.labandImaging.OrderingPhysicianId != null && this.labandImaging.OrderingPhysicianId != ""
      && this.labandImaging.OrderingFacility != null && this.labandImaging.OrderingFacility != ""
      && this.labandImaging.ResultStatus != null && this.labandImaging.ResultStatus != ""
      && this.labandImaging.CurrentPatient != null && this.labandImaging.CurrentPatient.PatientId != null
      && this.labandImaging.CurrentPatient.PatientId != ""
      && this.hasOrders)


  }

  get hasOrders() {
    let values = this.orders.getRawValue() as TestOrder[];
    this.labandImaging.Tests = values;
    let flag: boolean = true;
    values.forEach(value => {
      flag = flag && value.Code != "" && value.Test != "";
    })
    return flag && values.length > 0;
  }

  signed() {
    this.labandImaging.Signed = true;
    this.save();
  }

  save() {
    this.saveClicked = true;
    let isAdd = this.labandImaging.LabProcedureId == null;
    this.labandImaging.ClinicId = this.authService.userValue.ClinicId;
    this.labandImaging.LocationId = this.authService.userValue.CurrentLocation;
    this.labandImaging.StrScheduledAt = this.datePipe.transform(this.labandImaging.ScheduledAt, "MM/dd/yyyy")
    this.labandImaging.strReceivedAt = this.datePipe.transform(this.labandImaging.ReceivedAt, "MM/dd/yyyy")

    if (!this.labandImaging.Signed || this.labandImaging.Signed == null)
      this.labandImaging.Signed = this.labandImaging.ResultStatus == "signed";
    else
      this.labandImaging.ResultStatus = "signed";

    this.labsImagingService.CreateLabOrImagingOrder(this.labandImaging)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.ref.close({ "saved": true });
          this.alertMessage.displayMessageDailog(ERROR_CODES[this.labandImaging.View == "Lab" ? isAdd ? "M2G1001" : "M2G1002" : isAdd ? "M2G1008" : "M2G1009"]);

        } else {
          this.close();
          this.alertMessage.displayErrorDailog(ERROR_CODES[this.labandImaging.View == "Lab" ? isAdd ? "E2G1001" : "E2G1002" : isAdd ? "E2G1008" : "E2G1009"]);
        }

      });
  }

  close() {
    this.ref.close();
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = Actions.view) {
    const ref = this.overlayService.open(content, dialogData, true);
    ref.afterClosed$.subscribe(res => {
      if (content === this.testCodeComponent) {
        if (res != null && res.data != null && res.data.TestCode) {
          let value = res.data.TestCode;
          this.orders.controls[value.Index].setValue({ Code: value.Code, Test: value.Description, TestOrderId: -1 * value.Index });
        }
      }
    });
  }
  getCodeInfo(element, index) {
    let testCode: TestCode = new TestCode();
    testCode.Query = element.target.value;
    testCode.Scope = 'Lonics';
    testCode.Index = index;
    if (testCode.Query.length >= 3)
      this.openComponentDialog(this.testCodeComponent, testCode);
  }

  ItemsModified(data) {
    this.labandImaging.Attachments = data;
  }

  public UploadCompleted(data): any {
    if (data.event.body) {
      if (this.labandImaging.Attachments == null) this.labandImaging.Attachments = [];
      var temp = data.event.body as Attachment
      let attachment:Attachment = {
        EntityId : temp.EntityId,
        EntityName : temp.EntityName,
        AttachmentId : temp.AttachmentId,
        FileName : temp.FileName
      };
      this.labandImaging.Attachments.push(attachment);
    }
  }
  DeleteAttachment(attachment: Attachment) {
    if(!attachment.EntityName) attachment.EntityName = this.EntityName;
    if (attachment) {
      this.labandImaging.Attachments.filter(fn => fn.AttachmentId == attachment.AttachmentId)[0].IsDeleted = true;
      if (this.currentViewAttachment != null &&
        this.currentViewAttachment.FileName == attachment.FileName) {
        this.showImage = false;
        this.Imagedata = "";
        this.currentViewAttachment = null;
      }
      this.settingsService.DeleteAttachment(attachment).subscribe((resp) => {
        if (resp.IsSuccess) {
          this.alertMessage.displayMessageDailog(ERROR_CODES["2AD001"]);

        } else {
          this.alertMessage.displayErrorDailog(ERROR_CODES["2EAD001"]);
        }
      })
    }
  }

  get Attachments(): Observable<Attachment[]> {
    if (!this.labandImaging.Attachments) this.labandImaging.Attachments = [];
    return of(this.labandImaging.Attachments.filter(fn => !fn.IsDeleted));
  }
  Imagedata: any;
  showPdf: boolean = false;
  pdfUrl: string = "";

  currentViewAttachment: Attachment = null;
  showDocument(attachment) {
    if (attachment.FileName.endsWith(".pdf"))
      return;
    this.labsImagingService.ImagetoBase64String(attachment).subscribe(resp => {
      if (resp.IsSuccess) {
        this.showImage = true;
        this.Imagedata = resp.Result;
        this.currentViewAttachment = attachment;
      } else {
        this.showImage = false;
      }
    });
  }
  ItemRemoved($event) {

  }
}
