import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SuccessOrErrorHandlerService} from '../shared/service/success-or-error-handler.service';
import {ModalDirective} from 'angular-bootstrap-md';

@Component({
    selector: 'app-server-response-handler',
    templateUrl: './success-or-error-response-handler.component.html',
    styleUrls: ['./success-or-error-response-handler.component.css']
})
export class SuccessOrErrorResponseHandlerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') modalDialog: ModalDirective;
    public error: string;
    public success: string;
    public modalType: boolean;

    constructor(private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.errorHandlerService.error.asObservable().subscribe(value => {
            if (value && value.length > 0) {
                this.error = value;
                this.modalType = false;
                this.modalDialog.show();
            }
        });
        this.errorHandlerService.success.asObservable().subscribe(value => {
            if (value && value.length > 0) {
                console.log(value);
                this.success = value;
                this.modalType = true;
                this.modalDialog.show();
            }
        });
    }

    closeErrorModal() {
        this.error = '';
        this.success = '';
        this.modalDialog.hide();
    }

    ngOnDestroy() {
        this.errorHandlerService.error.complete();
        this.errorHandlerService.success.complete();
    }
}
