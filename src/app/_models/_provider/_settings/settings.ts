import { Attachment } from './../LabandImage';
import { Time } from "@angular/common";
import { IDeleteFlag } from "../encounter";

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
  DentalLicence?: string;
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
  ProfileImage?: string;

  Admin?: boolean;
  EmergencyAccess?: boolean;
  LocationInfo?: Location[] = new Location()[0] ;
}

export class Location {
  Name?: string;
  LocationId?: string;
  City?: string;
  State?: string;
  WeekDay?: string;
  From?: string;
  To?: string;
  SpecifiHour?: string;
  Assigned?: boolean = false
  TimeSlots?: TimeSlot[] = new TimeSlot()[0]
  FormatedTimeSlot?: string = "";
}

export class LocationDialog{

  ProviderId?: string;
  LocationInfo?: Location;
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

export class AppointmentStatus {
  Id?: string;
  Name?: string;
  Colour?: string;
  Editable?: boolean = true;
  //Appointmentstatus: boolean = true;
}

export class AppointmentType {
  Id?: string;
  AppointmentType?: string;
  Colour?: string;
  Editable?: boolean = true;
  //AppointmenttypeStatus?: boolean
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
  Username?: string;
  SecureQuestion?:string;
  Answer?:string;
  QAnswer?:string;
  SecurityCode?: string;
}

export class ChangePasswordResult{
  Valid?:boolean;
  HasQuestion?:boolean;

}


export class PatientEducationInfomation {
  EducationMat?: EducationMaterial[] = [];

}
export class EducationMaterial implements IDeleteFlag {
  EducationalId?:string
  ClinicId?:string;
  PatientId?:string;
  Code?: string;
  CodeSystem?: string;
  Name?: string;
  ResourceNotes?:string;
  CanDelete?: boolean = false;
  Attachments?: Attachment[] =[]
  strAttachments?: string;
}
 export class CDSAlert
 {
  AlertId?:String
  AlertName?:String
  Bibliography?:String
  Description?:String
  Developer?:String
  FundingSource?: string
  ProviderId?: String
  ReleaseAt?:Date
  Resolution?:string
  Rule?:String
  CanDelete?: boolean = false;
  Triggers?:AlertTrigger[]
  triggersInfo?:string;
  strReleaseAt?:string;
  Active?: boolean;
 }
 export class CDSCode implements IDeleteFlag
 {
   TriggerId?:String
   Code?:String
   Description?:String
   CodeSystem?:String
   CanDelete?: boolean = false;
 }
 export class AlertTrigger {
  TriggerId?:string;
  AlertId?:string;
  Description?: string;
  Condition?: string;
  Category?:string;
  Codes?: CDSCode [] = [];
  strCodes?:string;
}

export class AlertResult{
  AlertId?:string;
  Desription?: string;
  strTriggers?: string;
  IsMet?: boolean;
  Triggers?: TriggerResult[] =[]
}

export class TriggerResult{
  TriggerId?:string;
  Description?:string;
  IsMet?:boolean;
}

