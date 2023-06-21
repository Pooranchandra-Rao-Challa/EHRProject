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
  PatientId?: string;
  OngoingProblems?: string;
  NutritionHistory?: string;
  MajorEvents?: string;
  PerventiveCare?: string;
  FamilyMedicalHistories?: FamilyMedicalHistory[] = [];
  strFamilyMedicalHistories?: string;
}

export class FamilyMedicalHistory {
  FamilyHealthHistoryId?: string;
  PastMedicalHistoryId?: string;
  FirstName?: string;
  LastName?: string;
  Relationship?: string;
  BirthAt?: string;
  Deceased?: boolean;
  Notes?: string;
  Age?: number = 0;
  CodeSystem?: string;
  Diagnoses?: Diagnosis[] = [];
  strDiagnoses?: string;
  Index?: number;
}

export class Allergy {
  AllergyId?: string;
  PatientId?: string;
  ProviderId?: string;
  AllergenType?: string;
  AlergieName?: string;
  SeverityLevel?: string;
  OnSetAt?: string;
  StartAt?: string;
  EndAt?: string;
  Note?: string;
  Reaction?: string = null;
  AllergenName?: string = null;
  AllergenId?: string;
}

export enum PatientChart {
  Diagnoses,
  AdvancedDirectives,
  SmokingStatus,
  TobaccoUse,
  PastMedicalHistory,
  FamilyMedicalHistory,
  Allergies,
  Medications,
  Discontinue,
  Interventions,
  Encounters,
  CQMNotPerforemd,
  Appointment,
  PatientRelationship
}

export class ChartInfo {
  AdvancedDirectives?: AdvancedDirective[] = []
  Diagnoses?: EncounterDiagnosis[] = []
  Alergies?: Allergy[] = []
  PastMedicalHistories?: PastMedicalHistory[] = []
  Immunizations?: Immunization[] = []
  Encounters?: EncounterInfo[] = []
  Appointments?: NewAppointment[] = []
  Medications?: Medication[] = []
  SmokingStatuses?: SmokingStatus[] = []
  TobaccoUseInterventions?: TobaccoUseScreening[] = []
  TobaccoUseScreenings?: TobaccoUseIntervention[] = []
  Interventions?: Intervention[] = []
  TobaccoUse?: TobaccoUse[] =[];
}

export class Immunization {
  ImmunizationId?: string;
  PatientId?: string;
  AdministeredAt?: string;
  AdministeredDate?: Date;
  ExpirationAt?: Date;
  strExpirationAt?: string;
  Notes?: string;
  ImmType?: string = 'administered';
  Code?: string = '';
  Description?: string = '';
  RefusedAt?: Date;
  ReasonRefused?: string;
  Comments?: string;
  FacilityId?: string;
  UpdatedAt?: Date;
  CreatedAt?: Date;
  Manufacturer?: string;
  Lot?: string;
  Quantity?: string;
  Dose?: string;
  Unit?: string;
  Route?: string;
  BodySite?: string;
  FundingSource?: string;
  RegistryNotification?: string;
  VFCClass?: string;
  AdministeredById?: string;
  OrderedById?: string;
  AdministeredFacilityId?: string;
  Text?: string;
  RefusedCode?: string;
  SourceOfInformation?: string;
  CQMExcelData?: boolean;
  DateStopped?: Date;
  ReasonCodeSystem?: string;
  CQMCodeSystem?: string;
  ReasonCode?: string;
  LocationId?: string;
  AdministeredTime?: string;
}

export class Medication {
  MedicationId?: string;
  CodeSystem?: string = 'RxNorm';
  PatientId?: string;
  ProviderId?: string;
  DrugName?: string;
  DrugForm?: string;
  DisplayName?: string;
  Rxcui?: string;
  NDC?: string;
  DoesspotMedicationId?: string;
  DrugStrength?: string;
  Dose?: string;
  DoseUnits?: string;
  DoseOther?: string;
  DoseRoute?: string;
  Quantity?: number;
  QuantityUnits?: string;
  Route?: string;
  Action?: string;
  DoseTiming?: string;
  Refills?: string;
  DaysSupply?: string;
  StartAt?: Date;
  StopAt?: Date = null;
  strStartAt?: string;
  strStopAt?: string;
  ReasonCode?: string;
  ReasonDescription?: string;
  Notes?: string;
  CQMStatus?: string;
  Status?: string;
  IsElectronicPrescription?: boolean;
  PrescriptionStatus?: string;
  IsPrescription?: boolean;
  MedicationRcopiaId?: string;
  HasPrescriptions?: string;
}

export class TobaccoUseScreening {
  TobaccoUseId?: string;
  PatientId?: string;
  ScreeningId?: string;
  ScreeningType?: string;
  ScreeningDate?: Date;
  strScreeningDate?: string;
  ScreeningDescription?: string;
  ScreeningCode?: string;
  ScreeningStatus?: string;
  ScreeningPerformed?: string;
  CQMReason?: string;
}

export class TobaccoUseIntervention {
  TobaccoUseId?: string;
  InterventionId?: string;
  PatientId?: string;
  InterventionDate?: Date;
  strInterventionDate?: string;
  InterventionType?: string;
  InterventionCode?: string;
  InterventionDescription?: string;
  Reason?: string;
	ReasonCode?: string;
	ReasonDescription?: string;
  NotPerformed?: boolean;
}

export class TobaccoUse {
  TobaccoUseId?: string;
  PatientId?: string;
  strScreenings?:string;
  strInterventions?: string;
  Screenings?: TobaccoUseScreening[]
  Interventions?: TobaccoUseIntervention[]
  TotalRecords?: number;

}

