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
  Immunizations?: Immunization[] = []
  Encounters?: EncounterInfo[] = []
  Appointments?: NewAppointment[] = []
  Medications?: Medication[] = []
  SmokingStatuses?: SmokingStatus[] = []
  TobaccoUseInterventions?: TobaccoUseScreenings[] = []
  TobaccoUseScreenings?: TobaccoUseInterventions[] = []
}

export class Immunization {
  ImmunizationId?: string;
  PatientId?: string;
  AdministeredAt?: string;
  ExpirationAt?: Date;
  Notes?: string;
  ImmType?: string = 'administered';
  Code?: string;
  Description?: string;
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
  PatientId?: string;
  DrugName?: string;
  DisplayName?: string;
  Rxcui?: string;
  NDC?: string;
  DoesspotMedicationId?: string;
  DoseandForm?: string;
  Dispense?: string;
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

export class TobaccoUse {
  TobaccoUseId?: string;
  PatientId?: string;
  ScreeningId?: string;
  ScreeningType?: string;
  ScreeningDate?: Date;
  ScreeningDescription?: string;
  ScreeningCode?: string;
  Status?: string;
  ScreeningPerformed?: string;
  CI_Id?: string;
  CI_Date?: Date;
  CI_Type?: string;
  CI_Code?: string;
  CI_Description?: string;
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

export interface Vaccine {
  VaccineId?: string;
  Code?: string;
  Description?: string;
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

export enum AllergyReaction {
  Anaphylaxis = 'Anaphylaxis',
  Bloating = 'Bloating/gas',
  ChestPain = 'Chest Pain',
  Conjunctivitis = 'Conjunctivitis',
  Cough = 'Cough',
  Diarrhea = 'Diarrhea',
  DifficultySpeaking = 'Difficulty speaking or swallowing',
  DizzinessLightheadedness = 'Dizziness/Lightheadedness',
  Facialswelling = 'Facial swelling',
  Hives = 'Hives',
  IrregularHeartbeat = 'Irregular Heartbeat',
  Itchiness = 'Itchiness',
  Lossofconsciousness = 'Loss of consciousness',
  Nausea = 'Nausea Other',
  PainCramping = 'Pain/cramping',
  Patchyswellingskin = 'Patchy swelling-skin',
  Rashgeneralized = 'Rash-generalized',
  Rashlocalized = 'Rash-localized',
  RespiratoryDistress = 'Respiratory Distress',
  Runnynose = 'Runny nose',
  Shortnessofbreath = 'Shortness of breath',
  Tachycardia = 'Tachycardia',
  Tongueswelling = 'Tongue swelling',
  Unknown = 'Unknown',
  Vomiting = 'Vomiting',
  Wheezing = 'Wheezing'
}

export enum DiagnosisDpCodes {   // Dp - dropdown
  SNOMED = 'SNOMED',
  ICD10 = 'ICD10'
}

// Immunizations
export class GlobalConstants {
  public static MedicationName: string[] = ['medication 1', 'medication 2', 'medication 3'];

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
}

export const PROCEDURE_REASON_CODES = [
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

export const MEDICATION_NAMES = [
  { 'Name': 'Medication 1' },
  { 'Name': 'Medication 2' },
  { 'Name': 'Medication 3' },
];
