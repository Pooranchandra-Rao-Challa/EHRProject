import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export interface Patient {
  PatientId?: string;
  FirstName?: string;
  LastName?: string;
  DateofBirth?: NgbDateStruct;
  MiddleName?: string;
  //Age:string;
  CellPhone?: string;
  Homephone?: string;
  //WorkPhone:string;
  Email?: string;
  Gender?: string;
  Address?: string;
  PatinetHasNoEmail: boolean;
  ValidatedAddress?: string;

}
