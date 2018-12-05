import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConfirmationDialogComponent} from "../confirmation-dialog.component";

@Component({
    selector: 'app-annihilation-med-dialog',
    templateUrl: './annihilation-med-dialog.component.html',
    styleUrls: ['./annihilation-med-dialog.component.css']
})
export class AnnihilationMedDialogComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    rFormSubbmitted: boolean = false;
    rForm: FormGroup;

    destroyMethods : any[];

    annihilationMedInitial : any;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogConfirmation: MatDialog) {
    }

    ngOnInit() {
        this.initFormData();
        this.onChanges();
    }

    private initFormData() {
        this.destroyMethods = this.dataDialog.destructionMethods;
        this.annihilationMedInitial = this.dataDialog.annihilationMed;
        this.rForm = this.fb.group({
            'medicamentName': [{value : this.annihilationMedInitial.medicamentName, disabled: true}],
            'forma': [{value : this.annihilationMedInitial.form, disabled: true}],
            'doza': [{value : this.annihilationMedInitial.dose, disabled: true}],
            'ambalajPrimar': [{value : this.annihilationMedInitial.primarePackage, disabled: true}],
            'seria': [{value : this.annihilationMedInitial.seria, disabled: true}],
            'quantity': [{value : this.annihilationMedInitial.quantity, disabled: true}],
            'reasonDestroy': [{value : this.annihilationMedInitial.uselessReason, disabled: true}],
            'note': [{value : this.annihilationMedInitial.note, disabled: true}],
            'destroyMethod': [this.annihilationMedInitial.destructionMethod, Validators.required],
            'tax': [this.annihilationMedInitial.tax, Validators.required],
            'taxTotal': [{ value : this.annihilationMedInitial.tax * this.annihilationMedInitial.quantity, disabled: true}],
        });
    }

    onChanges(): void {
        this.rForm.get('tax').valueChanges.subscribe(val => {
            if (val) {
                this.rForm.get('taxTotal').setValue(val * this.rForm.get('quantity').value);
            }
            else {
                this.rForm.get('taxTotal').setValue(null);
            }
        });
    }



    ok()
    {
        this.rFormSubbmitted = true;

        if (!this.rForm.valid)
        {
            return;
        }

        this.rFormSubbmitted = false;

        let annihilationMed = this.annihilationMedInitial;
        annihilationMed.destructionMethod = this.rForm.get('destroyMethod').value;
        annihilationMed.tax = this.rForm.get('tax').value;
        annihilationMed.taxTotal = this.rForm.get('taxTotal').value;

        let  response = {
                success : true,
                annihilationMed : annihilationMed
            };

        this.dialogRef.close(response);
    }

    cancel()
    {
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

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
