import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ErrorHandlerService} from "../shared/service/error-handler.service";
import {ModalDirective} from "angular-bootstrap-md";

@Component({
    selector: 'app-server-response-handler',
    templateUrl: './error-response-handler.component.html',
    styleUrls: ['./error-response-handler.component.css']
})
export class ErrorResponseHandlerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') modalDialog: ModalDirective;
    public error: string;

    constructor(private errorHandlerService: ErrorHandlerService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.errorHandlerService.error.asObservable().subscribe(value => {
            if (value && value.length > 0) {
                this.error = value;
                this.modalDialog.show();
            }
        });
    }

    closeErrorModal() {
        this.error = '';
        this.modalDialog.hide();
    }

    ngOnDestroy() {
        this.errorHandlerService.error.complete();
    }
}
