export class Amendments {
  AmendmentId?:  string;
    DateofRequest?: string='';
    DateofAccept?: string='';
    DateofAppended?: string='';
    Status?: string;
    Source?: string;
    Description?:string;
    Note?: string;
    PatientId?:string;
  }

  // {
  //   "AmendmentId": "sample string 1",
  //   "Status": "sample string 2",
  //   "Source": "sample string 3",
  //   "PatientId": "sample string 4",
  //   "DateofRequest": "2022-07-18T10:13:20.5707833+05:30",
  //   "DateofAccept": "sample string 5",
  //   "DateofAppended": "sample string 6",
  //   "Description": "sample string 7",
  //   "Note": "sample string 8",
  //   "Updatedate": "2022-07-18T10:13:20.5707833+05:30",
  //   "Createdate": "2022-07-18T10:13:20.5707833+05:30"
  // }