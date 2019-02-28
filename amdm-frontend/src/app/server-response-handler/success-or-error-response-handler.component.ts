import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SuccessOrErrorHandlerService} from '../shared/service/success-or-error-handler.service';
import {ModalDirective} from 'angular-bootstrap-md';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
    selector: 'app-server-response-handler',
    templateUrl: './success-or-error-response-handler.component.html',
    styleUrls: ['./success-or-error-response-handler.component.css']
})
export class SuccessOrErrorResponseHandlerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') modalDialog: ModalDirective;
    public error: string;
    public success: string;
    public modalType = false;

    errorObs: Subscription;
    successObs: Subscription;

    constructor(private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {

        this.errorObs = this.errorHandlerService.error.asObservable().subscribe(async value => {
            if (await value && value.length > 0) {
                this.error = value;
                this.modalType = false;
                this.modalDialog.show();
            }
        }, error1 => {
            console.log('SuccessOrErrorResponseHandlerComponent error on show error', error1)
        });

        this.successObs = this.errorHandlerService.success.asObservable().subscribe(async value => {
                if (await value && value.length > 0) {
                    this.success = value;
                    this.modalType = true;
                    this.modalDialog.show();
                }
            }, error1 => {
                console.log('SuccessOrErrorResponseHandlerComponent error on show succes', error1)
            }
        );
    }

    closeErrorModal() {
        this.error = '';
        this.success = '';
        this.modalDialog.hide();
        this.errorHandlerService.cleanMessage();
    }

    ngOnDestroy() {
        this.errorObs.unsubscribe();
        this.successObs.unsubscribe();
    }
}
