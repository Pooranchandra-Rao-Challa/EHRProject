import { Attachment } from './LabandImage';
import { ToAddress } from './smart.scheduler.data';

export class Messages {
  EmailMessageId?: string;
  Updated?: string;
  Subject?: string;
  Body?: string;
  ToId?: string;
  FromId?: string;
  ToEmail?: string;
  FromEmail?: string;
  ProviderId?: string;
  ProviderName?: string;
  AltEmail?: string;
  PatientId?: string;
  PatientName?: string;
  MessagesCount?: number;
  TotalPatients?: number;
  Urgent?: boolean;
  Draft?: boolean;
  Sent?: boolean;
  UserId?: string;
  ReplyMessage?: string;
  toAddress?: ToAddress = {};
  ForwardReplyMessage?: string;
  Attachments?: Attachment[] = [];
  strAttachments?: string;
  Read?: boolean;
  Isccda?: boolean;
  New?: boolean;
}

export class MessageDialogInfo {
  Messages?: Messages;
  ForwardReplyMessage?: string;
  MessageFor?: string;
}

export class PatientNotificationSettingType {
  Email?: string
  ConfirmEmail?:string;
  IsVerified?: boolean = false;
  VerificationCode?: string
  PhoneNumber?: string
  ConfirmPhoneNumber?: string;
  Duration?: string = "days";
  NotificationType?: string
  NoOfDays?: number = 30
  IsEnabled?: boolean
  IsPrefered?: boolean
  NotifyThroEmail?: boolean
  NotifyThroMessage?: boolean
  PatientId?: string
  NotificationTypeId?:string;
  URL?: string;
}
