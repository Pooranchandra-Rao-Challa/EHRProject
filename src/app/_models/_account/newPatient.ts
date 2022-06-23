import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export interface Patient {
  PatientId?: string;
  LocationId?:string;
  ProviderId?: string;
  ClinicId?:string;
  FirstName?: string;
  LastName?: string;
  DateofBirth?: NgbDateStruct;
  MiddleName?: string;
  //Age:string;
  CellPhone?: string;
  Homephone?: string;
  StreetAddress?:string;
  Email?: string;
  Gender?: string;
  Address?: string;
  PatinetHasNoEmail: boolean;
  ValidatedAddress?: string;
  City?: string;
  State?: string;
  Zipcode?: string;
  ManualAddress?: string;
  AddressResult?: any;
}

export class PatientPortalUser{
  PatientName?: string;
  PatientId?: string;
  DateofBirth?: Date;
  Username?: string;
  Password?: string;
  Email?: string;
  ConfirmPassword?: string;
  PatientRelationshipUserId?: string;
  PatientRelationName?: string;
  Relationship?: string;
  PatientRelationUsername?: string;
}
