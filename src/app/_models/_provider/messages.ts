import { Attachment } from './LabandImage';
import { ToAddress } from './smart.scheduler.data';
import { PatientSearch } from "../_account/newPatient";

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
  Attachments?: Attachment[] =[];
  Read?:boolean;
}

export class MessageDialogInfo{
  Messages?: Messages;
  ForwardReplyMessage?: string;
  MessageFor?: string;
}
