import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {LoaderService} from '../../../shared/service/loader.service';
import {DrugDocumentsService} from '../../../shared/service/drugs/drugdocuments.service';
import {AdministrationService} from '../../../shared/service/administration.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {DecimalPipe} from '@angular/common';

@Component({
    selector: 'app-add-declaration-dialog',
    templateUrl: './add-declaration-dialog.component.html',
    styleUrls: ['./add-declaration-dialog.component.css']
})
export class AddDeclarationDialogComponent implements OnInit, OnDestroy {

    rFormSubbmitted = false;
    rForm: FormGroup;

    declarations: any[] = [];

    private subscriptions: Subscription[] = [];

    numberPipe: DecimalPipe = new DecimalPipe('en-US');

    constructor(public dialogRef: MatDialogRef<AddDeclarationDialogComponent>,
                public dialogConfirmation: MatDialog,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private fb: FormBuilder,
                private loadingService: LoaderService,
                private drugDocumentsService: DrugDocumentsService,
                private administrationService: AdministrationService,
                private errorHandlerService: SuccessOrErrorHandlerService) {
    }

    ngOnInit() {
        this.initFormData();
        this.declarations = this.dataDialog.details.substance.declarations;

        const value = this.dataDialog.details.substance.authorizedQuantity - this.declarations.map(dcl => parseFloat(dcl.substActiveQuantityUsed)).reduce((a, b) => a + b, 0);
        this.rForm.get('activeSubstanceQuantityRemaining').setValue(this.numberPipe.transform(value, '1.2-2'));
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'quantity': [null, [Validators.required, Validators.maxLength(9), Validators.pattern('^[0-9]+([\\.,](\\d{1,2})?)?$')]],
            'activeSubstanceQuantity': [null, [Validators.required, Validators.maxLength(9), Validators.pattern('^[0-9]+([\\.,](\\d{1,2})?)?$')]],
            'activeSubstanceQuantityUM': [{
                value: this.dataDialog.details.substance.authorizedQuantityUnitDesc,
                disabled: true
            }],
            'quantityUM': [{value: this.dataDialog.details.mainSubstanceDetails.packagingQuantityUnitDesc, disabled: true}],
            'activeSubstanceQuantityRemaining': [{value: 0.0, disabled: true}],
        });
    }

    ok() {
        this.dataDialog.details.substance.declarations = this.declarations;
        this.dialogRef.close({success: true, quantityRemaining : this.rForm.get('activeSubstanceQuantityRemaining').value});
    }

    cancel() {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close({success: false});
            }
        });
    }


    addDeclaration() {
        this.rFormSubbmitted = true;

        if (this.rForm.invalid) {
            return;
        }

        const value = parseFloat(this.rForm.get('activeSubstanceQuantity').value);
        let totalSum = parseFloat(this.declarations.map(dcl => dcl.substActiveQuantityUsed).reduce((a, b) => a + b, 0));

        totalSum += value;

        if (this.dataDialog.details.substance.authorizedQuantity < totalSum) {
            this.errorHandlerService.showError('Cantitatea de substanta activa depaseste cantitatea autorizata.');
            return;
        }

        this.rFormSubbmitted = false;

        this.declarations.push({
            quantity: this.rForm.get('quantity').value,
            substActiveQuantityUsed: this.rForm.get('activeSubstanceQuantity').value,
            declarationDate: new Date()
        });

        this.rForm.get('activeSubstanceQuantityRemaining').setValue(this.numberPipe.transform(this.dataDialog.details.substance.authorizedQuantity - totalSum, '1.2-2'));

        this.rForm.get('quantity').setValue(null);
        this.rForm.get('activeSubstanceQuantity').setValue(null);
    }

    remove(declare: any, index: number) {
        const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta declaratie?', confirm: false}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.declarations.splice(index, 1);
                const value = this.dataDialog.details.substance.authorizedQuantity - this.declarations.map(dcl => dcl.substActiveQuantityUsed).reduce((a, b) => a + b, 0);
                this.rForm.get('activeSubstanceQuantityRemaining').setValue(this.numberPipe.transform(value, '1.2-2'));
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
