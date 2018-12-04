import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: 'app-medicament-modifications-dialog',
    templateUrl: './medicament-modifications-dialog.component.html',
    styleUrls: ['./medicament-modifications-dialog.component.css']
})
export class MedicamentModificationsDialogComponent implements OnInit {

    private subscriptions: Subscription[] = [];
    modifications: any[] = [];
    changeDateReference : any;
    divisions : any[] = [];
    manufacturesTable : any[] = [];
    activeSubstancesTable : any[] = [];

    constructor(
        public dialogRef: MatDialogRef<MedicamentModificationsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataDialog: any) {

    }

    ngOnInit() {
        this.populateListsFromHistory();

        //fill medicament history
        this.populateMedicamentDetailsFromHistory();
        //this.populateMedicamentHistoryWithCurrentValues();
        //this.checkPreviousMedicamentValuesInHistory();

        //fill active substances history
        //this.populateActiveSubstancesWithCurrentValues();
        //this.populateActiveSubstancesWithPreviousValues();
    }

    confirm(): void {
        this.dialogRef.close(true);
    }

    populateListsFromHistory()
    {
        for (let history of this.dataDialog.historyDetails) {
            if (history.id == this.dataDialog.order.registrationRequestId) {
                let ar =history.medicamentHistory[0].divisionHistory.filter(r=> r.status=='N' || r.status=='R');
                if(ar.length!=0) {
                    this.divisions=ar;
                }
                let ar2 = history.medicamentHistory[0].manufacturesHistory;
                if(ar2.length!=0) {
                    this.manufacturesTable=ar2;
                }
                let ar3 = history.medicamentHistory[0].activeSubstancesHistory;
                if(ar3.length!=0) {
                    this.activeSubstancesTable=ar3;
                }
            }
        }
    }

