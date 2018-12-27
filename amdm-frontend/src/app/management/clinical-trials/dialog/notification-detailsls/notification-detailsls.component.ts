import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestService} from "../../../../shared/service/request.service";

@Component({
    selector: 'app-notification-detailsls',
    templateUrl: './notification-detailsls.component.html',
    styleUrls: ['./notification-detailsls.component.css']
})
export class NotificationDetailslsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    ctAmendForm: FormGroup;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private requestService: RequestService,
                public dialogRef: MatDialogRef<NotificationDetailslsComponent>) {
    }

    ngOnInit() {
        console.log('dataDialog', this.dataDialog);

        this.ctAmendForm = this.fb.group({
            'documents': [],
            'note': [{value: null, disabled: true}]
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

}