export class Diagnosis {
  DiagnosisId?: string;
  PatientId?: string;
  ProviderId?: string;
  //DFamilyHealthHistoryId?: string;
  CodeSystem?: string;
  Code?: string;
  Description?: string;
  StartAt?: Date;
  strStartAt?: string;
  StopAt?: string;
  Note?: string;
  Acute?: boolean = true;
  Terminal?: boolean = false;
  Referral?: boolean = false;
  Primary?: boolean = false;
  //IsEditable?: boolean = true;
}

export class Prescription {
  PrescriptionId?: string;
  PatientId?: string;
  DrugName?: string;
  BrandName?: string;
  RxcuiId?: string;
  NDCId?: string;
  DrugStrength?: string;
  QuantityUnits?: string;
  Quantity?: number;
  Refills?: Number;
  Duration?: Number;
  CompletedAt?: Date;
  StopAt?: Date;
  PatientNotes?: string;
  Status?: string;
  Action?: string;
  Dose?: string;
  DoseUnits?: string;
  DoseRoute?: string;
  DoseOther?: string;
  DoseTiming?: string;
  Route?: string;
  BrandType?: string;
  IsElectronicPrescription?: boolean;
  PrescriptionRcopiaId?: string;
}

export class Intervention {
  InterventionId?: string;
  PatientId?: string;
  StartDate?: Date;
  EndDate?: Date;
  strStartDate?: string;
  strEndDate?: string;
  InterventionType?: string;
  Code?: string;
  Description?: string;
  CodeSystem?: string;
  Note?: string;
  ReasonValueSetOID?: string;
  CQMStatus?: string;
  LocationId?: string;
  ProviderName?: string;
  CQMReason?: string;
}

export interface Vaccine {
  VaccineId?: string;
  Code?: string;
  Description?: string;
}

export interface AllergyNames {
  AllergyId?: string;
  AllergyName?: string;
}

import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
export class Labandimaging {
  CurrentPatient?: PracticeProviders;
  LabProcedureId?: string;
  PatientId?: string;
  ClinicId?: string;
  ProviderId?: string;
  Signed?: string;
  LocationId?: string;
  OrderId?: string;
  OrderType?: string;
  LabName?: string;
  Status?: string;
  ScheduleDate?: string;
  OrderingPhyscian?: string;
  OrderingFacility?: string;
  LabandImageStatus?: string;
  ReceivedDate?: string;
  Notes?: string;
  Tests: Test[] = [];
  View?: string;
}

export class Test {
  Code?: string;
  Test?: string;
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

// export enum Allergens {
//   diphenylethylene = '1,1-diphenylethylene',
//   dioleoyl = '1,2-dioleoyl-sn-glycero-3-phosphocholine',
//   methoxynaphthoquinone = '2-methoxynaphthoquinone'
// }

// export enum AllergyReaction {
//   Anaphylaxis = 'Anaphylaxis',
//   Bloating = 'Bloating/gas',
//   ChestPain = 'Chest Pain',
//   Conjunctivitis = 'Conjunctivitis',
//   Cough = 'Cough',
//   Diarrhea = 'Diarrhea',
//   DifficultySpeaking = 'Difficulty speaking or swallowing',
//   DizzinessLightheadedness = 'Dizziness/Lightheadedness',
//   Facialswelling = 'Facial swelling',
//   Hives = 'Hives',
//   IrregularHeartbeat = 'Irregular Heartbeat',
//   Itchiness = 'Itchiness',
//   Lossofconsciousness = 'Loss of consciousness',
//   Nausea = 'Nausea Other',
//   PainCramping = 'Pain/cramping',
//   Patchyswellingskin = 'Patchy swelling-skin',
//   Rashgeneralized = 'Rash-generalized',
//   Rashlocalized = 'Rash-localized',
//   RespiratoryDistress = 'Respiratory Distress',
//   Runnynose = 'Runny nose',
//   Shortnessofbreath = 'Shortness of breath',
//   Tachycardia = 'Tachycardia',
//   Tongueswelling = 'Tongue swelling',
//   Unknown = 'Unknown',
//   Vomiting = 'Vomiting',
//   Wheezing = 'Wheezing'
// }

export enum DiagnosisDpCodes {   // Dp - dropdown
  SNOMED = 'SNOMED',
  ICD10 = 'ICD10'
}

// Immunizations
export class GlobalConstants {
  public slice;

  public static AllergyReactions = [
    { ReactionName: 'Anaphylaxis' },
    { ReactionName: 'Bloating/gas' },
    { ReactionName: 'Bradycardia' },
    { ReactionName: 'Chest Pain' },
    { ReactionName: 'Conjunctivitis' },
    { ReactionName: 'Cough' },
    { ReactionName: 'Diarrhea' },
    { ReactionName: 'Difficulty speaking or swallowing' },
    { ReactionName: 'Dizziness/Lightheadedness' },
    { ReactionName: 'Facial swelling' },
    { ReactionName: 'Hives' },
    { ReactionName: 'Irregular Heartbeat' },
    { ReactionName: 'Itchiness' },
    { ReactionName: 'Loss of consciousness' },
    { ReactionName: 'Nausea Other' },
    { ReactionName: 'Pain/cramping' },
    { ReactionName: 'Patchy swelling-skin' },
    { ReactionName: 'Rash-generalized' },
    { ReactionName: 'Rash-localized' },
    { ReactionName: 'Respiratory Distress' },
    { ReactionName: 'Runny nose' },
    { ReactionName: 'Shortness of breath' },
    { ReactionName: 'Tachycardia' },
    { ReactionName: 'Tongue swelling' },
    { ReactionName: 'Unknown' },
    { ReactionName: 'Vomiting' },
    { ReactionName: 'Wheezing' },
  ]

