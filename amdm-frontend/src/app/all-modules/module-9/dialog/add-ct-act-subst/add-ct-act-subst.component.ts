import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../../../shared/service/administration.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {ActiveSubstanceDialogComponent} from '../../../../dialog/active-substance-dialog/active-substance-dialog.component';
import {Subscription} from 'rxjs/index';
import {AddManufactureComponent} from '../../../../dialog/add-manufacture/add-manufacture.component';
import {ConfirmationDialogComponent} from '../../../../dialog/confirmation-dialog.component';
import {CtMedType} from '../../../../shared/enum/ct-med-type.enum';

@Component({
    selector: 'app-add-ct-act-subst',
    templateUrl: './add-ct-act-subst.component.html',
    styleUrls: ['./add-ct-act-subst.component.css']
})
export class AddCtActSubstComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    aForm: FormGroup;
    title = 'Adaugare substanta activa';
    activeSubstances: any[];
    activeSubstanceUnitsOfMeasurement: any[];
    manufacturesTable: any[] = [];
    public ctMedTypes = CtMedType;

    formSubmitted = false;

    constructor(private administrationService: AdministrationService,
                private fb: FormBuilder,
                public dialog: MatDialog,
                public dialogRef: MatDialogRef<ActiveSubstanceDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    }

    ngOnInit() {
        this.aForm = this.fb.group({
            'isNotAuthorized': [false],
            'activeSubstance': [null, Validators.required],
            'activeSubstanceCode': {value: '', disabled: true},
            'actSubstName': [null, Validators.required],
            'quantity': [null, Validators.required],
            'unitsOfMeasurement': [null, Validators.required],
            'manufacture': [null],

            'compositionNumber': [null, Validators.required]
        });
        this.aForm.get('actSubstName').disable();

        // console.log('dataDialog', this.dataDialog);
        if (this.dataDialog.ctMedType != this.ctMedTypes.MicTestat) {
            this.aForm.get('isNotAuthorized').disable();
        }

        this.loadActiveSubstances();
        this.loadUnitOfMeasurments();
        this.subscribeToEvents();
    }

    subscribeToEvents() {
        this.subscriptions.push(
            this.aForm.get('activeSubstance').valueChanges.subscribe(data => {
                // console.log('data1', data);
                if (data) {
                    this.aForm.get('activeSubstanceCode').setValue(data.code);
                } else {
                    this.aForm.get('activeSubstanceCode').reset();
                }
            })
        );
        this.subscriptions.push(
            this.aForm.get('isNotAuthorized').valueChanges.subscribe(data => {
                // console.log('data2', data);
                if (data) {
                    this.aForm.get('activeSubstance').disable();
                    this.aForm.get('activeSubstance').reset();
                    this.aForm.get('actSubstName').enable();
                } else {
                    this.aForm.get('activeSubstance').enable();
                    this.aForm.get('actSubstName').disable();
                    this.aForm.get('actSubstName').reset();
                }
            })
        );
    }

    loadActiveSubstances() {
        this.subscriptions.push(
            this.administrationService.getAllActiveSubstances().subscribe(data => {
                this.activeSubstances = data;
            }, error => console.log(error))
        );
    }

    loadUnitOfMeasurments() {
        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.activeSubstanceUnitsOfMeasurement = data;
                }
            )
        );
    }

    addManufacture() {
        const dialogConfig2 = new MatDialogConfig();
        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';

        dialogConfig2.data = {manufacturesTable: this.manufacturesTable};

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

    dysplayInvalidControl(form: FormGroup) {
        const ctFormControls = form['controls'];
        for (const control of Object.keys(ctFormControls)) {
            ctFormControls[control].markAsTouched();
            ctFormControls[control].markAsDirty();
        }
    }

    submit() {
        this.formSubmitted = true;
        if (this.aForm.invalid || this.manufacturesTable.length == 0) {
            this.dysplayInvalidControl(this.aForm as FormGroup);
            return;
        }
        this.formSubmitted = false;

        this.aForm.get('manufacture').setValue(this.manufacturesTable);
        // console.log('this.aForm', this.aForm.getRawValue());
        // console.log('this.aForm', this.aForm);
        this.dialogRef.close(this.aForm.getRawValue());
        // this.dialogRef.close(this.aForm.value);
    }

    cancel() {
        this.dialogRef.close();
    }

}
