import { Pipe, PipeTransform } from '@angular/core';
import { TimeSlot } from 'src/app/_models';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { E } from '@angular/cdk/keycodes';
@Pipe({
  name: 'weekdayFormat'
})
export class WeekdayFormatPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {

  }
  transform(timeSlots: TimeSlot[]): SafeHtml {
    var rtnString ='';
    timeSlots.forEach(timeslot => {
      if(rtnString != '') rtnString += '<br/>'
      if(timeslot.SpecificHour == 'Specific Hours')
        rtnString += timeslot.WeekDay+', '+timeslot.From+'-'+timeslot.To
      else
        rtnString += timeslot.WeekDay+', '+timeslot.SpecificHour;
    });
    return this.sanitizer.bypassSecurityTrustHtml(rtnString);
  }
}