  public static Medication_Names = [
    { DrugName: 'Medication 1' },
    { DrugName: 'Medication 2' },
    { DrugName: 'Medication 3' },
  ];

  public static Units: string[] = ['EL U/0.5 ML', 'EL U/ML', 'GM', 'GM/100 ML', 'GM/10 ML', 'GM/200 ML', 'GM/20 ML',
    'GM/400 ML', 'GM/500 ML', 'GM/50 ML', 'LF-MCG/0.5', 'LF/O.5 ML', 'LFU', 'LFU/0.5 ML', 'MCG', 'MCG/0.5 ML', 'MCG/ML',
    'MCG/STRAIN', 'MG/0.5 ML', 'MG/ML', 'ML', 'PFU/0.5 ML', 'UNIT', 'UNIT/0.5 ML', 'UNIT/1.2 ML', 'UNIT/1.3 ML',
    'UNIT/13 ML', 'UNIT/2.2 ML', 'UNIT/2 ML', 'UNIT/ 4.4 ML', 'UNIT/ML', 'UNIT/0.65 ML'];

  public static Routes: string[] = ['Apply externally', 'Buccal', 'Dental', 'Endotrachial tube', 'Epidural',
    'Gastrostomy tub', 'GU irrigant', 'Immerse (soak) body part', 'Inhalation', 'Intra-arterial', 'Intrabursal',
    'Intracardiac', 'Intracervical(uterus)', 'Intradermal', 'Intrahepatic artery', 'Intramuscular', 'Intranasal',
    'Intraocular', 'Intraperitoneal', 'Intrasynovial', 'Intrathecal', 'Intrauterine', 'Intravenous', 'Mouth/throat',
    'Mucous membrane', 'Nasal', 'Nasal prongs', 'Nasogastric', 'Nastrachial tube', 'Ophthalmic', 'Oral',
    'Other/miscellaneous', 'Otic', 'Perfusion', 'Rebreather mask', 'Rectal', 'Soaked dressing', 'Subcutaneous',
    'Sublingual', 'Topical', 'Tracheostomy', 'Transdermal', 'Translingual', 'Urethral', 'Vaginal', 'Ventimask'];

  public static BodySites: string[] = ['Bilateral Ears', 'Bilateral Eyes', 'Bilateral Nares', 'Bladder', 'Buttock',
    'Chest tube', 'Left Antecubital Fossa', 'Left Anterior Chest', 'Left Arm', 'Left Buttock', 'Left Deltoid',
    'Left Ear', 'Left External Jugular', 'Left Eye', 'Left Foot', 'Left Forearm', 'Left Gluteus',
    'Left Gluteus Medius', 'Left Hand', 'Left Internal Jugular', 'Left Lower Abdomen', 'Left Lower Forearm',
    'Left Mid-Forearm', 'Left Naris', 'Left Posterior Chest', 'Left Quadriceps', 'Left Subclavian', 'Left Thigh',
    'Left Upper Abdomen', 'Left Upper Arm', 'Left Upper Forearm', 'Left Vastus Lateralis', 'Left Ventragluteal',
    'Mouth', 'Nebulized', 'Perianal', 'Perineal', 'Right Antecubital Fossa', 'Right Anterior Chest', 'Right Arm',
    'Right Buttock', 'Right Deltoid', 'Right Ear', 'Right External Jugular', 'Right Eye', 'Right Foot',
    'Right Forearm', 'Right Gluteus', 'Right Gluteus Medius', 'Right Hand', 'Right Internal Jugular',
    'Right Lower Abdomen', 'Right Lower Forearm', 'Right Mid-Forearm', 'Right Naris', 'Right Posterior Chest',
    'Right Quadriceps', 'Right Subclavian', 'Right Thigh', 'Right Upper Abdomen', 'Right Upper Arm',
    'Right Upper Forearm', 'Right Vastus Lateralis', 'Right Ventragluteal'];

  public static FundingSources: string[] = ['Federal funds', 'Military funds', 'Other source', 'Private funds',
    'State funds', 'Tribal funds', 'Unspecified'];

  public static RegistryNotifications: string[] = ['No reminder/recall', 'Only recall to provider, no reminder',
    'Only reminder to provider, no recall', 'Recall only - any method', 'Recall only - no calls', 'Recall to provider',
    'Reminder only - any method', 'Reminder only - no calls', 'Reminder to provider', 'Reminder/recall - any method',
    'Reminder/recall - no calls', 'Reminder/recall to provider'];

  public static VfcClasses: string[] = ['Deprecated [Not VFC eligible-underinsured]',
    'Deprecated [VFC eligible-State specific eligibility (e.g. SCHIP plan)]', 'Local-specific eligibility',
    'Not VFC eligible', 'VFC eligible - American Indian/Alaskan Native',
    'VFC eligible - Federally Qualified Health Center Patient (under-insured)',
    'VFC eligible - Medicaid/Medicaid Managed Care', 'VFC eligible - Uninsured'];

  public static Manufacturers: string[] = ['Acambis', 'Barr Labs Inc.', 'bioCSL', 'Emergent BioSolutions',
    'GlaxoSmithKline', 'Massachusetts Biological Labs', 'Medimmune', 'Merck', 'Novartis', 'PaxVax', 'Protein Sciences',
    'sanofi', 'Valneva', 'Wyeth / Pfizer'];

