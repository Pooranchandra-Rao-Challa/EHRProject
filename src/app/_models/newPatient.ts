import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BitwiseOperator } from 'typescript';
export interface NewPatient {
  PatientId: string;
  FirstName: string;
  LastName: string;
  DateofBirth:NgbDateStruct;
  MiddleName: string;
  //Age:string;
  CellPhone:string;
  Homephone?:string;
  //WorkPhone:string;
  Email:string;
  Gender:string;
  Address:string;
  PatinetHasNoEmail: boolean;
  ValidatedAddress?: string;
  //City:string;
  //State:string;
  //Zip:string;
  //PrimeSubscriberNo:string;
  //PrimeSubscriberName:string;

}
