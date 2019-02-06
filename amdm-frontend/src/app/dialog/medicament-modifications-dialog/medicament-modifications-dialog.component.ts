import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {saveAs} from 'file-saver';
import {SelectVariationTypeComponent, TodoItemFlatNode} from '../select-variation-type/select-variation-type.component';
import {SelectionModel} from '@angular/cdk/collections';
import {AdministrationService} from '../../shared/service/administration.service';

@Component({
    selector: 'app-medicament-modifications-dialog',
    templateUrl: './medicament-modifications-dialog.component.html',
    styleUrls: ['./medicament-modifications-dialog.component.css']
})
export class MedicamentModificationsDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    modifications: any[] = [];
    changeDateReference: any;
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    activeSubstancesTable: any[] = [];
    auxiliarySubstancesTable: any[] = [];
    medicamentTypes: any[] = [];
    instructions: any[] = [];
    machets: any[] = [];
    documents: any[] = [];
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
    variationTypesIds: string;
    variationTypesIdsTemp: string;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<MedicamentModificationsDialogComponent>,
        public dialog: MatDialog,
        private uploadService: UploadFileService,
        private administrationService: AdministrationService,
        @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    }

    ngOnInit() {
        this.populateListsFromHistory();
        this.populateMedicamentDetailsFromHistory();
        this.subscriptions.push(this.administrationService.variatonTypesJSON().subscribe(data2 => {
                this.variationTypesIds = JSON.stringify(data2.val2);
                    this.variationTypesIdsTemp =  this.variationTypesIds.substr(1);
                    for (const history of this.dataDialog.historyDetails) {
                        if (history.id == this.dataDialog.order.registrationRequestId && history.variations) {
                            for (const v of history.variations) {
                                const t = new TodoItemFlatNode();
                                t.item = this.getVariationCodeById(v.variation.id, v.value);
                                this.checklistSelection.selected.push(t);
                            }
                        }
                    }
            }
        ));
    }

    confirm(): void {
        this.dialogRef.close(true);
    }

    populateListsFromHistory() {
        for (const history of this.dataDialog.historyDetails) {
            if (history.id == this.dataDialog.order.registrationRequestId) {
                this.documents = history.documents;
                const ar = history.medicamentHistory[0].divisionHistory.filter(r => r.status == 'N' || r.status == 'R');
                if (ar.length != 0) {
                    this.divisions = ar;
                }
                const ar2 = history.medicamentHistory[0].manufacturesHistory;
                if (ar2.length != 0) {
                    this.manufacturesTable = ar2;
                }
                const ar3 = history.medicamentHistory[0].activeSubstancesHistory;
                if (ar3.length != 0) {
                    this.activeSubstancesTable = ar3;
                }
                const ar4 = history.medicamentHistory[0].auxiliarySubstancesHistory;
                if (ar4.length != 0) {
                    this.auxiliarySubstancesTable = ar4;
                }
                const ar6 = history.medicamentHistory[0].medicamentTypesHistory;
                if (ar6.length != 0) {
                    this.medicamentTypes = ar6;
                }
            }
        }
    }

    populateMedicamentDetailsFromHistory() {
        for (const history of this.dataDialog.historyDetails) {
            if (history.id == this.dataDialog.order.registrationRequestId) {
                this.changeDateReference = new Date(history.medicamentHistory[0].changeDate);
                if (history.medicamentHistory[0].commercialNameFrom != history.medicamentHistory[0].commercialNameTo) {
                    this.modifications.push({
                        field: 'Denumire comerciala',
                        oldValue: history.medicamentHistory[0].commercialNameFrom,
                        newValue: history.medicamentHistory[0].commercialNameTo,
                        changeDate: new Date()
                    });
                }
                if (history.medicamentHistory[0].internationalMedicamentNameFrom.id != history.medicamentHistory[0].internationalMedicamentNameTo.id) {
                    this.modifications.push({
                        field: 'Denumire internationala',
                        oldValue: history.medicamentHistory[0].internationalMedicamentNameFrom.description,
                        newValue: history.medicamentHistory[0].internationalMedicamentNameTo.description,
                        changeDate: new Date()
                    });
               }
                if (history.medicamentHistory[0].pharmaceuticalFormFrom.id != history.medicamentHistory[0].pharmaceuticalFormTo.id) {
                    this.modifications.push({
                        field: 'Forma farmaceutica',
                        oldValue: history.medicamentHistory[0].pharmaceuticalFormFrom.description,
                        newValue:  history.medicamentHistory[0].pharmaceuticalFormTo.description,
                        changeDate: new Date()
                    });
               }
                if (history.medicamentHistory[0].authorizationHolderFrom.id != history.medicamentHistory[0].authorizationHolderTo.id) {
                    this.modifications.push({
                        field: 'Detinatorul certificatului de inregistrare',
                        oldValue: history.medicamentHistory[0].authorizationHolderFrom.description,
                        newValue: history.medicamentHistory[0].authorizationHolderTo.description,
                        changeDate: new Date()
                    });
                }
                if (history.medicamentHistory[0].originaleFrom != history.medicamentHistory[0].originaleTo) {
                    this.modifications.push({
                        field: 'Original',
                        oldValue: history.medicamentHistory[0].originaleFrom ? 'Da' : 'Nu',
                        newValue: history.medicamentHistory[0].originaleTo ? 'Da' : 'Nu',
                        changeDate: new Date()
                    });
                }
                if (history.medicamentHistory[0].orphanFrom != history.medicamentHistory[0].orphanTo) {
                    this.modifications.push({
                        field: 'Orfan',
                        oldValue: history.medicamentHistory[0].orphanFrom ? 'Da' : 'Nu',
                        newValue: history.medicamentHistory[0].orphanTo ? 'Da' : 'Nu',
                        changeDate: new Date()
                    });
                }
               if ( history.medicamentHistory[0].vitaleFrom != history.medicamentHistory[0].vitaleTo
               || history.medicamentHistory[0].esentialeFrom != history.medicamentHistory[0].esentialeTo
               || history.medicamentHistory[0].nonesentialeFrom != history.medicamentHistory[0].nonesentialeTo) {
                    this.modifications.push({
                        field: 'Grupa medicament',
                        oldValue: history.medicamentHistory[0].vitaleFrom ? 'Vitale' : (history.medicamentHistory[0].esentialeFrom ? 'Esenţiale' : (history.medicamentHistory[0].nonesentialeFrom ? 'Nonesenţiale' : '') ),
                        newValue: history.medicamentHistory[0].vitaleTo ? 'Vitale' : (history.medicamentHistory[0].esentialeTo ? 'Esenţiale' : (history.medicamentHistory[0].nonesentialeTo ? 'Nonesenţiale' : '') ),
                        changeDate: new Date()
                    });
                }
                if (history.medicamentHistory[0].prescriptionFrom != history.medicamentHistory[0].prescriptionTo) {
                    this.modifications.push({
                        field: 'Eliberare receta',
                        oldValue: history.medicamentHistory[0].prescriptionFrom == 1 ? 'Cu prescriptie' : 'Fara prescriptie',
                        newValue:  history.medicamentHistory[0].prescriptionTo == 1 ? 'Cu prescriptie' : 'Fara prescriptie',
                        changeDate: new Date()
                    });
                }
               if (history.medicamentHistory[0].volumeFrom != history.medicamentHistory[0].volumeTo) {
                    this.modifications.push({
                        field: 'Volum',
                        oldValue: history.medicamentHistory[0].volumeFrom,
                        newValue: history.medicamentHistory[0].volumeTo,
                        changeDate: new Date()
                    });
                }
                if (history.medicamentHistory[0].volumeQuantityMeasurementFrom && history.medicamentHistory[0].volumeQuantityMeasurementTo &&  history.medicamentHistory[0].volumeQuantityMeasurementFrom.id != history.medicamentHistory[0].volumeQuantityMeasurementTo.id) {
                    this.modifications.push({
                        field: 'Unitate de masura volum',
                        oldValue: history.medicamentHistory[0].volumeQuantityMeasurementFrom.description,
                        newValue: history.medicamentHistory[0].volumeQuantityMeasurementTo.description,
                        changeDate: new Date()
                    });
                }
                if (history.medicamentHistory[0].termsOfValidityFrom != history.medicamentHistory[0].termsOfValidityTo) {
                    this.modifications.push({
                        field: 'Termen de valabilitate',
                        oldValue: history.medicamentHistory[0].termsOfValidityFrom,
                        newValue: history.medicamentHistory[0].termsOfValidityTo,
                        changeDate: new Date()
                    });
               }
                if (history.medicamentHistory[0].atcCodeFrom != history.medicamentHistory[0].atcCodeTo) {
                    this.modifications.push({
                        field: 'Cod ATC',
                        oldValue: history.medicamentHistory[0].atcCodeFrom,
                        newValue: history.medicamentHistory[0].atcCodeTo,
                        changeDate: new Date()
                    });
                }
            }
        }
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

    viewVariationType() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        // dialogConfig2.panelClass = 'overflow-ys';

        dialogConfig2.width = '1000px';
        dialogConfig2.height = '800px';

        dialogConfig2.data = {values: this.checklistSelection, disabled : true};

        const dialogRef = this.dialog.open(SelectVariationTypeComponent, dialogConfig2);
    }

    getVariationCodeById(id: string, value: string): string {
        const i = this.variationTypesIdsTemp.indexOf(value + '":"' + id + '"') + value.length - 1;
        const tempStr =  this.variationTypesIdsTemp.substr(1, i);
        const j = tempStr.lastIndexOf('"') + 1;
        const finalStr  = tempStr.substr(j, i);
        this.variationTypesIdsTemp = this.variationTypesIdsTemp.replace('"' + finalStr + '":"' + id + '"', '');
        return finalStr;
    }
}
