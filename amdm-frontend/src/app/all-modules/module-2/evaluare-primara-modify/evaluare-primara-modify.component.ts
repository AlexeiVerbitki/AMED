import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {RequestService} from '../../../shared/service/request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../models/document';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {DocumentService} from '../../../shared/service/document.service';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {TaskService} from '../../../shared/service/task.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ActiveSubstanceDialogComponent} from '../../../dialog/active-substance-dialog/active-substance-dialog.component';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {MedicamentDetailsDialogComponent} from '../../../dialog/medicament-details-dialog/medicament-details-dialog.component';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {AuxiliarySubstanceDialogComponent} from '../../../dialog/auxiliary-substance-dialog/auxiliary-substance-dialog.component';
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {PaymentComponent} from '../../../payment/payment.component';
import {AddManufactureComponent} from '../../../dialog/add-manufacture/add-manufacture.component';
import {AddDivisionComponent} from '../../../dialog/add-division/add-division.component';
import {
    SelectVariationTypeComponent,
    TodoItemFlatNode
} from '../../../dialog/select-variation-type/select-variation-type.component';
import {SelectionModel} from '@angular/cdk/collections';
import {isNumeric} from 'rxjs/internal-compatibility';
import {AddLaboratorStandardsComponent} from '../../../dialog/add-laborator-standards/add-laborator-standards.component';

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara-modify.component.html',
    styleUrls: ['./evaluare-primara-modify.component.css']
})
export class EvaluarePrimaraModifyComponent implements OnInit, OnDestroy {
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
    eForm: FormGroup;
    documents: Document [] = [];
    instructions: any[] = [];
    machets: any[] = [];
    formSubmitted: boolean;
    auxiliarySubstancesTable: any[] = [];
    paymentTotal: number;
    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstancesTable: any[] = [];
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    registrationRequestMandatedContacts: any[];
    groups: any[] = [];
    prescriptions: any[] = [];
    internationalNames: any[];
    medicamentTypes2: any[];
    manufactureAuthorizations: any[];
    docTypes: any[];
    docTypesInitial: any[];
    outDocuments: any[] = [];
    isResponseReceived = true;
    isNonAttachedDocuments = false;
    initialData: any;
    medicamentsDetails: any[];
    variationTypesIds: string;
    variationTypesIdsTemp: string;
    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;
    @ViewChild('payment') payment: PaymentComponent;
    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    atcCodesInputs = new Subject<string>();
    private subscriptions: Subscription[] = [];
    loadingManufacture = false;
    standarts: any[];
    notSetForm = false;

    constructor(public dialog: MatDialog,
                private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private uploadService: UploadFileService,
                private documentService: DocumentService,
                private taskService: TaskService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private loadingService: LoaderService,
                private medicamentService: MedicamentService,
                private navbarTitleService: NavbarTitleService,
                public dialogConfirmation: MatDialog,
                private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

        this.eForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
            'currentStep': ['X'],
            'documents': [],
            'companyValue': [],
            'initiator': [''],
            'assignedUser': [''],
            'medicamentHistory': [[]],
            'medicamentName': [],
            'regnr': [null, Validators.required],
            'medicaments': [[]],
            'medicamentPostauthorizationRegisterNr': [''],
            'division': [null],
            'labResponse': [null],
            'divisionBonDePlata': [null],
            'registrationStatus': [null],
            'medicament':
                fb.group({
                    'id': [],
                    'commercialNameTo': ['', Validators.required],
                    'atcCodeTo': [null, Validators.required],
                    'registrationDate': [],
                    'registrationNumber': [],
                    'pharmaceuticalFormTo': [null, Validators.required],
                    'pharmaceuticalFormType': [null, Validators.required],
                    'doseTo': [null],
                    'internationalMedicamentNameTo': [null, Validators.required],
                    'termsOfValidityTo': [null, Validators.required],
                    'originaleTo': [null],
                    'orphanTo': [null],
                    'prescriptionTo': [null, Validators.required],
                    'authorizationHolderTo': [null, Validators.required],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'status': ['P'],
                    'groupTo': [null, Validators.required],
                    'medTypesValues': []
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': [],
        });
    }

    loadMedicamentDetailsByRegNr(regNr: any) {
        this.subscriptions.push(this.medicamentService.getMedicamentByRegisterNumberFullDetails(regNr).subscribe(data => {
                data.medicaments = [];
                data.medicaments = data.filter(t => t.status == 'F');
                this.initiateMedicamentDetails(data);
                //this.loadAllQuickSearches(data);
                this.outDocuments = [];
                this.medicamentsDetails = data.medicaments;
                this.notSetForm = true;
                for (const type of this.pharmaceuticalFormTypes) {
                    if (type.id == data.medicaments[0].pharmaceuticalForm.type.id) {
                        this.eForm.get('medicament.pharmaceuticalFormType').setValue(type);
                    }
                }
                this.subscriptions.push(
                    this.administrationService.getAllPharamceuticalFormsByTypeId(data.medicaments[0].pharmaceuticalForm.type.id).subscribe(forms => {
                        this.eForm.get('medicament.pharmaceuticalFormTo').setValue(null);
                        this.pharmaceuticalForms = forms;
                        this.eForm.get('medicament.pharmaceuticalFormTo').setValue(this.pharmaceuticalForms.find(r => r.id === data.medicaments[0].pharmaceuticalForm.id));
                    }));
                this.eForm.get('medicament.internationalMedicamentNameTo').setValue(this.internationalNames.find(r => r.id === data.medicaments[0].internationalMedicamentName.id));
                const arr: any[] = [];
                for (const z of data.medicaments[0].medicamentTypes) {
                    arr.push(z.type);
                }
                this.eForm.get('medicament.medTypesValues').setValue(arr);
                this.eForm.get('medicament.authorizationHolderTo').setValue(this.manufactureAuthorizations.find(r => r.id == data.medicaments[0].authorizationHolder.id));
                if (data.medicaments[0].prescription == 1) {
                    this.eForm.get('medicament.prescriptionTo').setValue({value: 1, description: 'Cu prescripţie'});
                } else if (data.medicaments[0].prescription == 0) {
                    this.eForm.get('medicament.prescriptionTo').setValue({value: 0, description: 'Fără prescripţie'});
                } else {
                    this.eForm.get('medicament.prescriptionTo').setValue({value: 2, description: 'Staţionar'});
                }
                if (data.medicaments && data.medicaments.length != 0 && data.medicaments[0].vitale) {
                    this.eForm.get('medicament.groupTo').setValue({value: 'VIT', description: 'Vitale'});
                } else if (data.medicaments && data.medicaments.length != 0 && data.medicaments[0].esentiale) {
                    this.eForm.get('medicament.groupTo').setValue({value: 'ES', description: 'Esenţiale'});
                } else if (data.medicaments && data.medicaments.length != 0 && data.medicaments[0].nonesentiale) {
                    this.eForm.get('medicament.groupTo').setValue({value: 'NES', description: 'Nonesenţiale'});
                }
            })
        );
    }