  public static SourceOfInfo: string[] = ['Administered by another Provider', 'Birth Certification',
    'Immunization Registry', "Parent's Recall", "Parent's Written Record", 'Patient', 'Public Agency',
    'School Record', 'Source Unspecified'];

  public static ReasonRefuseds: string[] = ['Immunity', 'Medical Precaution', 'Other', 'Out of Stock',
    'Parental Decision', 'Patient Decision', 'Patient Objection', 'Philosophical Objection', 'Religious Exemption',
    'Religious Objection', 'Vaccine Efficacy Concerns', 'Vaccine Safety Concerns'];

  public static DrugReasonRefusedsCode: string[] = ["107724000 - Patient transfer (procedure)", "182856006",
    "182857002 - Drug not available - out of stock (finding)", "185335007 - Appointment canceled by hospital (finding)",
    "224194003 - Not entitled to benefits (finding)", "224198000 - Delay in receiving benefits (finding)",
    "242990004 - Drug not available for administration (event)", "309017000 - Referred to doctor (finding)",
    "309846006 - Treatment not available (situation)", "419808006 - Finding related to health insurance issues (finding)",
    "424553001 - Uninsured medical expenses (finding)", "105480006 - Refusal of treatment by patient (situation)",
    "160932005 - Financial problem (finding)", "160934006 - Financial circumstances change (finding)",
    "182890002 - Patient requests alternative treatment (finding)", "182895007 - Drug declined by patient (situation)",
    "182897004 - Drug declined by patient - side effects (situation)",
    "182900006 - Drug declined by patient - patient beliefs (situation)",
    "182902003 - Drug declined by patient - cannot pay script (situation)",
    "183944003 - Procedure refused (situation)", "183945002 - Procedure refused for religious reason (situation)",
    "184081006 - Patient has moved away (finding)", "185479006 - Patient dissatisfied with result (finding)",
    "185481008 - Dissatisfied with doctor (finding)", "224187001 - Variable income (finding)",
    "225928004 - Patient self-discharge against medical advice (procedure)", "258147002",
    "266710000 - Drugs not taken/completed (situation)", "266966009 - Family illness (situation)",
    "275694009 - Patient defaulted from follow-up (finding)", "275936005 - Patient noncompliance - general (situation)",
    "281399006 - Did not attend (finding)", "310343007 - Further opinion sought (finding)",
    "373787003 - Treatment delay - patient choice (finding)", "385648002 - Rejected by recipient (qualifier value)",
    "406149000 - Medication refused (situation)", "408367005 - Patient forgets to take medication (finding)",
    "413310006 - Patient non-compliant - refused access to services (situation)",
    "413311005 - Patient non-compliant - refused intervention / support (situation)",
    "413312003 - Patient non-compliant - refused service (situation)",
    "416432009 - Procedure not wanted (situation)", "423656007 - Income insufficient to buy necessities (finding)",
    "424739004 - Income sufficient to buy only necessities (finding)", "443390004 - Refused (qualifier value)",
    "183932001 - Procedure contraindicated (situation)", "183964008 - Treatment not indicated (situation)",
    "183966005 - Drug treatment not indicated (situation)", "216952002 - Failure in dosage (event)",
    "266721009 - Absent response to treatment (situation)",
    "269191009 - Late effect of medical and surgical care complication (disorder)",
    "274512008 - Drug therapy discontinued (situation)", "31438003 - Drug resistance (disorder)",
    "35688006 - Complication of medical care (disorder)", "371133007 - Treatment modification (procedure)",
    "397745006 - Medical contraindication (finding)", "407563006 - Treatment not tolerated (situation)",
    "410534003 - Not indicated (qualifier value)", "410536001 - Contraindicated (qualifier value)",
    "416098002 - Drug allergy (disorder)", "416406003 - Procedure discontinued (situation)",
    "428119001 - Procedure not indicated (situation)", "445528004 - Treatment changed (situation)",
    "59037007 - Drug intolerance (disorder)", "62014003 - Adverse reaction caused by drug (disorder)",
    "79899007 - Drug interaction (finding)"];

  public static PROCEDURE_REASON_CODES = [
    { 'Code': '105480006', 'Description': 'Refusal of treatment by patient (situation)', 'CodeDescription': '105480006 - Refusal of treatment by patient (situation)' },
    { 'Code': '183944003', 'Description': 'Procedure refused (situation)', 'CodeDescription': '183944003 - Procedure refused (situation)' },
    { 'Code': '183945002', 'Description': 'Procedure refused for religious reason (situation)', 'CodeDescription': '183945002 - Procedure refused for religious reason (situation)' },
    { 'Code': '413310006', 'Description': 'Patient non-compliant - refused access to services (situation)', 'CodeDescription': '413310006 - Patient non-compliant - refused access to services (situation)' },
    { 'Code': '413311005', 'Description': 'Patient non-compliant - refused intervention / support (situation)', 'CodeDescription': '413311005 - Patient non-compliant - refused intervention / support (situation)' },
    { 'Code': '413312003', 'Description': 'Patient non-compliant - refused service (situation)', 'CodeDescription': '413312003 - Patient non-compliant - refused service (situation)' },
    { 'Code': '183932001', 'Description': 'Procedure contraindicated (situation)', 'CodeDescription': '183932001 - Procedure contraindicated (situation)' },
    { 'Code': '397745006', 'Description': 'Medical contraindication (finding)', 'CodeDescription': '397745006 - Medical contraindication (finding)' },
    { 'Code': '407563006', 'Description': 'Treatment not tolerated (situation)', 'CodeDescription': '407563006 - Treatment not tolerated (situation)' },
    { 'Code': '428119001', 'Description': 'Procedure not indicated (situation)', 'CodeDescription': '428119001 - Procedure not indicated (situation)' },
    { 'Code': '59037007', 'Description': 'Drug intolerance', 'CodeDescription': '59037007 - Drug intolerance' },
    { 'Code': '62014003', 'Description': 'Adverse reaction to drug', 'CodeDescription': '62014003 - Adverse reaction to drug' }
  ];

