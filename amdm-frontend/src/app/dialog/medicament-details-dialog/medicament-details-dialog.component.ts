import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {MedicamentService} from '../../shared/service/medicament.service';
import {MedicamentHistoryDialogComponent} from '../medicament-history-dialog/medicament-history-dialog.component';
import {UploadFileService} from '../../shared/service/upload/upload-file.service';
import {saveAs} from 'file-saver';
import {DocumentService} from '../../shared/service/document.service';
import {ScrAuthorRolesService} from '../../shared/auth-guard/scr-author-roles.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {AdministrationService} from '../../shared/service/administration.service';
import {AddDivisionComponent} from '../add-division/add-division.component';
import {ActiveSubstanceDialogComponent} from '../active-substance-dialog/active-substance-dialog.component';
import {ConfirmationDialogComponent} from '../confirmation-dialog.component';
import {AuxiliarySubstanceDialogComponent} from '../auxiliary-substance-dialog/auxiliary-substance-dialog.component';
import {AddManufactureComponent} from '../add-manufacture/add-manufacture.component';

@Component({
    selector: 'app-medicament-details-dialog',
    templateUrl: './medicament-details-dialog.component.html',
    styleUrls: ['./medicament-details-dialog.component.css']
})
export class MedicamentDetailsDialogComponent implements OnInit, OnDestroy {

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
    formSubmitted = false;
    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    groups: any[] = [];
    prescriptions: any[] = [];
    internationalNames: any[];
    medicamentTypes2: any[];
    //manufactureAuthorizations: any[];
    //loadingManufacture = false;
    atcCodesInputs = new Subject<string>();
    manufactureAuthorizationsAsync: Observable<any[]>;
    loadingManufactureAsync = false;
    manufacturesAuthorizationsInputsAsync = new Subject<string>();
    produsFinitInvalid = false;
    initialPharmaceuticalForm: any;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<MedicamentDetailsDialogComponent>,
                private dialog: MatDialog,
                private administrationService: AdministrationService,
                private uploadService: UploadFileService,
                private roleSrv: ScrAuthorRolesService,
                private documentService: DocumentService,
                @Inject(MAT_DIALOG_DATA) public dataDialog: any,
                private medicamentService: MedicamentService) {
        this.mForm = fb.group({
            'commercialName': [null, Validators.required],
            'dose': [null, Validators.required],
            'volume': [null],
            'volumeQuantityMeasurement': [null],
            'atcCode': [null, Validators.required],
            'pharmaceuticalFormType': [null, Validators.required],
            'pharmaceuticalForm': [null, Validators.required],
            'group': [null, Validators.required],
            'prescription': [null, Validators.required],
            'internationalMedicamentName': [null, Validators.required],
            'termsOfValidity': [null, Validators.required],
            'originale': [null],
            'orphan': [null],
            'medicamentType': [null],
            'authorizationHolder': [null, Validators.required],
            'authorizationHolderCountry': [null],
            'authorizationHolderAddress': [null],
            'customsCode': [null],
            'medTypesValues': [null],
            'registrationNumber': [null],
            'registrationDate': [null],
            'expirationDate': [null],
            'priceMdl': [null],
            'price': [null],
            'currency': [null],
        });
    }

    ngOnInit() {
        if (!this.checkRole('scr_admin')) {
            this.mForm.get('commercialName').disable();
            this.mForm.get('dose').disable();
            this.mForm.get('termsOfValidity').disable();
        }
        this.mForm.get('registrationDate').disable();
        this.mForm.get('expirationDate').disable();
        this.subscriptions.push(this.medicamentService.getMedicamentByCode(this.dataDialog.value.code).subscribe(data => {
            this.initialData = Object.assign([], data);
            this.mForm.get('commercialName').setValue(data[0].commercialName);
            this.mForm.get('dose').setValue(data[0].dose);
            this.mForm.get('atcCode').setValue(data[0].atcCode);
            this.mForm.get('authorizationHolder').setValue(data[0].authorizationHolder);
            const arr: any[] = [];
            for (const z of data[0].medicamentTypes) {
                arr.push(z.type);
            }
            this.mForm.get('medTypesValues').setValue(arr);
            if (!this.checkRole('scr_admin')) {
                this.mForm.get('pharmaceuticalFormType').setValue(data[0].pharmaceuticalForm.type.description);
                this.mForm.get('pharmaceuticalForm').setValue(data[0].pharmaceuticalForm.description);
                this.mForm.get('group').setValue(data[0].group == 'VIT' ? 'Vitale' : (data[0].group == 'ES' ? 'Esenţiale' : 'Nonesenţiale'));
                this.mForm.get('prescription').setValue(data[0].prescription == 1 ? 'Cu prescripţie' : 'Fără prescripţie');
                this.mForm.get('internationalMedicamentName').setValue(data[0].internationalMedicamentName.description);
                this.mForm.get('authorizationHolder').setValue(data[0].authorizationHolder.description);
                let medTypes = '';
                for (const mt of data[0].medicamentTypes) {
                    medTypes = medTypes + mt.type.description + '; ';
                }
                this.mForm.get('medTypesValues').setValue(medTypes);
            }
            this.initialPharmaceuticalForm = data[0].pharmaceuticalForm;
            this.mForm.get('termsOfValidity').setValue(data[0].termsOfValidity);
            this.mForm.get('originale').setValue(data[0].originale);
            this.mForm.get('orphan').setValue(data[0].orphan);
            this.mForm.get('authorizationHolderCountry').setValue(data[0].authorizationHolder.country.description);
            this.mForm.get('authorizationHolderAddress').setValue(data[0].authorizationHolder.address);
            this.mForm.get('registrationNumber').setValue(data[0].registrationNumber);
            this.mForm.get('registrationDate').setValue(new Date(data[0].registrationDate));
            this.mForm.get('expirationDate').setValue(data[0].expirationDate);
            for (const entry of data) {
                this.divisions.push({
                    code: entry.code,
                    description: entry.division,
                    volume: entry.volume,
                    volumeQuantityMeasurement: entry.volumeQuantityMeasurement,
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
                this.subscriptions.push(this.documentService.getDocumentsByRequestId(selectedMedEntity.requestId).subscribe(doc => {
                    this.documents = doc.body;
                }));
            }
            this.loadQuickSearches(data);
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

    loadQuickSearches(dataDB) {
        if (this.checkRole('scr_admin')) {
            this.loadATCCodes();
            this.subscriptions.push(
                this.administrationService.getAllPharamceuticalFormTypes().subscribe(phTypes => {
                        this.pharmaceuticalFormTypes = phTypes;
                        if (dataDB[0].pharmaceuticalForm) {
                            this.mForm.get('pharmaceuticalFormType')
                                .setValue(this.pharmaceuticalFormTypes.find(r => r.id === dataDB[0].pharmaceuticalForm.type.id));
                        }
                    },
                    error => console.log(error)
                )
            );

            this.groups = [...this.groups, {value: 'VIT', description: 'Vitale'}];
            this.groups = [...this.groups, {value: 'ES', description: 'Esenţiale'}];
            this.groups = [...this.groups, {value: 'NES', description: 'Nonesenţiale'}];
            if (dataDB[0].vitale) {
                this.mForm.get('group').setValue({value: 'VIT', description: 'Vitale'});
            } else if (dataDB[0].esentiale) {
                this.mForm.get('group').setValue({value: 'ES', description: 'Esenţiale'});
            } else if (dataDB[0].nonesentiale) {
                this.mForm.get('group').setValue({value: 'NES', description: 'Nonesenţiale'});
            }

            this.prescriptions = [...this.prescriptions, {value: 1, description: 'Cu prescripţie'}];
            this.prescriptions = [...this.prescriptions, {value: 0, description: 'Fără prescripţie'}];
            this.prescriptions = [...this.prescriptions, {value: 2, description: 'Staţionar'}];
            if (dataDB[0].prescription != null && dataDB[0].prescription != undefined) {
                if (dataDB[0].prescription == 1) {
                    this.mForm.get('prescription').setValue({value: 1, description: 'Cu prescripţie'});
                } else if (dataDB[0].prescription == 0) {
                    this.mForm.get('prescription').setValue({value: 0, description: 'Fără prescripţie'});
                } else {
                    this.mForm.get('prescription').setValue({value: 2, description: 'Staţionar'});
                }
            }

            this.subscriptions.push(
                this.administrationService.getAllInternationalNames().subscribe(data => {
                        this.internationalNames = data;
                        if (dataDB[0].internationalMedicamentName) {
                            this.mForm.get('internationalMedicamentName')
                                .setValue(this.internationalNames.find(r => r.id === dataDB[0].internationalMedicamentName.id));
                        }
                    },
                    error => console.log(error)
                )
            );

            this.subscriptions.push(
                this.administrationService.getAllMedicamentTypes().subscribe(data => {
                        this.medicamentTypes2 = data;
                        if (dataDB[0].medicamentTypes) {
                            const arr: any[] = [];
                            for (const z of dataDB[0].medicamentTypes) {
                                arr.push(z.type);
                            }
                            this.mForm.get('medTypesValues').setValue(arr);
                        }
                    },
                    error => console.log(error)
                )
            );

            this.manufactureAuthorizationsAsync =
                this.manufacturesAuthorizationsInputsAsync.pipe(
                    filter((result: string) => {
                        if (result && result.length > 0) {
                            return true;
                        }
                    }),
                    debounceTime(400),
                    distinctUntilChanged(),
                    tap((val: string) => {
                        this.loadingManufactureAsync = true;

                    }),
                    flatMap(term =>
                        this.administrationService.getManufacturersByName(term).pipe(
                            tap(() => this.loadingManufactureAsync = false)
                        )
                    )
                );
        }
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
                if (!instruction.typeDoc || instruction.typeDoc.length == 0) {
                    saveAs(new Blob([data]), instruction.name);
                } else {
                    const file = new Blob([data], {type: instruction.typeDoc});
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }
            },
            error => {
                console.log(error);
            }
            )
        );
    }

    manufacturesStr(substance: any) {
        if (substance && substance.manufactures) {
            let str = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' '
                + (s.manufacture.country ? s.manufacture.country.description : '')
                + ' ' + s.manufacture.address + 'NRQW').toString();
            str = str.replace(/NRQW/gi, ';');
            return str.replace(';,', '; ');
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
                concatenatedDivision = concatenatedDivision + entry.description + ' ' + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
            } else if (entry.volume && entry.volumeQuantityMeasurement) {
                concatenatedDivision = concatenatedDivision + entry.volume + ' ' + entry.volumeQuantityMeasurement.description + '; ';
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

    checkRole(role: string) {
        return this.roleSrv.isRightAssigned(role);
    }

    loadATCCodes() {
        this.atcCodes =
            this.atcCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
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

    checkPharmaceuticalFormTypeValue() {
        if (this.mForm.get('pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.mForm.get('pharmaceuticalFormType').value.id).subscribe(data => {
                    this.mForm.get('pharmaceuticalForm').setValue(null);
                    this.pharmaceuticalForms = data;
                },
                error => console.log(error)
            )
        );
    }

    loadPharmaceuticalForms() {
        if (this.mForm.get('pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.mForm.get('pharmaceuticalFormType').value.id).subscribe(data => {
                    this.mForm.get('pharmaceuticalForm').setValue(null);
                    this.pharmaceuticalForms = data;
                    if (this.initialPharmaceuticalForm) {
                        this.mForm.get('pharmaceuticalForm').setValue(this.initialPharmaceuticalForm);
                        this.initialPharmaceuticalForm = null;
                    }
                },
                error => console.log(error)
            )
        );
    }

    fillAutorizationHolderDetails() {
        if (this.mForm.get('authorizationHolder').value == null) {
            return;
        }

        this.mForm.get('authorizationHolderCountry').setValue(this.mForm.get('authorizationHolder').value.country.description);
        this.mForm.get('authorizationHolderAddress').setValue(this.mForm.get('authorizationHolder').value.address);
    }

    editDivision(division: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';
        dialogConfig2.data = {division : division, disabledMainFields : false, onlyMainFields : true};

        const dialogRef = this.dialog.open(AddDivisionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.divisions[index].description = result.division;
                this.divisions[index].volume = result.volume;
                this.divisions[index].volumeQuantityMeasurement = result.volumeQuantityMeasurement;
                this.displayInstructions();
                this.displayMachets();
            }
        });
    }

    editSubstance(substance: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';
        dialogConfig2.data = substance;

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.activeSubstancesTable[index].activeSubstance = result.activeSubstance;
                this.activeSubstancesTable[index].quantity = result.activeSubstanceQuantity;
                this.activeSubstancesTable[index].unitsOfMeasurement = result.activeSubstanceUnit;
                this.activeSubstancesTable[index].manufactures = result.manufactures;
                this.activeSubstancesTable[index].compositionNumber = result.compositionNumber;
                this.fillDose();
            }
        });
    }

    fillDose() {
        if (this.activeSubstancesTable.length > 3) {
            this.mForm.get('dose').setValue('Combinatie');
            return;
        }
        this.activeSubstancesTable.sort((a, b) => {
            return (a.compositionNumber - b.compositionNumber == 0) ? a.activeSubstance.id - b.activeSubstance.id : a.compositionNumber - b.compositionNumber;
        });
        let i = 1;
        let orderNr = '';
        let tempDose = '';
        for (const z of this.activeSubstancesTable) {
            if (z.compositionNumber == orderNr || i == 1) {
                if (i == 1) {
                    tempDose = z.quantity + ' ' + z.unitsOfMeasurement.description;
                } else {
                    tempDose = tempDose + ' + ' + z.quantity + ' ' + z.unitsOfMeasurement.description;
                }
            } else {
                tempDose = tempDose + '; ' + z.quantity + ' ' + z.unitsOfMeasurement.description;
            }
            i++;
            orderNr = z.compositionNumber;
        }
        this.mForm.get('dose').setValue(tempDose);
    }

    removeAuxiliarySubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.auxiliarySubstancesTable.splice(index, 1);
            }
        });
    }

    addAuxiliarySubstanceDialog() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';
        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(AuxiliarySubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.auxiliarySubstancesTable.push({
                    auxSubstance: result.auxSubstance,
                    compositionNumber: result.compositionNumber,
                });
            }
        });
    }

    addManufacture() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';

        dialogConfig2.data = {manufacturesTable: this.manufacturesTable, comment: true};

        const dialogRef = this.dialog.open(AddManufactureComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.manufacturesTable.push({
                        manufacture: result.manufacture,
                        producatorProdusFinit: false,
                        comment: result.comment
                    });
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    cancel() {
        this.dialogRef.close(true);
    }

    save() {
        this.formSubmitted = true;
        this.produsFinitInvalid = false;
        if (this.mForm.invalid) {
            return;
        }
        if (this.manufacturesTable.length == 0) {
           return;
        }
        const test = this.manufacturesTable.find(r => r.producatorProdusFinit == true);
        if (!test) {
            this.produsFinitInvalid = true;
            return;
        }
        this.formSubmitted = false;

        const x = this.mForm.value;
        x.divisions = this.divisions;
        x.activeSubstancesTable = this.activeSubstancesTable;
        x.auxiliarySubstancesTable = this.auxiliarySubstancesTable;
        x.manufacturesTable = this.manufacturesTable;
        if (this.mForm.getRawValue().atcCode.code) {
            x.atcCode = this.mForm.getRawValue().atcCode.code;
        } else {
            x.atcCode = this.mForm.getRawValue().atcCode;
        }
        console.log(x);
        this.subscriptions.push(this.medicamentService.saveDetailsFromCartelaMedicament(x).subscribe(data => {
            this.dialogRef.close(true);
        }));

    }

    checkProducatorProdusFinit(manufacture: any, value: any) {
        manufacture.producatorProdusFinit = value.checked;
    }

    checkClasificareMedicament(value: any) {
        this.mForm.get('originale').setValue(value.checked);
    }

    checkOrphanMedicament(value: any) {
        this.mForm.get('orphan').setValue(value.checked);
    }


}
