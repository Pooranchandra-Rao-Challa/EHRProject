import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { StringMapWithRename } from "@angular/compiler/src/compiler_facade_interface";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, pipe, throwError } from "rxjs";
import { catchError, map, take, tap } from "rxjs/operators";
import {
  environment,
  RX_DRUG_URI,
  RX_NDCS_STATUS_URI,
  RX_NDCS_URI,
  RX_URI_NDC_PROPERTIES,
  RXCUI_NAME_URI
} from "src/environments/environment";



@Injectable()
export class RxNormAPIService {
  constructor(public http: HttpClient) {

  }

  private _drugUrl(term: string): string {
    //const baseUri = environment.RX_END_POINT;
    //const drugUri = RX_DRUG_URI(term);
    return RX_DRUG_URI(term);
  }
  private _ndcsUrl(rxcui: string): string {
    //const baseUri = environment.RX_END_POINT;
    //const rxcuiUri = RX_NDCS_URI(rxcui);
    return RX_NDCS_URI(rxcui);
  }

  private _ndcStatusUrl(ndc: string): string {
    const baseUri = environment.RX_END_POINT;
    const ndcStatusUri = RX_NDCS_STATUS_URI(ndc);
    return baseUri + ndcStatusUri;
  }

  private _ndcPropertiesUrl(ndc:string):string{
    return RX_URI_NDC_PROPERTIES(ndc);
  }

  drugRegex = /(!?\w*\s?[-.\[\]]?)*/gi;
  drugSplitter: RegExp = /(\s+\/\s+)/;

  parseString(regex,text,groupname){

    let textArray = regex.exec(text);
    let returnvalue ="";
    if(textArray && textArray.groups){
      return textArray.groups[groupname];
    }
    else if(textArray) {
      textArray.forEach(element => {
        if(element !== undefined){
          element = element.replace(/^\s+|\s+$/g, '')
          if(element != '') {
            if(returnvalue != '')returnvalue+='/ ';
            returnvalue += element
          }
        }
      });
      if(returnvalue == undefined || returnvalue == null) returnvalue = '';
      return returnvalue
    }
    else return "";
  }

/**clinical drug (SCD), clinical pack (GPCK), branded drug (SBD), branded pack (BPCK) */

  ParseDrugs(drugObj:any): Drug[]{
    let returnDrugs: Drug[] = [];
    let brand = this.parseString(/(?<brand>\[\w*(!?[\s\w*_-]*)\])/,drugObj.name,'brand').replace(/^\s+|\s+$/g, '');


    if(drugObj.tty == 'GPCK' || drugObj.tty == 'BPCK') return returnDrugs;
    let nameArr = drugObj.name.split(this.drugSplitter).filter((_, i) => i % 2 === 0) as string[];
    let drugform = this.parseString(/(?<drugform>Tablet|Tablets|Capsule|Capsules|Suspension|Suspensions|Lotion|Foam|Ointment|Cream|Injection|Lancet|Solution|Powder|Spray|Gel|Pack|Packet|Prefilled Syringe|Rectal Suppository|Auto-Injector|Sublingual Film|Pen Injector|Granules|Lozenge|Transdermal System|Medicated Pad|Vaginal Insert|Buccal Film|Sublingual Tablet|Implant|Suspension Powder)/gi,drugObj.synonym,'drugform').replace(/^\s+|\s+$/g, '');

    if(drugform == '')
      drugform = this.parseString(/(?<drugform>Tablet|Tablets|Capsule|Capsules|Suspension|Suspensions|Lotion|Foam|Ointment|Cream|Injection|Lancet|Solution|Powder|Spray|Gel|Pack|Packet|Prefilled Syringe|Rectal Suppository|Auto-Injector|Sublingual Film|Pen Injector|Granules|Lozenge|Transdermal System|Medicated Pad|Vaginal Insert|Buccal Film|Sublingual Tablet|Implant|Suspension Powder)/gi,drugObj.name,'drugform').replace(/^\s+|\s+$/g, '');
    nameArr = nameArr.map((value,index)=>{
      if(value.indexOf("(")>-1)
        return value.substring(value.indexOf("(")+1).replace(drugform,"").replace(brand,"").replace(/(\s{2,})/,"").replace(/^\w/, (c) => c.toUpperCase())+" "+drugform + " " + brand
      else if(value.indexOf(")")>-1)
        return value.substring(0,value.indexOf(")")).replace(drugform,"").replace(brand,"").replace(/(\s{2,})/,"").replace(/^\w/, (c) => c.toUpperCase())+" "+drugform + " " + brand
      else
        return value.replace(drugform,"").replace(brand,"").replace(/(\s{2,})/,"").replace(/^\w/, (c) => c.toUpperCase())+ " "+ drugform  + " " + brand
    })
    if(nameArr.length > 0){
      nameArr.forEach((name,i) => {
        returnDrugs.push({
          Name: name,
          Synonym : name,
          rxcui: drugObj.rxcui,
          TermType: drugObj.tty
        })
      });
    }
    return returnDrugs;
  }
  Drugs(term: string): Observable<DrugGroup[]> {
    return this.http.get<Drug[]>(this._drugUrl(term)).pipe(
      map((result) => {
        let returnDrugs: Drug[] = [];
        var drugs = result as Drugs;
        if (drugs != null &&
          drugs.drugGroup != null &&
          drugs.drugGroup.conceptGroup != null &&
          drugs.drugGroup.conceptGroup.length > 0) {
          drugs.drugGroup.conceptGroup.forEach((value) => {
            if (value != null && value.conceptProperties != null
              && value.conceptProperties.length > 0) {
              value.conceptProperties.forEach((props) => {
                returnDrugs.push(...this.ParseDrugs(props))
              })
            }
          })
        }
        return groupByTermType(returnDrugs,durg=>durg.TermType);
      }),
      catchError(this._handleError)
    );
  }

