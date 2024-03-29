
import { IUser } from 'src/app/_models/_admin/admins'
export class ProviderList implements IUser {

  UserId?: string;
  ProviderId?: string;
  ClinicId?: string;
  ProviderName?: string;
  Degree?: string;
  Email?: string;
  EmailVerifyStatus?: string;
  PrimaryPhone?: string;
  TrailDays?: number;
  Trial?: string;
  Paid?: boolean;
  ActiveStatus?: string;
  Status?: boolean;
  Locked?: boolean;
  Address?: string;
  ClinicName?: string;
  IsMainProvider?: boolean;
  PracticeId?: string;
  PracticeName?: string;
  IsPrimaryProvider?: boolean;
  PrimaryProvider?: string;
  EnableTwofactor?: boolean;
  ResetTwofactor?: boolean;
}
