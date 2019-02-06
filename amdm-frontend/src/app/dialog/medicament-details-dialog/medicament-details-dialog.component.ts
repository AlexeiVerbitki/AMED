import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {MedicamentService} from '../../shared/service/medicament.service';
import {MedicamentHistoryDialogComponent} from '../medicament-history-dialog/medicament-history-dialog.component';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {saveAs} from 'file-saver';
import {DocumentService} from '../../shared/service/document.service';

@Component({
    selector: 'app-medicament-details-dialog',
    templateUrl: './medicament-details-dialog.component.html',
    styleUrls: ['./medicament-details-dialog.component.css']
})
export class MedicamentDetailsDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    mForm: FormGroup;
    divisions: any[] = [];
    prices: any[] = [];
    activeSubstancesTable: any[] = [];
    auxiliarySubstancesTable: any[] = [];
    manufacturesTable: any[] = [];
    initialData: any;
    instructions: any[] = [];
    machets: any[] = [];
    documents: any[] = [];

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<MedicamentDetailsDialogComponent>,
                private dialog: MatDialog,
                private uploadService: UploadFileService,
                private documentService: DocumentService,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private medicamentService: MedicamentService) {
        this.mForm = fb.group({
            'commercialName': [null],
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
            'originale': [null],
            'orphan': [null],
            'medicamentType': [null],
            'authorizationHolder': [null],
            'authorizationHolderCountry': [null],
            'authorizationHolderAddress': [null],
            'customsCode': [null],
            'medTypesValues' : [null],
            'registrationNumber': [null],
            'registrationDate': [null],
            'expirationDate': [null],
            'priceMdl': [null],
            'price': [null],
            'currency': [null],
        });
    }

    ngOnInit() {
        this.mForm.get('registrationDate').disable();
        this.mForm.get('expirationDate').disable();
        this.subscriptions.push(this.medicamentService.getMedicamentByCode(this.dataDialog.value.code).subscribe(data => {
            this.initialData = Object.assign({}, data);
            this.mForm.get('commercialName').setValue(data[0].commercialName);
            this.mForm.get('dose').setValue(data[0].dose);
            this.mForm.get('atcCode').setValue(data[0].atcCode);
            this.mForm.get('pharmaceuticalFormType').setValue(data[0].pharmaceuticalForm.type.description);
            this.mForm.get('pharmaceuticalForm').setValue(data[0].pharmaceuticalForm.description);
            this.mForm.get('group').setValue(data[0].group == 'VIT' ? 'Vitale' : (data[0].group == 'ES' ? 'Esenţiale' : 'Nonesenţiale'));
            this.mForm.get('prescription').setValue(data[0].prescription == 1 ? 'Cu prescripţie' : 'Fără prescripţie');
            this.mForm.get('internationalMedicamentName').setValue(data[0].internationalMedicamentName.description);
            this.mForm.get('termsOfValidity').setValue(data[0].termsOfValidity);
            this.mForm.get('originale').setValue(data[0].originale);
            this.mForm.get('orphan').setValue(data[0].orphan);
            this.mForm.get('authorizationHolder').setValue(data[0].authorizationHolder.description);
            this.mForm.get('authorizationHolderCountry').setValue(data[0].authorizationHolder.country.description);
            this.mForm.get('authorizationHolderAddress').setValue(data[0].authorizationHolder.address);
            this.mForm.get('registrationNumber').setValue(data[0].registrationNumber);
            this.mForm.get('registrationDate').setValue(new Date(data[0].registrationDate));
            this.mForm.get('expirationDate').setValue(data[0].expirationDate);
            let medTypes = '';
            for (const mt of data[0].medicamentTypes) {
                medTypes = medTypes + mt.type.description + '; ';
            }
            this.mForm.get('medTypesValues').setValue(medTypes);
            for (const entry of data) {
                    this.divisions.push({
                        code : entry.code,
                        description: entry.division,
                        volume: entry.volume,
                        volumeQuantityMeasurement: entry.volumeQuantityMeasurement ? entry.volumeQuantityMeasurement.description : '',
                        instructions: entry.instructions.filter(t => t.type == 'I'),
                        machets: entry.instructions.filter(t => t.type == 'M')
                    });
            }
            this.displayInstructions();
            this.displayMachets();
            this.activeSubstancesTable = data[0].activeSubstances;
            this.auxiliarySubstancesTable = data[0].auxSubstances;
            this.manufacturesTable = data[0].manufactures;
            const selectedMedEntity = data.find(t => t.code == this.dataDialog.value.code);
            if (selectedMedEntity && selectedMedEntity.requestId) {
                this.subscriptions.push(this.documentService.getDocumentsByRequestId(selectedMedEntity.requestId).subscribe(data => {
                    this.documents = data.body;
                }));
            }
        }));
        this.subscriptions.push(this.medicamentService.getMedPrice(this.dataDialog.value.id).subscribe(data => {
            const currentPrice = data;
            if (currentPrice) {
                this.mForm.get('priceMdl').setValue(currentPrice.priceMdl);
                this.mForm.get('price').setValue(currentPrice.price);
                this.mForm.get('currency').setValue(currentPrice.currency.shortDescription);
            }
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

        dialogConfig2.width = '1100px';

        dialogConfig2.data = {
            value: this.initialData,
            id: this.dataDialog.value.id
        };

        this.dialog.open(MedicamentHistoryDialogComponent, dialogConfig2);
    }

    viewFile(instruction: any) {
        this.subscriptions.push(this.uploadService.loadFile(instruction.path).subscribe(data => {
                const file = new Blob([data], {type: instruction.typeDoc});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            },
            error => {
                console.log(error);
            }
            )
        );
    }

    manufacturesStr(substance: any) {
        if (substance && substance.manufactures) {
            let s = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' ' + (s.manufacture.country ? s.manufacture.country.description : '') + ' ' + s.manufacture.address + 'NRQW').toString();
            s = s.replace(/NRQW/gi, ';');
            return s.replace(';,', '; ');
        }
        return '';
    }

    displayInstructions() {
        this.instructions = [];
        for (const div of this.divisions) {
            if (div.instructions) {
                for (const instr of div.instructions) {
                    const instrTest = this.instructions.find(value => value.path == instr.path);
                    if (instrTest) {
                        instrTest.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                    } else {
                        const instrAdd = Object.assign({}, instr);
                        instrAdd.divisions = [];
                        instrAdd.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                        this.instructions.push(instrAdd);
                    }
                }
            }
        }
    }

    displayMachets() {
        this.machets = [];
        for (const div of this.divisions) {
            if (div.machets) {
                for (const machet of div.machets) {
                    const machetTest = this.machets.find(value => value.path == machet.path);
                    if (machetTest) {
                        machetTest.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                    } else {
                        const machetAdd = Object.assign({}, machet);
                        machetAdd.divisions = [];
                        machetAdd.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                        this.machets.push(machetAdd);
                    }
                }
            }
        }
    }

    getConcatenatedDivision(divisions: any[]) {
        let concatenatedDivision = '';
        for (const entry of divisions) {
            if (entry.description && entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.description + ' ' + entry.volume + ' ' + entry.volumeQuantityMeasurement + '; ';
            } else if (entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.volume + ' ' + entry.volumeQuantityMeasurement + '; ';
            } else {
                concatenatedDivision = concatenatedDivision + entry.description + '; ';
            }

        }
        return concatenatedDivision;
    }

    loadFile(path: string) {
        this.subscriptions.push(this.uploadService.loadFile(path).subscribe(data => {
                this.saveToFileSystem(data, path.substring(path.lastIndexOf('/') + 1));
            },

            error => {
                console.log(error);
            }
            )
        );
    }

    private saveToFileSystem(response: any, docName: string) {
        const blob = new Blob([response]);
        saveAs(blob, docName);
    }

}