  private allNDCStatuses(rxcui: string): BehaviorSubject<ndcStatusObj> {
    if(!rxcui) return new BehaviorSubject<ndcStatusObj>(null)
    let valueSubject: BehaviorSubject<ndcStatusObj> = new BehaviorSubject<ndcStatusObj>(null)
    this.ndclist(rxcui).pipe(
      map((ndcs) => {
        return ndcs.map((ndc) => {
          return this.ndcStatus(ndc).pipe(
            map(result => {
              return result;
            })
          )
        })
      })
    ).subscribe((ndcObjservables) => {
      ndcObjservables.forEach(ndcObjservable => ndcObjservable.subscribe(
        (ndcstatus) => { valueSubject.next(ndcstatus); }
      ))
    }
    )
    return valueSubject;
  }

  ndclist(rxcui: string): Observable<string[]> {
    if(!rxcui) return  of([])
    return this.http.get<string[]>(this._ndcsUrl(rxcui)).pipe(
      map((result) => {

        let returnNDCS: string[] = [];
        var ndclist = result as NDCS;
        if (ndclist != null
          && ndclist.ndcGroup != null
          && ndclist.ndcGroup.ndcList != null
          && ndclist.ndcGroup.ndcList.ndc != null
          && ndclist.ndcGroup.ndcList.ndc.length > 0) {
          returnNDCS = ndclist.ndcGroup.ndcList.ndc;
        }
        return returnNDCS;
      }
      ),
      catchError(this._handleError)
    );
  }

  rxcuiName(rxcui:string):Observable<string>{
    return this.http.get<idGroup>(RXCUI_NAME_URI(rxcui)).pipe(
      map(result => {
        let res = (result as any).idGroup
        return res.name;
      })
    )
  }
  ndcStatus(ndc: string): Observable<ndcStatusObj> {
    return this.http.get<ndcStatusObj>(this._ndcStatusUrl(ndc)).pipe(
      map((result) => {
        let returnNDCStatuses: ndcStatusObj;
        var ndcStatus = result as NDCStatus;
        if (ndcStatus != null && ndcStatus.ndcStatus != null) {
          returnNDCStatuses = ndcStatus.ndcStatus;
        }
        return returnNDCStatuses;
      }

      ),
      catchError(this._handleError)

    );
  }

  // ndcProperties(ndc:string):Observable<string[]>{

