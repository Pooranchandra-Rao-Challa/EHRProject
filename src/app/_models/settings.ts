export interface NewUser {
  PracticeRole?: string,
  Active?: boolean,

  UserId?: string,
  ClinicId?: string,
  ProviderId?: string,
  FirstName?: string,
  LastName?: string,
  LocationId?: string,

  Title?: string,
  MiddleName?: string,
  Degree?: string,
  Speciality?: string,
  SecondarySpeciality?: string,
  DentalLicense?: string,
  ExpirationDate?: string,
  State?: string,
  Npi?: string,
  Dea?: string,
  UPin?: string,
  NADean?: string,
  SSN?: string,
  PrimaryPhone?: string,
  Email?: string,
  AltEmail?: string,
  PracticeName?: string,

  Admin?: boolean;
  EmergencyAccess?: boolean;
  LocationInfo?: Location[];
}

export interface Location{
    Name?: string,
		LocationId?: string,
		City?: string,
		State?: string,
		WeekDay?: string,
		From?: string,
		To?: string,
		SpecifiHour?: string,
		Assigned?: boolean
    TimeSlots: TimeSlot[]
}

export interface TimeSlot{
  From?: string,
  SpecificHour?: string,
  To?: string,
  WeekDay?: string
}
