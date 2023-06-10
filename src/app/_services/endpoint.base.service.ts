
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class EndpointBase {
  jwtToken: string = '';

  constructor() {
    let user = localStorage.getItem('user');
    if (user) {
      let sessionUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (sessionUser) {
        this.jwtToken = sessionUser.JwtToken
      }
    }

  }

  protected get requestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": this.jwtToken
    });
    return { headers: headers };
  }
}
