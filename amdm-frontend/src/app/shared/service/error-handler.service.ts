import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService implements OnInit, OnDestroy {
    public error: BehaviorSubject<string>;

    constructor() {
        this.error = new BehaviorSubject<string>('');
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }


}
