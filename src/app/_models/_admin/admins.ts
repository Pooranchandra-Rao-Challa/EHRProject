export interface Admins {
    id?:string,
    C_title?:string,
    first_name?: string,
    last_name?: string,
    middle_name?: string,
    primary_phone?:string,
    mobile_phone?:string,
    email?: string,
    C_role?:string,
    alt_email?:string,
    UserId?: string;
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
