import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService implements OnInit, OnDestroy {
    public error: BehaviorSubject<string>;

    constructor() {
        this.error = new BehaviorSubject<string>('');
    }

    showError(errorMessage: string) {
        this.error.next(errorMessage);
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }


}
