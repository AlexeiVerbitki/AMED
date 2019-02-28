import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {LoaderService} from "../../../shared/service/loader.service";
import {AdministrationService} from "../../../shared/service/administration.service";
import {SuccessOrErrorHandlerService} from "../../../shared/service/success-or-error-handler.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {DrugDecisionsService} from "../../../shared/service/drugs/drugdecisions.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {AddDeclarationDialogComponent} from "../add-declaration-dialog/add-declaration-dialog.component";

@Component({
    selector: 'app-add-active-substance-dialog',
    templateUrl: './add-active-substance-dialog.component.html',
    styleUrls: ['./add-active-substance-dialog.component.css']
})
export class AddActiveSubstanceDialogComponent implements OnInit, OnDestroy {


    authorizedSubstances: Observable<any[]>;
    substInput = new Subject<string>();
    substLoading = false;


    rFormSubbmitted = false;
    rForm: FormGroup;

    substanceUnits: any[];
    allSubstanceUnits: any[];
    activeSubstancesTable: any[] = [];
    selectedSubstancesTable: any[] = [];

    reqId: any;

    otherSelectedSubstanceDetails: any[] = [];

    selectedSubstance: any;
    authorizationType: any;
    viewMode = false;

    private subscriptions: Subscription[] = [];

    constructor(public dialogRef: MatDialogRef<AddActiveSubstanceDialogComponent>,
                public dialogConfirmation: MatDialog,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private fb: FormBuilder,
                private loadingService: LoaderService,
                private administrationService: AdministrationService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private drugDecisionsService: DrugDecisionsService,
                public dialogDeclaration: MatDialog) {
    }

