import { JsonPipe } from "@angular/common";


export interface IDeleteFlag {
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


export class EncounterInfo {
  EncounterId?: string;
  PatientId?: string;
  ProviderId?: string;
  LocationId?: string;
  AppointmentId?: string;



  ServicedAt?: Date = new Date;
  ServiceEndAt?: Date;
  Medication?: string = "yes";
  ClinicalSummary: boolean = false;
  Signed: boolean = false;
  cqmData: boolean = false;
  cqmExcelData: boolean = false;
  DirectImport: boolean = false;
  EnableNewEncounterData: boolean = false;

  //MU2
  VisitReason?: string;
  ClinicalInstructions?: string;
  EncounterType?: string = "Office Visit (1853490003)";
  NewPatientEncounter: boolean;
  PatientHealthData: string = "";
  PatientEducation: boolean ;
  DischargeStatus: string = "";
  DischargeStatusCode: string = "";
  DischargeStatusCodeSystem: string = "";
  // Need to Know DataBase Columns
  EncounterCode: string = "99213";
  EncounterCodeSystem: string = "SNOMED";
  EncounterDescription: string = "Office or Other Outpatient Visit";
  // End of Need to Know
  SummaryCareRecordRefIn?: boolean;
  SummaryCareRecordRefOut?: boolean;
  DeclinedToReceiveSummary?: boolean;
  SummaryOfCareRecord?: string;
  MedicationAllergyReconciliationCompleted?: boolean;
  DiagnosisReconciliationCompleted?: boolean;
  medCompleted?: boolean;
  HealthInfoExchange?: boolean;
  CurrentMedicationDocumented: number = 1
  MedicationReconciliation?: boolean;
  MedicalReconcillation?: boolean;

  // Referral
  ReferralReason?: string
  ReferralFrom?: string;
  ReferralTo?: string;
  ReferredFrom: boolean = false;
  ReferredTo: boolean = false;
  CongnitiveStatus?: string;
  FunctionalStatus?: string;


  Diagnoses: EncounterDiagnosis[] = [];
  RecommendedProcedures: ProceduresInfo[] = [];
  CompletedProcedures: ProceduresInfo[] = [];
  Vital: VitalInfo = new VitalInfo;
}

export class ReferralInfo {
  Reason?: string
  ReferralFrom?: string;
  ReferralTo?: string;
  ReferredFrom: boolean = false;
  ReferredTo: boolean = false;
  CongnitiveStatus?: string;
  FunctionalStatus?: string;
}

export class EncounterDiagnosis implements IDeleteFlag {
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
  AllergenName?: string;
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

  ViewFrom?: string;
  CanDelete?: boolean = false;
}

export class VitalInfo {
  VitalId?: string;
  EncounterId?: string;
  CollectedAt?: Date;
  CollectedTime?: string;
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
  Note?: string;
}


export const REASON_CODES = [
  { 'Code': '105480006', 'Description': 'Refusal of treatment by patient (situation)' },
  { 'Code': '183944003', 'Description': 'Procedure refused (situation)' },
  { 'Code': '183945002', 'Description': 'Procedure refused for religious reason (situation)' },
  { 'Code': '413310006', 'Description': 'Patient non-compliant - refused access to services (situation)' },
  { 'Code': '413311005', 'Description': 'Patient non-compliant - refused intervention / support (situation)' },
  { 'Code': '413312003', 'Description': 'Patient non-compliant - refused service (situation)' },
  { 'Code': '183932001', 'Description': 'Procedure contraindicated (situation)' },
  { 'Code': '397745006', 'Description': 'Medical contraindication (finding)' },
  { 'Code': '407563006', 'Description': 'Treatment not tolerated (situation)' },
  { 'Code': '428119001', 'Description': 'Procedure not indicated (situation)' },
  { 'Code': '59037007', 'Description': 'Drug intolerance' },
  { 'Code': '62014003', 'Description': 'Adverse reaction to drug' }
];

export const INTERVENSION_TYPES = ["BMI-Above Normal Follow-up",
 "BMI-Above Normal Medication",
 "BMI-Referrals where weight assessement may occur",
 "BMI-Below Normal Follow-up",
 "BMI-Below Normal Medication",
 "Weight-Counseling for Nutrition",
  "Weight-Counseling for Physical Activity"
];

export const MEDICAL_REASONS_NOT_PERFORMED =["Medical Reason", "Patient Refused"];

export const OTHER_REASON_NOT_PERFORMED =  ["Current Meds Documented", "BMI Screening/Follow-up", "Tobacco Use Screening/Cessation Counseling"];


export const TOOTH_PROBLEM_PLACES = {
"surface_buccal_v": "Surface Buccal V",
"surface_facial_v": "Surface Facial V",
"surface_mesial": "Surface Mesial",
"surface_incisal": "Surface Incisal",
"surface_distal": "Surface Distal",
"surface_lingual": "Surface Lingual",
"surface_facial": "Surface Facial",
"surface_buccal": "Surface Buccal",
"surface_occlusal": "Surface Occlusal V",
"surface_lingual_v": "Surface Lingual V",

"pit_mesiobuccal": "Pit Mesiobuccal",
"pit_mesiolingual": "Pit Mesiolingual",
"pit_distobuccal": "Pit Distobuccal",
"pit_distolingual": "Pit Distolingual",
"cusp_mesial": "Cusp Mesial",
"cusp_mesiobuccal": "Cusp Mesiobuccal",
"cusp_mesiolingual": "Cusp Mesiolingual",
"cusp_distal": "Cusp Distal",
"cusp_distobuccal": "Cusp Distobuccal",
"cusp_distolingual": "Cusp Distolingual" };

/**def update_intervention_cqm_status
    self.intervention.update(:cqm_status => reason_code == '407563006' ? 'INT' : 'PRFND') if self.intervention.present?
  end */
