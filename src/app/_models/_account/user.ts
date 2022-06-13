import{ProviderPatient} from './../_provider/Providerpatient';
export interface User {
  CurrentLocation: string;
  UserId: string;
  ClinicId: string;
  ProviderId: string;
  AdminId: string;
  PatientId: string;
  RepresentativeId: string;
  UserName: string;
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
  PatientView?: string = ""

}
