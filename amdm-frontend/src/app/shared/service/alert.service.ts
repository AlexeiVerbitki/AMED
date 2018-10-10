import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  errStr: string;

  constructor() {
  }

  errorStr(e: string) {
    this.errStr = 'test' + e;
  }
}
