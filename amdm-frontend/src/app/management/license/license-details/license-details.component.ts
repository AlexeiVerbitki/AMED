import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs';
import {LicenseService} from '../../../shared/service/license/license.service';
import {LicenseHistoryDialogComponent} from '../license-history-dialog/license-history-dialog.component';

@Component({
    selector: 'app-license-details',
    templateUrl: './license-details.component.html',
    styleUrls: ['./license-details.component.css']
})
export class LicenseDetailsComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;

    status: string;

    companiiPerIdnoSelected: any[] = [];

    private subscriptions: Subscription[] = [];


    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<LicenseDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private licenseService: LicenseService,
                public dialogHistory: MatDialog) {
    }


    ngOnInit() {
        this.initFormData();

        this.subscriptions.push(this.licenseService.findLicenseById(this.dataDialog.licenseId).subscribe(data => {
            console.log('sfsd', data);
            this.patchValue(data);
        }));


    }

    private initFormData() {
        this.rForm = this.fb.group({
            'companyName': {value: null, disabled : true},
            'companyIdno': {value: null, disabled : true},
            'seriaLicenta': {value: null, disabled : true},
            'nrLicenta': {value: null, disabled : true},
            'dataExpirare': {value: null, disabled : true},
            'dataEliberarii': {value: null, disabled : true},
            'reasonSuspension': {value: null, disabled : true},
            'reasonCancel': {value: null, disabled : true},
        });
    }


    private patchValue(data: any) {
        this.rForm.get('seriaLicenta').patchValue(data.serialNr);
        this.rForm.get('nrLicenta').patchValue(data.nr);
        this.rForm.get('companyName').patchValue(data.companyName);
        this.rForm.get('companyIdno').patchValue(data.idno);
        this.rForm.get('dataEliberarii').patchValue(new Date(data.releaseDate));
        this.rForm.get('dataExpirare').patchValue(new Date(data.expirationDate));
        if (data.status === 'S') {
            this.rForm.get('reasonSuspension').patchValue(data.reason);
        } else if (data.status === 'R') {
            this.rForm.get('reasonCancel').patchValue(data.reason);
        }

        this.status = data.status;

        this.companiiPerIdnoSelected = data.economicAgents;


        this.companiiPerIdnoSelected.forEach(cis => {
            cis.companyType = cis.type.description;
            if (cis.locality) {
                cis.address = cis.locality.stateName + ', ' + cis.locality.description + ', ' + cis.street;
            }

            let activitiesStr;
            cis.activities.forEach(r => {
                if (activitiesStr) {
                    activitiesStr += ', ' + r.description;
                } else {
                    activitiesStr = r.description;
                }

            });
            cis.activitiesStr = activitiesStr;
        });
    }

    cancel() {
        this.dialogRef.close();
    }

    showLicenseHistory() {
        const dialogRef2 = this.dialogHistory.open(LicenseHistoryDialogComponent, {
            width: '1000px',
            panelClass: 'materialLicense',
            data: {
                licenseId: this.dataDialog.licenseId,
            },
            hasBackdrop: true
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