  public static INTERVENTION_TYPES = [
    { 'InterventionType': 'BMI-Above Normal Weight' },
    { 'InterventionType': 'BMI-Below Normal Weight' },
    { 'InterventionType': 'BMI-Referral to Alternate Provider/Care Setting' },
    { 'InterventionType': 'Tobacco Cessation Counseling' },
    { 'InterventionType': 'Weight-Counseling for Nutrition' },
    { 'InterventionType': 'Weight-Counseling for Physical Activity' },
    { 'InterventionType': 'Controlling BP-Evidence of ESRD, dialysis, or renal transplant' }
  ];

  public static RELATIONSHIP = [
    { 'Id': '1', 'Relationship': 'Parent-Mother' },
    { 'Id': '2', 'Relationship': 'Parent-Father' },
    { 'Id': '3', 'Relationship': 'Sibling-Sister' },
    { 'Id': '4', 'Relationship': 'Sibling-Brother' },
    { 'Id': '5', 'Relationship': 'Child-Daughter' },
    { 'Id': '6', 'Relationship': 'Child-Son' },
    { 'Id': '8', 'Relationship': 'Grandparent-Grandmother' },
    { 'Id': '9', 'Relationship': 'Grandparent-Grandfather' },
    { 'Id': '10', 'Relationship': 'Great Grandparent' },
    { 'Id': '11', 'Relationship': 'Uncle' },
    { 'Id': '12', 'Relationship': 'Aunt' },
    { 'Id': '13', 'Relationship': 'Cousin' },
    { 'Id': '14', 'Relationship': 'Other' },
    { 'Id': '15', 'Relationship': 'UnKnown' },
  ]

  public static MedPickList = {
    "Action": ["Administer", "Drink", "Inject", "Shampoo with", "Apply", "Hold", "Insert", "Spray", "Chew", "Implant", "Instill", "Take", "Dissolve", "Infuse", "Place", "Use", "Douche with", "Inhale", "Rinse with"],
    "DoseTiming": ["single dose", "once a day", "twice a day", "three times a day", "four times a day", "five times a day", "six times a day", "every morning", "every evening", "every night", "at bedtime", "every other day", "every three days", "every hour", "every two hours", "every two hours while awake", "every three hours", "every three hours while awake", "every four hours", "every four hours while awake", "every six hours", "every six to eight hours", "every eight hours", "every twelve hours", "every 24 hours", "every 48 hours", "every 72 hours", "every three to four hours", "every three to four hours while awake", "every four to six hours", "every four to six hours while awake", "every eight to twelve hours", "once a week", "twice a week", "three times a week", "once every two weeks", "every two weeks", "every four weeks", "once a month", "every three months", "as directed"],
    "DoseOther": ["as needed", "with meals", "one hour before meals", "as needed for pain", "between meals", "with a glass of water", "as directed", "after meals", "before exercise"],
    "DoseUnit": ["a small amount", "drop", "mcg", "scoop", "ampul", "dropperful", "meq", "sheet", "applicator", "each", "mg", "spacer", "applicatorful", "enema", "ml", "spansule", "as directed", "film", "needle", "sponge", "bag", "foam", "ounce", "spray", "bandage", "gelcap", "pack", "stick", "bead", "gram", "packet", "strip", "bottle", "gum", "pad", "suppository", "box", "implant", "pastille", "swab", "caplet", "inch", "patch", "syringe", "capsule", "infusion set", "pen", "tablespoon", "cartridge", "insert", "pen injector", "tablet", "catheter", "kit", "pen needle", "teaspoon", "clicks", "lancet", "perle", "troche", "condoms", "liberally", "piece", "tube", "device", "lollipop", "pledgette", "unit", "diaphragm", "lozenge", "puff", "vial", "douche", "mask", "pump"],
    "DaysSupply": ["1 day", "2 days", "3 days", "4 days", "5 days", "6 days", "7 days", "9 days", "10 days", "12 days", "14 days", "15 days", "20 days", "21 days", "22 days", "25 days", "28 days", "30 days", "31 days", "34 days", "35 days", "45 days", "56 days", "60 days", "75 days", "84 days", "90 days", "91 days", "100 days", "102 days", "112 days", "120 days", "180 days"],
    "QuntityUnit": ["adhesive patch, medicated", "gum", "pad", "sponge", "applicator", "implant", "pads", "sponges", "blister", "insert", "pastille", "stick", "blisters", "inserts", "patch", "strip", "cap", "kit", "patch 24 hr", "strips", "caplet", "kits", "patch 72 hr", "suppositories", "capsule", "lancet", "patch daily, sequential", "suppository", "capsules", "lollipop", "patch semiweekly", "swab", "condom", "lozenge", "patch weekly", "syringe", "condoms", "mask", "patches", "syringes", "diaphragm", "milliliter", "pen needle", "tab", "each", "milliliters", "pen needles", "tablet", "film", "ml", "perle", "tablets", "film strips", "needle", "pill", "transdermal patch", "films", "not specified", "pills", "troche", "g", "package", "pledgette", "troches", "gelcap", "packages", "ring", "unspecified", "gram", "packet", "rings", "wafer", "grams", "packets", "spansule", "wafers"],
    "Route": ["a small amount", "into both eyes", "intradermally", "to skin", "as directed", "into both nostrils", "intramuscularly", "to teeth", "as enema", "into catheter", "intranasally", "topical", "by irrigation", "into each nostril", "intraperitoneally", "under skin", "by mouth", "into left ear", "intrathecally", "under tongue", "by perfusion", "into left eye", "intravenously", "using inhaler", "dissolved in water", "into mouth", "IVPB", "using nebulizer", "epidurally", "into one nostril", "liberally", "vaginally", "in both eyes", "into rectum", "on tongue", "via applicator", "in ear", "into right ear", "patch", "via device", "in eye", "into right eye", "rectally", "via g-j tube", "in left eye", "into urethra", "subcutaneously", "via g-tube", "in mouth", "into uterus", "sublingually", "via intrathecal pump", "in right eye", "into uterus as directed", "to affected area", "via j-tube", "into affected ear", "into vagina", "to face", "via meter", "into affected eye", "intraarterially", "to inside of mouth (buccal)", "via nebulizer", "into bladder", "intraarticularly", "to mouth", "into both ears", "intracavernosally", "to scalp"],
    "Dose": ["1", "2", "3", "4", "5", "10", "15", "1/4", "1/2", "3/4", "1 1/4", "1 1/2", "2 1/2"]
  }

