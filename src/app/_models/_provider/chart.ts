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

export class PastMedicalHistories {
  PastMedicalHistoryId?: string;
  PatinetId?: string;
  CreatedAt?: Date;
  OngoingProblems?: string = '';
  NutritionHistory?: string = '';
  MajorEvents?: string = '';
  PerventiveCare?: string = '';
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

export class Allergies {
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
  CQMNotPerforemd
}

export class ChartInfo {
  AdvancedDirectives?: AdvancedDirective[] = []
  Diagnoses?: EncounterDiagnosis[] = []
  Alergies?: Allergies[] = []
  PastMedicalHistories?: PastMedicalHistories[] = []
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
