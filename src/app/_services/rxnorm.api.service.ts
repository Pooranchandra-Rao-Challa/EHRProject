import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, pipe, throwError } from "rxjs";
import { catchError, map, take, tap } from "rxjs/operators";
import {
  environment,
  RX_DRUG_URI,
  RX_NDCS_STATUS_URI,
  RX_NDCS_URI
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

  Drugs(term: string): Observable<Drug[]> {
    console.log(this._drugUrl(term));

    return this.http.get<Drug[]>(this._drugUrl(term)).pipe(
      map((result) => {
        let returnDrugs: Drug[] = [];
        console.log(result);

        var drugs = result as Drugs;
        if (drugs != null &&
          drugs.drugGroup != null &&
          drugs.drugGroup.conceptGroup != null &&
          drugs.drugGroup.conceptGroup.length > 0) {
          drugs.drugGroup.conceptGroup.forEach((value) => {
            if (value != null && value.conceptProperties != null
              && value.conceptProperties.length > 0) {
              value.conceptProperties.forEach((props) => {
                returnDrugs.push(
                  {
                    Name: props.name,
                    rxcui: props.rxcui
                  }
                )
              })
            }
          })
        }
        return returnDrugs;
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
  //Handel Errorss
  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error("serverside error", error.error);
    }
    return throwError(error.error.Message);
  }

}

export interface Drug {
  Name: string;
  rxcui: string;
}

export class Drugs {
  public drugGroup?: drugGroupObj;
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
