import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, keys: any, term: string): string {
    debugger;
    if (!term) {
      return value;
    }
    return (value || []).filter((item) =>
      keys
        .split(',')
        .find(
          (key) =>
            item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])
        )
    );
  }
}
