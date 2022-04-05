import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export interface NewAppointment {
  PatientId: string;
  ProviderId: string;
  AppointmentTypeId: string;
  ApoointmentStatusId: string;
  Colour: string;
  Reason?: string;
  Duration: number;
  RoomId: string;
  Remainder?: string;
  LocationId: string;
  RemainderSent?: string;
  Startat: NgbDateStruct;
  ContactMail?: string;
  Note?: string;
  RequestFrom?: string;
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
}

export interface ScheduleVisitStatus
{

}
export interface ScheduledAppointment{
  ScheduleTime? : string;
  PatientInfo? : string;
  Provider? : string;
  Status?: string;
  AppointmentType? :string;
  Notes? :string;
}
