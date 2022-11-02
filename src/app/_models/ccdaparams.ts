export class CCDAParams {
  PatientId?: string;
  ClinicalSummary?: string = 'Clinical Summary';
  PatientInformation?: CCDAInformation[] = [
    { Name: 'Patient Information', Value: true },
    { Name: 'Identification & Demographics', Value: true }
  ];
  EncounterDetails?: CCDAInformation[] = [
    { Name: 'Basic Information', Value: true },
    { Name: 'Reason for visit', Value: true },
    { Name: 'Clinical Instructions', Value: true },
    { Name: 'Medication Administered', Value: true },
    { Name: 'Immunizations Administered', Value: true },
    { Name: 'Diagnostic Tests Pending', Value: true },
    { Name: 'Future Scheduled Tests', Value: true },
    { Name: 'Referrals to Other Providers', Value: true },
    { Name: 'Recommended Patient Decision Aids', Value: true }
  ];
  PatientChartInformation?: CCDAInformation[] = [
    { Name: 'Smoking Status', Value: true },
    { Name: 'Problems (Dx)', Value: true },
    { Name: 'Medications (Rx)', Value: true },
    { Name: 'Medication Allergies', Value: true },
    { Name: 'Laboratory Tests & Results', Value: true },
    { Name: 'Vital Stats', Value: true },
    { Name: 'Care Plan - Goals & Instructions', Value: true },
    { Name: 'Procedures', Value: true },
    { Name: 'Care Team Members', Value: true }
  ];
  TransitionofCareDetails?: CCDAInformation[] = [
    { Name: 'Encounter Diagnosis', Value: true },
    { Name: 'Immunizations', Value: true },
    { Name: 'Cognitive Status', Value: true },
    { Name: 'Functional Status', Value: true },
    { Name: 'Reason for Referral', Value: true },
    { Name: 'Discharge Instructions', Value: true }
  ];
}

export class CCDAInformation {
  Name?: string;
  Value?: boolean;
}

export class CCDAData {
  PatientInformation?: CCDAIdentification;
  ContactInformation?: CCDAContactInformation;
  BasicInformation?: CCDABasicInformation;

  EncounterDiagnoses?: string[] = [];
  Immunizations?: string[] = [];
  CognitiveStatus?: string[] = [];
  FunctionalStatus?: string[] = [];
  ReasonforReferral?: string[] = [];
  DischargeInstructions?: string[] = [];


  ReasonforVisit?: string[] = [];
  ClinicalInstructions?: string[] = [];
  MedicationAdmin?: string[] = [];
  ImmunizationAdmin?: string[] = [];
  DiagTestPending?: string[] = [];
  FutureTests?: string[] = [];
  ReferralsTo?: string[] = [];
  RecommendedAID?: string[] = [];


  SmokingStatus?: string[] = [];
  ProblemsDX?: string[] = [];
  Medications?: string[] = [];
  MedicationAllergies?: string[] = [];
  Laboratory?: string[] = [];
  CarePlan?: string[] = [];
  Procedures?: string[] = [];

  CareTeamMembers?: string[] = [];
}

export class CCDAIdentification {
  ID?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  Birth?: Date;
  Age?: number;
  Gender?: string;
  Active?: boolean;
}

export class CCDAContactInformation {
  Race?: string;
  Ethnicity?: string;
  PreferredLanguage?: string;
}

export class CCDABasicInformation {
  Provider?: string;
  PracticeName?: string;
  PracticeAddress?: string;
  PracticePhone?: string;
}
