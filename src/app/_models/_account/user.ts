import { DefaultMessage } from './../_admin/defaultmessage';
import { CQMNotPerformed } from './../_provider/cqmnotperformed';
import { WeeklyUpdated } from '../_admin/weeklyupdated';
import { ProviderPatient } from './../_provider/Providerpatient';
export interface User {
  CurrentLocation: string;
  UserId: string;
  ClinicId: string;
  ProviderId: string;
  AdminId: string;
  PatientId: string;
  RepresentativeId: string;
  RepresentativeName: string;
  Username: string;
  Role: string;
  FirstName: string;
  LastName: string;
  JwtToken: string;
  TimeZone: string;
  LocationInfo: string;
  BusinessName: string;
  IsSuccess: boolean;
  EmailConfirmation: boolean;
  IsInTrailPeriod: boolean;
  TrialDaysLeft?: number;
  EnableStage3: boolean;
  RepresentativeUserId:string;
  IsFirstTimeLogin: boolean;
  ProviderActive: boolean;
  UserLocked: boolean;
  AdminActive: boolean;
  Npi:string;
  UnReadMails?:number ;
  UrgentMessages?:number;
  UnlockToken?: string;
  HasSecureQuestion?: boolean;
  ResetToken?: string;
}
export class UserLocations {
  LocationId: string;
  LocationName: string;
}

export class ViewModel {
  View?: string = "Smart Schedule";
  SubView?: string = "";
  PatinetId?: string = "";
  Patient?: ProviderPatient;
  PatientView?: string = "";
  CQMNotPerformed?: CQMNotPerformed;
  CQMView?: string = "";
  WeeklyUpdate?: WeeklyUpdated;
  AdminViewName?: string;
  PatientBreadCrumb?: string[];
  LabandImageView?: string = "Lab";
  DefaultMessageView?: DefaultMessage;
  Cds?:boolean = true;
}

export class AdminViewModal {
  WeeklyUpdate?: WeeklyUpdated;
  WeeklyUpdatedView?: string = "";
}

export class SecureCreds{
  SecurityCode?: string;
  Password?: string;
  Token?: string;
}


export class PhotoFileProperties {
  Width: number;
  Height: number;
  FileName: string;
  FileExtension: string;
  Size: number;
  File: any;
  Message: string;
}
