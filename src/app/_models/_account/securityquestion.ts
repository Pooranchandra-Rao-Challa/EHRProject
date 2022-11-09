export class FirstTimeSecurityQuestion{
  Question?: string;
  Answer?: string;
  PatientId?: string;
  IsAccepted?: boolean = true;
  RememberComputer?: boolean;
  Password?: string;
  ConfirmPassword?: string;
  ResetToken?: string;
}
