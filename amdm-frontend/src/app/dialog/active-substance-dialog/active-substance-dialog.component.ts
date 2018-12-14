import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdministrationService} from "../../shared/service/administration.service";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-active-substance-dialog',
  templateUrl: './active-substance-dialog.component.html',
  styleUrls: ['./active-substance-dialog.component.css']
})

export class ActiveSubstanceDialogComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    aForm: FormGroup;
    title: string = 'Adaugare substanta activa';
    activeSubstances: any[];
    formSubmitted: boolean;
    activeSubstanceUnitsOfMeasurement: any[];
    manufactures: any[];
    protected loadingActiveSubst: boolean = false;
    protected loadingManufacture: boolean = false;

    constructor(private administrationService: AdministrationService,
                private fb: FormBuilder,
                public dialogRef: MatDialogRef<ActiveSubstanceDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
        this.aForm = fb.group({
            'activeSubstance': [null, Validators.required],
            'activeSubstanceCode': [null],
            'activeSubstanceQuantity': [null,Validators.required],
            'activeSubstanceUnit': [null,Validators.required],
            'manufactureSA': [null,Validators.required],
            'manufactureCountrySA': [null],
            'manufactureAddressSA': [null],
            'status' : [null],
            'response' : [null]
        });
    }

    ngOnInit() {

        if(this.dataDialog && this.dataDialog.disableSubstance)
        {
            this.aForm.get('activeSubstance').disable();
        }

        if(this.dataDialog) {
            this.aForm.get('activeSubstanceQuantity').setValue(this.dataDialog.quantity);
        }

        this.loadingActiveSubst = true;
        this.subscriptions.push(
            this.administrationService.getAllActiveSubstances().subscribe(data => {
                    this.activeSubstances = data;
                    if(this.dataDialog) {
                        this.aForm.get('activeSubstance').setValue(this.activeSubstances.find(r => r.id === this.dataDialog.activeSubstance.id));
                        this.aForm.get('activeSubstanceCode').setValue(this.aForm.get('activeSubstance').value.code);
                    }
                    this.loadingActiveSubst = false;
                },
                error => {console.log(error);  this.loadingActiveSubst = false;}
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.activeSubstanceUnitsOfMeasurement = data;
                    if(this.dataDialog) {
                        this.aForm.get('activeSubstanceUnit').setValue(this.activeSubstanceUnitsOfMeasurement.find(r => r.id === this.dataDialog.unitsOfMeasurement.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.loadingManufacture = true;
        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactures = data;
                    if(this.dataDialog) {
                        this.aForm.get('manufactureSA').setValue(this.manufactures.find(r => r.id === this.dataDialog.manufacture.id));
                        this.aForm.get('manufactureCountrySA').setValue(this.aForm.get('manufactureSA').value.country.description);
                        this.aForm.get('manufactureAddressSA').setValue(this.aForm.get('manufactureSA').value.address);
                    }
                    this.loadingManufacture = false;
                },
                error => {console.log(error);  this.loadingManufacture = false;}
            )
        );

        if(this.dataDialog) {
            this.title = 'Editare substanta activa'
            this.aForm.get('status').setValue(this.dataDialog.status);
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

        if(this.aForm.invalid)
        {
            return;
        }

        this.formSubmitted = false;

        this.aForm.get('response').setValue(true);
        this.aForm.get('activeSubstance').enable();
        this.dialogRef.close(this.aForm.value);
    }

    cancel() {
        this.aForm.get('response').setValue(false);
        this.dialogRef.close(this.aForm.value);
    }

    checkActiveSubstanceManufacture()
    {
        if (this.aForm.get('manufactureSA').value == null) {
            return;
        }

        this.aForm.get('manufactureCountrySA').setValue(this.aForm.get('manufactureSA').value.country.description);
        this.aForm.get('manufactureAddressSA').setValue(this.aForm.get('manufactureSA').value.address);
    }
}


