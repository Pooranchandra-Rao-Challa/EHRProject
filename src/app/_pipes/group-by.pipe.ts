import { Pipe, PipeTransform } from '@angular/core';
import { IDeleteFlag } from '../_models';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(value: Array<any>, field: string): Array<any> {

    if (!value) {
      return value;
    }

    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }

      return prev;
    }, {});

    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }
}

@Pipe({
  name: 'datasourceFilter'
})
export class DataSourceFilterPipe implements PipeTransform {

  transform(value: any[] , ...args: any[]) : any[]
  {
    if(value==null && value.length == 0) return value;
    return (value as IDeleteFlag[]).filter(fn => fn.CanDelete === false)
  }


}
