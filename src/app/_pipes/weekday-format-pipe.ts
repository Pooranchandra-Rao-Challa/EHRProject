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
        rtnString +='<div style="color:green" >'+ timeslot.WeekDay+', '+timeslot.From+'-'+timeslot.To +  '</div>'
      else if(timeslot.SpecificHour == 'Closed/NA')
      {
        rtnString += '<div style="color:red" >'+ timeslot.WeekDay+', '+timeslot.SpecificHour+'</div>';
      }
      else{
        rtnString += '<div style="color:#74757e" >'+ timeslot.WeekDay+', '+timeslot.SpecificHour+'</div>';
      }
     
    });
    return this.sanitizer.bypassSecurityTrustHtml(rtnString);
  }
}
