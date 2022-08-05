
import{ PracticeProviders} from'./practiceProviders';
import { UserLocations } from '../';
export interface NewAppointment {
  AppointmentId?: string;
  PatientId?: string;
  ClinicId?: string;
  ProviderId?: string;
  PatientName?: string;
  AppointmentTypeId?: string;
  AppointmentStatusId?: string;
  Colour?: string;
  Reason?: string;
  Duration?: number;
  RoomId?: string;
  Remainder?: boolean;
  LocationId?: string;
  RemainderSent?: boolean;
  Startat?: Date;
  ContactMail?: string;
  Notes?: string;
  RequestFrom?: string;
  TimeSlot?: AvailableTimeSlot;
  AppointmentTime?: Date;
  Status? : string;
	AppointmentType? : string;
  ProviderName? : string;
};

export interface SearchPatient {
  SearchTerm: string;
};

export class PatientSearchResults {
  Name: string;
  Age: number;
  ContactNumber: string;
  DateofBirth: string;
  PrimaryPhone: string;
  MobilePhone: string;
  NumberOfAppointments: number;
  AppointmentId: string;
  Gender: string;
  PatientId?: string;
  ProviderName?: string;
}

export interface ScheduleVisitStatus
{

}
export class ScheduledAppointment{
  AppointmentId? : string;
  EncounterId?: string;
  PatientId?: string;
  ClinicId?: string;
  ProviderId?: string;
  AppointmentTime? : Date;
  PatientName? : string;
  DateofBirth? : Date;
  ProviderName? : string;
  Status?: string;
  AppointmentType? :string;
  Notes? :string;
  IsCurrent?: boolean;
  IsPast?: boolean;
  PrimaryPhone?: string;
  MobilePhone?: string;
  StatusToUpdate?: string;
}



export interface AppointmentTypes{
  Id? :string;
  AppointmentType?: string;

}
// export interface UserLocations {
//   locationId: string;
//   locationName: string;
// }

export interface Room{
  RoomId? :string;
  RoomName? :string;
}

export class AvailableTimeSlot{
  Id? :number;
  TimeSlot? :string;
  StartDateTime? :Date;
  EndDateTime? :Date;
  Selected? : boolean;
}

export class AppointmentDialogInfo{
  Title?: string;
  ProviderId?: string;
  LocationId?: string;
  ClinicId?: string;
  PatientAppointment?:NewAppointment
  PracticeProviders?:PracticeProviders[]
  AppointmentTypes?: AppointmentTypes[]
  Locations?: UserLocations[];
  Rooms?: Room[];
  AppointmentsOfPatient?: NewAppointment[];
  status?: Actions;
  TimeSlot?: AvailableTimeSlot;
  NavigationFrom?: string = "Smart Schedule";
  IsInBusinessHours?: boolean;
}

export enum Actions {
  new,add, view, edit, upcomming,delete,create
}

export class CalendarAppointment{
  AppointmentId?: string;
  StartAt?: Date;
  EndAt?: Date;
  AppColor?: string
  PatientId?: string
  PatientName?: string
  ProviderId?: string
  LocationId?: string
  ProviderName?: string
  AppStatusId?: string
  AppTypeId?: string
  StatusColor?: string
  Status?: string
  TypeColor?: string
  ApptType?: string
  RoomId?: string
  RoomName?: string
  Duration?: number
  strStartAt?: string;
  Notes?: string;
  ClinicId?: string;
}

export class Blockout{
  BlockoutId?: string;
  BlockoutFor?: string;
  RecurType?: string;
  BlockoutForId?: string;
  StartAt?: Date;
  Time?: string;
  Duration?: number;
  Description?: string;
  Note?: string;
  Recur?: boolean;
  RecurTime?: number;
  ClinicId?: string;
  LocationId?: string;
  RoomId?: string;
  RangeDay?: BlockoutRangeDay[];
}

export class BlockoutRangeDay{
  BlockoutId?: string;
  RangeDay?: string;
}

export class BlockOutDialog{
  PracticeProvider?: PracticeProviders[]
  Staff?: PracticeProviders[]
  Rooms?: Room[];
  Locations?: UserLocations[];
}
