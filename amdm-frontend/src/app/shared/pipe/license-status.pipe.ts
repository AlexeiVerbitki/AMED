import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'licenseStatus'
})
export class LicenseStatusPipe implements PipeTransform {

  transform(value: string): string {
    let valToReturn;
    if (value === 'F')
    {
      valToReturn = 'Activa';
    }
    else if (value === 'R')
    {
        valToReturn = 'Anulata';
    }
    else if (value === 'S')
    {
        valToReturn = 'Suspendata';
    }
    return valToReturn;
  }

}
