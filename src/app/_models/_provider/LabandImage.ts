import { TestScheduler } from 'rxjs-compat';
import { PatientSearch } from 'src/app/_models';
export class LabProcedureWithOrder {
  CurrentPatient?: PatientSearch = new PatientSearch();
  LabProcedureId?: string;
  ClinicId?: string;
  PatientId?: string;
  Signed?: boolean;
  LocationId?: string;
  OrderId?: string;
  OrderNumber?:string;
  ProcedureType?:string;
  LabName?: string;
  OrderStatus?: string; // Status.
  ScheduledAt?: string;
  StrScheduledAt?: string // use 'MM/dd/yyyy'
  OrderingPhyscianId?: string;
  OrderingFacility?: string;
  ResultStatus?: string; // Lab and Imaging Status
  ReceivedAt?: string;
  strReceivedAt?: string; // use 'MM/dd/yyyy'
  Notes?: string;
  Tests?: TestOrder[] = [];
  View?: string;
  CreatedDate?: Date;
  PatientName?: string;
  PrimaryPhone?: string;
  ProviderName?: string;
  sex?:string;
  TotalRecords?: number;
  LabResult?: LabResultInfo = {};
  TestResultsOfImages?: ImageResultInfo = {};
  StrTests?: string;
  strResult?: string;
  RemovedTestOrderIds?: string[] = [];
  LabResultId?: string;
  ImageResultId?: string;
  ViewFor?: string;
  Attachments?: Attachment[] = [];
  StrAttachments?:string;

  Exam?: string;
  RequestedBy?: string;
  History?: string;
  RadioPharmaceutical?: string;
  Technique?: string;
  Comparison?: string;
}

export class TestOrder {
  TestOrderId?: string;
  LabProcedureId?: string;
  Code?: string;
  Test?: string;
  Result?: string;
  Units?: string;
  Flag?: string;
  Range?: string;
}

export class LabResultInfo{
  LabResultId?: string;
  Fasting?: string;
  Specimen?: string;
  SpecimenType?: string;
  TestReportedAt?: string;
  ProviderId?: string;
  NPI?: string;
  OrderName?: string;
  OrderAddress?: string;
  PerformingName?: string;
  PerformingAddress?: string;
  Notes?: string;
  LabProcedureId?: string;
  CollectedAt?: string;
  ReceivedAt?: string;
  TestedAt?: string;
  OrderId?: string;
  CollectedDate?: Date;
  ReceivedDate?: Date;
  TestedDate?: Date;
  TestReportedDate?: Date;
  CollectedTime?: string;
  ReceivedTime?: string;
  TestedTime?: string;
}

export class ImageResultInfo{
  ImageResultId?: string;
  LabProcedureId?: string;
  ScheduleAt?: Date;
  Exam?: string;
  RequestedBy?: string;
  History?: string;
  RadioPharmaceutical?: string;
  Technique?: string;
  Comparison?: string;
  Findings?: string;
  Impression?: string;
  strScheduleAt?: string;
  Attachments?: Attachment[] = [];
}

export class Attachment{
    FileName: string;
    EnitityName: string;
    EntityId: string;
    AttachmentId:string;
    IsDeleted?:boolean = false;
}

