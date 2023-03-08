export interface ProblemData{
  PatientId: string;
  PatientName: string;
  Sex: string;
  DOB: Date;
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  ZipCode: number;
  LastEncounter: Date;
  Active: boolean;
  DxCode: string;
  DxDescription: string;
  DxStartDate: string;
  DxEndDate: string;
  SmokingStatus: boolean;
  Allergy: string;
}
