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
  MobilePhone?: string;
  Email?: string;
  AltEmail?: string;
  Password?: string;
}

export class ViewModel{
  FirstName: boolean = false;
  MiddleName: boolean = false;
  LastName: boolean = false;
  PracticeName: boolean = false;
  NPI: boolean = false;
  PracticeAddress: boolean = false;
  PrimaryPhone: boolean = false;
  MobilePhone: boolean = false;
  Email: boolean = false;
  AltEmail: boolean = false;
  Password: boolean=false;
  ConfirmPassword: boolean = false;
}