    ngOnInit() {
        this.viewMode = this.dataDialog.details.viewMode;
        this.selectedSubstance = this.dataDialog.details.substance;
        this.selectedSubstancesTable = this.selectedSubstance.details;
        if (!this.selectedSubstancesTable)
        {
            this.selectedSubstancesTable = [];
        }
        this.authorizationType = this.dataDialog.details.authorizationType;
        this.otherSelectedSubstanceDetails = this.dataDialog.details.otherSelectedSubstanceDetails;
        this.reqId = this.dataDialog.details.reqId;
        this.initFormData();
        this.getAuthorizedSubstances();

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.allSubstanceUnits = data;
                }
            )
        );

        this.onChanges();
    }

    private initFormData() {
        this.rForm = this.fb.group({
            'unitOfMeasurement': [],
            'authorizedQuantity': [null, Validators.required],
            'availableQuantity': {disabled: true, value: []},
            'substance': [null, Validators.required],
            'availableQuantityUM': {disabled: true, value: null},
        });
    }


    onChanges(): void {
        this.getSelectedSubstanceDetails();
    }

    getSelectedSubstanceDetails() {
        this.rForm.get('substance').valueChanges.subscribe(val => {
            if (val) {
                this.rForm.get('availableQuantityUM').setValue(this.allSubstanceUnits.find(asu => asu.code == val.unitOfMeasureCode).description);
                val.unitDescription = this.rForm.get('availableQuantityUM').value;
                this.subscriptions.push(
                    this.drugDecisionsService.getUnitsByRefUnitCode(val.unitOfMeasureCode).subscribe(data => {
                            this.substanceUnits = data;
                            if (!this.substanceUnits) {
                                this.substanceUnits = [];
                            }
                            const refUnit = {
                                unitCode: val.unitOfMeasureCode,
                                refUnitCode: '',
                                unitCodeRate: 1,
                                refUnitCodeRate: 1,
                                unitCodeDescription: this.allSubstanceUnits.find(r => r.code == val.unitOfMeasureCode).description
                            };

                            this.substanceUnits.push(refUnit);
                            this.rForm.get('unitOfMeasurement').setValue(refUnit);
                        }
                    )
                );
                this.getSubstanceDetails(val);
            } else {
                this.initSubstanceData();
            }
        });
    }


    getAuthorizedSubstances() {

        this.authorizedSubstances =
            this.substInput.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.substLoading = true;

                }),
                flatMap(term =>

                    this.drugDecisionsService.getAuthorizedSubstancesByNameOrCode(term, this.authorizationType.value).pipe(
                        tap(() => this.substLoading = false)
                    )
                )
            );
    }


    initSubstanceData() {
        this.activeSubstancesTable = [];
        this.rForm.get('availableQuantity').setValue(null);
        this.rForm.get('unitOfMeasurement').setValue(null);
        this.rForm.get('availableQuantityUM').setValue(null);
        this.rForm.get('authorizedQuantity').setValue(null);
        this.substanceUnits = [];
    }


    ok() {
        this.dialogRef.close({
            success: true,
            details: this.selectedSubstancesTable
        });
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


    addSubstance() {
        this.rFormSubbmitted = true;
        if (this.rForm.invalid) {
            return;
        }

        let initialAuthQuantity = this.rForm.value.authorizedQuantity;
        if (this.rForm.get('authorizedQuantity').value && this.rForm.get('availableQuantity').value ) {

            if (this.rForm.get('unitOfMeasurement').value.unitCode && this.rForm.get('substance').value.unitOfMeasureCode != this.rForm.get('unitOfMeasurement').value.unitCode) {
                this.rForm.get('authorizedQuantity').setValue((this.rForm.value.authorizedQuantity * this.rForm.get('unitOfMeasurement').value.refUnitCodeRate) / this.rForm.get('unitOfMeasurement').value.unitCodeRate);
            }

        }
        if (this.rForm.get('authorizedQuantity').value && this.rForm.get('availableQuantity').value
            && this.rForm.get('authorizedQuantity').value > this.rForm.get('availableQuantity').value) {
            this.rForm.get('authorizedQuantity').setValue(initialAuthQuantity);
            this.errorHandlerService.showError('Cantitatea autorizata nu poate fi mai mare ca cantitatea admisibila.');
            return;
        }

        this.rFormSubbmitted = false;

        this.populateSelectedSubstanceDetails();

        this.rForm.get('substance').setValue(null);
        this.rForm.get('availableQuantity').setValue(null);
        this.rForm.get('authorizedQuantity').setValue(null);
        this.rForm.get('unitOfMeasurement').setValue(null);

        this.selectedSubstance = [];
    }

    populateSelectedSubstanceDetails() {
        const substanceDetails = {
            authorizedDrugSubstance: this.rForm.get('substance').value,
            substanceName: this.rForm.get('substance').value.substanceName,
            substanceCode: this.rForm.get('substance').value.substanceCode,
            authorizedQuantity: this.rForm.get('authorizedQuantity').value,
            authorizedQuantityUnitCode: this.rForm.get('unitOfMeasurement').value.refUnitCode ? this.rForm.get('unitOfMeasurement').value.refUnitCode : this.rForm.get('unitOfMeasurement').value.unitCode,
            authorizedQuantityUnitDesc: this.rForm.get('unitOfMeasurement').value.unitCodeDescription,
        };

        this.selectedSubstancesTable.push(substanceDetails);
    }


    getSubstanceDetails(val: any) {

        this.activeSubstancesTable = [];
        this.activeSubstancesTable.push(val);
        this.rForm.get('availableQuantity').setValue(0);
        if (val != null && val.fromDate != null) {

            const toDate = new Date(val.toDate);
            const fromDate = new Date(val.fromDate);
            const date = new Date();
            if (toDate.getTime() > date.getTime() && date.getTime() >= fromDate.getTime()) {
                this.calculateSubstanceAvailableQuantity(val);
            }
        }
    }


    calculateSubstanceAvailableQuantity(val: any) {
        const authType = this.authorizationType.value;
        this.subscriptions.push(
            this.drugDecisionsService.calculateAvailableQuantityForSubstance(val.id, authType, this.reqId).subscribe(data => {

                    //Also check for data in the same process
                    let result = 0.0;
                    let resultOther = 0.0;
                    if (this.selectedSubstancesTable) {
                        result = this.selectedSubstancesTable.filter(a => a.authorizedDrugSubstance.id === val.id).map(o => o.authorizedQuantity).reduce((x, y) => x + y, 0);
                    }

                    this.otherSelectedSubstanceDetails.forEach(oss => {
                        if (oss.details)
                        {
                            resultOther += oss.details.filter(a => a.authorizedDrugSubstance.id === val.id).map(o => o.authorizedQuantity).reduce((x, y) => x + y, 0);
                        }
                    })

                    if (data - result -  resultOther > 0) {
                        this.rForm.get('availableQuantity').setValue(data - result - resultOther);
                        // val.quantity = this.rForm.get('availableQuantity').value;
                    }
                }
            )
        );

    }

    validateAuthorizedQuantity() {
        if (this.rForm.value.authorizedQuantity != null && this.rForm.get('availableQuantity').value != null && this.rForm.get('substance') != null && this.rForm.get('unitOfMeasurement') != null) {

            if (this.rForm.get('unitOfMeasurement').value.unitCode && this.rForm.get('substance').value.unitOfMeasureCode != this.rForm.get('unitOfMeasurement').value.unitCode) {

                this.rForm.value.authorizedQuantity = (this.rForm.value.authorizedQuantity * this.rForm.get('unitOfMeasurement').value.refUnitCodeRate) / this.rForm.get('unitOfMeasurement').value.unitCodeRate;

            }

        }
        if (this.rForm.value.authorizedQuantity != null && this.rForm.get('availableQuantity').value != null
            && this.rForm.value.authorizedQuantity > this.rForm.get('availableQuantity').value) {
            this.errorHandlerService.showError('Cantitatea autorizata nu poate fi mai mare ca cantitatea admisibila.');
            return;
        }

    }


    removeSubstance(index) {

        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });
        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.selectedSubstancesTable.splice(index, 1);
            }
        });

    }

    declare(substance: any) {

        const data = {
            substance: substance,
            mainSubstanceDetails: this.selectedSubstance
        };

        const dialogRef2 = this.dialogDeclaration.open(AddDeclarationDialogComponent, {
            data: {
                details: data,
                parentWindow: window
            },
            hasBackdrop: false,
            disableClose: false,
            autoFocus: true,
            panelClass: 'custom-dialog-container',
            width: '1000px',

        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                substance.authorizedQuantityRemaining = result.quantityRemaining;
            }
        });
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
