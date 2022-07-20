import { PatientSearch } from 'src/app/_models';
export class LabProcedureWithOrder {
  CurrentPatient?: PatientSearch = new PatientSearch();
  LabProcedureId?: string;
  ClinicId?: string;
  PatientId?: string;
  Signed?: string;
  LocationId?: string;
  OrderId?: string;
  ProcedureType?:string;
  LabName?: string;
  Status?: string; // Status.
  ScheduledAt?: string;
  StrScheduledAt?: string // use 'MM/dd/yyyy'
  OrderingPhyscianId?: string;
  OrderingFacility?: string;
  OrderStatus?: string; // Lab and Imaging Status
  ReceivedAt?: string;
  strReceivedAt?: string; // use 'MM/dd/yyyy'
  Notes?: string;
  Tests: TestOrder[] = [];
  View?: string;
  CreatedDate?: Date;
  PatientName?: string;
  ProviderName?: string;
  TotalRecords?: number;
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
