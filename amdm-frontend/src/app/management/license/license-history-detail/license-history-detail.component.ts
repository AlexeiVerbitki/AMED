import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LicenseService} from '../../../shared/service/license/license.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-license-history-detail',
    templateUrl: './license-history-detail.component.html',
    styleUrls: ['./license-history-detail.component.css']
})
export class LicenseHistoryDetailComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    modifiedList: any [];
    removedList: any [];
    addedList: any [];

    constructor(public dialogRef: MatDialogRef<LicenseHistoryDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private licenseService: LicenseService) {
    }

    ngOnInit() {
        this.subscriptions.push(this.licenseService.compareRevisionForLicense(this.dataDialog.licenseId, this.dataDialog.reqId).subscribe(data => {
            console.log('sfsd', data);
            if (data) {
                const obj: any [] = data;
                this.modifiedList = obj.filter(ff => ff.action === 'MODIFY');
                this.removedList = obj.filter(ff => ff.action === 'REMOVE');
                this.addedList = obj.filter(ff => ff.action === 'ADD');
            }
        }));
    }

    cancel() {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
