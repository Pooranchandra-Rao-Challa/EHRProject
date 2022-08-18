export class CQMNotPerformed {
  NPRId?: string;
  PatientId?: string;
  ProviderId?: string;
  ItemNotPerformed?: string;
  Date?: Date;
  InterventionType?: string;
  InterventionCode?: string;
  InterventionDescription?: string;
  InterventionCodeDescription?: string;
  ReasonCodeDescription?: string;
  Reason?: string;
  ReasonCode?: string;
  ReasonDescription?: string;
  Note?: string;
  InterventionId?: string;
  Reasondetails?: string;
  CessationInterventionId?: string;
}

export class InterventionCodes {
  public slice;

  Code?: string;
  Description?: string;
  CodeDescription?: string;
}
