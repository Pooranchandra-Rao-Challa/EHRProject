
import{ PracticeProviders} from'./_provider/practiceProviders';
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

export interface PatientSearchResults {
  Name: string;
  Age: number;
  ContactNumber: string;
  DateofBirth: string;
  ContactEmail: string;
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
  AppointmentTime? : Date;
  PatientName? : string;
  DateofBirth? : Date;
  ProviderName? : string;
  Status?: string;
  AppointmentType? :string;
  Notes? :string;
  IsCurrent?: boolean;
  IsPast?: boolean;
}



export interface AppointmentTypes{
  Id? :string;
  AppointmentType?: string;

}
export interface UserLocations {
  locationId: string;
  locationName: string;
}

export interface Room{
  RoomId? :string;
  RoomName? :string;
}

export interface AvailableTimeSlot{
  Id? :number;
  TimeSlot? :string;
  StartDateTime? :Date;
  EndDateTime? :Date;
  Selected? : boolean;
}

export interface AppointmentDialogInfo{
  Title?: string;
  ProviderId?: string;
  LocationId?: string;
  ClinicId?: string;
  PatientAppointment?:NewAppointment
  PracticeProviders?:PracticeProviders[]
  AppointmentTypes?: AppointmentTypes[]
  Locations: UserLocations[];
  Rooms?: Room[];
  AppointmentsOfPatient?: NewAppointment[];
  status: Actions;
}

export enum Actions {
  new,add, view, edit, upcomming,delete,create
}
