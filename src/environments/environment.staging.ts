// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://182.18.157.215/EHR/API/',
  RX_END_POINT: 'https://rxnav.nlm.nih.gov/',
  RX_URI_NDC_PROPERTIES:'REST/rxcui/{0}/properties.json',
  EPRESCRIBE_SERVER:'https://engine201.staging.drfirst.com/servlet/rcopia.servlet.EngineServlet',
  showemail:false,

};

export enum DrFristParamNames {
  RcopiaPortalSystemName = 'rcopia_portal_system_name',
  RcopiaPracticeUserName = 'rcopia_practice_user_name',
  RcopiaUserId = 'rcopia_user_id',
  RcopiaPatientId = 'rcopia_patient_id',
  RcopiaUserExternalId = 'rcopia_user_external_id',
  RcopiaPatientExternalId = 'rcopia_patient_external_id',
  CloseWindow = 'close_window',
  LogoutUrl = 'logout_url',
  StartupScreen = 'startup_screen',
  AllowPopupScreens = 'allow_popup_screens',
  Service = 'service',
  Action = 'action',
  LimpMode = 'limp_mode',
  Time = 'time',
  MAC = 'MAC'
}
export enum DrFirstSSOConstants {
  Service = 'rcopia',
  Action = 'login',
  Patient = 'patient',
  ManageMedication = 'manage_medications',
  ManageAllergies = 'manage_allergies',
  ManageProblems = 'manage_problems',
  Report = 'report',
  Message = 'message'
}

export const RX_DRUG_URI = (term:string) => `REST/drugs.json?name=${term}`;

export const RX_ALL_NDCS_URI = (rxcui:string) => `REST/rxcui/${rxcui}/allndcs.json`;

export const RX_NDCS_URI = (rxcui:string) => `REST/rxcui/${rxcui}/ndcs.json`;

export const RX_NDCS_STATUS_URI = (ndc:string) => `REST/ndcstatus.json?ndc=${ndc}`;

export const RX_URI_NDC_PROPERTIES = (ndc:string) => `REST/rxcui/${ndc}/properties.json`;

export const DR_FIRSR_VERESION = 2.45;

export const UPLOAD_URL = (uri:string) => `${environment.baseUrl}${uri}`;

export const MEDLINE_PLUS_SERVER = 'http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm'
export const MEDLINE_PLUS_ICD ='mainSearchCriteria.v.cs=2.16.840.1.113883.6.90'
export const MEDLINE_PLUS_SNOMED = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.96'
export const MEDLINE_PLUS_LOINC = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.1'
export const MEDLINE_PLUS_RXNORM = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.88'
export const DR_FIRST_SERVER = 'web.staging.drfirst.com'
export const DR_FIRST_ENDPOINT = 'https:'
export const DR_FIRST_URI = 'sso/portalServices'



export const MEDLINE_PLUS_URL = (code:string,codesystem:string) => `${MEDLINE_PLUS_SERVER}?${codesystem}=${code}`


export const DR_FIRST_PATINET_URL = (
  endpoint: string,
  drfirstServer: string,
  drfirstUri: string,
  vendor_username: string,
  rcopia_user_name: string,
  rcopia_user_id: string,
  rcopia_user_external_id: string,
  drfirst_patient_id: string) => `${endpoint}://${drfirstServer}/${drfirstUri}?rcopia_portal_system_name=${vendor_username}&rcopia_practice_user_name=${rcopia_user_name}&rcopia_user_id=${rcopia_user_id}&rcopia_patient_id=${drfirst_patient_id}&rcopia_user_external_id=${rcopia_user_external_id}&service=rcopia&action=login&startup_screen=patient&skip_auth=y&time=`

  export const DR_FIRST_PROVIDER_URL = (urlParams: string) => `${DR_FIRST_ENDPOINT}://${DR_FIRST_SERVER}/${DR_FIRST_URI}?${urlParams}`

  export const DR_FIRST_PROVIDER_URL_PARAMS = (
    vendor_username: string,
    rcopia_user_name: string,
    rcopia_user_id: string,
    rcopia_user_external_id: string,
    start_up: string = 'report') => `${DrFristParamNames.RcopiaPortalSystemName}=${vendor_username}&${DrFristParamNames.RcopiaPracticeUserName}=${rcopia_user_name}&${DrFristParamNames.RcopiaUserId}=${rcopia_user_id}&${DrFristParamNames.RcopiaUserExternalId}=${rcopia_user_external_id}&${DrFristParamNames.Service}=${DrFirstSSOConstants.Service}&${DrFristParamNames.Action}=${DrFirstSSOConstants.Action}&${DrFristParamNames.LimpMode}=y&${DrFristParamNames.StartupScreen}=${start_up}&${DrFristParamNames.Time}=`


  export const DR_FIRST_URL = (url: string, key: string) => `${url}&MAC=${key}`;



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
