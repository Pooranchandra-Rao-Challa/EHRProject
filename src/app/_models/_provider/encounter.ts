import { JsonPipe } from "@angular/common";

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

export class MU2Info{
  VisitReason?: string;
  ClinicalInstructions? :string;
  EducationProvided: boolean = false;
  MedicalReconcillation: boolean = false;
  ReconcillationCode? :string;
  ReconcillationDescription? :string;
  HealthInfoExchange: boolean = false;
  CurrentMedicationDocumented: number = 1
  DocumentedCode: string = "99213";
  DocumentedDescription: string ="Office or Other Outpatient Visit"
}

export class EncounterInfo{
  EncounterId?: string;
  PatientId?: string;
  ProviderId?: string;
  LocationId?: string;
  ServicedAt?: Date = new Date;
  ServiceEndAt?: Date = new Date;
  ReasonForVisit?: string;
  ReasonForReferral?: string = "";
  Medication?: string = "yes" ;
  EncounterType?: string = "Office Visit (1853490003)";
  ToProviderName?: string = "";
  FromProviderName?: string = "";
  DischargeStatus?: string = "";
  HealthInfoExchange: boolean = false;
  ClinicalSummary: boolean = false;
  FromProvider: boolean = false;
  ToProvider: boolean = false;
  PatientEducation: boolean = false;
  medCompleted: boolean = false;
  Signed: boolean = false;
  cqmData: boolean = false;
  cqmExcelData: boolean = false;
  DirectImport: boolean = false;
  NewPatientEncounter: boolean = false;
  MedicationAllergyReconciliationCompleted: boolean = false;
  DiagnosisReconciliationCompleted: boolean = false;
  SummaryCareRecordRefIn: boolean = false;
  SummaryCareRecordRefOut: boolean = false;
  DeclinetoReceiveSummary: boolean = false;
  CareRecordCreated: boolean = false;
  CareRecordExchanged: boolean = false;

  mu2: MU2Info = new MU2Info;
  Referral: ReferralInfo = new ReferralInfo;
  Diagnoses: EncounterDiagnosis[] = [];
  RecommendedProcedures: ProceduresInfo[] = [];
  CompletedProcedures: ProceduresInfo[] = [];
  Vitals: VitalInfo[] = [];
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

export class EncounterDiagnosis{
  DiagnosisId?: string;
  RCopiaId?: string;
  LocationId?: string;
  StartAt?: Date;
  StopAt?: Date;
  Terminal?: string;
  Note?: string;
  Referral?: boolean;
  Primary?: boolean;
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
  onSetAt?: string;
  Code?: string;
  CodeSystem?: string;
  Description?: string;
  PatientEdn?: string = "MedLine Plus";
  PrimaryDx?: boolean = false;
  CanDelete?: boolean = false;
  /**<a href="http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.96&amp;mainSearchCriteria.v.c=223788007" target="_blank">Medline Plus</a> */
}

export class ProceduresInfo{
  ProcedureId?: string;
  EncounterId?: string;
  PatientId?: string;
  LocationId?: string;
  ProviderId?: string;
  DiagnosisId?: string;
  ServicedAt?: Date;
  ToothSystem?: string = "JP";
  Quantity?: number = 0;
  Fee?: number = 0;
  cqmData: boolean = false;
  cqmExcelData: boolean = false;
  date?: Date;
  OralCavityArea?: string;
  Notes?: string;
  ReasonCode?: string;
  ReasonDescription?: string;
  EndDate?: Date;
  cqmStatus?: boolean;
  DataSubType?: string;
  Status?: Date; // if Updating from Procedures from Completed tab its 'Completed' else from recommended tab ' Treetment Plannned'
  Code?: string;
  CodeSystem?: string;
  Description?: string;
  ToothNo?: number;
  Surface?: string;
  CanDelete?: boolean = false;
}

export class VitalInfo{
  VitalId?: string;
  EncounterId?:string;
  CollectedAt?:Date;
  Height: number;
  Weight: number;
  BMI: number;
  BPSystolic: number; //bp_left
  BPDiastolic: number; //bp_right;
  Temperature: number;
  Pulse: number;
  RespiratoryRate: number;
  O2Saturation: number;
  BloodType: string;
  UnitSystem: string = "us";
  TempType: string = "unspecified";
  Note?:string;
}
