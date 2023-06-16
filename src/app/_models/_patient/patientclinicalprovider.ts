// Get clinical Provider by Patietn Id
export interface PatientClinicalProvider {
  FirstName?: string
  City?: string
  State?: string
  StreetAddress?: string
  Zip?: string
  Phone?: string
  email?: string
  ProviderId?: string
  Title?: string
  MiddleName?: string
  LastName?: string
}

// Get Care Team By PatientId
export interface CareTeam {
  FirstName?: string
  MiddleName?: string
  LastName?: string
}

// ProblemDxData and Care Plane
export interface ProblemDX {
  Description?: string
  Code?: string
  StartDate?: string
}

// Allergies By PatientId

export interface Allergies {
  C_id?: string
  patient_id?: string
  StartDate?: string
  C_allergen_type?: string
  name?: string
  severity_level?: string
  C_onset_at?: string
  note?: string
  allergie_id?: string
  reaction?: string
}

// VitalStats by Patient Id
export interface VitalStats {
  PatientId?: string
  EncounterId?: string
  VitalStatID?: string
  Height?: string
  Weight?: string
  Bmi?: string
  Temperature?: string
  BloodPressure?: string
  HeartRate?: string
  BloodType?:string
}

export interface Medications {
  patient_id?: string
  drug_name?: string
  rxcui?: string
  ndc?: string
  dosespot_medication_id?: string
  manual_dose_form?: string
  units?: string
  quantity?: string
  refills?: string
  days_supply?:string
  start_at?: string
  stop_at?: string
  reason_code?:string
  reason_description?: string
  notes?: string
  cqm_status?:string
  display_name?: string

}
export interface MedicationsAllergies {
  AlergieId?: string
  PatientId?: string
  AllergenType?: string
  AlergieName?: string
  SeverityLevel?: string
  OnSetAt?: string
  StartAt?: string
  dtStartAt?: Date;
  EndAt?: string
  Note?: string
  Reaction?:string
}
export interface LabtestResult {
  Num?: string
  Code?: string
  Test?: string
  TestReportedAt?:string
  ProcedureType?:string

}
