import { PatientSearch } from "../_account/newPatient";

export class Messages
{
            EmailMessageId?: string;
            Updated?: string;
            Subject?: string;
            Body?: string;
            ToId ?: string;
            FromId ?: string;
            ToEmail?: string;
            FromEmail?: string;
            ProviderId ?: string;
            ProviderName?: string;
            AltEmail?: string;
            PatientId ?: string;
            PatientName ?: string;
            MessagesCount ?: number;
            TotalPatients?: number;
            Urgent?:boolean;
            Draft?:boolean;
            Sent?:boolean;
            UserId?:string;
            ReplyMessage?:string;
            CurrentPatient?: PatientSearch = new PatientSearch();
            ForwardreplyMessage?:string ;

}