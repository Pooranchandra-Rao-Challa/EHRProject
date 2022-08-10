import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class MessagesService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  Messages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._messagesUrl, reqparams);
  }

  InboxMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._inboxMessagesUrl, reqparams);
  }

  SentMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._sentMessagesUrl, reqparams);
  }

  DraftMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._draftMessagesUrl, reqparams);
  }

  UrgentMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._urgentMessagesUrl, reqparams);
  }
 CreateMessage(reqparams: any)
 {
   return this._ProcessPostRequest<any>(this._createMessageUrl,reqparams)
 }

 DeleteMessages(reqParams:any)
 {
   return this._ProcessPostRequest<any>(this._deleteMessageUrl,reqParams)
 }
}