  public static Action = GlobalConstants.MedPickList.Action
  public static DoseTiming = GlobalConstants.MedPickList.DoseTiming
  public static DoseOther = GlobalConstants.MedPickList.DoseOther
  public static DoseUnit = GlobalConstants.MedPickList.DoseUnit
  public static DaysSupply = GlobalConstants.MedPickList.DaysSupply
  public static QuntityUnit = GlobalConstants.MedPickList.QuntityUnit
  public static Route = GlobalConstants.MedPickList.Route
  public static Dose = GlobalConstants.MedPickList.Dose
}

// export const PROCEDURE_REASON_CODES = [
//   { 'Code': '105480006', 'Description': 'Refusal of treatment by patient (situation)' },
//   { 'Code': '183944003', 'Description': 'Procedure refused (situation)' },
//   { 'Code': '183945002', 'Description': 'Procedure refused for religious reason (situation)' },
//   { 'Code': '413310006', 'Description': 'Patient non-compliant - refused access to services (situation)' },
//   { 'Code': '413311005', 'Description': 'Patient non-compliant - refused intervention / support (situation)' },
//   { 'Code': '413312003', 'Description': 'Patient non-compliant - refused service (situation)' },
//   { 'Code': '183932001', 'Description': 'Procedure contraindicated (situation)' },
//   { 'Code': '397745006', 'Description': 'Medical contraindication (finding)' },
//   { 'Code': '407563006', 'Description': 'Treatment not tolerated (situation)' },
//   { 'Code': '428119001', 'Description': 'Procedure not indicated (situation)' },
//   { 'Code': '59037007', 'Description': 'Drug intolerance' },
//   { 'Code': '62014003', 'Description': 'Adverse reaction to drug' }
// ];

export const MEDICATION_NAMES = [
  { 'Name': 'Medication 1' },
  { 'Name': 'Medication 2' },
  { 'Name': 'Medication 3' },
];

export class TobaccoUseConstants {
  // [x: string]: any;

  public slice;

  public map;

  public static SCREENING_PERFORMED = [
    { 'Performed': 'Tobacco use CPHS' },
    { 'Performed': 'Have you used tobacco in the last 30 days [SAMHSA]' },
    { 'Performed': 'Have you used smokeless tobacco product in the last 30 days [SAMHSA]' },
    { 'Performed': 'Tobacco smoking status NHIS' }
  ];

