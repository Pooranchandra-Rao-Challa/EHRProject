export class PracticeLocation {
  ProviderId?: string;
  LocationId?: string;
  LocationName?: string;
  LocationPhone?: string;
  Fax?: string;
  Street?: string;
  StreetAddress?: string;
  City?: string;
  State?: string;
  Zipcode?: string;
  NPI?: string;
  RenderNPI?: string;
  Tin?: string;
  WeekDays?: string;
  From?: string;
  To?: string;
  SpecificHours?: string;
  ActivityStatus?: string;
  SunOpenTime: string = "04:00 AM";
  MonOpenTime: string = "04:00 AM";
  TueOpenTime: string = "04:00 AM";
  WedOpenTime: string = "04:00 AM";
  ThursOpenTime: string = "04:00 AM";
  FriOpenTime: string = "04:00 AM";
  SatOpenTime: string = "04:00 AM";
  SunCloseTime: string = "10:00 PM";
  MonCloseTime: string = "10:00 PM";
  TueCloseTime: string = "10:00 PM";
  WedCloseTime: string = "10:00 PM";
  ThursCloseTime: string = "10:00 PM";
  FriCloseTime: string = "10:00 PM";
  SatCloseTime: string = "10:00 PM";
  SunDDL: string = "Specific Hours";
  MonDDL: string = "Specific Hours";
  TueDDL: string = "Specific Hours";
  WedDDL: string = "Specific Hours";
  ThursDDL: string = "Specific Hours";
  FriDDL: string= "Specific Hours";
  SatDDL: string= "Specific Hours";
  locationprimary?: boolean;
}

export class LocationData{
  Location_Name: string;
  Location_Street_Address: string;
  Location_Phone: string;
  providers: number;
  Location_Id: string;
}
