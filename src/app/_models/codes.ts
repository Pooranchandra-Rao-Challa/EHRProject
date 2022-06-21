export class MedicalCode {
  Id?: string;
  Code?: string;
  Description? :string;
  CodeSystem?: string;
}

export interface CodeSystemGroup{
  name: string,
  codes: MedicalCode[]
}