  public static SCREENING_TOBACCO_STATUS = [
    { Code: '160603005', 'Description': 'Light cigarette smoker (1-9 cigs/day) (finding)' },
    { 'Code': '160604004', 'Description': 'Moderate cigarette smoker (10-19 cigs/day) (finding)' },
    { 'Code': '160605003', 'Description': 'Heavy cigarette smoker (20-39 cigs/day) (finding)' },
    { 'Code': '160606002', 'Description': 'Very heavy cigarette smoker (40+ cigs/day) (finding)' },
    { 'Code': '160619003', 'Description': 'Rolls own cigarettes (finding)' },
    { 'Code': '228494002', 'Description': 'Snuff user (finding)' },
    { 'Code': '228504007', 'Description': 'User of moist powdered tobacco (finding)' },
    { 'Code': '228514003', 'Description': 'Chews plug tobacco (finding)' },
    { 'Code': '228515002', 'Description': 'Chews twist tobacco (finding)' },
    { 'Code': '228516001', 'Description': 'Chews loose leaf tobacco (finding)' },
    { 'Code': '228517005', 'Description': 'Chews fine cut tobacco (finding)' },
    { 'Code': '228518000', 'Description': 'Chews products containing tobacco (finding)' },
    { 'Code': '230059006', 'Description': 'Occasional cigarette smoker (finding)' },
    { 'Code': '230060001', 'Description': 'Light cigarette smoker (finding)' },
    { 'Code': '230062009', 'Description': 'Moderate cigarette smoker (finding)' },
    { 'Code': '230063004', 'Description': 'Heavy cigarette smoker (finding)' },
    { 'Code': '230064005', 'Description': 'Very heavy cigarette smoker (finding)' },
    { 'Code': '230065006', 'Description': 'Chain smoker (finding)' },
    { 'Code': '266920004', 'Description': 'Trivial cigarette smoker (less than one cigarette/day) (finding)' },
    { 'Code': '428041000124106', 'Description': 'Occasional tobacco smoker (finding)' },
    { 'Code': '428061000124105', 'Description': 'Light tobacco smoker (finding)' },
    { 'Code': '428071000124103', 'Description': 'Heavy tobacco smoker (finding)' },
    { 'Code': '449868002', 'Description': 'Smokes tobacco daily (finding)' },
    { 'Code': '59978006', 'Description': 'Cigar smoker (finding)' },
    { 'Code': '65568007', 'Description': 'Cigarette smoker (finding)' },
    { 'Code': '77176002', 'Description': 'Smoker (finding)' },
    { 'Code': '81703003', 'Description': 'Chews tobacco (finding)' },
    { 'Code': '82302008', 'Description': 'Pipe smoker (finding)' },
    { 'Code': '105539002', 'Description': 'Non-smoker for personal reasons (finding)' },
    { 'Code': '105540000', 'Description': 'Non-smoker for religious reasons (finding)' },
    { 'Code': '105541001', 'Description': 'Non-smoker for medical reasons (finding)' },
    { 'Code': '160618006', 'Description': 'Current non-smoker (finding)' },
    { 'Code': '160620009', 'Description': 'Ex-pipe smoker (finding)' },
    { 'Code': '160621008', 'Description': 'Ex-cigar smoker (finding)' },
    { 'Code': '228501004', 'Description': 'Does not use moist powdered tobacco (finding)' },
    { 'Code': '228502006', 'Description': 'Never used moist powdered tobacco (finding)' },
    { 'Code': '228503001', 'Description': 'Ex-user of moist powdered tobacco (finding)' },
    { 'Code': '228512004', 'Description': 'Never chewed tobacco (finding)' },
    { 'Code': '266919005', 'Description': 'Never smoked tobacco (finding)' },
    { 'Code': '266921000', 'Description': 'Ex-trivial cigarette smoker (<1/day) (finding)' },
    { 'Code': '266922007', 'Description': 'Ex-light cigarette smoker (1-9/day) (finding)' },
    { 'Code': '266923002', 'Description': 'Ex-moderate cigarette smoker (10-19/day) (finding)' },
    { 'Code': '266924008', 'Description': 'Ex-heavy cigarette smoker (20-39/day) (finding)' },
    { 'Code': '266925009', 'Description': 'Ex-very heavy cigarette smoker (40+/day) (finding)' },
    { 'Code': '266928006', 'Description': 'Ex-cigarette smoker amount unknown (finding)' },
    { 'Code': '281018007', 'Description': 'Ex-cigarette smoker (finding)' },
    { 'Code': '360890004', 'Description': 'Intolerant ex-smoker (finding)' },
    { 'Code': '360900008', 'Description': 'Aggressive ex-smoker (finding)' },
    { 'Code': '360918006', 'Description': 'Aggressive non-smoker (finding)' },
    { 'Code': '360929005', 'Description': 'Intolerant non-smoker (finding)' },
    { 'Code': '405746006', 'Description': 'Current non smoker but past smoking history unknown (finding)' },
    { 'Code': '53896009', 'Description': 'Tolerant ex-smoker (finding)' },
    { 'Code': '8392000', 'Description': 'Non-smoker (finding)' },
    { 'Code': '8517006', 'Description': 'Ex-smoker (finding)' },
    { 'Code': '87739003', 'Description': 'Tolerant non-smoker (finding)' }
  ];

  public static INTERVENTION_PERFORMED = [
    { 'Performed': 'Tobacco Use Cessation Counseling' },
    { 'Performed': 'Tobacco Use Cessation Pharmacotherapy' }
  ];

