import { NumericLiteral } from 'typescript';
import { AdvancedDirective } from './chart';
export class ProviderPatient{
  Age?: number;
  Created?: string;
  Dob?: string;
  Email?: string;
  FirstName?: string;
  Gender?: string;
  LastAccessed?: string;
  LastName?: string;
  MiddleName?: string;
  MobilePhone?: string;
  PatientId?: string;
  PrimaryPhone?: string;
  ProviderId?: string;
  active?: boolean;
  IsDeleted?: boolean;
  EncKey?:string;
  ShowDetailView?: boolean;
  AdvancedDirectives?: AdvancedDirective[] = [];
  TotalPatients?: number;
  UserId?: string;
  RelationShip?: string = 'Parent-Mother';
}


export class PatientBreadcurm{
  Name?: string;
  DOB?: string;
  ViewType?: number
  PatientId?: string;
  ProviderId?: string;
  ShowRemoveIcon?: boolean = false;
  EncKey?: string;
  Details?: ProviderPatient;
  ActiveId?: boolean;
}

export class PatientAccountInfo{
  InvitationSentAt?: Date;
  HasAccount?: boolean;
}
export enum ENavigationView{
  list, view
}

export class PatientNotificationSetting {
  Patientid : string
  NotificationType : string
  Enable : boolean
}
