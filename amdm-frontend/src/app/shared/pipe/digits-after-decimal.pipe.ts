import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'digitsAfterDecimal'})
export class DigitsAfterDecimalPipe implements PipeTransform {
    transform(value: string, numberOfDigitsToTheRightOfDecimal: number): string {
        const num: number = +value;
        if (!num) {
            return '-';
        }
        return num.toFixed(numberOfDigitsToTheRightOfDecimal);
    }
}
