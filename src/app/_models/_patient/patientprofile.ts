export interface PatientProfile {
  PatientId: string
  ProfileImage: string
  FirstName: string
  MiddleName: string
  LastName: string
  Sex: string
  DateOfBirth: string
  DateOfDeath: string
  HomePhone: string
  CellPhone: string
  WorkPhone: string
  ChartId: string
  DeclinedPortalAccess: boolean
  VisionImpared: string
  CauseofDeath: string
  MobilePhone: string
  PrimaryPhone: string
  EXT: string
  PreferredContact: string
  EmailReminder: boolean
  SMSReminder: boolean
  LastNamanualAddressme: boolean
  ethnicity:string
  PreferredLanguage: string
  GenderIdentity: string
  orientation: string
  AmericanRace: boolean
  AsianRace: boolean
  AfricanRace: boolean
  WhiteRace: boolean
  HawaiianRace: boolean
  UndeterminedRace: boolean
  MultipleRthnicity: boolean
  Notes: string
  ImmunizationrRegistry:string
  UserId: string
  username: string
  email: string
  StreetAddress: string
  city: string
  state: string
  zip: string
  EmergencyId: string
  EmergencyFirstName: string
  EmergencyMiddleName: string
  EmergencyLastName: string
  RelationshipToPatient: string
  Phone: string
  EmergencyEmail: string
  EmergencyStreetAddress: string
  EmergencyCity: string
  EmergencyState: string
  EmergencyZip: string
  QuestuonId: string
  question: string
  SSecuirtyNumber:string
  NextKinsId: string
  NKFirstName: string
  NkMiddleName: string
  NkLastName: string
  NkRel: string
  NKMobilePhone: string
  NKStreetAddress: string
  NKCity: string
  NKState: string
  NKZip: string,
  PatientRelationId:string
  relationships:String

}

export class Dropdown {

  Language: { [key: string]: Object;}[] = [

    { Id: '1', value: 'Enlish (en)' },

    { Id: '2', value: 'German (de)' },

    { Id: '3', value: 'Russian (ru)' },

    { Id: '4', value: 'Spanish (es)' },

    { Id: '5', value: 'Abkhazian (ab)' },

    { Id: '6', value: 'Afar (aa)' },

    { Id: '7', value: 'Afrikaans (af)' },

    { Id: '8', value: 'Akan (ak)' },

    { Id: '9', value: 'Albanian (sq)' },

    { Id: '10', value: 'Amharic (am)' },

    { Id: '11', value: 'arabic (ar)' },

    { Id: '12', value: 'Aragonese (an)' },

    { Id: '13', value: 'Armenian (hy)' },

    { Id: '14', value: 'Assamese (as)' },

    { Id: '15', value: 'Avaric (av)' },

];
}
