export interface Admins extends IUser {
    id?:string,
    Title?:string,
    //FirstName?: string,
    //LastName?: string,
    MiddleName?: string,
    PrimaryPhone?:string,
    MobilePhone?:string,
    Email?: string,
    Role?:string,
    AltEmail?:string,
   // UserId?: string;
    AdminId?:string;
   // EnableTwofactor?:boolean;
  }

export class AdminRegistration {
  UserId?: string;
  UserName?: string;
  Role?: string;
  Email?: string;
  Password?: string;
  AdminId?: string;
  Title?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  PrimaryPhone?: string;
  PrimaryPhoneCode?: string;
  PrimaryPhoneSuffix?: string;
  PrimaryPhonePreffix?: string;
  AltEmail?: string;
  Active?: string;
  MobilePhone?: string;
  MobilePhoneCode?: string;
  MobilePhoneSuffix?: string;
  MobilePhonePreffix?: string;
  URL?: string;
}


export class  AreaCode{
  AreaId?: string;
  AreaCode?: string;
}

export class Clinic{
  ClinicId?: string;
  ClinicName?: string;
}


export interface IUser{
  UserId?: string;
 EnableTwofactor?:boolean;
 FirstName?: string,
 LastName?: string,
}
