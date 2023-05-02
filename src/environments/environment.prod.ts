export const environment = {
  production: true,
  showemail: false,
  //baseUrl: 'http://13.56.245.114:3550/',
  baseUrl: 'http://10.1.1.4:3550/',
  RX_END_POINT: 'https://rxnav.nlm.nih.gov/',
  RX_URI_NDC_PROPERTIES: 'REST/rxcui/{0}/properties.json',
  EPRESCRIBE_SERVER:'https://engine301.drfirst.com/servlet/rcopia.servlet.EngineServlet',
  EPRESCRIBE_SERVER_STAGE101: 'https://engine101.staging.drfirst.com/servlet/rcopia.servlet.EngineServlet',
  EPRESCRIBE_SERVER_STAGE102: 'https://engine201.staging.drfirst.com/servlet/rcopia.servlet.EngineServlet',

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

export const RX_DRUG_URI = (term: string) => `REST/drugs.json?name=${term}`;

export const RX_ALL_NDCS_URI = (rxcui: string) => `REST/rxcui/${rxcui}/allndcs.json`;

export const RX_NDCS_URI = (rxcui: string) => `REST/rxcui/${rxcui}/ndcs.json`;

export const RX_NDCS_STATUS_URI = (ndc: string) => `REST/ndcstatus.json?ndc=${ndc}`;

export const RX_URI_NDC_PROPERTIES = (ndc: string) => `REST/rxcui/${ndc}/properties.json`;

export const UPLOAD_URL = (uri: string) => `${environment.baseUrl}${uri}`;

export const DR_FIRSR_VERESION = 2.45;

export const MEDLINE_PLUS_SERVER = 'http://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm'
export const MEDLINE_PLUS_ICD = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.90'
export const MEDLINE_PLUS_SNOMED = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.96'
export const MEDLINE_PLUS_LOINC = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.1'
export const MEDLINE_PLUS_RXNORM = 'mainSearchCriteria.v.cs=2.16.840.1.113883.6.88'
export const DR_FIRST_SERVER = 'web.staging.drfirst.com'
export const DR_FIRST_ENDPOINT = 'https:'
export const DR_FIRST_URI = 'sso/portalServices'

export const MEDLINE_PLUS_URL = (code: string, codesystem: string) => `${MEDLINE_PLUS_SERVER}?${codesystem}=${code}`


export const DR_FIRST_PATINET_URL = (
  vendor_username: string,
  rcopia_user_name: string,
  rcopia_user_id: string,
  rcopia_user_external_id: string,
  drfirst_patient_id: string) => `${DrFristParamNames.RcopiaPortalSystemName}=${vendor_username}&{DrFristParamNames.RcopiaPracticeUserName}=${rcopia_user_name}&${DrFristParamNames.RcopiaUserId}=${rcopia_user_id}&${DrFristParamNames.RcopiaPatientId}=${drfirst_patient_id}&${DrFristParamNames.RcopiaUserExternalId}=${rcopia_user_external_id}&${DrFristParamNames.Service}=${DrFirstSSOConstants.Service}&${DrFristParamNames.Action}=${DrFirstSSOConstants.Action}&${DrFristParamNames.StartupScreen}=${DrFirstSSOConstants.Patient}&${DrFristParamNames.Time}=`

export const DR_FIRST_SSO_URL = (urlParams: string) => `${DR_FIRST_ENDPOINT}://${DR_FIRST_SERVER}/${DR_FIRST_URI}?${urlParams}`

export const DR_FIRST_PROVIDER_URL_PARAMS = (
  vendor_username: string,
  rcopia_user_name: string,
  rcopia_user_id: string,
  rcopia_user_external_id: string,
  start_up: string = 'report') => `${DrFristParamNames.RcopiaPortalSystemName}=${vendor_username}&${DrFristParamNames.RcopiaPracticeUserName}=${rcopia_user_name}&${DrFristParamNames.RcopiaUserId}=${rcopia_user_id}&${DrFristParamNames.RcopiaUserExternalId}=${rcopia_user_external_id}&${DrFristParamNames.Service}=${DrFirstSSOConstants.Service}&${DrFristParamNames.Action}=${DrFirstSSOConstants.Action}&${DrFristParamNames.LimpMode}=y&${DrFristParamNames.StartupScreen}=${start_up}&${DrFristParamNames.Time}=`


export const DR_FIRST_URL = (urlparams: string, mac: string) => `${urlparams}&MAC=${mac}`;
