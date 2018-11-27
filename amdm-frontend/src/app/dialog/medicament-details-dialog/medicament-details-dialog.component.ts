import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {MedicamentService} from "../../shared/service/medicament.service";
import {MedicamentHistoryDialogComponent} from "../medicament-history-dialog/medicament-history-dialog.component";

@Component({
    selector: 'app-medicament-details-dialog',
    templateUrl: './medicament-details-dialog.component.html',
    styleUrls: ['./medicament-details-dialog.component.css']
})
export class MedicamentDetailsDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    mForm: FormGroup;
    divisions : any[] = [];
    activeSubstancesTable : any[] = [];
    manufacturesTable: any[]= [];
    initialData : any;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<MedicamentDetailsDialogComponent>,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private medicamentService: MedicamentService) {
        this.mForm = fb.group({
            'name': [null],
            'dose': [null],
            'volume': [null],
            'volumeQuantityMeasurement': [null],
            'atcCode': [null],
            'pharmaceuticalFormType': [null],
            'pharmaceuticalForm': [null],
            'group': [null],
            'prescription': [null],
            'internationalMedicamentName': [null],
            'termsOfValidity': [null],
            'medicamentType': [null],
            'authorizationHolder': [null],
            'authorizationHolderCountry': [null],
            'authorizationHolderAddress': [null],
            'registrationNumber': [null],
            'registrationDate': [null],
            'expirationDate': [null],
        });
    }

    ngOnInit() {
        this.mForm.get('registrationDate').disable();
        this.mForm.get('expirationDate').disable();
        this.subscriptions.push(this.medicamentService.getMedicamentByCode(this.dataDialog.value).subscribe(data => {
            this.initialData = Object.assign({}, data);
            this.mForm.get('name').setValue(data[0].name);
            this.mForm.get('dose').setValue(data[0].dose);
            this.mForm.get('volume').setValue(data[0].volume);
            if(data[0].volumeQuantityMeasurement) {
                this.mForm.get('volumeQuantityMeasurement').setValue(data[0].volumeQuantityMeasurement.description);
            }
            this.mForm.get('atcCode').setValue(data[0].atcCode);
            this.mForm.get('pharmaceuticalFormType').setValue(data[0].pharmaceuticalForm.type.description);
            this.mForm.get('pharmaceuticalForm').setValue(data[0].pharmaceuticalForm.description);
            this.mForm.get('group').setValue(data[0].group.description);
            this.mForm.get('prescription').setValue(data[0].prescription == 1 ? 'Cu prescripţie' : 'Fără prescripţie');
            this.mForm.get('internationalMedicamentName').setValue(data[0].internationalMedicamentName.description);
            this.mForm.get('termsOfValidity').setValue(data[0].termsOfValidity);
            this.mForm.get('medicamentType').setValue(data[0].medicamentType.description);
            this.mForm.get('authorizationHolder').setValue(data[0].authorizationHolder.description);
            this.mForm.get('authorizationHolderCountry').setValue(data[0].authorizationHolder.country.description);
            this.mForm.get('authorizationHolderAddress').setValue(data[0].authorizationHolder.address);
            this.mForm.get('registrationNumber').setValue(data[0].registrationNumber);
            this.mForm.get('registrationDate').setValue(new Date(data[0].registrationDate));
            this.mForm.get('expirationDate').setValue(data[0].expirationDate);
            for (let entry of data) {
                if(entry.division && entry.division.length!=0) {
                    this.divisions.push({
                        code : entry.code,
                        description: entry.division
                    });
                }
            }
            this.activeSubstancesTable = data[0].activeSubstances;
            this.manufacturesTable = data[0].manufactures;
        }));
    }

    confirm(): void {
        this.dialogRef.close(true);
    }


    showMedicamentHistory() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width='1100px';

        dialogConfig2.data = {
            value: this.initialData
        };

        this.dialog.open(MedicamentHistoryDialogComponent, dialogConfig2);
    }

}
