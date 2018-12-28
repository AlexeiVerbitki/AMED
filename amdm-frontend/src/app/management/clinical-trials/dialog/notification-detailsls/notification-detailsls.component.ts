import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestService} from "../../../../shared/service/request.service";
import {ClinicalTrialService} from "../../../../shared/service/clinical-trial.service";

@Component({
    selector: 'app-notification-detailsls',
    templateUrl: './notification-detailsls.component.html',
    styleUrls: ['./notification-detailsls.component.css']
})
export class NotificationDetailslsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    ctNotifForm: FormGroup;

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private requestService: RequestService,
                private ctService: ClinicalTrialService,
                public dialogRef: MatDialogRef<NotificationDetailslsComponent>) {
    }

    ngOnInit() {
        console.log('dataDialog', this.dataDialog);

        this.ctNotifForm = this.fb.group({
            'documents': [],
            'title': [{value: null, disabled: true}],
            'clinicTrailNotificationTypeEntity': [],
            'startDateInternational': {value: null, disabled: true},
            'startDateNational': {value: null, disabled: true},
            'endDateNational': {value: null, disabled: true},
            'endDateInternational': {value: null, disabled: true},
        });

        this.subscriptions.push(
            this.ctService.loadRegistrationRequestById(this.dataDialog.id).subscribe(data => {
                console.log('data', data);
                this.ctNotifForm.get('documents').setValue(data.documents);
                let currentNotification = data.clinicalTrails.clinicTrialNotificationEntities.find(notification => this.dataDialog.id == notification.registrationRequestId);
                console.log('currentNotification', currentNotification);
                this.ctNotifForm.get('title').setValue(currentNotification.title);
                this.ctNotifForm.get('clinicTrailNotificationTypeEntity').setValue(currentNotification.clinicTrailNotificationTypeEntity);
                this.ctNotifForm.get('startDateInternational').setValue(data.clinicalTrails.startDateInternational ? new Date(data.clinicalTrails.startDateInternational) : null);
                this.ctNotifForm.get('startDateNational').setValue(data.clinicalTrails.startDateNational ? new Date(data.clinicalTrails.startDateNational) : null);
                this.ctNotifForm.get('endDateNational').setValue(data.clinicalTrails.endDateNational ? new Date(data.clinicalTrails.endDateNational) : null);
                this.ctNotifForm.get('endDateInternational').setValue(data.clinicalTrails.endDateInternational ? new Date(data.clinicalTrails.endDateInternational) : null);
                console.log('this.ctNotifForm', this.ctNotifForm);

            })
        );
    }

    cancel() {
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

}
