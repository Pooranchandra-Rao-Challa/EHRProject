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