  public static INTERVENTION_TOBACCO_STATUS = [
    { 'Code': '171055003', 'Description': 'Pregnancy smoking education (procedure)' },
    { 'Code': '185795007', 'Description': 'Stop smoking monitoring verbal invite (procedure)' },
    { 'Code': '185796008', 'Description': 'Stop smoking monitoring telephone invite (procedure)' },
    { 'Code': '225323000', 'Description': 'Smoking cessation education (procedure)' },
    { 'Code': '225324006', 'Description': 'Smoking effects education (procedure)' },
    { 'Code': '310429001', 'Description': 'Smoking monitoring invitation (procedure)' },
    { 'Code': '315232003', 'Description': 'Referral to stop-smoking clinic (procedure)' },
    { 'Code': '384742004', 'Description': 'Smoking cessation assistance (regime/therapy)' },
    { 'Code': '395700008', 'Description': 'Referral to smoking cessation advisor (procedure)' },
    { 'Code': '449841000124108', 'Description': 'Referral to tobacco use cessation clinic (procedure)' },
    { 'Code': '449851000124105', 'Description': 'Referral to tobacco use cessation counselor (procedure)' },
    { 'Code': '449861000124107', 'Description': 'Referral to tobacco use cessation counseling program (procedure)' },
    { 'Code': '449871000124100', 'Description': 'Referral to tobacco use quit line (procedure)' },
    { 'Code': '702388001', 'Description': 'Tobacco use cessation education (procedure)' },
    { 'Code': '710081004', 'Description': 'Smoking cessation therapy (regime/therapy)' },
    { 'Code': '711028002', 'Description': 'Counseling about tobacco use (procedure)' },
    { 'Code': '99406', 'Description': 'Smoking and tobacco use cessation counseling visit; intermediate, greater than 3 minutes up to 10 minutes' },
    { 'Code': '99407', 'Description': 'Smoking and tobacco use cessation counseling visit; intensive, greater than 10 minutes' },
    { 'Code': '1232585', 'Description': '24 HR Bupropion Hydrochloride 450 MG Extended Release Oral Tablet' },
    { 'Code': '151226', 'Description': 'topiramate 50 MG Oral Tablet' },
    { 'Code': '1551468', 'Description': '12 HR Bupropion Hydrochloride 90 MG / Naltrexone hydrochloride 8 MG Extended Release Oral Tablet' },
    { 'Code': '1797886', 'Description': 'Nicotine 0.5 MG/ACTUAT Metered Dose Nasal Spray' },
    { 'Code': '1801289', 'Description': 'Smoking Cessation 12 HR Bupropion Hydrochloride 150 MG Extended Release Oral Tablet' },
    { 'Code': '198029 ', 'Description': '24 HR Nicotine 0.583 MG/HR Transdermal System' },
    { 'Code': '198030 ', 'Description': '24 HR Nicotine 0.875 MG/HR Transdermal System' },
    { 'Code': '198031 ', 'Description': '24 HR Nicotine 0.292 MG/HR Transdermal System' },
    { 'Code': '198045 ', 'Description': 'Nortriptyline 10 MG Oral Capsule' },
    { 'Code': '198046 ', 'Description': 'Nortriptyline 50 MG Oral Capsule' },
    { 'Code': '198047 ', 'Description': 'Nortriptyline 75 MG Oral Capsule' },
    { 'Code': '199283 ', 'Description': 'Nortriptyline 10 MG Oral Tablet' },
    { 'Code': '199888 ', 'Description': 'topiramate 25 MG Oral Tablet' },
    { 'Code': '199889 ', 'Description': 'topiramate 100 MG Oral Tablet' },
    { 'Code': '199890 ', 'Description': 'topiramate 200 MG Oral Tablet' },
    { 'Code': '205315 ', 'Description': 'topiramate 25 MG Oral Capsule' },
    { 'Code': '205316 ', 'Description': 'topiramate 15 MG Oral Capsule' },
    { 'Code': '250983 ', 'Description': 'Nicotine 4 MG/ACTUAT Inhalant Solution' },
    { 'Code': '311975 ', 'Description': 'Nicotine 4 MG Chewing Gum' },
    { 'Code': '312036 ', 'Description': 'Nortriptyline 2 MG/ML Oral Solution' },
    { 'Code': '314119 ', 'Description': 'Nicotine 2 MG Chewing Gum' },
    { 'Code': '317136 ', 'Description': 'Nortriptyline 25 MG Oral Capsule' },
    { 'Code': '359817 ', 'Description': 'Nicotine 2 MG Oral Lozenge' },
    { 'Code': '359818 ', 'Description': 'Nicotine 4 MG Oral Lozenge' },
    { 'Code': '636671 ', 'Description': 'varenicline 0.5 MG Oral Tablet' },
    { 'Code': '636676 ', 'Description': 'varenicline 1 MG Oral Tablet' },
    { 'Code': '749289 ', 'Description': '{11 (varenicline 0.5 MG Oral Tablet) / 42 (varenicline 1 MG Oral Tablet) } Pack' },
    { 'Code': '749788 ', 'Description': '{56 (varenicline 1 MG Oral Tablet) } Pack' },
    { 'Code': '892244 ', 'Description': '{14 (24 HR Nicotine 0.292 MG/HR Transdermal System) / 14 (24 HR Nicotine 0.583 MG/HR Transdermal System) / 28 (24 HR Nicotine 0.875 MG/HR Transdermal System) } Pack' },
    { 'Code': '993503 ', 'Description': '12 HR Bupropion Hydrochloride 100 MG Extended Release Oral Tablet' },
    { 'Code': '993518 ', 'Description': '12 HR Bupropion Hydrochloride 150 MG Extended Release Oral Tablet' },
    { 'Code': '993536 ', 'Description': '12 HR Bupropion Hydrochloride 200 MG Extended Release Oral Tablet' },
    { 'Code': '993541 ', 'Description': '24 HR Bupropion Hydrochloride 150 MG Extended Release Oral Tablet' },
    { 'Code': '993550 ', 'Description': '24 HR Bupropion hydrobromide 174 MG Extended Release Oral Tablet' },
    { 'Code': '993557 ', 'Description': '24 HR Bupropion Hydrochloride 300 MG Extended Release Oral Tablet' },
    { 'Code': '993567 ', 'Description': '24 HR Bupropion hydrobromide 348 MG Extended Release Oral Tablet' },
    { 'Code': '993681 ', 'Description': '24 HR Bupropion hydrobromide 522 MG Extended Release Oral Tablet' },
    { 'Code': '993687 ', 'Description': 'Bupropion Hydrochloride 100 MG Oral Tablet' },
    { 'Code': '993691 ', 'Description': 'Bupropion Hydrochloride 75 MG Oral Tablet' },
    { 'Code': '998671 ', 'Description': '168 HR Clonidine 0.00417 MG/HR Transdermal System' },
    { 'Code': '998675 ', 'Description': '168 HR Clonidine 0.00833 MG/HR Transdermal System' },
    { 'Code': '998679 ', 'Description': '168 HR Clonidine 0.0125 MG/HR Transdermal System' }
  ];
}
