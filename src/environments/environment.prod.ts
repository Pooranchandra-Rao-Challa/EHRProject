export const environment = {
  production: true,
  showemail:true,
  //baseUrl:'http://183.82.111.111/EHRCQMReports/API/',
  //redirectUrl:'http://183.82.111.111/EHRCQMReports/dashboard'
  //redirectUrl:'http://182.18.157.215/EHR/Web/account/login',
  baseUrl: 'http://182.18.157.215/EHR/API/',
  //VIRTUAL_URL:'EHR/API/',
  //baseUrl:'http://localhost/EHR/API/',
  RX_END_POINT: 'https://rxnav.nlm.nih.gov/',
  RX_URI_NDC_PROPERTIES:'REST/rxcui/{0}/properties.json',

};

export const RX_DRUG_URI = (term:string) => `REST/drugs.json?name=${term}`;

export const RX_ALL_NDCS_URI = (rxcui:string) => `REST/rxcui/${rxcui}/allndcs.json`;

export const RX_NDCS_URI = (rxcui:string) => `REST/rxcui/${rxcui}/ndcs.json`;

export const RX_NDCS_STATUS_URI = (ndc:string) => `REST/ndcstatus.json?ndc=${ndc}`;

export const RX_URI_NDC_PROPERTIES = (ndc:string) => `REST/rxcui/${ndc}/properties.json`;


export const UPLOAD_URL = (uri:string) => `${environment.baseUrl}${uri}`;

export const MEDLINE_PLUS_SERVER = 'http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm'
export const MEDLINE_PLUS_ICD ='mainSearchCriteria.v.cs=2.16.840.1.113883.6.90'
export const MEDLINE_PLUS_SNOMED = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.96'
export const MEDLINE_PLUS_LOINC = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.1'
export const MEDLINE_PLUS_RXNORM = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.88'

export const MEDLINE_PLUS_URL = (code:string,codesystem:string) => `${MEDLINE_PLUS_SERVER}?${codesystem}=${code}`

/***
 *  public const string RX_END_POINT = "https://rxnav.nlm.nih.gov/";
    public const string RX_URI = "REST/rxcui/{0}/properties.json";
    public const string RX_DRUG_URI = "REST/drugs.json?name={0}";

    /// <summary>
    /// This <b>ALL_NDCS_URI<b> is obsolated uri
    /// </summary>
    public const string ALL_NDCS_URI = "REST/rxcui/{0}/allndcs.json"; // the index 0 should be of rxcui number obtained from RX_DRUG_URI
    public const string NDCS_URI = "REST/rxcui/{0}/ndcs.json";   // the index 0 should be of rxcui number obtained from RX_DRUG_URI
    public const string NDCS_STATUS_URI = "REST/ndcstatus.json?ndc={0}"; // the index 0 should be of ndc number obtained from NDCS_URI


 */
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
