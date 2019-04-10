import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'tableFilter'})
export class TableFilterPipe implements PipeTransform {
    transform(items: any[], field: any, filterValues: any[]): any[] {
        if (!items) {
            return [];
        }
        if (!field || !filterValues || filterValues.length == 0) {
            return items;
        }
        return items.filter(singleItem => filterValues.includes(singleItem[field]));
    }
}
