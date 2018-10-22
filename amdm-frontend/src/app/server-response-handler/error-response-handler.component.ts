import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ErrorHandlerService} from "../shared/service/error-handler.service";
import {MDBModalRef} from "angular-bootstrap-md";

@Component({
    selector: 'app-server-response-handler',
    templateUrl: './error-response-handler.component.html',
    styleUrls: ['./error-response-handler.component.css']
})
export class ErrorResponseHandlerComponent implements OnInit, OnDestroy {

    @ViewChild('errorModal') modalDialog: MDBModalRef;
    private error: string;

    constructor(private errorHandlerService: ErrorHandlerService) {
    }

    ngOnInit() {
        this.errorHandlerService.error.asObservable().subscribe(value => {
            this.error = value;
            console.log('error response handler: ', value);
        })
    }

    ngOnDestroy() {
    }
}