    populateMedicamentDetailsFromHistory()
    {
        for (let history of this.dataDialog.historyDetails) {
            if (history.id == this.dataDialog.order.registrationRequestId) {
                this.changeDateReference = new Date(history.medicamentHistory[0].changeDate);
                if (history.medicamentHistory[0].commercialNameFrom!=history.medicamentHistory[0].commercialNameTo) {
                    this.modifications.push({
                        field: 'Denumire comerciala',
                        oldValue: history.medicamentHistory[0].commercialNameFrom,
                        newValue: history.medicamentHistory[0].commercialNameTo,
                        changeDate: new Date()
                    })
                }
                if (history.medicamentHistory[0].internationalMedicamentNameFrom.id!=history.medicamentHistory[0].internationalMedicamentNameTo.id) {
                    this.modifications.push({
                        field: 'Denumire internationala',
                        oldValue: history.medicamentHistory[0].internationalMedicamentNameFrom.description,
                        newValue: history.medicamentHistory[0].internationalMedicamentNameTo.description,
                        changeDate: new Date()
                    })
               }
                if (history.medicamentHistory[0].pharmaceuticalFormFrom.id!=history.medicamentHistory[0].pharmaceuticalFormTo.id) {
                    this.modifications.push({
                        field: 'Forma farmaceutica',
                        oldValue: history.medicamentHistory[0].pharmaceuticalFormFrom.description,
                        newValue:  history.medicamentHistory[0].pharmaceuticalFormTo.description,
                        changeDate: new Date()
                    })
               }
                if (history.medicamentHistory[0].authorizationHolderFrom.id!=history.medicamentHistory[0].authorizationHolderTo.id) {
                    this.modifications.push({
                        field: 'Detinatorul certificatului de inregistrare',
                        oldValue: history.medicamentHistory[0].authorizationHolderFrom.description,
                        newValue:history.medicamentHistory[0].authorizationHolderTo.description,
                        changeDate: new Date()
                    })
                }
                if (history.medicamentHistory[0].medicamentTypeFrom.id!=history.medicamentHistory[0].medicamentTypeTo.id) {
                    this.modifications.push({
                        field: 'Tip medicament',
                        oldValue: history.medicamentHistory[0].medicamentTypeFrom.description,
                        newValue: history.medicamentHistory[0].medicamentTypeTo.description,
                        changeDate: new Date()
                    })
                }
               if ( history.medicamentHistory[0].groupFrom.id!= history.medicamentHistory[0].groupTo.id) {
                    this.modifications.push({
                        field: 'Grupa medicament',
                        oldValue: history.medicamentHistory[0].groupFrom.description,
                        newValue: history.medicamentHistory[0].groupTo.description,
                        changeDate: new Date()
                    })
                }
                if (history.medicamentHistory[0].prescriptionFrom!=history.medicamentHistory[0].prescriptionTo) {
                    this.modifications.push({
                        field: 'Eliberare receta',
                        oldValue: history.medicamentHistory[0].prescriptionFrom == 1 ? 'Cu prescriptie' : 'Fara prescriptie',
                        newValue:  history.medicamentHistory[0].prescriptionTo == 1 ? 'Cu prescriptie' : 'Fara prescriptie',
                        changeDate: new Date()
                    })
                }
               if (history.medicamentHistory[0].volumeFrom!=history.medicamentHistory[0].volumeTo) {
                    this.modifications.push({
                        field: 'Volum',
                        oldValue: history.medicamentHistory[0].volumeFrom,
                        newValue: history.medicamentHistory[0].volumeTo,
                        changeDate: new Date()
                    })
                }
                if (history.medicamentHistory[0].volumeQuantityMeasurementFrom.id!=history.medicamentHistory[0].volumeQuantityMeasurementTo.id) {
                    this.modifications.push({
                        field: 'Unitate de masura volum',
                        oldValue: history.medicamentHistory[0].volumeQuantityMeasurementFrom.description,
                        newValue: history.medicamentHistory[0].volumeQuantityMeasurementTo.description,
                        changeDate: new Date()
                    })
                }
                if (history.medicamentHistory[0].termsOfValidityFrom!=history.medicamentHistory[0].termsOfValidityTo) {
                    this.modifications.push({
                        field: 'Termen de valabilitate',
                        oldValue: history.medicamentHistory[0].termsOfValidityFrom,
                        newValue: history.medicamentHistory[0].termsOfValidityTo,
                        changeDate: new Date()
                    })
               }
                if (history.medicamentHistory[0].atcCodeFrom!=history.medicamentHistory[0].atcCodeTo) {
                    this.modifications.push({
                        field: 'Cod ATC',
                        oldValue: history.medicamentHistory[0].atcCodeFrom,
                        newValue: history.medicamentHistory[0].atcCodeTo,
                        changeDate: new Date()
                    })
                }
            }
        }
    }

    // populateMedicamentHistoryWithCurrentValues()
    // {
    //     for (let m of this.modifications) {
    //         if (m.field == 'Cod ATC') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].atcCode;
    //         }
    //         if (m.field == 'Termen de valabilitate') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].termsOfValidity;
    //         }
    //         if (m.field == 'Unitate de masura volum') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].volumeQuantityMeasurement.description;
    //         }
    //         if (m.field == 'Volum') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].volume;
    //         }
    //         if (m.field == 'Eliberare receta') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].prescription == 1 ? 'Cu prescriptie' : 'Fara prescriptie';
    //         }
    //         if (m.field == 'Grupa medicament') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].group.description;
    //         }
    //         if (m.field == 'Tip medicament') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].medicamentType.description;
    //         }
    //         if (m.field == 'Detinatorul certificatului de inregistrare') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].authorizationHolder.description;
    //         }
    //         if (m.field == 'Forma farmaceutica') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].pharmaceuticalForm.description;
    //         }
    //         if (m.field == 'Denumire internationala') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].internationalMedicamentName.description;
    //         }
    //         if (m.field == 'Denumire comerciala') {
    //             m.newValue = this.dataDialog.medicamentDetails[0].commercialName;
    //         }
    //     }
    // }

