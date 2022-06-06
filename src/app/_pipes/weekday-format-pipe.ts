import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'weekdayFormat'
})
export class WeekdayFormatPipe implements PipeTransform {

  transform(weekday: string, from: string, to: string,specifichours: string): string {

    if(specifichours == 'Specific Hours')
      return weekday+', '+from+'-'+to;
    else
      return weekday+', '+specifichours;
  }
}
