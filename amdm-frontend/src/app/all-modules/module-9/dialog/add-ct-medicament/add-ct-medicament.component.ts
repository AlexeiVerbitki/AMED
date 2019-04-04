import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {AddCtExpertComponent} from '../add-ct-expert/add-ct-expert.component';
import {ConfirmationDialogComponent} from '../../../../dialog/confirmation-dialog.component';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {AdministrationService} from '../../../../shared/service/administration.service';
import {ActiveSubstanceDialogComponent} from '../../../../dialog/active-substance-dialog/active-substance-dialog.component';
import {CtMedType} from '../../../../shared/enum/ct-med-type.enum';
import {AddCtActSubstComponent} from '../add-ct-act-subst/add-ct-act-subst.component';

@Component({
    selector: 'app-add-ct-medicament',
    templateUrl: './add-ct-medicament.component.html',
    styleUrls: ['./add-ct-medicament.component.css']
})
export class AddCtMedicamentComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    addMedForm: FormGroup;
    medActiveSubstances: any[] = [];
    pageTitle: string;
    public ctMedTypes = CtMedType;
    public ctMedType: CtMedType;
    isMicPlacebo = false;

    manufacturers: Observable<any[]>;
    manufacturerInputs = new Subject<string>();
    loadingManufacturer = false;

    farmForms: Observable<any[]>;
    loadingFarmForms = false;
    farmFormsInputs = new Subject<string>();

    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    atcCodesInputs = new Subject<string>();

    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                public dialogRef: MatDialogRef<AddCtMedicamentComponent>,
                public dialog: MatDialog,
                private administrationService: AdministrationService) {
    }

    ngOnInit() {
        this.addMedForm = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'manufacture': [null, Validators.required],
            'dose': [null],
            'pharmaceuticalForm': [null, Validators.required],
            'atcCode': [null],
            'administratingMode': [null],
            'activeSubstances': [null],
            'subjectsSC': [null],
            'isNew': [null]
        });

        console.log('dataDialog', this.dataDialog);
        this.pageTitle = this.dataDialog.pageTitle;
        this.ctMedType = this.dataDialog.ctMedType;
        if (this.dataDialog.ctMedType == this.ctMedTypes.MicTestat) {
            this.addMedForm.get('administratingMode').setValidators(Validators.required);
            this.addMedForm.get('subjectsSC').setValidators(Validators.required);
            this.subscriptions.push(
                this.addMedForm.get('atcCode').valueChanges.subscribe(value => {
                    if (value) {
                        this.addMedForm.get('subjectsSC').reset();
                        this.addMedForm.get('subjectsSC').disable();
                    } else {
                        this.addMedForm.get('subjectsSC').enable();
                    }
                })
            );
        } else if (this.dataDialog.ctMedType == this.ctMedTypes.MicReferance) {
            this.addMedForm.get('subjectsSC').disable();
            this.addMedForm.get('dose').setValidators(Validators.required);
            this.addMedForm.get('atcCode').setValidators(Validators.required);
            this.addMedForm.get('administratingMode').setValidators(Validators.required);
        } else if (this.dataDialog.ctMedType == this.ctMedTypes.MicPlacebo) {
            this.isMicPlacebo = true;
            this.addMedForm.get('subjectsSC').disable();
            this.addMedForm.get('dose').disable();
            this.addMedForm.get('atcCode').disable();
        }


        if (this.dataDialog.medicament) {
            this.addMedForm.setValue(this.dataDialog.medicament);
            this.medActiveSubstances = this.dataDialog.medicament.activeSubstances;
        }

        this.loadManufacturers();
        this.loadFarmForms();
        this.loadATCCodes();
    }

    ngOnDestroy(): void {
    }

    loadManufacturers() {
        this.manufacturers =
            this.manufacturerInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingManufacturer = true;
                }),
                flatMap(term =>
                    this.administrationService.getManufacturersByName(term).pipe(
                        tap(() => this.loadingManufacturer = false)
                    )
                )
            );
    }

    loadFarmForms() {
        this.farmForms =
            this.farmFormsInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingFarmForms = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllPharamceuticalFormsByName(term).pipe(
                        tap(() => this.loadingFarmForms = false)
                    )
                )
            );
    }

    loadATCCodes() {
        this.atcCodes =
            this.atcCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        console.log('result && result.length > 0', result);
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingAtcCodes = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllAtcCodesByCode(term).pipe(
                        tap(() => this.loadingAtcCodes = false)
                    )
                )
            );
    }

    addMedActiveSubstanceDialog() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = true;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        // dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';

        dialogConfig2.data = {
            ctMedType: this.ctMedType
        };

        // const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);
        const dialogRef = this.dialog.open(AddCtActSubstComponent, dialogConfig2);

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                console.log('result', result);
                if (result) {
                    this.medActiveSubstances.push({
                        activeSubstance: result.activeSubstance,
                        actSubstName: result.actSubstName,
                        quantity: result.quantity,
                        unitsOfMeasurement: result.unitsOfMeasurement,
                        manufacture: result.manufacture[0].manufacture
                    });
                    console.log('this.medActiveSubstances', this.medActiveSubstances);
                }
            })
        );
    }

    removeMedActiveSubstance(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        this.subscriptions.push(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.medActiveSubstances.splice(index, 1);
                }
            })
        );
    }

    submit() {
        console.log('this.addMedForm', this.addMedForm);
        if (this.addMedForm.invalid) {
            this.dysplayInvalidControl(this.addMedForm as FormGroup);
            // this.errorHandlerService.showError('Datele medicamentului contine date invalide');
            return;
        }

        const formModel = this.addMedForm.getRawValue();
        formModel.activeSubstances = this.medActiveSubstances;
        // console.log('formModel', formModel);
        // console.log('this.dataDialog', this.dataDialog);

        const response = {
            success: true,
            medicament: formModel
        };
        this.dialogRef.close(response);
    }


    cancel(): void {
        const message = 'Sunteti sigur(a)?';
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: message,
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close({success: false});
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

}
