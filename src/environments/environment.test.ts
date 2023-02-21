// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost/EHR/API/',
  //baseUrl: 'http://182.18.157.215/EHR/API/',
  RX_END_POINT: 'https://rxnav.nlm.nih.gov/',
  RX_URI_NDC_PROPERTIES:'REST/rxcui/{0}/properties.json',
  EPRESCRIBE_SERVER:'https://engine201.staging.drfirst.com/servlet/rcopia.servlet.EngineServlet',
  showemail:true,
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
export const DR_FIRST_SERVER = 'web3.drfist.com'
export const DR_FIRST_ENDPOINT = 'web3.drfist.com'
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

export const DR_FIRST_PROVIDER_URL = (
  endpoint: string,
  drfirstServer: string,
  drfirstUri: string,
  vendor_username: string,
  rcopia_user_name: string,
  rcopia_user_id: string,
  rcopia_user_external_id: string,
  start_up: string = 'report') => `${endpoint}://${drfirstServer}/${drfirstUri}?rcopia_portal_system_name=${vendor_username}&rcopia_practice_user_name=${rcopia_user_name}&rcopia_user_id=${rcopia_user_id}&rcopia_user_external_id=${rcopia_user_external_id}&service=rcopia&action=login&limp_mode=y&startup_screen=${start_up}&skip_auth=y&time=`


export const DR_FIRST_URL = (url: string,key: string) => `${url}&MAC=${key}`;
