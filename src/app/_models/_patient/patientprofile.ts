export interface PatientProfile {
  PatientId?: string;
  ProfileImage?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  Sex?: string;
  DateOfBirth?: string;
  DateOfDeath?: string;
  Gender?:string;
  Age?:string;
  HomePhone?: string;
  CellPhone?: string;
  WorkPhone?: string;
  ChartId?: string;
  DeclinedPortalAccess?: boolean;
  VisionImpared?: string;
  CauseofDeath?: string;
  MobilePhone?: string;
  PrimaryPhone?: string;
  EXT?: string;
  PreferredContact?: string;
  EmailReminder?: boolean;
  SMSReminder?: boolean;
  LastNamanualAddressme?: boolean;
  ethnicity?:string;
  PreferredLanguage?: string;
  GenderIdentity?: string;
  orientation?: string;
  AmericanRace?: string;
  AsianRace?: string;
  AfricanRace?: string;
  WhiteRace?: string;
  HawaiianRace?: string;
  UndeterminedRace?: string;
  MultipleRthnicity?: string;
  Notes?: string;
  ImmunizationrRegistry?:string;
  UserId?: string;
  username?: string;
  email?: string;
  Street?:string
  StreetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  EmergencyId?: string;
  EmergencyFirstName?: string;
  EmergencyMiddleName?: string;
  EmergencyLastName?: string;
  RelationshipToPatient?: string;
  Phone?: string;
  EmergencyEmail?: string;
  EmergencyStreet?:string;
  EmergencyStreetAddress?: string;
  EmergencyCity?: string;
  EmergencyState?: string;
  EmergencyZip?: string;
  QuestuonId?: string;
  question?: string;
  SSecuirtyNumber?:string;
  NextKinsId?: string;
  NKFirstName?: string;
  NkMiddleName?: string;
  NkLastName?: string;
  NkRel?: string;
  NKMobilePhone?: string;
  NKStreetAddress?: string;
  NKCity?: string;
  NKState?: string;
  NKZip?: string;
  PatientRelationId?:string;
  relationships?:String;
}
export interface areaCodes {
  areaId?: string;
  areaCode?: string;

}

export class PatientProfileSecurityQuestion{
  SecurityID?: string;
  Question?: string; 
  Answer?: string;
  PateientId?:string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ConfiramationActive?:boolean
}
