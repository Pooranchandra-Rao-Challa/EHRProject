import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export interface NewAppointment {
  PatientId: string;
  ProviderId: string;
  AppointmentTypeId: string;
  ApoointmentStatusId:string;
  Colour: string;
  Reason?:string;
  Duration:number;
  RoomId:string;
  Remainder?:string;
  LocationId:string;
  RemainderSent?:string;
  Startat:NgbDateStruct;
  ContactMail?: string;
  Note?:string;
}
