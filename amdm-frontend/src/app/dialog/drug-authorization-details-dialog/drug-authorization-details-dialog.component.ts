import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DrugDecisionsService} from '../../shared/service/drugs/drugdecisions.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog.component';

@Component({
    selector: 'app-drug-authorization-details-dialog',
    templateUrl: './drug-authorization-details-dialog.component.html',
    styleUrls: ['./drug-authorization-details-dialog.component.css']
})
export class DrugAuthorizationDetailsDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    mForm: FormGroup;
    nForm: FormGroup;
    disabled = true;
    authorizedSubstancesTable: any[] = [];
    hasError: boolean;
    hasErrorUsedQuantity: boolean;
    authorizationNotValid: boolean;
    authorizationExpired: boolean;
    usedQuantity: number;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<DrugAuthorizationDetailsDialogComponent>,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private drugDecisionsService: DrugDecisionsService,
                public dialogConfirmation: MatDialog
    ) {
        this.mForm = fb.group({
            'protocolNr': [null],
            'protocolDate': [null],
            'companyName': [null],
            'medicamentCommercialName': [null],
            'medicamentCode': [null],
            'requestNumber': [null],
            'drugSubstanceTypesCode': [null],
            'precursor': [{value: false, disabled: this.disabled}],
            'psihotrop': [{value: false, disabled: this.disabled}],
            'stupefiant': [{value: false, disabled: this.disabled}],
            'drugImportExportDetails': [[]]
        });

        this.nForm = fb.group({
            'usedQuantity': [null, Validators.required],
            'errorMessage': [null]
        });
    }

    ngOnInit() {
        this.mForm.get('protocolDate').disable();
        this.subscriptions.push(this.drugDecisionsService.getDrugDecisionById(this.dataDialog.value).subscribe(data => {
            this.mForm.get('protocolNr').setValue(data[0].protocolNr);
            this.mForm.get('protocolDate').setValue(new Date(data[0].protocolDate));
            this.mForm.get('companyName').setValue(data[0].companyName);
            this.mForm.get('requestNumber').setValue(data[0].requestNumber);
            this.mForm.get('drugSubstanceTypesCode').setValue(data[0].drugSubstanceTypesCode);
            this.mForm.get('drugImportExportDetails').setValue(data[0].importExportDetails);
            this.populateTypeOfSubstances();

            this.subscriptions.push(
                this.drugDecisionsService.getImportExportDetailsByDecisionId(this.dataDialog.value).subscribe(data => {

                        for (const entry of data) {

                            this.authorizedSubstancesTable.push(entry);
                        }
                    },
                    error => console.log(error)
                )
            );
        }));

    }

    populateTypeOfSubstances() {

        if (this.mForm.get('drugSubstanceTypesCode').value) {
            if (this.mForm.get('drugSubstanceTypesCode').value == 'PRECURSOR') {
                this.mForm.get('precursor').setValue(true);
            } else if (this.mForm.get('drugSubstanceTypesCode').value == 'PSIHOTROP') {
                this.mForm.get('psihotrop').setValue(true);
            } else if (this.mForm.get('drugSubstanceTypesCode').value == 'STUPEFIANT') {
                this.mForm.get('stupefiant').setValue(true);
            } else if (this.mForm.get('drugSubstanceTypesCode').value == 'PRECURSOR/PSIHOTROP') {
                this.mForm.get('precursor').setValue(true);
                this.mForm.get('psihotrop').setValue(true);
            } else if (this.mForm.get('drugSubstanceTypesCode').value == 'PRECURSOR/STUPEFIANT') {
                this.mForm.get('precursor').setValue(true);
                this.mForm.get('stupefiant').setValue(true);
            } else if (this.mForm.get('drugSubstanceTypesCode').value == 'PSIHOTROP/STUPEFIANT') {
                this.mForm.get('stupefiant').setValue(true);
                this.mForm.get('psihotrop').setValue(true);
            } else if (this.mForm.get('drugSubstanceTypesCode').value == 'PRECURSOR/PSIHOTROP/STUPEFIANT') {
                this.mForm.get('precursor').setValue(true);
                this.mForm.get('psihotrop').setValue(true);
                this.mForm.get('stupefiant').setValue(true);
            }
        }
    }

    confirm(): void {
        this.dialogRef.close(true);
    }

    validateQuantity(substance: any) {

        if (substance.authorizedQuantity == null || this.nForm.value.usedQuantity == null) {
            this.hasError = true;
            return;
        }

        this.usedQuantity = this.nForm.value.usedQuantity + substance.usedQuantity;
        if (substance.authorizedQuantity < this.usedQuantity) {
            this.hasErrorUsedQuantity = true;
            return;
        }

    }

    validateAuthorizationDates(substance: any) {

        if (substance.toDate != null && substance.fromDate != null) {

            const fromDate = new Date(substance.fromDate);
            const toDate = new Date(substance.toDate);
            const date = new Date();
            if (date.getTime() < fromDate.getTime()) {
                this.authorizationNotValid = true;
                return;
            }
            if (date.getTime() >= toDate.getTime()) {
                this.authorizationExpired = true;
                return;
            }
        } else {
            this.hasError = true;
            return;
        }

    }

    doValidations(substance: any) {
        this.hasError = false;
        this.hasErrorUsedQuantity = false;
        this.authorizationNotValid = false;
        this.authorizationExpired = false;
        this.validateQuantity(substance);
        this.validateAuthorizationDates(substance);
    }

    updateUsedQuantity(substance) {

        this.doValidations(substance);

        if (this.hasError || this.hasErrorUsedQuantity || this.authorizationNotValid || this.authorizationExpired || this.nForm.invalid) {
            return;
        }
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                substance.usedQuantity = this.usedQuantity;
                this.subscriptions.push(this.drugDecisionsService.saveImportExportDetails(substance).subscribe(data => {

                    }, error => console.log(error))
                );
            }

        });
    }
}
