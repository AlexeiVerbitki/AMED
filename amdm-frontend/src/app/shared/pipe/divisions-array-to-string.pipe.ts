import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'divisionsToString', pure: false})
export class DivisionsArrayToStringPipe implements PipeTransform {
    transform(values: any[]): string {
        let result = '';
        for (const value of values) {
            result += value.description + '; ';
        }
        return result.substr(0, result.length - 2);
    }
}
