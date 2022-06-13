import { EncounterDiagnosis } from './encounter';

export class AdvancedDirective {
  AdvancedDirectiveId?: string = '';
  PatientId?: string;
  RecordAt?: string = '';
  Notes?: string = '';
}

export interface SmokingStatus {
  SmokingStatusId?: string;
  PatientId?: string;
  Status?: string;
  EffectiveFrom?: string;
}

export enum PatientChart {
  AdvancedDirectives,
  SmokingStatus
}

export class ChartInfo{
  AdvancedDirectives?: AdvancedDirective[] = []
  Diagnoses?: EncounterDiagnosis[] = []
  Alergies?: []
  PastMedicalHistories?: []
  Immunizations?: []
  Encounters?: []
  Appointments?: []
  Medications?: []
  SmokingStatuses?: []
  TobaccoUseInterventions?: []
  TobaccoUseScreenings?: []
}
