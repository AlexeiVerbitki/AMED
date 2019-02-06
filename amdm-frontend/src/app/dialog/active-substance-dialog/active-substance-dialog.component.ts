import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../shared/service/administration.service';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog.component';
import {SuccessOrErrorHandlerService} from '../../shared/service/success-or-error-handler.service';
import {AddManufactureComponent} from '../add-manufacture/add-manufacture.component';

@Component({
    selector: 'app-active-substance-dialog',
    templateUrl: './active-substance-dialog.component.html',
    styleUrls: ['./active-substance-dialog.component.css']
})

export class ActiveSubstanceDialogComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    aForm: FormGroup;
    title = 'Adaugare substanta activa';
    activeSubstances: any[];
    formSubmitted: boolean;
    activeSubstanceUnitsOfMeasurement: any[];
    loadingActiveSubst = false;
    manufacturesTable: any[] = [];

    constructor(private administrationService: AdministrationService,
                private fb: FormBuilder,
                public dialog: MatDialog,
                private errorService: SuccessOrErrorHandlerService,
                public dialogRef: MatDialogRef<ActiveSubstanceDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
        this.aForm = fb.group({
            'activeSubstance': [null, Validators.required],
            'activeSubstanceCode': [null],
            'activeSubstanceQuantity': [null, Validators.required],
            'compositionNumber': [null, Validators.required],
            'activeSubstanceUnit': [null, Validators.required],
            'manufactures': [null],
            'status': [null],
            'response': [null]
        });
    }

    ngOnInit() {

        if (this.dataDialog && this.dataDialog.disableSubstance) {
            this.aForm.get('activeSubstance').disable();
        }

        if (this.dataDialog) {
            this.aForm.get('activeSubstanceQuantity').setValue(this.dataDialog.quantity);
            this.manufacturesTable = this.dataDialog.manufactures;
        }

        this.loadingActiveSubst = true;
        this.subscriptions.push(
            this.administrationService.getAllActiveSubstances().subscribe(data => {
                    this.activeSubstances = data;
                    if (this.dataDialog) {
                        this.aForm.get('activeSubstance').setValue(this.activeSubstances.find(r => r.id === this.dataDialog.activeSubstance.id));
                        this.aForm.get('activeSubstanceCode').setValue(this.aForm.get('activeSubstance').value.code);
                    }
                    this.loadingActiveSubst = false;
                },
                error => {
                    console.log(error);
                    this.loadingActiveSubst = false;
                }
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.activeSubstanceUnitsOfMeasurement = data;
                    if (this.dataDialog) {
                        this.aForm.get('activeSubstanceUnit').setValue(this.activeSubstanceUnitsOfMeasurement.find(r => r.id === this.dataDialog.unitsOfMeasurement.id));
                    }
                },
                error => console.log(error)
            )
        );

        if (this.dataDialog) {
            this.title = 'Editare substanta activa';
            this.aForm.get('status').setValue(this.dataDialog.status);
            this.aForm.get('compositionNumber').setValue(this.dataDialog.compositionNumber);
        }
    }

    checkActiveSubstanceValue() {
        if (this.aForm.get('activeSubstance').value == null) {
            return;
        }

        this.aForm.get('activeSubstanceCode').setValue(this.aForm.get('activeSubstance').value.code);
    }

    add() {
        this.formSubmitted = true;

        console.log(this.manufacturesTable.length == 0);
        if (this.aForm.invalid || this.manufacturesTable.length == 0) {
            return;
        }

        this.formSubmitted = false;

        this.aForm.get('response').setValue(true);
        this.aForm.get('activeSubstance').enable();
        this.aForm.get('manufactures').setValue(this.manufacturesTable);
        this.dialogRef.close(this.aForm.value);
    }

    cancel() {
        this.aForm.get('response').setValue(false);
        this.dialogRef.close(this.aForm.value);
    }

    addManufacture() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';

        dialogConfig2.data = {manufacturesTable : this.manufacturesTable};

        const dialogRef = this.dialog.open(AddManufactureComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.manufacturesTable.push({manufacture: result.manufacture});
                }
            }
        );
    }

    removeManufacture(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceast producator?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.manufacturesTable.splice(index, 1);
            }
        });
    }
}


