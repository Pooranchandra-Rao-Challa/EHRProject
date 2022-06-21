import { JsonPipe } from "@angular/common";


export interface IDeleteFlag{
  CanDelete?: boolean;
}

export interface EncounterData {
  Encounter_Id: number;
  Patient_Name: string;
  Provider_Name: string;
  Birth_Date: string;
  Patient_Age: string;
  Encounter_Date: string;
  Proc_Code: string;
  Encounter_Description: string;
  Proc_Fees: string;
  Prime_Subscriber_No: string;
  Prime_Subscriber_Name: string;
  Prime_Ins_Company_Name: string;
  Prim_Source_Payment_Typology: string;

}


export class EncounterInfo{
  EncounterId?: string;
  PatientId?: string;
  ProviderId?: string;
  LocationId?: string;
  AppointmentId?: string;



  ServicedAt?: Date = new Date;
  ServiceEndAt?: Date;
  Medication?: string = "yes" ;
  ClinicalSummary: boolean = false;
  Signed: boolean = false;
  cqmData: boolean = false;
  cqmExcelData: boolean = false;
  DirectImport: boolean = false;
  EnableNewEncounterData: boolean = false;

  //MU2
  VisitReason?: string;
  ClinicalInstructions? :string;
  EncounterType?: string = "Office Visit (1853490003)";
  NewPatientEncounter: boolean = false;
  PatientHealthData:string = "";
  PatientEducation: boolean = false;
  DischargeStatus: string = "";
  DischargeStatusCode: string ="";
  DischargeStatusCodeSystem: string ="";
  // Need to Know DataBase Columns
  EncounterCode: string="99213";
  EncounterCodeSystem: string="SNOMED";
  EncounterDescription: string ="Office or Other Outpatient Visit";
  // End of Need to Know
  SummaryCareRecordRefIn?: boolean;
  SummaryCareRecordRefOut?: boolean;
  DeclinedToReceiveSummary?: boolean;
  SummaryOfCareRecord?:string;
  MedicationAllergyReconciliationCompleted?: boolean;
  DiagnosisReconciliationCompleted?: boolean;
  medCompleted?: boolean;
  HealthInfoExchange?: boolean;
  CurrentMedicationDocumented: number = 1
  MedicationReconciliation?: boolean;
  MedicalReconcillation?: boolean ;

  // Referral
  ReferralReason?: string
  ReferralFrom?: string;
  ReferralTo?: string;
  ReferredFrom: boolean = false;
  ReferredTo: boolean = false;
  CongnitiveStatus?: string;
  FunctionalStatus?: string;

  //mu2: MU2Info = new MU2Info;
  //Referral: ReferralInfo = new ReferralInfo;
  Diagnoses: EncounterDiagnosis[] = [];
  RecommendedProcedures: ProceduresInfo[] = [];
  CompletedProcedures: ProceduresInfo[] = [];
  Vital:VitalInfo = new VitalInfo;
}

export class ReferralInfo{
  Reason?: string
  ReferralFrom?: string;
  ReferralTo?: string;
  ReferredFrom: boolean = false;
  ReferredTo: boolean = false;
  CongnitiveStatus?: string;
  FunctionalStatus?: string;
}

export class EncounterDiagnosis implements IDeleteFlag{
  DiagnosisId?: string;
  RCopiaId?: string;
  LocationId?: string;
  PatinetId?: string;
  StartAt?: Date;
  StopAt?: Date;
  Terminal?: boolean;
  Note?: string;
  Referral?: boolean;
  FamilyHealthHistoryId?: string;
  cqmData: boolean = false;
  cqmExcelData: boolean = false;
  cqmCodeSystem?: string;
  AllergenType?: string;
  SeverityLevel?: string;
  NDC?: string;
  AllergenName?:string;
  Rxcui?: string;
  EndAt?: string;
  OnSetAt?: string;
  Code?: string;
  CodeSystem?: string;
  Description?: string;
  PatientEdn?: string = "MedLine Plus";
  PrimaryDx?: boolean = false;
  CanDelete?: boolean = false;
  /**<a href="http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.96&amp;mainSearchCriteria.v.c=223788007" target="_blank">Medline Plus</a> */
}

export class ProceduresInfo implements IDeleteFlag {
  ProcedureId?: string;
  EncounterId?: string;
  PatientId?: string;
  LocationId?: string;
  ProviderId?: string;
  ServicedAt?: Date;
  ToothSystem?: string = "JP";
  Quantity?: number = 0;
  Fee?: number = 0;
  cqmData: boolean = false;
  cqmExcelData: boolean = false;
  OralCavityArea?: string;
  Notes?: string;
  ReasonCode?: string;
  ReasonDescription?: string;
  EndDate?: Date;
  cqmStatus?: boolean;
  DataSubType?: string;
  Status?: string; // if Updating from Procedures from Completed tab its 'Completed' else from recommended tab ' Treetment Plannned'
  Code?: string;
  CodeSystem?: string;
  Description?: string;
  ToothNo?: number;
  Surface?: string;
  ToothProblemId?: string;
  ReasonStartDate?: Date;

  CanDelete?: boolean = false;
}

export class VitalInfo{
  VitalId?: string;
  EncounterId?:string;
  CollectedAt?:Date;
  CollectedTime?:string;
  Height?: number;
  Weight?: number;
  BMI?: number;
  BPSystolic?: number; //bp_left
  BPDiastolic?: number; //bp_right;
  Temperature?: number;
  Pulse?: number;
  RespiratoryRate?: number;
  O2Saturation?: number;
  BloodType?: string;
  UnitSystem: string = "us";
  TempType: string = "unspecified";
  Note?:string;
}
