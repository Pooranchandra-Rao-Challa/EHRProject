
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
  mu2: MU2Info = new MU2Info;
  referralInfo: ReferralInfo = new ReferralInfo;
  Diagnoses: EncounterDiagnosis[] = [];
  RecommendedProcedures: ProceduresInfo = new ProceduresInfo;
  CompletedProcedures: ProceduresInfo = new ProceduresInfo;
}

export class ReferralInfo{
  Reason?: string
  ReferralFrom?: string;
  ReferralTo?: string;
  ReferredFrom: boolean = false;
  ReferredTo: boolean = false;
  CongnitiveStatu?: string;
  FunctionalStatu?: string;
}

export class EncounterDiagnosis{
  Code?: string;
  CodeSystem?: string;
  Description?: string;
  PatientEdn?: string = "MedLine Plus";
  PrimaryDx?: boolean = false;
  CanDelete?: boolean = false;
  /**<a href="http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.96&amp;mainSearchCriteria.v.c=223788007" target="_blank">Medline Plus</a> */
}

export class ProceduresInfo{
  Code?: string;
  CodeSystem?: string;
  Description?: string;
  Tooth?: number;
  Surface?: string;
}
