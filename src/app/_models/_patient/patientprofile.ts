export class PatientProfile {
  PatientId?: string;
  ProfileImage?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  Sex?: string;
  DateOfBirth?: string;
  DateOfDeath?: string;
  Gender?: string;
  Age?: string;
  HomePhone?: string;
  CellPhone?: string;
  WorkPhone?: string;
  ChartId?: string;
  DeclinedPortalAccess?: boolean;
  VisionImpared?: boolean;
  Active?:boolean;
  CauseofDeath?: string;
  MobilePhone?: string;
  PrimaryPhone?: string;
  EXT?: string;
  PreferredContact?: string;
  EmailReminder?: boolean;
  SMSReminder?: boolean;
  LastNamanualAddressme?: boolean;
  ethnicity?: string;
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
  ImmunizationrRegistry?: string;
  UserId?: string;
  username?: string;
  email?: string;
  Street?: string
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
  EmergencyStreet?: string;
  EmergencyStreetAddress?: string;
  EmergencyCity?: string;
  EmergencyState?: string;
  EmergencyZip?: string;
  QuestuonId?: string;
  question?: string;
  SSecuirtyNumber?: string;
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
  PatientRelationId?: string;
  relationships?: String;
  PrimaryPhonePreffix?: string;
  PrimaryPhoneSuffix?: string;
  MobilePhonePreffix?: string;
  MobilePhoneSuffix?: string;
  WorkPhonePreffix?: string;
  WorkPhoneSuffix?: string;
  EmergencyPhonePreffix?: string;
  EmergencyPhoneSuffix?: string;
}
export interface areaCodes {
  areaId?: string;
  areaCode?: string;

}

export class PatientProfileSecurityQuestion {
  SecurityID?: string;
  Question?: string;
  Answer?: string;
  PateientId?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ConfiramationActive?: boolean
}


export const SECURE_QUESTIONS: { key: string, value: string }[] = [{ key: 'What is your favorite sports team?', value: 'What is your favorite sports team?' },
{ key: 'Which historical figure would you most like to meet?', value: 'Which historical figure would you most like to meet?' },
{ key: 'In what city were you born?', value: 'In what city were you born?' },
{ key: 'What was the make and model of your first car?', value: 'What was the make and model of your first car?' },
{ key: 'What is your favorite movie?', value: 'What is your favorite movie?' },
{ key: 'What is the name of your favorite person in history?', value: 'What is the name of your favorite person in history?' },
{ key: 'Who is your favorite actor, musician, or artist?', value: 'Who is your favorite actor, musician, or artist?' },
{ key: 'What was your favorite sport in high school?', value: 'What was your favorite sport in high school?' },
{ key: 'What is the name of your favorite book?', value: 'What is the name of your favorite book?' },
{ key: 'What was the last name of your first grade teacher?', value: 'What was the last name of your first grade teacher?' },
{ key: 'Where were you when you had your first kiss?', value: 'Where were you when you had your first kiss?' },
{ key: 'Where were you when you had your first kiss?', value: 'Where were you when you had your first kiss?' },
{ key: 'What is the last name of the teacher who gave you your first falling grade?', value: 'What is the last name of the teacher who gave you your first falling grade?' }];
