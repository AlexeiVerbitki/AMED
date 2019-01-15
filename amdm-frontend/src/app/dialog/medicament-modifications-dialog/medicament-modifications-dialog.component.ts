import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';

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

    constructor(
        public dialogRef: MatDialogRef<MedicamentModificationsDialogComponent>,
        private uploadService: UploadFileService,
        @Inject(MAT_DIALOG_DATA) public dataDialog: any) {

    }

    ngOnInit() {
        this.populateListsFromHistory();
        this.populateMedicamentDetailsFromHistory();
    }

    confirm(): void {
        this.dialogRef.close(true);
    }

    populateListsFromHistory() {
        for (const history of this.dataDialog.historyDetails) {
            if (history.id == this.dataDialog.order.registrationRequestId) {
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
                const ar5: any[] = history.medicamentHistory[0].instructionsHistory;
                if (ar5.length != 0) {
                    this.instructions = ar5.filter(t => t.type == 'I');
                    this.machets = ar5.filter(t => t.type == 'M');
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
                if (history.medicamentHistory[0].medicamentTypeFrom.id != history.medicamentHistory[0].medicamentTypeTo.id) {
                    this.modifications.push({
                        field: 'Tip medicament',
                        oldValue: history.medicamentHistory[0].medicamentTypeFrom.description,
                        newValue: history.medicamentHistory[0].medicamentTypeTo.description,
                        changeDate: new Date()
                    });
                }
               if ( history.medicamentHistory[0].groupFrom.id != history.medicamentHistory[0].groupTo.id) {
                    this.modifications.push({
                        field: 'Grupa medicament',
                        oldValue: history.medicamentHistory[0].groupFrom.description,
                        newValue: history.medicamentHistory[0].groupTo.description,
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
                if (history.medicamentHistory[0].customsCodeFrom.id != history.medicamentHistory[0].customsCodeTo.id) {
                    this.modifications.push({
                        field: 'Cod vamal',
                        oldValue: history.medicamentHistory[0].customsCodeFrom.description,
                        newValue: history.medicamentHistory[0].customsCodeTo.description,
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
}
