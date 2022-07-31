import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(value: any, keys: any, term: string): string {
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


@Pipe({
  name: 'active'
})
export class ActivePipe implements PipeTransform {
  transform(value: any): string {
    //debugger;
    if (value) {
      return "Active";
    } else if (value == null) {
      return ""
    } else {
      return "InActive"
    }

  }
}


@Pipe({
  name: 'globalsearch'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }
}
