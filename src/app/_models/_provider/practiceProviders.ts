import { ToAddress } from "./smart.scheduler.data";

export class PracticeProviders implements ToAddress {
  ProviderId: string;
  FullName: string;
  UserId?: string;
  NPI?:string;
  get Name(): string
  {
    return this.FullName;
  }
}
export interface Company {
  companyName: string;
  description?: string
}
