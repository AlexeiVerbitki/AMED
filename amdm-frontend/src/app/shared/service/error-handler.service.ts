import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {

   public error: BehaviorSubject<string>;

    constructor() {
        this.error = new BehaviorSubject<string>('');
    }


}
