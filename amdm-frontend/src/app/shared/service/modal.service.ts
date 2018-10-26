import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ModalService {
    public data: BehaviorSubject<any>;

    constructor() {
        this.data = new BehaviorSubject<any>('');
    }
}