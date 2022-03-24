export interface User {
  LocationName: any;
  UserId: string;
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
  IsSuccess: boolean;

}
export interface UserLocations {
  locationId: string;
  locationName: string;
}
