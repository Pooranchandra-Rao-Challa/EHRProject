// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: "/API/",
  apiUrl: 'http://localhost:3500/EHR/API/',
  DR_FIRST_ONSTAGE: true,
  RX_END_POINT: 'https://rxnav.nlm.nih.gov/',
  VirtualHost: ''
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

}

export enum DrFirstStartUpScreens {
  Patient = 'patient',
  ManageMedication = 'manage_medications',
  ManageAllergies = 'manage_allergies',
  ManageProblems = 'manage_problems',
  Report = 'report',
  Message = 'message'
}
export const ISSUER = 'http://ehr1.pro';

export const RX_DRUG_URI = (term: string) => `${environment.RX_END_POINT}REST/drugs.json?name=${term}`;

export const RX_ALL_NDCS_URI = (rxcui: string) => `REST/rxcui/${rxcui}/allndcs.json`;

export const RX_NDCS_URI = (rxcui: string) => `${environment.RX_END_POINT}REST/rxcui/${rxcui}/ndcs.json`;

export const RX_NDCS_STATUS_URI = (ndc: string) => `REST/ndcstatus.json?ndc=${ndc}`;

export const RXCUI_NAME_URI = (rxcui: string) => `${environment.RX_END_POINT}REST/rxcui/${rxcui}.json`;
//https://rxnav.nlm.nih.gov/REST/rxcui/131725.json

export const RX_URI_NDC_PROPERTIES = (ndc: string) => `${environment.RX_END_POINT}REST/rxcui/${ndc}/properties.json`;

export const DR_FIRSR_VERESION = 2.45;

export const UPLOAD_URL = (uri:string) => `${environment.baseUrl}${uri}`;

export const MEDLINE_PLUS_SERVER = 'http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm'
export const MEDLINE_PLUS_ICD ='mainSearchCriteria.v.cs=2.16.840.1.113883.6.90'
export const MEDLINE_PLUS_SNOMED = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.96'
export const MEDLINE_PLUS_LOINC = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.1'
export const MEDLINE_PLUS_RXNORM = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.88'
export const MEDLINE_PLUS_CODE_PARAM = 'mainSearchCriteria.v.c'
export const DR_FIRST_SERVER = 'web.staging.drfirst.com'
export const DR_FIRST_ENDPOINT = 'https'
export const DR_FIRST_URI = 'sso/portalServices'

export const MEDLINE_PLUS_URL = (code: string, codesystem: string) => `${MEDLINE_PLUS_SERVER}?${codesystem}&${MEDLINE_PLUS_CODE_PARAM}=${code}`

export const DR_FIRST_PATINET_URL = (
  vendor_username: string,
  rcopia_practice_name: string,
  rcopia_provider_name: string,
  rcopia_user_external_id: string,
  drfirst_patient_id: string,
  start_up_screen: string) => `${DrFristParamNames.RcopiaPortalSystemName}=${vendor_username}&${DrFristParamNames.RcopiaPracticeUserName}=${rcopia_practice_name}&${DrFristParamNames.RcopiaUserId}=${rcopia_provider_name}&${DrFristParamNames.RcopiaPatientId}=${drfirst_patient_id}&${DrFristParamNames.RcopiaUserExternalId}=${rcopia_user_external_id}&${DrFristParamNames.Service}=${DrFirstSSOConstants.Service}&${DrFristParamNames.Action}=${DrFirstSSOConstants.Action}&${DrFristParamNames.StartupScreen}=${start_up_screen}&${DrFristParamNames.Time}=`

export const DR_FIRST_SSO_URL = (urlParams: string) => `${DR_FIRST_ENDPOINT}://${DR_FIRST_SERVER}/${DR_FIRST_URI}?${urlParams}`

export const DR_FIRST_PROVIDER_URL = (
  vendor_username: string,
  rcopia_practice_name: string,
  rcopia_provider_name: string,
  rcopia_user_external_id: string,
  start_up: string = 'report') => `${DrFristParamNames.RcopiaPortalSystemName}=${vendor_username}&${DrFristParamNames.RcopiaPracticeUserName}=${rcopia_practice_name}&${DrFristParamNames.RcopiaUserId}=${rcopia_provider_name}&${DrFristParamNames.RcopiaUserExternalId}=${rcopia_user_external_id}&${DrFristParamNames.Service}=${DrFirstSSOConstants.Service}&${DrFristParamNames.Action}=${DrFirstSSOConstants.Action}&${DrFristParamNames.LimpMode}=y&${DrFristParamNames.StartupScreen}=${start_up}&${DrFristParamNames.Time}=`


export const DR_FIRST_URL = (urlparams: string, mac: string) => `${urlparams}&MAC=${mac}`;
