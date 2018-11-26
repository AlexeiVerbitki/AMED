import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NavbarTitleService {
    public message: BehaviorSubject<string>;

    constructor() {
        this.message = new BehaviorSubject<string>('');
    }

    showTitleMsg(titleMsg: string) {
        this.message.next(titleMsg);
    }
}
