import { CQMNotPerformed } from './../_provider/cqmnotperformed';
import { WeeklyUpdated } from '../_admin/weeklyupdated';
import{ProviderPatient} from './../_provider/Providerpatient';
export interface User {
  CurrentLocation: string;
  UserId: string;
  ClinicId: string;
  ProviderId: string;
  AdminId: string;
  PatientId: string;
  RepresentativeId: string;
  Username: string;
  Role: string;
  FirstName: string;
  LastName: string;
  JwtToken: string;
  TimeZone: string;
  LocationInfo: string;
  BusinessName: string;
  IsSuccess: boolean;
  IsInTrailPeriod:boolean;
}
export interface UserLocations {
  locationId: string;
  locationName: string;
}

export class ViewModel{
  View? : string = "Smart Schedule";
  SubView?: string = "";
  PatinetId?: string = "";
  Patient?: ProviderPatient;
  PatientView?: string = "";
  CQMNotPerformed?:CQMNotPerformed;
  CQMView?: string ="";
  WeeklyUpdate?:WeeklyUpdated;
  AdminViewName?:string;
  PatientBreadCrumb?: string[];
  LabandImageView?:string = "Lab"
}

export class AdminViewModal{
  WeeklyUpdate?: WeeklyUpdated;
  WeeklyUpdatedView?:string = ""
}

