import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class NavbarTitleService {
    public message: BehaviorSubject<string>;

    constructor() {
            this.message = new BehaviorSubject<string>('');
    }

    showTitleMsg(titleMsg: string) {
            this.message.next(titleMsg);
    }
}
