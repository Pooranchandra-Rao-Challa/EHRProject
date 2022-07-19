// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:4345/',
  RX_END_POINT: 'https://rxnav.nlm.nih.gov/',
  RX_URI_NDC_PROPERTIES:'REST/rxcui/{0}/properties.json',

};

export const RX_DRUG_URI = (term:string) => `REST/drugs.json?name=${term}`;

export const RX_ALL_NDCS_URI = (rxcui:string) => `REST/rxcui/${rxcui}/allndcs.json`;

export const RX_NDCS_URI = (rxcui:string) => `REST/rxcui/${rxcui}/ndcs.json`;

export const RX_NDCS_STATUS_URI = (ndc:string) => `REST/ndcstatus.json?ndc=${ndc}`;

export const RX_URI_NDC_PROPERTIES = (ndc:string) => `REST/rxcui/${ndc}/properties.json`;

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
