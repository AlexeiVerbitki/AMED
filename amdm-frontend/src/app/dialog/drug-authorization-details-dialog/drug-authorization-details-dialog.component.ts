import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
 import {DrugDecisionsService} from "../../shared/service/drugs/drugdecisions.service";

@Component({
  selector: 'app-drug-authorization-details-dialog',
  templateUrl: './drug-authorization-details-dialog.component.html',
  styleUrls: ['./drug-authorization-details-dialog.component.css']
})
export class DrugAuthorizationDetailsDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    mForm: FormGroup;
    disabled: boolean = true;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<DrugAuthorizationDetailsDialogComponent>,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private drugDecisionsService: DrugDecisionsService
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
            'stupefiant': [{value: false, disabled: this.disabled}]
        });
    }

    ngOnInit() {
        this.mForm.get('protocolDate').disable();
        this.subscriptions.push(this.drugDecisionsService.getDrugDecisionById(this.dataDialog.value).subscribe(data => {
            this.mForm.get('protocolNr').setValue(data[0].protocolNr);
            this.mForm.get('protocolDate').setValue(new Date(data[0].protocolDate));
            this.mForm.get('companyName').setValue(data[0].companyName);
            this.mForm.get('medicamentCommercialName').setValue(data[0].medicamentCommercialName);
            this.mForm.get('medicamentCode').setValue(data[0].medicamentCode);
            this.mForm.get('requestNumber').setValue(data[0].requestNumber);
            this.mForm.get('drugSubstanceTypesCode').setValue(data[0].drugSubstanceTypesCode);
            this.populateTypeOfSubstances();
        }));

    }

    populateTypeOfSubstances() {

        if (this.mForm.get('drugSubstanceTypesCode').value ) {
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

}
