import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { TestOrder } from '../_models/_provider/LabandImage';


@Pipe({
  name: 'labOrderTest'
})
export class LabOrderTestFormatPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {

  }
  transform(jsonString: string): SafeHtml {
    let Tests: TestOrder[];
    if(!Array.isArray(jsonString))
      Tests = JSON.parse(jsonString);
    else Tests = jsonString;
    var rtnString ='';
    Tests.forEach(order => {
      //if(rtnString != '') rtnString += '<br/>'
      // if(timeslot.SpecificHour == 'Specific Hours')
      //   rtnString += timeslot.WeekDay+', '+timeslot.From+'-'+timeslot.To
      // else
      //   rtnString += timeslot.WeekDay+', '+timeslot.SpecificHour;
      rtnString = rtnString+'<li>'+order.Code+'-'+order.Test+'</li>'
    });
    return   this.sanitizer.bypassSecurityTrustHtml('<ul>'+rtnString+'</ul>');
  }
}
