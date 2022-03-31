export interface NewUser {
  PracticeRole?: string,
  Active?: boolean,

  UserId?: string,
  ClinicId?: string,
  UserProviderId?: string,
  FirstName?: string,
  LastName?: string,
  LocationId?: string,

  Title?: string,
  MiddleName?: string,
  // PracticeName: string,
  Degree?: string,
  Speciality?: string,
  SecondaryPpeciality?: string,
  DentalLicense?: string,
  ExpirationAt?: string,
  State?: string,
  NPI?: string,
  Dea?: string,
  Upin?: string,
  Nadean?: string,
  Ssn?: string,
  // StreetAddress: string,
  // SuiteNumber: string,
  // PrimarPhone: string,
  MobilePhone?: string,
  Email?: string,
  AltEmail?: string,
  // EncryptedPassword: string,
  // SelectedUserLocationIds: string
}
