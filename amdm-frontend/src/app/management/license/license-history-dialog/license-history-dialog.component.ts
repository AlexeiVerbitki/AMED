import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {LicenseService} from '../../../shared/service/license/license.service';
import {LicenseHistoryDetailComponent} from '../license-history-detail/license-history-detail.component';

@Component({
    selector: 'app-license-history-dialog',
    templateUrl: './license-history-dialog.component.html',
    styleUrls: ['./license-history-dialog.component.css']
})
export class LicenseHistoryDialogComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;

    requests: any [] = [];

    private subscriptions: Subscription[] = [];


    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<LicenseHistoryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private licenseService: LicenseService,
                public dialogHistoryDetail: MatDialog) {
    }

    ngOnInit() {

        this.subscriptions.push(this.licenseService.findRequestsForLicense(this.dataDialog.licenseId).subscribe(data => {
            this.requests = data;
            console.log('data', data);
        }));
    }

    cancel() {
        this.dialogRef.close();
    }


    showDetails(reqId: string) {
        const dialogRef2 = this.dialogHistoryDetail.open(LicenseHistoryDetailComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
                licenseId: this.dataDialog.licenseId,
                reqId: reqId,
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                //do nothing
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
