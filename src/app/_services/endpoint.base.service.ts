
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class EndpointBase {


  constructor() { }

  protected get requestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {


    const headers = new HttpHeaders({
      "Content-Type": "application/json",

    });
    return { headers: headers };
  }
}
