import { EncounterDiagnosis, EncounterInfo } from './encounter';
import { NewAppointment } from './smart.scheduler.data';

export class AdvancedDirective {
  AdvancedDirectiveId?: string = '';
  PatientId?: string;
  RecordAt?: string = '';
  Notes?: string = '';
}

export class SmokingStatus {
  SmokingStatusId?: string;
  PatientId?: string;
  Status?: string;
  EffectiveFrom?: string;
}

export class PastMedicalHistory {
  PastMedicalHistoryId?: string;
  PatinetId?: string;
  CreatedAt?: Date;
  OngoingProblems?: string;
  NutritionHistory?: string;
  MajorEvents?: string;
  PerventiveCare?: string;
  FamilyHealthyHistoryId?: string;
  fFirstName?: string;
  fLastName?: string;
  Relationship?: string;
  fBirthAt?: string;
  fDeceased?: boolean;
  fNote?: string;
  fCreatedAt?: Date;
  fUpdatedAt?: Date;
}

export class Allergy {
  AlergieId?: string;
  PatientId?: string;
  AllergenType?: string;
  AlergieName?: string;
  SeverityLevel?: string;
  OnSetAt?: string;
  StartAt?: string;
  EndAt?: string;
  Note?: string;
  Reaction?: string;
  AllergenName?: string;
  EncounterId?: string;
  AllergenId?: string;
}

export enum PatientChart {
  AdvancedDirectives,
  SmokingStatus,
  Encounters,
  CQMNotPerforemd
}

export class ChartInfo {
  AdvancedDirectives?: AdvancedDirective[] = []
  Diagnoses?: EncounterDiagnosis[] = []
  Alergies?: Allergy[] = []
  PastMedicalHistories?: PastMedicalHistory[] = []
  Immunizations?: Immunizations[] = []
  Encounters?: EncounterInfo[] = []
  Appointments?: NewAppointment[] = []
  Medications?: Medications[] = []
  SmokingStatuses?: SmokingStatus[] = []
  TobaccoUseInterventions?: TobaccoUseScreenings[] = []
  TobaccoUseScreenings?: TobaccoUseInterventions[] = []
}

export class Immunizations {
  ImmunizationId?: string;
  PatientId?: string;
  AdministeredAt?: string;
  ExpirationAt?: Date;
  Notes?: string;
}

export class Medications {
  MedicationId?: string;
  PatientId?: string;
  DrugName?: string;
  DisplayName?: string;
  Rxcui?: string;
  NDC?: string;
  DoesspotMedicationId?: string;
  ManualDose?: string;
  Units?: string;
  Quantity?: number;
  Refills?: string;
  DaysSupply?: number;
  StartAt?: Date;
  StopAt?: Date;
  ReasonCode?: string;
  ReasonDescription?: string;
  Notes?: string;
  CQMStatus?: string;
}

export class TobaccoUseScreenings {
  TobaccoUseId?: string;
  PatientId?: string;
  ScreeningId?: string;
  DatePerformed?: Date;
  Description?: string;
  Code?: string;
  Status?: string;
  ScreeningPerformed?: string;
}

export class TobaccoUseInterventions {
  tobacco_use_id?: string;
  patient_id?: string;
  cessation_intervention_id?: string
  cessation_intervention_date?: Date;
  cessation_intervention_performed?: string;
  code?: string;
  description?: string;
}

export class Diagnosis {
  DiagnosisId?: string;
  PatinetId?: string;
  CodeSystem?: string;
  Code?: string;
  Description?: string;
  StartAt?: Date;
  StopAt?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Note?: string;
  Acute?: boolean;
  Terminal?: boolean;
  Referral?: boolean;
}

// Enums

export enum AllergyType {
  Medication = 'Medication',
  Food = 'Food',
  Environment = 'Environment',
}

export enum SeverityLevel {
  VeryMild = 'Very Mild',
  Mild = 'Mild',
  Moderate = 'Moderate',
  Severe = 'Severe'
}

export enum OnSetAt {
  Childhood = 'Childhood',
  Adulthood = 'Adulthood',
  Unknown = 'Unknown'
}

export enum Allergens {
  diphenylethylene = '1,1-diphenylethylene',
  dioleoyl = '1,2-dioleoyl-sn-glycero-3-phosphocholine',
  methoxynaphthoquinone = '2-methoxynaphthoquinone'
}

export enum AllergyReaction {
  Anaphylaxis = 'Anaphylaxis',
  Bloating = 'Bloating/gas',
  ChestPain = 'Chest Pain',
  Cough = 'Cough'
}

export enum DiagnosisDpCodes {   // Dp - dropdown
  SNOMED = 'SNOMED',
  ICD10 = 'ICD10'
}
