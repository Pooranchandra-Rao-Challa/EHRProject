import { JsonPipe } from "@angular/common";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class EndpointBase {
  //  UserData:any=JSON.parse(localStorage.getItem('UserInformation'));

  constructor() { }

  protected get requestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    let UserData = JSON.parse(localStorage.getItem("UserInformation") || "{}");

    const headers = new HttpHeaders({
      //'Authorization': 'Bearer '+ UserData.access_token,
      "Content-Type": "application/json",
      // Accept: 'application/json, text/plain, */*'
    });
    return { headers: headers };
  }
}