    initiateMedicamentDetails(data: any) {
        this.loadingService.show();
        this.initialData.medicamentHistory = Object.assign([], data.medicamentHistory);
        this.eForm.get('medicament.commercialNameTo').setValue(data.medicaments[0].commercialName);
        this.eForm.get('medicamentName').setValue(data.medicaments[0].commercialName);
        this.eForm.get('medicament.registrationDate').setValue(data.medicaments[0].registrationDate);
        this.eForm.get('medicament.registrationNumber').setValue(data.medicaments[0].registrationNumber);
        this.eForm.get('medicamentPostauthorizationRegisterNr').setValue(data.medicaments[0].registrationNumber);
        this.eForm.get('medicament.orphanTo').setValue(data.medicaments[0].orphan);
        this.eForm.get('medicament.originaleTo').setValue(data.medicaments[0].originale);
        this.initialData.medicamentHistory.activeSubstancesHistory = Object.assign([], data.medicaments[0].activeSubstances);
        this.initialData.medicamentHistory.activeSubstancesHistory.forEach(t => {
            t.quantityTo = t.quantity;
            t.unitsOfMeasurementTo = t.unitsOfMeasurement;
            t.compositionNumberTo = t.compositionNumber;
            t.status = 'O';
        });
        this.initialData.medicamentHistory.auxiliarySubstancesHistory = Object.assign([], data.medicaments[0].auxiliarySubstances);
        this.initialData.medicamentHistory.auxiliarySubstancesHistory.forEach(t => {t.status = 'O';   t.compositionNumberTo = t.compositionNumber; });
        this.divisions = [];
        for (const entry of data.medicaments) {
            if ((entry.division || entry.volume) && (entry.status == 'F' || entry.status == 'P')) {
                entry.instructions.forEach(t => {
                    t.status = 'O';
                    t.id = null;
                });
                this.divisions.push({
                    description: entry.division,
                    medicamentCode: entry.code,
                    volume: entry.volume,
                    volumeQuantityMeasurement: entry.volumeQuantityMeasurement,
                    instructions: entry.instructions.filter(t => t.type == 'I'),
                    machets: entry.instructions.filter(t => t.type == 'M'),
                    old: 1
                });
            }
        }
        this.eForm.get('divisionBonDePlata').setValue(this.getConcatenatedDivision());
        this.displayInstructions();
        this.displayMachets();
        this.eForm.get('medicament.atcCodeTo').setValue(data.medicaments[0].atcCode);
        this.eForm.get('medicament.doseTo').setValue(data.medicaments[0].dose);
        this.eForm.get('medicament.termsOfValidityTo').setValue(data.medicaments[0].termsOfValidity);
        this.activeSubstancesTable = data.medicaments[0].activeSubstances;
        this.auxiliarySubstancesTable = data.medicaments[0].auxSubstances;
        this.auxiliarySubstancesTable.forEach(t => {
            t.status = 'O';
        });
        this.manufacturesTable = data.medicaments[0].manufactures;
        this.manufacturesTable.forEach(t => {
            t.commentTo = t.comment;
            t.producatorProdusFinitTo = t.producatorProdusFinit;
            t.status = 'O';
        });
        this.loadingService.hide();
    }