  //   return this.http.get<Drug[]>(this._ndcPropertiesUrl(ndc)).pipe(
  //     map((result) => {
  //       let returnDrugs: Drug[] = [];
  //       var drugs = result as Drugs;
  //       if (drugs != null &&
  //         drugs.drugGroup != null &&
  //         drugs.drugGroup.conceptGroup != null &&
  //         drugs.drugGroup.conceptGroup.length > 0) {
  //         drugs.drugGroup.conceptGroup.forEach((value) => {
  //           if (value != null && value.conceptProperties != null
  //             && value.conceptProperties.length > 0) {
  //             value.conceptProperties.forEach((props) => {
  //               returnDrugs.push(
  //                 {
  //                   Name: props.name,
  //                   Synonym: props.synonym,
  //                   rxcui: props.rxcui
  //                 }
  //               )
  //             })
  //           }
  //         })
  //       }
  //       return returnDrugs;
  //     }),
  //     catchError(this._handleError)
  //   );
  // }
  //Handel Errorss
  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error( error.error ? `Server Side Error ${error.error.Message}` : `Server Side Error ${error}`);
    }
    return throwError(error.error ? error.error.Message : error);
  }

}

export interface Drug {
  Name: string;
  Synonym:string;
  rxcui: string;
  TermType?:TermTypes;
}

export interface DrugGroup{
  TermType?:TermTypes;
  Drugs: Drug[];
}

export class Drugs {
  public drugGroup?: drugGroupObj;
}

export class idGroup
{
  public name:string;
}
export class drugGroupObj {
  public name: string;
  public conceptGroup?: conceptGroupObj[]
}
export class conceptGroupObj {
  public tty?: string;
  public conceptProperties?: conceptProperty[]
}
export class conceptProperty {

  public rxcui?: string;
  public name?: string;
  public synonym?: string;
  public tty?: string;
  public language?: string;
  public suppress?: string;
  public umlscui?: string;
}
/**clinical drug (SCD), clinical pack (GPCK), branded drug (SBD), branded pack (BPCK) */
export enum TermTypes{
  SCD = "Clinical Drug",
  SBD = "Branded Drug",
  GPCK = "Clinical Pack",
  BPCK = "Branded Pack",
  NOTDEF = "not defined"
}

export class NDCS {
  ndcGroup?: ndcGroupObj;
}
export class ndcGroupObj {
  rxcui?: string;
  ndcList?: ndcListObj;

}
export class ndcListObj {
  ndc?: string[];
}

export class AllNDCs {
  ndcConcept?: ndcConceptObj;
}

export class ndcConceptObj {
  ndcTime?: ndcTimeObj;
}

export class ndcTimeObj {
  ndc?: string[];
  startDate?: string;
  endDate?: string;
}

export class NDCStatus {
  ndcStatus?: ndcStatusObj;
}

export class ndcStatusObj {
  ndc11?: string;
  status?: string;
  active?: string;
  nxnormNdc?: string;
  rxcui?: string;
  conceptName?: string;
  conceptStatus?: string;
  sourceList?: sourceListObj;
  altNdc?: string;
  comment?: string;
  ndcHistory?: ndcHistoryObj[];
  ndcSourceMapping?: ndcSourceObj[];

}


export class sourceListObj {
  sourceName?: string;
}
export class ndcHistoryObj {
  activeRxcui?: string;
  originalRxcui?: string;
  startDate?: string;
  endDate?: string;
}

export class ndcSourceObj {
  ndcSourceSource?: string;
  ndcActiveWhether?: string;
  ndcRxcuiConcept?: string;
  ndcConceptName?: string;
  ndcConceptStatus?: string;
}


function groupByTermType<_string, _MedicalCode>(array: Drug[], grouper: (item: Drug) => string) {
  let rtnValue = array.reduce((store, item) => {
    var key = grouper(item)
    if (!store.has(key)) {
      store.set(key, [item])
    } else {
      store.get(key).push(item)
    }
    return store;
  }, new Map<string, Drug[]>())

  let durgs: DrugGroup[] = [];
  rtnValue.forEach((values: Drug[], mykey: TermTypes) => {
    durgs.push({ TermType: mykey, Drugs: values })
  });
  return durgs;
}
