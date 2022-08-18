export class Registration{
  UserId?: string;
  ClinicId?: string;
  ProviderId?: string;
  Title?: string = 'Dr';
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  PracticeName?: string;
  Degree?: string = 'DDS';
  Speciality?:string = 'Dentistry';
  NPI?:string;
  PracticeAddress?: string;
  SuiteNumber?: string = 'new suit';
  PrimaryPhone?: string;
  PrimaryPhonePreffix?: string;
  PrimaryPhoneSuffix?: string;
  MobilePhone?: string;
  MobilePhonePreffix?: string;
  MobilePhoneSuffix?: string;
  Email?: string;
  AltEmail?: string;
  Password?: string;
  Address?: string;
  SuitNumber?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  EPrescribeFrom?: string;

  IsDoseSpotRegistation?: boolean;
  DoseSpotClinicId?: string;
  DoseSpotClinicKey?: string;
  DoseSpotClinicianId?: string;

  PracticeUsername?: string;
  PracticePassword?: string;
  VendorUsername?: string;
  VendorSecretKey?: string;
  ProviderUsername?: string;
  ProviderPassword?: string;
  UserExternalId?: string;

  CreatedFromAdmin?: boolean = false;
}

export class ViewModel{
  FirstName: boolean = false;
  MiddleName: boolean = false;
  LastName: boolean = false;
  PracticeName: boolean = false;
  Degree: boolean = false;
  Speciality: boolean = false;
  NPI: boolean = false;
  PracticeAddress: boolean = false;
  PrimaryPhone: boolean = false;
  MobilePhone: boolean = false;
  Email: boolean = false;
  AltEmail: boolean = false;
  Password: boolean=false;
  ConfirmPassword: boolean = false;
}