    clearAllDetails() {
        this.formSubmitted = false;
        this.initialData.medicamentHistory = [];
        this.divisions = [];
        this.displayInstructions();
        this.displayMachets();
        this.activeSubstancesTable = [];
        this.auxiliarySubstancesTable = [];
        this.manufacturesTable = [];
        this.eForm.get('divisionBonDePlata').setValue(null);
        this.eForm.get('medicament.atcCodeTo').setValue(null);
        this.eForm.get('medicament.doseTo').setValue(null);
        this.eForm.get('medicament.termsOfValidityTo').setValue(null);
        this.eForm.get('medicament.commercialNameTo').setValue(null);
        this.eForm.get('medicamentName').setValue(null);
        this.eForm.get('medicament.registrationDate').setValue(null);
        this.eForm.get('medicament.registrationNumber').setValue(null);
        this.eForm.get('medicamentPostauthorizationRegisterNr').setValue(null);
        this.eForm.get('medicament.orphanTo').setValue(null);
        this.eForm.get('medicament.originaleTo').setValue(null);
        this.eForm.get('medicament.internationalMedicamentNameTo').setValue(null);
        this.eForm.get('medicament.pharmaceuticalFormType').setValue(null);
        this.eForm.get('medicament.pharmaceuticalFormTo').setValue(null);
        this.eForm.get('medicament.groupTo').setValue(null);
        this.eForm.get('medicament.prescriptionTo').setValue(null);
        this.eForm.get('medicament.medTypesValues').setValue(null);
        this.eForm.get('medicament.authorizationHolderTo').setValue(null);
        this.eForm.get('medicament.authorizationHolderAddress').setValue(null);
        this.eForm.get('medicament.authorizationHolderCountry').setValue(null);
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Aprobarea modificarilor postautorizare / Evaluare primara');

        this.loadingService.show();

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentHistory(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('initiator').setValue(data.initiator);
                        this.eForm.get('startDate').setValue(data.startDate);
                        this.eForm.get('requestNumber').setValue(data.requestNumber);
                        this.eForm.get('type').setValue(data.type);
                        this.eForm.get('requestHistories').setValue(data.requestHistories);
                        this.eForm.get('typeValue').setValue(data.type.description);
                        this.eForm.get('regnr').setValue(data.medicamentPostauthorizationRegisterNr);
                        this.eForm.get('company').setValue(data.company);
                        this.eForm.get('companyValue').setValue(data.company.name);
                        if (data.medicamentHistory && data.medicamentHistory.length != 0) {
                            this.initialData.medicamentHistory = Object.assign([], data.medicamentHistory);
                            this.eForm.get('medicament.id').setValue(data.medicamentHistory[0].id);
                            this.eForm.get('medicament.commercialNameTo').setValue(data.medicamentHistory[0].commercialNameTo);
                            this.eForm.get('medicamentName').setValue(data.medicamentHistory[0].commercialNameTo);
                            this.eForm.get('medicament.registrationDate').setValue(data.medicamentHistory[0].registrationDate);
                            this.eForm.get('medicament.registrationNumber').setValue(data.medicamentHistory[0].registrationNumber);
                            this.eForm.get('medicamentPostauthorizationRegisterNr').setValue(data.medicamentHistory[0].registrationNumber);
                            this.eForm.get('medicament.orphanTo').setValue(data.medicamentHistory[0].orphanTo);
                            this.eForm.get('medicament.originaleTo').setValue(data.medicamentHistory[0].originaleTo);
                        }
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        const rl = this.outDocuments.find(r => r.docType.category == 'RL');
                        if (rl && rl.responseReceived) {
                            this.eForm.get('labResponse').setValue(rl.responseReceived.toString());
                        }
                        if (data.medicamentHistory && data.medicamentHistory.length != 0) {
                            this.initialData.medicamentHistory.activeSubstancesHistory = Object.assign([], data.medicamentHistory[0].activeSubstancesHistory);
                            this.initialData.medicamentHistory.auxiliarySubstancesHistory = Object.assign([], data.medicamentHistory[0].auxiliarySubstancesHistory);
                            for (const entry of data.medicamentHistory[0].divisionHistory) {
                                this.divisions.push({
                                    description: entry.description,
                                    medicamentCode: entry.medicamentCode,
                                    volume: entry.volume,
                                    serialNr: entry.serialNr,
                                    samplesNumber: entry.samplesNumber,
                                    samplesExpirationDate: entry.samplesExpirationDate,
                                    volumeQuantityMeasurement: entry.volumeQuantityMeasurement,
                                    instructions: entry.instructionsHistory.filter(t => t.type == 'I'),
                                    machets: entry.instructionsHistory.filter(t => t.type == 'M'),
                                    old: entry.old
                                });
                            }
                            this.eForm.get('divisionBonDePlata').setValue(this.getConcatenatedDivision());
                            this.displayInstructions();
                            this.displayMachets();
                            this.eForm.get('medicament.atcCodeTo').setValue(data.medicamentHistory[0].atcCodeTo);

                            this.eForm.get('medicament.doseTo').setValue(data.medicamentHistory[0].doseTo);
                            this.eForm.get('medicament.termsOfValidityTo').setValue(data.medicamentHistory[0].termsOfValidityTo);
                            this.activeSubstancesTable = data.medicamentHistory[0].activeSubstancesHistory;
                            this.auxiliarySubstancesTable = data.medicamentHistory[0].auxiliarySubstancesHistory;
                            this.manufacturesTable = data.medicamentHistory[0].manufacturesHistory;
                        }
                        this.checkOutputDocumentsStatus();
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        this.loadAllQuickSearches(data);
                        if (data.medicamentHistory && data.medicamentHistory.length != 0) {
                            this.subscriptions.push(
                                this.medicamentService.getMedicamentsByFilter({registerNumber: data.medicamentHistory[0].registrationNumber}
                                ).subscribe(request => {
                                        this.medicamentsDetails = request.body;
                                    },
                                    error => console.log(error)
                                ));
                        }
                        this.loadingService.hide();
                    })
                );
            })
        );

        this.eForm.get('regnr').valueChanges.subscribe(val => {
            if (val && val.regnr) {
                this.loadMedicamentDetailsByRegNr(val.regnr);
            } else {
                this.clearAllDetails();
            }
        });
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
                        if (instr.status == 'O') {
                            instrTest.status = 'O';
                        }
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
                        if (machet.status == 'O') {
                            machetTest.status = 'O';
                        }
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


    checkOutputDocumentsStatus() {
        for (const entry of this.outDocuments) {
            const isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category && elem.number == entry.number) ? true : false;
            });
            if (entry.docType.category != 'LAB') {
                if (isMatch) {
                    entry.status = 'Atasat';
                } else {
                    entry.status = 'Nu este atasat';
                }
            } else {
                if (entry.number) {
                    const rl = this.documents.find(r => r.docType.category == 'RL');
                    if (rl) {
                        entry.status = 'Inclus in actul de predare-primire. Raspuns primit.';
                    } else {
                        entry.status = 'Inclus in actul de predare-primire. Asteptare raspuns.';
                    }
                } else {
                    entry.status = 'Urmeaza a fi inclus in actul de predare-primire';
                }
            }
        }
    }

    loadAllQuickSearches(dataDB: any) {

        this.loadATCCodes();

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].pharmaceuticalFormTo) {
                        this.eForm.get('medicament.pharmaceuticalFormType').setValue(this.pharmaceuticalFormTypes.find(r =>
                            r.id === dataDB.medicamentHistory[0].pharmaceuticalFormTo.type.id));
                    }
                },
                error => console.log(error)
            )
        );
        this.subscriptions.push(
            this.administrationService.getAllInternationalNames().subscribe(data => {
                    this.internationalNames = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].internationalMedicamentNameTo) {
                        this.eForm.get('medicament.internationalMedicamentNameTo').setValue(this.internationalNames.find(r =>
                            r.id === dataDB.medicamentHistory[0].internationalMedicamentNameTo.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    //this.medicamentTypes2 = data.filter(r => r.category === 'T');
                    this.medicamentTypes2 = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].medicamentTypesHistory) {
                        const arr: any[] = [];
                        for (const z of dataDB.medicamentHistory[0].medicamentTypesHistory) {
                            arr.push(z.type);
                        }
                        this.eForm.get('medicament.medTypesValues').setValue(arr);
                    }

                },
                error => console.log(error)
            )
        );

        this.loadingManufacture = true;
        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactureAuthorizations = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].authorizationHolderTo) {
                        this.eForm.get('medicament.authorizationHolderTo').setValue(this.manufactureAuthorizations.find(r => r.id === dataDB.medicamentHistory[0].authorizationHolderTo.id));
                    }

                    this.loadingManufacture = false;
                },
                error => this.loadingManufacture = false
            )
        );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('21', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                                if (dataDB.labIncluded == 1 && !dataDB.labNumber && !this.outDocuments.find(r => r.docType.category == 'LAB')) {
                                    this.outDocuments.push({
                                        name: 'Solicitare desfasurare analize de laborator',
                                        docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                                        status: 'Urmeaza a fi inclus in actul de predare-primire',
                                        date: new Date()
                                    });
                                } else if (dataDB.labIncluded == 1 && dataDB.labNumber) {
                                    this.outDocuments.forEach((item, index) => {
                                        if (item.docType.category == 'LAB') {
                                            this.outDocuments.splice(index, 1);
                                        }
                                    });
                                    const rl = this.documents.find(r => r.docType.category == 'RL');
                                    let statusDoc = '';
                                    if (rl) {
                                        statusDoc = 'Inclus in actul de predare-primire. Raspuns primit.';
                                    } else {
                                        statusDoc = 'Inclus in actul de predare-primire. Asteptare raspuns.';
                                    }
                                    this.outDocuments.push({
                                        name: 'Solicitare desfasurare analize de laborator',
                                        docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                                        status: statusDoc,
                                        date: new Date(),
                                        number: dataDB.labNumber
                                    });
                                }
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );

        this.groups = [];
        this.groups = [...this.groups, {value: 'VIT', description: 'Vitale'}];
        this.groups = [...this.groups, {value: 'ES', description: 'Esenţiale'}];
        this.groups = [...this.groups, {value: 'NES', description: 'Nonesenţiale'}];
        if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].vitaleTo) {
            this.eForm.get('medicament.groupTo').setValue({value: 'VIT', description: 'Vitale'});
        } else if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].esentialeTo) {
            this.eForm.get('medicament.groupTo').setValue({value: 'ES', description: 'Esenţiale'});
        } else if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].nonesentialeTo) {
            this.eForm.get('medicament.groupTo').setValue({value: 'NES', description: 'Nonesenţiale'});
        }

        this.prescriptions = [];
        this.prescriptions = [...this.prescriptions, {value: 1, description: 'Cu prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 0, description: 'Fără prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 2, description: 'Staţionar'}];
        if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].prescriptionTo != undefined
            && dataDB.medicamentHistory[0].prescriptionTo != null) {
            if (dataDB.medicamentHistory[0].prescriptionTo == 1) {
                this.eForm.get('medicament.prescriptionTo').setValue({value: 1, description: 'Cu prescripţie'});
            } else if (dataDB.medicamentHistory[0].prescriptionTo == 0) {
                this.eForm.get('medicament.prescriptionTo').setValue({value: 0, description: 'Fără prescripţie'});
            } else {
                this.eForm.get('medicament.prescriptionTo').setValue({value: 2, description: 'Staţionar'});
            }
        }

        this.companyMedicaments =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.medLoading = true;

                }),
                flatMap(term =>

                    this.medicamentService.getMedicamentByRegisterNumber(term).pipe(
                        tap((r) => {
                            this.medLoading = false;
                        })
                    )
                )
            );

        this.subscriptions.push(this.administrationService.variatonTypesJSON().subscribe(data => {
                this.variationTypesIds = JSON.stringify(data.val2);
                if (dataDB.variations) {
                    this.variationTypesIdsTemp = this.variationTypesIds.substr(1);
                    for (const v of dataDB.variations) {
                        const t = new TodoItemFlatNode();
                        t.item = this.getVariationCodeById(v.variation.id, v.value);
                        this.checklistSelection.selected.push(t);
                    }
                }
            }
        ));
    }

    getVariationCodeById(id: string, value: string): string {
        const i = this.variationTypesIdsTemp.indexOf(value + '":"' + id + '"') + value.length - 1;
        const tempStr = this.variationTypesIdsTemp.substr(1, i);
        const j = tempStr.lastIndexOf('"') + 1;
        const finalStr = tempStr.substr(j, i);
        this.variationTypesIdsTemp = this.variationTypesIdsTemp.replace('"' + finalStr + '":"' + id + '"', '');
        return finalStr;
    }

    checkPharmaceuticalFormTypeValue() {
        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        if (this.notSetForm) {
            this.notSetForm = false;
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalFormTo').setValue(null);
                    this.pharmaceuticalForms = data;
                    if (this.initialData.medicamentHistory && this.initialData.medicamentHistory.length != 0
                        && this.initialData.medicamentHistory[0] && this.initialData.medicamentHistory[0].pharmaceuticalFormTo) {
                        this.eForm.get('medicament.pharmaceuticalFormTo').setValue(this.pharmaceuticalForms.find(r => r.id === this.initialData.medicamentHistory[0].pharmaceuticalFormTo.id));
                    }
                },
                error => console.log(error)
            )
        );
    }

    fillAutorizationHolderDetails() {
        if (this.eForm.get('medicament.authorizationHolderTo').value == null) {
            return;
        }

        this.eForm.get('medicament.authorizationHolderCountry').setValue(this.eForm.get('medicament.authorizationHolderTo').value.country.description);
        this.eForm.get('medicament.authorizationHolderAddress').setValue(this.eForm.get('medicament.authorizationHolderTo').value.address);
    }

    fillManufactureDetails() {
        if (this.eForm.get('medicament.manufacture').value == null) {
            return;
        }

        this.eForm.get('medicament.manufactureMedCountry').setValue(this.eForm.get('medicament.manufacture').value.country.description);
        this.eForm.get('medicament.manufactureMedAddress').setValue(this.eForm.get('medicament.manufacture').value.address);
    }


    nextStep() {
        if (!this.eForm.get('registrationStatus').value) {
            this.errorHandlerService.showError('Status inregistrare trebuie selectat.');
            return;
        }

        if (!this.checklistSelection.selected || this.checklistSelection.selected.length == 0) {
            this.errorHandlerService.showError('Tip variatie trebuie selectat.');
            return;
        }

        if (this.eForm.get('registrationStatus').value == 0) {
            this.interruptProcess();
            return;
        }
        this.formSubmitted = true;

        let isFormInvalid = false;
        const isOutputDocInvalid = false;
        if (this.eForm.invalid || this.divisions.length == 0 || this.activeSubstancesTable.length == 0 || this.manufacturesTable.length == 0 || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        if (!this.eForm.get('regnr').value) {
            isFormInvalid = true;
        }
        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }

        if (isOutputDocInvalid || isFormInvalid) {
            return;
        }

        const test = this.manufacturesTable.find(r => r.producatorProdusFinitTo == true);
        if (!test) {
            this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
            return;
        }

        const sl = this.outDocuments.find(r => r.docType.category == 'SL');
        if (sl) {
            const resp = this.outDocuments.filter(t => t.docType.category == 'SL').find(r => r.responseReceived != 1);
            if (resp) {
                this.errorHandlerService.showError('Exista solicitari de date aditionale fara raspuns primit.');
                return;
            }
        }

        const rl = this.documents.find(r => r.docType.category == 'RL');
        const lab = this.outDocuments.find(r => r.docType.category == 'LAB');
        if (lab && !rl) {
            this.errorHandlerService.showError('Rezultatul laboratorului nu a fost atasat.');
            return;
        }

        this.isResponseReceived = true;
        this.formSubmitted = false;

        this.loadingService.show();
        const modelToSubmit: any = this.eForm.value;
        modelToSubmit.currentStep = 'X';
        modelToSubmit.laboratorReferenceStandards = this.standarts;

        this.fillMedicamentDetails(modelToSubmit);

        modelToSubmit.medicamentName = this.eForm.get('medicament.commercialNameTo').value;
        if (this.eForm.get('regnr').value) {
            modelToSubmit.medicamentPostauthorizationRegisterNr = this.eForm.get('regnr').value.regnr;
        }

        if (!this.outDocuments.find(t => t.docType.category == 'MP')) {
            modelToSubmit.outputDocuments.push({
                name: 'Modificarea la Certificatul de autorizare a medicamentului',
                docType: this.docTypesInitial.find(r => r.category == 'MP'),
                number: 'MP-' + this.eForm.get('requestNumber').value,
                date: new Date()
            });
        }

        if (!this.outDocuments.find(t => t.docType.category == 'SAV')) {
            modelToSubmit.outputDocuments.push({
                name: 'Scrisoare de aprobare variatii',
                docType: this.docTypesInitial.find(r => r.category == 'SAV'),
                number: 'SAV-' + this.eForm.get('requestNumber').value,
                date: new Date()
            });
        }

        modelToSubmit.variations = [];
        for (const sel of this.checklistSelection.selected) {
            const xid = this.getVariationId(sel.item);
            if (isNumeric(xid)) {
                modelToSubmit.variations.push({variation: {id: xid}, value: this.getVariationValue(sel.item)});
            }
        }

        this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/post-modify/expert/' + data.body.id]);
            }, error => this.loadingService.hide())
        );
    }

    hideModal(modelToSubmit: any) {
        this.loadingService.hide();
        this.outDocuments = modelToSubmit.medicament.outputDocuments;
    }

    addDivision() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';

        dialogConfig2.data = {divisions: this.divisions};

        const dialogRef = this.dialog.open(AddDivisionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.divisions.push({
                        old: 0,
                        description: result.division,
                        volume: result.volume,
                        volumeQuantityMeasurement: result.volumeQuantityMeasurement,
                        samplesNumber: result.samplesNumber,
                        serialNr: result.serialNr,
                        samplesExpirationDate: result.samplesExpirationDate,
                    });
                    this.eForm.get('divisionBonDePlata').setValue(this.getConcatenatedDivision());
                    this.displayInstructions();
                    this.displayMachets();
                }
            }
        );
    }

    getConcatenatedDivision() {
        let concatenatedDivision = '';
        for (const entry of this.divisions) {
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
                        commentTo: result.comment
                    });
                    this.payment.manufactureModified();
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
                this.payment.manufactureModified();
            }
        });
    }

    removeDivision(index: number, division: any) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur ca doriti sa stergeti aceasta divizare? Instructiunile si machetele atasate acestei diviziuni vor fi sterese.',
                confirm: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.divisions.splice(index, 1);
                this.eForm.get('divisionBonDePlata').setValue(this.getConcatenatedDivision());
                this.displayInstructions();
                this.displayMachets();
            }
        });
    }

    removeSubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.activeSubstancesTable.splice(index, 1);
                this.fillDose();
            }
        });
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


    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    documentModified(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
    }

    requestLaboratoryAnalysis() {

        this.formSubmitted = true;

        if (this.eForm.invalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        this.formSubmitted = false;

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(AddLaboratorStandardsComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.subscriptions.push(this.requestService.laboratorAnalysis(this.eForm.get('id').value).subscribe(data => {
                        this.outDocuments.push({
                            name: 'Solicitare desfasurare analize de laborator',
                            docType: this.docTypesInitial.find(r => r.category == 'LAB'),
                            status: 'Urmeaza a fi inclus in actul de predare-primire',
                            date: new Date()
                        });
                        this.standarts = result.standards;
                        this.save();
                    }, error => console.log(error))
                );
            }
        });

    }


    isDisabledLabButton(): boolean {
        return this.outDocuments.some(elem => {
            return elem.docType.category == 'LAB' ? true : false;
        });
    }


    requestAdditionalData() {

        if (!this.checklistSelection.selected || this.checklistSelection.selected.length == 0) {
            this.errorHandlerService.showError('Tip variatie trebuie selectat.');
            return;
        }

        this.formSubmitted = true;

        let isFormInvalid = false;
        const isOutputDocInvalid = false;
        if (this.eForm.get('medicament.pharmaceuticalFormTo').invalid || this.eForm.get('medicament.doseTo').invalid ||
            this.eForm.get('medicament.internationalMedicamentNameTo').invalid || this.divisions.length == 0 || this.manufacturesTable.length == 0) {
            isFormInvalid = true;
        }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        this.formSubmitted = false;

        this.save();

        const lenOutDoc = this.outDocuments.filter(r => r.docType.category === 'SL').length;

        let x = this.eForm.get('medicament.commercialNameTo').value + ', ' + this.eForm.get('medicament.pharmaceuticalFormTo').value.description
            + ' ' + this.eForm.get('medicament.doseTo').value;
        x = x + this.getConcatenatedDivision();
        x = x + '(DCI:' + this.eForm.get('medicament.internationalMedicamentNameTo').value.description + '), producători: ';
        this.manufacturesTable.forEach(elem => x = x + ' ' + elem.manufacture.description + ',' + elem.manufacture.country.description + ',' + elem.manufacture.address);

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            width: '1000px',
            height: '800px',
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.eForm.get('data').value,
                nrOrdDoc: lenOutDoc + 1,
                medicamentStr: x,
                companyName: this.eForm.get('company').value.name,
                address: this.eForm.get('company').value.legalAddress,
                registrationRequestMandatedContact: this.registrationRequestMandatedContacts[0]
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.initialData.outputDocuments = this.outDocuments;
                const modSubmit = Object.assign({}, this.initialData);
                modSubmit.variations = [];
                for (const sel of this.checklistSelection.selected) {
                    const xid = this.getVariationId(sel.item);
                    if (isNumeric(xid)) {
                        modSubmit.variations.push({variation: {id: xid}, value: this.getVariationValue(sel.item)});
                    }
                }
                this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(modSubmit).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                    }, error => console.log(error))
                );
            }
        });
    }

    interruptProcess() {
        this.formSubmitted = true;

        if (this.eForm.invalid || this.divisions.length == 0 || this.activeSubstancesTable.length == 0 || this.manufacturesTable.length == 0) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }
        const test = this.manufacturesTable.find(r => r.producatorProdusFinitTo == true);
        if (!test) {
            this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
            return;
        }

        this.formSubmitted = false;
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.show();
                this.save();
                const usernameDB = this.authService.getUserName();
                const modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.eForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.initialData.initiator,
                    registrationRequestMandatedContacts: [],
                    medicaments: [],
                    medicamentHistory: []
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.eForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

                let medicamentToSubmit: any;
                medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
                medicamentToSubmit.activeSubstancesHistory = this.activeSubstancesTable;
                medicamentToSubmit.auxiliarySubstancesHistory = this.auxiliarySubstancesTable;
                medicamentToSubmit.divisionHistory = this.divisions;
                medicamentToSubmit.prescriptionTo = this.eForm.get('medicament.prescriptionTo').value.value;
                modelToSubmit.medicamentHistory.push(medicamentToSubmit);
                modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;
                if (this.eForm.get('medicament.atcCodeTo').value) {
                    if (this.eForm.get('medicament.atcCodeTo').value.code) {
                        medicamentToSubmit.atcCodeTo = this.eForm.get('medicament.atcCodeTo').value.code;
                    } else {
                        medicamentToSubmit.atcCodeTo = this.eForm.get('medicament.atcCodeTo').value;
                    }
                }

                this.subscriptions.push(this.requestService.addMediacmentPostauthorizationHistoryOnInterruption(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/post-modify/interrupt/' + this.eForm.get('id').value]);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    viewDoc(document: any) {
        this.loadingService.show();
        if (document.docType.category == 'SL' || document.docType.category == 'LA') {


            const modelToSubmit = {
                nrDoc: document.number,
                responsiblePerson: this.registrationRequestMandatedContacts[0].mandatedLastname + ' ' + this.registrationRequestMandatedContacts[0].mandatedFirstname,
                companyName: this.eForm.get('company').value.name,
                requestDate: document.date,
                country: 'Moldova',
                address: this.eForm.get('company').value.legalAddress,
                phoneNumber: this.registrationRequestMandatedContacts[0].phoneNumber,
                email: this.registrationRequestMandatedContacts[0].email,
                message: document.content,
                function: document.signerFunction,
                signerName: document.signerName
            };

            let observable: Observable<any> = null;
            observable = this.documentService.viewRequestNew(modelToSubmit);

            this.subscriptions.push(observable.subscribe(data => {
                    const file = new Blob([data], {type: 'application/pdf'});
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
        }
    }

    remove(doc: any) {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(a)?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                if (doc.docType.category == 'LAB') {
                    this.subscriptions.push(this.requestService.removeLaboratorAnalysis(this.eForm.get('id').value).subscribe(data => {
                            this.outDocuments.forEach((item, index) => {
                                if (item === doc) {
                                    this.outDocuments.splice(index, 1);
                                }
                            });
                            this.standarts = [];
                            this.save();
                        }, error => console.log(error))
                    );
                    return;
                }

                this.loadingService.show();
                this.outDocuments.forEach((item, index) => {
                    if (item === doc) {
                        this.outDocuments.splice(index, 1);
                    }
                });
                this.initialData.outputDocuments = this.outDocuments;

                this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                        if (doc.docType.category == 'RL') {
                            this.eForm.get('labResponse').setValue(null);
                        }
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkResponseReceived(doc: any, value: any) {
        if (value.checked) {
            doc.responseReceived = 1;
        } else {
            doc.responseReceived = 0;
        }
    }

    checkProducatorProdusFinit(manufacture: any, value: any) {
        manufacture.producatorProdusFinitTo = value.checked;
        this.payment.manufactureModified();
    }

    save() {

        const rl = this.outDocuments.find(r => r.docType.category == 'RL');
        if (rl) {
            rl.responseReceived = this.eForm.get('labResponse').value;
        }

        this.loadingService.show();
        const modelToSubmit: any = this.eForm.value;
        modelToSubmit.currentStep = 'E';

        this.fillMedicamentDetails(modelToSubmit);

        modelToSubmit.variations = [];
        for (const sel of this.checklistSelection.selected) {
            const xid = this.getVariationId(sel.item);
            if (isNumeric(xid)) {
                modelToSubmit.variations.push({variation: {id: xid}, value: this.getVariationValue(sel.item)});
            }
        }

        this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(modelToSubmit).subscribe(data => {
                this.initialData = Object.assign({}, data.body);
                this.initialData.medicamentHistory = Object.assign([], data.body.medicamentHistory);
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
    }

    getVariationValue(find: string): string {
        const j = find.indexOf('- ') + 2;
        return find.substr(j);
    }

    getVariationId(find: string): string {
        const i = this.variationTypesIds.indexOf(find) + find.length + 3;
        const tempStr = this.variationTypesIds.substr(i);
        const j = tempStr.indexOf(',');
        const k = tempStr.indexOf('}');
        if (j < k && j != -1) {
            return this.variationTypesIds.substr(i, j - 1);
        } else {
            return this.variationTypesIds.substr(i, k - 1);
        }
    }

    fillMedicamentDetails(modelToSubmit: any) {
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;
        modelToSubmit.laboratorReferenceStandards = this.standarts;
        modelToSubmit.assignedUser = this.authService.getUserName();
        modelToSubmit.paymentOrders = this.payment.getPaymentOrders();

        let medicamentToSubmit: any;
        medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
        medicamentToSubmit.activeSubstancesHistory = this.activeSubstancesTable;
        medicamentToSubmit.auxiliarySubstancesHistory = this.auxiliarySubstancesTable;
        medicamentToSubmit.divisionHistory = this.divisions;
        medicamentToSubmit.divisionHistory.forEach(t => {
            t.instructionsHistory = [];
        });
        medicamentToSubmit.divisionHistory.forEach(t => {
            t.instructionsHistory.push.apply(t.instructionsHistory, t.instructions);
            t.instructionsHistory.push.apply(t.instructionsHistory, t.machets);
        });

        medicamentToSubmit.manufacturesHistory = this.manufacturesTable;
        medicamentToSubmit.medicamentTypesHistory = [];
        this.fillGroups(medicamentToSubmit);

        if (this.eForm.get('medicament.medTypesValues').value) {
            for (const w of this.eForm.get('medicament.medTypesValues').value) {
                medicamentToSubmit.medicamentTypesHistory.push({type: w});
            }
        }
        if (this.eForm.get('medicament.atcCodeTo').value) {
            if (this.eForm.get('medicament.atcCodeTo').value.code) {
                medicamentToSubmit.atcCodeTo = this.eForm.get('medicament.atcCodeTo').value.code;
            } else {
                medicamentToSubmit.atcCodeTo = this.eForm.get('medicament.atcCodeTo').value;
            }
        }
        if (this.eForm.get('medicament.prescriptionTo').value) {
            medicamentToSubmit.prescriptionTo = this.eForm.get('medicament.prescriptionTo').value.value;
        }
        modelToSubmit.medicamentHistory = [];
        modelToSubmit.medicamentHistory.push(medicamentToSubmit);

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.medicaments = [];
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

        // if(!this.rForm.dirty){
        //     return true;
        // }
        // const dialogRef = this.dialogConfirmation.open(ConfirmationDialogComponent, {
        //     data: {
        //         message: 'Toate datele colectate nu vor fi salvate, sunteti sigur(a)?',
        //         confirm: false,
        //     }
        // });
        //
        // return dialogRef.afterClosed();
        return true;

    }

    addActiveSubstanceDialog() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.activeSubstancesTable.push({
                    activeSubstance: result.activeSubstance,
                    quantityTo: result.activeSubstanceQuantity,
                    unitsOfMeasurementTo: result.activeSubstanceUnit,
                    manufactures: result.manufactures,
                    status: 'N',
                    compositionNumberTo: result.compositionNumber
                });
                this.fillDose();
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
                if (!this.auxiliarySubstancesTable) {
                    this.auxiliarySubstancesTable = [];
                }
                this.auxiliarySubstancesTable.push({
                    auxSubstance: result.auxSubstance,
                    compositionNumberTo: result.compositionNumber
                });
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
        dialogConfig2.data = {
            activeSubstance: substance.activeSubstance,
            quantity: substance.quantityTo,
            unitsOfMeasurement: substance.unitsOfMeasurementTo,
            manufactures: substance.manufactures,
            status: substance.status,
            compositionNumber: substance.compositionNumberTo
        };
        dialogConfig2.data.disableSubstance = (substance.status && substance.status == 'O');

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.activeSubstancesTable[index] = {
                    activeSubstance: result.activeSubstance,
                    quantityTo: result.activeSubstanceQuantity,
                    unitsOfMeasurementTo: result.activeSubstanceUnit,
                    manufactures: result.manufactures,
                    status: result.status == 'O' ? 'O' : 'N',
                    compositionNumberTo: result.compositionNumber
                };
                this.fillDose();
            }
        });
    }

    editDivision(division: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        dialogConfig2.panelClass = 'custom-dialog-container';

        dialogConfig2.width = '600px';
        dialogConfig2.data = {division : division, disabledMainFields : false};

        const dialogRef = this.dialog.open(AddDivisionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.divisions[index].samplesNumber = result.samplesNumber;
                this.divisions[index].serialNr = result.serialNr;
                this.divisions[index].samplesExpirationDate = result.samplesExpirationDate;
            }
        });
    }

    fillDose() {
        this.activeSubstancesTable.sort((a, b) => {
            return (a.compositionNumberTo - b.compositionNumberTo == 0) ? a.activeSubstance.id - b.activeSubstance.id : a.compositionNumberTo - b.compositionNumberTo;
        });
        let i = 1;
        let orderNr = '';
        let tempDose = '';
        for (const z of this.activeSubstancesTable) {
            if (z.compositionNumberTo == orderNr || i == 1) {
                if (i == 1) {
                    tempDose = z.quantityTo + ' ' + z.unitsOfMeasurementTo.description;
                } else {
                    tempDose = tempDose + ' + ' + z.quantityTo + ' ' + z.unitsOfMeasurementTo.description;
                }
            } else {
                tempDose = tempDose + '; ' + z.quantityTo + ' ' + z.unitsOfMeasurementTo.description;
            }
            i++;
            orderNr = z.compositionNumberTo;
        }
        this.eForm.get('medicament.doseTo').setValue(tempDose);
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    showMedicamentDetails() {

        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.width = '1100px';

        console.log(this.medicamentsDetails);
        dialogConfig2.data = {
            value: {code: this.medicamentsDetails[0].code, id: this.medicamentsDetails[0].id}
        };

        this.dialog.open(MedicamentDetailsDialogComponent, dialogConfig2);
    }

    fillGroups(medicamentToSubmit: any) {
        if (this.eForm.get('medicament.groupTo').value) {
            if (this.eForm.get('medicament.groupTo').value.value == 'VIT') {
                medicamentToSubmit.vitaleTo = 1;
                medicamentToSubmit.esentialeTo = 0;
                medicamentToSubmit.nonesentialeTo = 0;
            } else if (this.eForm.get('medicament.groupTo').value.value == 'ES') {
                medicamentToSubmit.vitaleTo = 0;
                medicamentToSubmit.esentialeTo = 1;
                medicamentToSubmit.nonesentialeTo = 0;
            } else if (this.eForm.get('medicament.groupTo').value.value == 'NES') {
                medicamentToSubmit.vitaleTo = 0;
                medicamentToSubmit.esentialeTo = 0;
                medicamentToSubmit.nonesentialeTo = 1;
            }
        }
    }

    manufacturesStr(substance: any) {
        if (substance && substance.manufactures) {
            let s = Array.prototype.map.call(substance.manufactures,
                s => s.manufacture.description + ' ' + (s.manufacture.country ? s.manufacture.country.description : '')
                    + ' ' + s.manufacture.address + 'NRQW').toString();
            s = s.replace(/NRQW/gi, ';');
            return s.replace(';,', '; ');
        }
        return '';
    }

    checkClasificareMedicament(value: any) {
        this.eForm.get('medicament.originaleTo').setValue(value.checked);
    }

    checkOrphanMedicament(value: any) {
        this.eForm.get('medicament.orphanTo').setValue(value.checked);
    }

    removeInstr(event) {
        for (const div of this.divisions) {
            if (div.instructions) {
                div.instructions = div.instructions.filter(t => t.path != event);
            }
        }
        this.displayInstructions();
    }

    addInstr(event) {
        this.divisions = event;
        this.displayInstructions();
    }

    removeMacheta(event) {
        for (const div of this.divisions) {
            if (div.machets) {
                div.machets = div.machets.filter(t => t.path != event);
            }
        }
        this.displayMachets();
    }

    addMacheta(event) {
        this.divisions = event;
        this.displayMachets();
    }

    addVariationType() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;
        // dialogConfig2.panelClass = 'overflow-ys';

        dialogConfig2.width = '1000px';
        dialogConfig2.height = '800px';

        dialogConfig2.data = {values: this.checklistSelection, disabled: false};

        const dialogRef = this.dialog.open(SelectVariationTypeComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.checklistSelection = result.values;
                    //console.log(result.values);
                }
            }
        );
    }
}