    // checkPreviousMedicamentValuesInHistory()
    // {
    //     for (let m of this.modifications) {
    //         for (let history of this.dataDialog.historyDetails) {
    //             if (history.id != this.dataDialog.order.registrationRequestId) {
    //                 if (m.field == 'Denumire comerciala' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference && history.medicamentHistory[0].name) {
    //                     m.newValue = history.medicamentHistory[0].commercialName;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Denumire internationala' && m.changeDate >new Date( history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].internationalMedicamentName) {
    //                     m.newValue = history.medicamentHistory[0].internationalMedicamentName.description;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Forma farmaceutica' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].pharmaceuticalForm) {
    //                     m.newValue = history.medicamentHistory[0].pharmaceuticalForm.description;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Detinatorul certificatului de inregistrare' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].authorizationHolder) {
    //                     m.newValue = history.medicamentHistory[0].authorizationHolder.description;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Tip medicament' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].medicamentType) {
    //                     m.newValue = history.medicamentHistory[0].medicamentType.description;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Grupa medicament' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].group) {
    //                     m.newValue = history.medicamentHistory[0].group.description;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Eliberare receta' && m.changeDate >new Date( history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].prescription) {
    //                     m.newValue = history.medicamentHistory[0].prescription == 1 ? 'Cu prescriptie' : 'Fara prescriptie';
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Volum' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].volume) {
    //                     m.newValue = history.medicamentHistory[0].volume;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Unitate de masura volum' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].volumeQuantityMeasurement) {
    //                     m.newValue = history.medicamentHistory[0].volumeQuantityMeasurement.description;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Termen de valabilitate' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference  && history.medicamentHistory[0].termsOfValidity) {
    //                     m.newValue = history.medicamentHistory[0].termsOfValidity;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //                 if (m.field == 'Cod ATC' && m.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference && history.medicamentHistory[0].atcCode) {
    //                     m.newValue = history.medicamentHistory[0].atcCode;
    //                     m.changeDate = history.medicamentHistory[0].changeDate;
    //                 }
    //             }
    //         }
    //     }
    // }

    // populateActiveSubstancesWithPreviousValues()
    // {
    //     for(let sa of this.activeSubstancesTable)
    //     {
    //         if(sa.status=='M') {
    //             for (let history of this.dataDialog.historyDetails) {
    //                 if (history.id != this.dataDialog.order.registrationRequestId) {
    //                     for(let saHist of history.medicamentHistory[0].activeSubstancesHistory)
    //                     {
    //                         if(saHist.activeSubstance.id==sa.activeSubstance.id && sa.changeDate > new Date(history.medicamentHistory[0].changeDate) && new Date(history.medicamentHistory[0].changeDate)> this.changeDateReference )
    //                         {
    //                             if(sa.quantity && saHist.quantity) {
    //                                 sa.quantityNew = saHist.quantity;
    //                             }
    //                             if(sa.unitsOfMeasurement && saHist.unitsOfMeasurement) {
    //                                 sa.unitsOfMeasurementNew = saHist.unitsOfMeasurement;
    //                             }
    //                             if(sa.manufacture && saHist.manufacture) {
    //                                 sa.manufactureNew = saHist.manufacture;
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    // populateActiveSubstancesWithCurrentValues()
    // {
    //     for(let saModification of this.activeSubstancesTable)
    //     {
    //         if(saModification.status=='M') {
    //             saModification.changeDate = new Date();
    //             for(let sa of this.dataDialog.medicamentDetails[0].activeSubstances)
    //             {
    //                 if(saModification.activeSubstance.id==sa.activeSubstance.id) {
    //                     if (saModification.quantity) {
    //                         saModification.quantityNew = sa.quantity;
    //                     }
    //                     if (saModification.unitsOfMeasurement) {
    //                         saModification.unitsOfMeasurementNew = sa.unitsOfMeasurement;
    //                     }
    //                     if (saModification.manufacture) {
    //                         saModification.manufactureNew = sa.manufacture;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     console.log(this.activeSubstancesTable);
    // }

}
