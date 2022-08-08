export class Registration{
  Title?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  PracticeName?: string;
  Degree?: string;
  Speciality?:string;
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
  PrescribeFrom?: string;
  DoseSpot?: boolean;
  ClinicId?: string;
  ClinicKey?: string;
  ClinicianId?: string;
  PracticeUsername?: string;
  VendorUsername?: string;
  ProviderUsername?: string;
  PracticePassword?: string;
  SecretKey?: string;
  ProviderPassword?: string;
  UserExternalId?: string;
  RandomPassword?: string;
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
