
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
  strDateofBirth?: string;
}

export class PatientPortalUser{
  PatientName?: string;
  PatientId?: string;
  DateofBirth?: Date;
  Username?: string;
  Password?: string;
  Email?: string;
  ProviderName?: string;
  LocationName?: string;
  BusinessName?: string;
  ConfirmPassword?: string;
  PatientRelationshipUserId?: string;
  PatientRelationName?: string;
  Relationship?: string;
  PatientRelationUsername?: string;
  SendInvitation?:boolean;
  URL?:string;
}

export class PatientSearch{
  PatientId?: string;
  Name?: string;
  Gender?: string;
  PrimaryPhone?: string;
	MobilePhone?: string;
	Dob?: Date;
	Age?: Number;
  User?:string;
}

