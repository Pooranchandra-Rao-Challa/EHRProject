import { ToAddress } from "./smart.scheduler.data";

export class PracticeProviders implements ToAddress {
  ProviderId: string;
  FullName: string;
  UserId?: string;
  NPI?: string;
  get Name(): string {
    return this.FullName;
  }
}
export interface Company {
  companyName: string;
  description?: string;
}
export class DrFirstAttributes {
  VendorUserName?: string;
  VendorPassword?: string;
  SystemName?: string;
  RcopiaPracticeUserName?: string;
  RcopiaPracticeUserNamePassword?: string;
  ProviderUserName?: string;
  ProviderUserNamePassword?: string;
  RcopiaUserExternalId?: string;
  EprescribeFrom?: string;
  DrFirstPatientId?: number;
  RcopiaUserExternalPatientId?: string;
}

export class DrFirstPatient {
  PatientId?: string;
  ProviderId: string;
  FirstName?: string;
  LastName?: string;
  Gender?: string;
  DOB?: Date;
  PatientAddress?: string;
  City?: string;
  State?: string;
  Zip?: string;
  SocialNumber?: string;
  HomePhone ?: string;
  MobilePhone ?: string;
  ClinicPhone ?: string;
  ClinicZip ?: string;
  ClinicName?: string;
  ClinicAddress?: string;
  ClinicCity?: string;
  ClinicState?: string;
}
