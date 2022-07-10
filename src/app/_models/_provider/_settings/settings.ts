import { Time } from "@angular/common";

export class NewUser {
  PracticeRole?: string;
  Active?: boolean;

  UserId?: string;
  ClinicId?: string;
  ProviderId?: string;
  FirstName?: string;
  LastName?: string;
  LocationId?: string;

  Title?: string;
  MiddleName?: string;
  Degree?: string;
  Speciality?: string;
  SecondarySpeciality?: string;
  DentalLicense?: string;
  ExpirationDate?: string;
  State?: string;
  Npi?: string;
  Dea?: string;
  UPin?: string;
  NADean?: string;
  SSN?: string;
  PrimaryPhone?: string;
  Email?: string;
  AltEmail?: string;
  PracticeName?: string;
  URL?: string;

  Admin?: boolean;
  EmergencyAccess?: boolean;
  LocationInfo?: Location[] = new Location()[0] ;
}

export class Location {
  Name: string;
  LocationId: string;
  City: string;
  State: string;
  WeekDay: string;
  From: string;
  To: string;
  SpecifiHour: string;
  Assigned: boolean = false
  TimeSlots: TimeSlot[] = new TimeSlot()[0]
  FormatedTimeSlot: string = "";
}

export class TimeSlot {
  From: string = "";
  SpecificHour: string = "";
  To: string = "";
  WeekDay: string ="";
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
  CalendarFrom?: Date,
  CalendarTo?: Date,
  ConcurrentApps?: boolean,
  OutSidePracticeHour?: boolean,
  PatientRescedule?: boolean,
  RescheduleTime?: number,
  ScheduleGeneral?: string,
  SlotSize?: number
}


export class ChangePassword{
  Email?: string;
  Password?: string;
  ConfirmPassword?: string;
  Userid?:string;
}
