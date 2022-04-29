import { Time } from "@angular/common";

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

export interface Location {
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

export interface TimeSlot {
  From?: string,
  SpecificHour?: string,
  To?: string,
  WeekDay?: string
}

export interface RoomsSlot {
  RoomId?: string,
  RoomName?: string,
  Status?: boolean
}

export interface AppointmentStatus {
  Id?: string,
  Name?: string,
  Colour?: string,
  Editable?: boolean,
  Appointmentstatus?: boolean
}

export interface AppointmentType {
  Id?: string,
  AppointmentType?: string,
  Colour?: string,
  Editable?: boolean,
  AppointmenttypeStatus?: boolean
}

export interface GeneralSchedule {
  ClinicId?: string,
  CalendarFrom?: Time,
  CalendarTo?: Time,
  ConcurrentApps?: boolean,
  OutSidePracticeHour?: boolean,
  PatientRescedule?: boolean,
  RescheduleTime?: number,
  ScheduleGeneral?: string,
  SlotSize?: number
}
