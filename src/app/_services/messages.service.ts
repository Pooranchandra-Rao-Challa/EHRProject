import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class MessagesService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  ProviderInboxMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._providerInboxMessagesUrl, reqparams);
  }

  ProviderSentMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._providerSentMessagesUrl, reqparams);
  }

  ProviderDraftMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._providerDraftMessagesUrl, reqparams);
  }

  ProviderUrgentMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._providerUrgentMessagesUrl, reqparams);
  }
 CreateMessage(reqparams: any)
 {
   return this._ProcessPostRequest<any>(this._createMessageUrl,reqparams)
 }
}