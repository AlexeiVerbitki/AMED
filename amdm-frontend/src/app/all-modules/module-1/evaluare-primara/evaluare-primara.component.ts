import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {RequestService} from '../../../shared/service/request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdministrationService} from '../../../shared/service/administration.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AuthService} from '../../../shared/service/authetication.service';
import {DocumentService} from '../../../shared/service/document.service';
import {RequestAdditionalDataDialogComponent} from '../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component';
import {TaskService} from '../../../shared/service/task.service';
import {ErrorHandlerService} from '../../../shared/service/error-handler.service';
import {LoaderService} from '../../../shared/service/loader.service';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ActiveSubstanceDialogComponent} from '../../../dialog/active-substance-dialog/active-substance-dialog.component';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {Document} from '../../../models/document';
import {UploadFileService} from '../../../shared/service/upload/upload-file.service';
import {AuxiliarySubstanceDialogComponent} from '../../../dialog/auxiliary-substance-dialog/auxiliary-substance-dialog.component';
import {PaymentComponent} from '../../../payment/payment.component';
import {AddManufactureComponent} from '../../../dialog/add-manufacture/add-manufacture.component';
import {AddDivisionComponent} from '../../../dialog/add-division/add-division.component';
import {MedicamentService} from '../../../shared/service/medicament.service';

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara.component.html',
    styleUrls: ['./evaluare-primara.component.css']
})
export class EvaluarePrimaraComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document[] = [];
    instructions: any[] = [];
    machets: any[] = [];
    formSubmitted: boolean;
    paymentTotal: number;

    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstancesTable: any[] = [];
    auxiliarySubstancesTable: any[] = [];
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    registrationRequestMandatedContacts: any[];
    groups: any[] = [];
    reqTypes: any[];
    prescriptions: any[] = [];
    internationalNames: any[];
    medicamentTypes2: any[];
    manufactureAuthorizations: any[];
    docTypes: any[];
    docTypesInitial: any[];
    outDocuments: any[] = [];
    isResponseReceived: boolean = true;
    isNonAttachedDocuments: boolean = false;
    initialData: any;
    companyMedicaments: Observable<any[]>;
    medInputs = new Subject<string>();
    medLoading = false;

    @ViewChild('payment') payment: PaymentComponent;

    protected atcCodes: Observable<any[]>;
    protected loadingAtcCodes: boolean = false;
    protected atcCodesInputs = new Subject<string>();

    constructor(public dialog: MatDialog,
                private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private documentService: DocumentService,
                private medicamentService: MedicamentService,
                private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService,
                private navbarTitleService: NavbarTitleService,
                private uploadService: UploadFileService,
                private loadingService: LoaderService,
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
            'medicamentName': [],
            'regnr': [],
            'medicaments': [[]],
            'division': [null],
            'labResponse': [null],
            'divisionBonDePlata': [null],
            'registrationStatus': [null],
            'medicament':
                fb.group({
                    'id': [],
                    'commercialName': ['', Validators.required],
                    'atcCode': [null, Validators.required],
                    'registrationNumber' : [],
                    'registrationDate': [],
                    'pharmaceuticalForm': [null, Validators.required],
                    'pharmaceuticalFormType': [null, Validators.required],
                    'dose': [null],
                    'internationalMedicamentName': [null, Validators.required],
                    'termsOfValidity': [null, Validators.required],
                    'prescription': [null, Validators.required],
                    'authorizationHolder': [null, Validators.required],
                    'authorizationHolderCountry': [null],
                    'originale': [null],
                    'orphan': [null],
                    'authorizationHolderAddress': [null],
                    'status': ['P'],
                    'group': [null, Validators.required],
                    'medTypesValues': []
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'type': [],
            'typeFara': [null],
            'requestHistories': [],
            'expirationDate': {disabled: true, value: null},
            'registrationDate': {disabled: true, value: null},
        });
        this.eForm.get('regnr').valueChanges.subscribe(val => {
            if (val && val.regnr) {
                this.loadMedicamentDetailsByRegNr(val.regnr);
            }
        });
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Înregistrarea medicamentului / Evaluare primara');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.fillRequestDetails(data);
                        this.initiateMedicamentDetails(data, false);
                        if (data.type && data.type.code == 'MEDR') {
                            this.disabeFieldsForRepeatedRegistration();
                        }
                    })
                );
            })
        );
    }

    loadMedicamentDetailsByRegNr(regNr: any) {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getOldRequestIdByMedicamentRegNr(regNr).subscribe(data2 => {
                        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                                this.subscriptions.push(this.requestService.getMedicamentRequest(data2).subscribe(data3 => {
                                        data3.medicaments = data3.medicaments.filter(t => t.status == 'F');
                                        this.initiateMedicamentDetails(data3, true);
                                        this.outDocuments = [];
                                        this.eForm.get('medicament.registrationDate').setValue(new Date(data3.medicaments[0].registrationDate));
                                        this.eForm.get('medicament.registrationNumber').setValue(data3.medicaments[0].registrationNumber);
                                        this.eForm.get('registrationDate').setValue(new Date(data3.medicaments[0].registrationDate));
                                        this.eForm.get('expirationDate').setValue(new Date(data3.medicaments[0].expirationDate));
                                        this.disabeFieldsForRepeatedRegistration();
                                    })
                                );
                            })
                        );
                    })
                );
            })
        );
    }

    disabeFieldsForRepeatedRegistration() {
        this.eForm.get('medicament.dose').disable();
        this.eForm.get('medicament.pharmaceuticalFormType').disable();
        this.eForm.get('medicament.pharmaceuticalForm').disable();
        this.eForm.get('medicament.atcCode').disable();
        this.eForm.get('medicament.group').disable();
        this.eForm.get('medicament.prescription').disable();
        this.eForm.get('medicament.internationalMedicamentName').disable();
        this.eForm.get('medicament.medTypesValues').disable();
        this.eForm.get('medicament.authorizationHolder').disable();
        this.eForm.get('medicament.termsOfValidity').disable();
    }

    fillRequestDetails(data: any) {
        this.eForm.get('typeFara').setValue(data.type);
        this.eForm.get('type').setValue(data.type);
        this.eForm.get('id').setValue(data.id);
        this.registrationRequestMandatedContacts = data.registrationRequestMandatedContacts;
        this.eForm.get('initiator').setValue(data.initiator);
        this.eForm.get('startDate').setValue(data.startDate);
        this.eForm.get('requestNumber').setValue(data.requestNumber);
        this.eForm.get('requestHistories').setValue(data.requestHistories);
        this.eForm.get('company').setValue(data.company);
        this.eForm.get('companyValue').setValue(data.company.name);
    }

    initiateMedicamentDetails(data: any, isRepeatedRegistration: boolean) {
        this.initialData = Object.assign({}, data);
        this.initialData.medicaments = Object.assign([], data.medicaments);
        if (!isRepeatedRegistration) {
            this.documents = data.documents;
        } else {
            data.type = this.reqTypes.find(t => t.code == 'MEDR');
        }
        this.outDocuments = data.outputDocuments;
        let rl = this.outDocuments.find(r => r.docType.category == 'RL');
        if (rl && (rl.responseReceived == 0 || rl.responseReceived)) {
            this.eForm.get('labResponse').setValue(rl.responseReceived.toString());
        }
        if (data.medicaments && data.medicaments.length != 0) {
            this.eForm.get('medicament.commercialName').setValue(data.medicaments[0].commercialName);
            this.eForm.get('medicamentName').setValue(data.medicaments[0].commercialName);
            this.initialData.medicaments.activeSubstances = Object.assign([], data.medicaments[0].activeSubstances);
            this.initialData.medicaments.auxSubstances = Object.assign([], data.medicaments[0].auxSubstances);
            for (let entry of data.medicaments) {
                if ((entry.division || entry.volume) && (entry.status == 'F' || entry.status == 'P')) {
                    this.divisions.push({
                        description: entry.division,
                        code: entry.code,
                        volume: entry.volume,
                        volumeQuantityMeasurement: entry.volumeQuantityMeasurement,
                        instructions: entry.instructions.filter(t => t.type == 'I'),
                        machets: entry.instructions.filter(t => t.type == 'M')
                    });
                }
            }
            this.eForm.get('medicament.registrationDate').setValue(data.medicaments[0].registrationDate);
            this.eForm.get('medicament.registrationNumber').setValue(data.medicaments[0].registrationNumber);
            this.eForm.get('regnr').setValue(data.medicaments[0].registrationNumber);
            this.eForm.get('divisionBonDePlata').setValue(this.getConcatenatedDivision());
            this.displayInstructions();
            this.displayMachets();
            this.eForm.get('medicament.atcCode').setValue(data.medicaments[0].atcCode);
            this.eForm.get('medicament.dose').setValue(data.medicaments[0].dose);
            this.eForm.get('medicament.termsOfValidity').setValue(data.medicaments[0].termsOfValidity);
            this.eForm.get('medicament.originale').setValue(data.medicaments[0].originale);
            this.eForm.get('medicament.orphan').setValue(data.medicaments[0].orphan);
            this.activeSubstancesTable = data.medicaments[0].activeSubstances;
            this.auxiliarySubstancesTable = data.medicaments[0].auxSubstances;
            this.manufacturesTable = data.medicaments[0].manufactures;
        }
        this.checkOutputDocumentsStatus();
        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let xs = this.documents;
        xs = xs.map(x => {
            x.isOld = true;
            return x;
        });
        this.loadAllQuickSearches(data);
    }

    displayInstructions() {
        this.instructions = [];
        for (let div of this.divisions) {
            if (div.instructions) {
                for (let instr of div.instructions) {
                    let instrTest = this.instructions.find(value => value.path == instr.path);
                    if (instrTest) {
                        instrTest.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                    } else {
                        let instrAdd = Object.assign({}, instr);
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
        for (let div of this.divisions) {
            if (div.machets) {
                for (let machet of div.machets) {
                    let machetTest = this.machets.find(value => value.path == machet.path);
                    if (machetTest) {
                        machetTest.divisions.push({
                            description: div.description,
                            volume: div.volume,
                            volumeQuantityMeasurement: div.volumeQuantityMeasurement
                        });
                    } else {
                        let machetAdd = Object.assign({}, machet);
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
        for (let entry of this.outDocuments) {
            var isMatch = this.documents.some(elem => {
                return (elem.docType.category == entry.docType.category && elem.number == entry.number) ? true : false;
            });
            if (isMatch) {
                entry.status = 'Atasat';
            } else {
                entry.status = 'Nu este atasat';
            }
        }
    }

    loadAllQuickSearches(dataDB: any) {

        this.loadATCCodes();

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].pharmaceuticalForm) {
                        this.eForm.get('medicament.pharmaceuticalFormType').setValue(this.pharmaceuticalFormTypes.find(r => r.id === dataDB.medicaments[0].pharmaceuticalForm.type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllInternationalNames().subscribe(data => {
                    this.internationalNames = data;
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].internationalMedicamentName) {
                        this.eForm.get('medicament.internationalMedicamentName').setValue(this.internationalNames.find(r => r.id === dataDB.medicaments[0].internationalMedicamentName.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    this.medicamentTypes2 = data.filter(r => r.category === 'T');
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].medicamentTypes) {
                        const arr: any[] = [];
                        for (const z of dataDB.medicaments[0].medicamentTypes) {
                            arr.push(z.type);
                        }
                        this.eForm.get('medicament.medTypesValues').setValue(arr);
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactureAuthorizations = data.filter(r => r.authorizationHolder == 1);
                    if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].authorizationHolder) {
                        this.eForm.get('medicament.authorizationHolder').setValue(this.manufactureAuthorizations.find(r => r.id === dataDB.medicaments[0].authorizationHolder.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('1', 'E').subscribe(step => {
                    this.subscriptions.push(
                        this.administrationService.getAllDocTypes().subscribe(data => {
                                this.docTypes = data;
                                this.docTypesInitial = Object.assign([], data);
                                this.docTypes = this.docTypes.filter(r => step.availableDocTypes.includes(r.category));
                            },
                            error => console.log(error)
                        )
                    );
                },
                error => console.log(error)
            )
        );
        this.groups = [...this.groups, {value: 'VIT', description: 'Vitale'}];
        this.groups = [...this.groups, {value: 'ES', description: 'Esenţiale'}];
        this.groups = [...this.groups, {value: 'NES', description: 'Nonesenţiale'}];
        if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].vitale) {
            this.eForm.get('medicament.group').setValue({value: 'VIT', description: 'Vitale'});
        } else if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].esentiale) {
            this.eForm.get('medicament.group').setValue({value: 'ES', description: 'Esenţiale'});
        } else if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].nonesentiale) {
            this.eForm.get('medicament.group').setValue({value: 'NES', description: 'Nonesenţiale'});
        }

        this.prescriptions = [...this.prescriptions, {value: 1, description: 'Cu prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 0, description: 'Fără prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 2, description: 'Staţionar'}];
        if (dataDB.medicaments && dataDB.medicaments.length != 0 && dataDB.medicaments[0].prescription) {
            if (dataDB.medicaments[0].prescription == 1) {
                this.eForm.get('medicament.prescription').setValue({value: 1, description: 'Cu prescripţie'});
            } else if (dataDB.medicaments[0].prescription == 0) {
                this.eForm.get('medicament.prescription').setValue({value: 0, description: 'Fără prescripţie'});
            } else {
                this.eForm.get('medicament.prescription').setValue({value: 2, description: 'Staţionar'});
            }
        }

        this.companyMedicaments =
            this.medInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
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

        this.subscriptions.push(
            this.administrationService.getAllRequestTypes().subscribe(data => {
                    this.reqTypes = data;
                    this.reqTypes = this.reqTypes.filter(t => t.processId == 2 && t.code != 'MEDF');
                    if (dataDB.type) {
                        this.eForm.get('type').setValue(this.reqTypes.find(r => r.id === dataDB.type.id));
                    }
                },
                error => console.log(error)
            )
        );
    }

    checkPharmaceuticalFormTypeValue() {

        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalForm').setValue(null);
                    this.pharmaceuticalForms = data;
                    if (this.initialData.medicaments && this.initialData.medicaments.length != 0 && this.initialData.medicaments[0] && this.initialData.medicaments[0].pharmaceuticalForm) {
                        this.eForm.get('medicament.pharmaceuticalForm').setValue(this.pharmaceuticalForms.find(r => r.id === this.initialData.medicaments[0].pharmaceuticalForm.id));
                    }
                },
                error => console.log(error)
            )
        );
    }

    fillAutorizationHolderDetails() {
        if (this.eForm.get('medicament.authorizationHolder').value == null) {
            return;
        }

        this.eForm.get('medicament.authorizationHolderCountry').setValue(this.eForm.get('medicament.authorizationHolder').value.country.description);
        this.eForm.get('medicament.authorizationHolderAddress').setValue(this.eForm.get('medicament.authorizationHolder').value.address);
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

        if (this.eForm.get('registrationStatus').value == 0) {
            this.interruptProcess();
            return;
        }

        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;
        if (this.eForm.invalid || this.divisions.length == 0 || this.activeSubstancesTable.length == 0 || this.manufacturesTable.length == 0
            || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        if (!this.eForm.get('type').value) {
            isFormInvalid = true;
        } else {
            if (this.eForm.get('type').value.code != 'MEDR' && !this.eForm.get('medicament.commercialName').value) {
                isFormInvalid = true;
            }
            if (this.eForm.get('type').value.code == 'MEDR' && !this.eForm.get('medicament').value) {
                isFormInvalid = true;
            }
        }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }

        if (isOutputDocInvalid || isFormInvalid) {
            return;
        }

        let test = this.manufacturesTable.find(r => r.producatorProdusFinit == true);
        if (!test) {
            this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
            return;
        }

        let sl = this.outDocuments.find(r => r.docType.category == 'SL');
        if (sl) {
            let resp = this.outDocuments.filter(t => t.docType.category == 'SL').find(r => r.responseReceived != 1);
            if (resp) {
                this.errorHandlerService.showError('Exista solicitari de date aditionale fara raspuns primit.');
                return;
            }
        }

        let rl = this.outDocuments.find(r => r.docType.category == 'RL');
        if (rl) {
            if (!this.eForm.get('labResponse').value) {
                this.errorHandlerService.showError('Nu a fost primit rezultatul de la laborator.');
                return;
            } else if (rl.status != 'Atasat') {
                this.errorHandlerService.showError('Rezultatul laboratorului nu a fost atasat.');
                return;
            } else {
                rl.responseReceived = this.eForm.get('labResponse').value;
            }
        }

        this.isResponseReceived = true;
        this.formSubmitted = false;

        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        this.fillMedicamentDetails(modelToSubmit);

        if (this.eForm.get('type').value.code == 'MEDR') {
            modelToSubmit.medicamentPostauthorizationRegisterNr = this.eForm.get('regnr').value.regnr;
            modelToSubmit.medicamentName = this.eForm.get('regnr').value.commercialName;
        }
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        if (!this.outDocuments.find(t => t.docType.category == 'CA')) {
            modelToSubmit.outputDocuments.push({
                name: 'Certificatul de autorizare al medicamentului',
                docType: this.docTypesInitial.find(r => r.category == 'CA'),
                number: 'CA-' + this.eForm.get('requestNumber').value,
                date: new Date()
            });
        }

        modelToSubmit.assignedUser = this.authService.getUserName();

        this.loadingService.show();
        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/medicament-registration/expert/' + data.body.id]);
            }, error1 => this.hideModal(modelToSubmit))
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

        let dialogRef = this.dialog.open(AddDivisionComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.divisions.push({
                        description: result.division,
                        volume: result.volume,
                        volumeQuantityMeasurement: result.volumeQuantityMeasurement
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
        for (let entry of this.divisions) {
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

        let dialogRef = this.dialog.open(AddManufactureComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
                if (result && result.response) {
                    this.manufacturesTable.push({
                        manufacture: result.manufacture,
                        producatorProdusFinit: false,
                        comment: result.comment
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

        this.outDocuments.push({
            name: 'Solicitare desfasurare analize de laborator',
            docType: this.docTypes.find(r => r.category == 'RL'),
            status: 'Nu este atasat',
            date: new Date()
        });
        this.initialData.outputDocuments = this.outDocuments;
        this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                this.outDocuments = data.body.outputDocuments;
                this.checkOutputDocumentsStatus();
            }, error => console.log(error))
        );

    }

    isDisabledLabButton(): boolean {
        return this.outDocuments.some(elem => {
            return elem.docType.category == 'RL' ? true : false;
        });
    }

    requestAdditionalData() {

        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;
        if (this.eForm.get('medicament.pharmaceuticalForm').invalid || this.eForm.get('medicament.dose').invalid ||
            this.eForm.get('medicament.internationalMedicamentName').invalid || this.divisions.length == 0 || this.manufacturesTable.length == 0) {
            isFormInvalid = true;
        }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
            return;
        }

        this.formSubmitted = false;

        var lenOutDoc = this.outDocuments.filter(r => r.docType.category === 'SL').length;

        let x = this.eForm.get('medicament.commercialName').value + ', ' + this.eForm.get('medicament.pharmaceuticalForm').value.description
            + ' ' + this.eForm.get('medicament.dose').value;
        x = x + this.getConcatenatedDivision();
        x = x + '(DCI:' + this.eForm.get('medicament.internationalMedicamentName').value.description + '), producători: ';
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
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
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
        let test = this.manufacturesTable.find(r => r.producatorProdusFinit == true);
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
                let usernameDB = this.authService.getUserName();
                var modelToSubmit = {
                    requestHistories: [],
                    currentStep: 'I',
                    id: this.eForm.get('id').value,
                    assignedUser: usernameDB,
                    initiator: this.initialData.initiator,
                    registrationRequestMandatedContacts: [],
                    medicaments: []
                };
                modelToSubmit.requestHistories.push({
                    startDate: this.eForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

                this.fillMedicamentDetails(modelToSubmit);
                modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

                this.subscriptions.push(this.requestService.addMedicamentRegistrationHistoryOnInterruption(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.eForm.get('id').value]);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    viewDoc(document: any) {
        this.loadingService.show();
        if (document.docType.category == 'SL' || document.docType.category == 'LA') {


            let modelToSubmit = {
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
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                }
                )
            );
        } else {
            this.subscriptions.push(this.documentService.viewDD(document.number).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
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
                this.loadingService.show();
                this.outDocuments.forEach((item, index) => {
                    if (item === doc) this.outDocuments.splice(index, 1);
                });
                this.initialData.outputDocuments = this.outDocuments;

                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
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
        for (let m of this.manufacturesTable) {
            m.producatorProdusFinit = false;
        }
        manufacture.producatorProdusFinit = value.checked;
        this.payment.manufactureModified();
    }

    save() {

        let rl = this.outDocuments.find(r => r.docType.category == 'RL');
        if (rl) {
            rl.responseReceived = this.eForm.get('labResponse').value;
        }

        this.loadingService.show();
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.currentStep = 'E';
        modelToSubmit.assignedUser = this.authService.getUserName();
        modelToSubmit.paymentOrders = this.payment.getPaymentOrders();
        if (!this.eForm.get('type').value) {
            modelToSubmit.type = this.eForm.get('typeFara').value;
        }

        this.fillMedicamentDetails(modelToSubmit);

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });
        modelToSubmit.registrationRequestMandatedContacts = this.registrationRequestMandatedContacts;

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.initialData = Object.assign({}, data.body);
                this.initialData.medicaments = Object.assign([], data.body.medicaments);
                this.loadingService.hide();
            }, error => this.loadingService.hide())
        );
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

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.activeSubstancesTable.push({
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufactures: result.manufactures,
                    compositionNumber: result.compositionNumber,
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
                this.auxiliarySubstancesTable.push({
                    auxSubstance: result.auxSubstance
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
        dialogConfig2.data = substance;

        const dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.activeSubstancesTable[index] = {
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufactures: result.manufactures,
                    compositionNumber: result.compositionNumber
                };
                this.fillDose();
            }
        });
    }

    fillDose() {
        this.activeSubstancesTable.sort((a, b) => {
            return (a.compositionNumber - b.compositionNumber == 0) ? a.activeSubstance.id - b.activeSubstance.id : a.compositionNumber - b.compositionNumber
        });
        var i = 1;
        var orderNr = '';
        var tempDose = '';
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
        this.eForm.get('medicament.dose').setValue(tempDose);
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    fillMedicamentDetails(modelToSubmit: any): void {
        for (let subst of this.activeSubstancesTable) {
            subst.id = null;
            for (let man of subst.manufactures) {
                man.id = null;
            }
        }

        for (let subst of this.auxiliarySubstancesTable) {
            subst.id = null;
        }

        if (this.initialData.expertList) {
            modelToSubmit.expertList = this.initialData.expertList;
        }

        if(this.eForm.get('type').value && this.eForm.get('type').value.code == 'MEDR') {
            modelToSubmit.medicamentName = this.eForm.getRawValue().medicament.commercialName;
        }
        else
        {
            modelToSubmit.medicamentName = this.eForm.get('medicament.commercialName').value;
        }

        modelToSubmit.medicaments = [];
        for (let division of this.divisions) {
            let medicamentToSubmit: any;

            if(this.eForm.get('type').value && this.eForm.get('type').value.code == 'MEDR') {
                medicamentToSubmit = Object.assign({}, this.eForm.getRawValue().medicament);
                medicamentToSubmit.registrationDate = this.eForm.get('medicament.registrationDate').value;
                medicamentToSubmit.registrationNumber = this.eForm.get('medicament.registrationNumber').value;
            }
            else
            {
                medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            }
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            medicamentToSubmit.auxSubstances = this.auxiliarySubstancesTable;
            medicamentToSubmit.division = division.description;
            medicamentToSubmit.volume = division.volume;
            medicamentToSubmit.volumeQuantityMeasurement = division.volumeQuantityMeasurement;
            medicamentToSubmit.instructions = [];
            if (division.instructions) {
                for (let i of division.instructions) {
                    i.id = null;
                    i.type = 'I';
                    medicamentToSubmit.instructions.push(i);
                }
            }
            if (division.machets) {
                for (let m of division.machets) {
                    m.id = null;
                    m.type = 'M';
                    medicamentToSubmit.instructions.push(m);
                }
            }

            if(this.eForm.get('type').value && this.eForm.get('type').value.code == 'MEDR') {
                if (this.eForm.getRawValue().medicament.atcCode) {
                    if (this.eForm.getRawValue().medicament.atcCode.code) {
                        medicamentToSubmit.atcCode = this.eForm.getRawValue().medicament.atcCode.code;
                    } else {
                        medicamentToSubmit.atcCode = this.eForm.getRawValue().medicament.atcCode;
                    }
                }
            }
            else
            {
                if (this.eForm.get('medicament.atcCode').value) {
                    if (this.eForm.get('medicament.atcCode').value.code) {
                        medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
                    } else {
                        medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value;
                    }
                }
            }

            if(this.eForm.get('type').value && this.eForm.get('type').value.code == 'MEDR') {
                this.fillRawGroups(medicamentToSubmit);
            }
            else
            {
                this.fillGroups(medicamentToSubmit);
            }

            if(this.eForm.get('type').value && this.eForm.get('type').value.code == 'MEDR') {
                medicamentToSubmit.prescription = this.eForm.getRawValue().medicament.prescription.value;
            }
            else {
                if (this.eForm.get('medicament.prescription').value) {
                    medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
                }
            }

            if (this.eForm.get('type').value && this.eForm.get('type').value.code == 'MEDR') {
                medicamentToSubmit.code = division.code;
            }

            medicamentToSubmit.manufactures = [];
            for (let x of this.manufacturesTable) {
                x.id = null;
                medicamentToSubmit.manufactures.push(x);
            }

            medicamentToSubmit.medicamentTypes = [];
            if(this.eForm.get('type').value && this.eForm.get('type').value.code == 'MEDR') {
                if (this.eForm.getRawValue().medicament.medTypesValues) {
                    for (let w of this.eForm.getRawValue().medicament.medTypesValues) {
                        medicamentToSubmit.medicamentTypes.push({type: w});
                    }
                }
            }
            else
            {
                if (this.eForm.get('medicament.medTypesValues').value) {
                    for (let w of this.eForm.get('medicament.medTypesValues').value) {
                        medicamentToSubmit.medicamentTypes.push({type: w});
                    }
                }
            }

            modelToSubmit.medicaments.push(medicamentToSubmit);
        }

        if (this.divisions.length == 0) {
            let medicamentToSubmit: any;
            medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            medicamentToSubmit.auxSubstances = this.auxiliarySubstancesTable;
            if (this.eForm.get('medicament.atcCode').value) {
                medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
            }
            this.fillGroups(medicamentToSubmit);
            if (this.eForm.get('medicament.prescription').value) {
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
            }
            medicamentToSubmit.manufactures = this.manufacturesTable;
            medicamentToSubmit.medicamentTypes = [];
            if (this.eForm.get('medicament.medTypesValues').value) {
                for (let w of this.eForm.get('medicament.medTypesValues').value) {
                    medicamentToSubmit.medicamentTypes.push({type: w});
                }
            }
            modelToSubmit.medicaments.push(medicamentToSubmit);
        }
    }

    fillGroups(medicamentToSubmit: any) {
        if (this.eForm.get('medicament.group').value) {
            if (this.eForm.get('medicament.group').value.value == 'VIT') {
                medicamentToSubmit.vitale = 1;
                medicamentToSubmit.esentiale = 0;
                medicamentToSubmit.nonesentiale = 0;
            } else if (this.eForm.get('medicament.group').value.value == 'ES') {
                medicamentToSubmit.vitale = 0;
                medicamentToSubmit.esentiale = 1;
                medicamentToSubmit.nonesentiale = 0;
            } else if (this.eForm.get('medicament.group').value.value == 'NES') {
                medicamentToSubmit.vitale = 0;
                medicamentToSubmit.esentiale = 0;
                medicamentToSubmit.nonesentiale = 1;
            }
        }
    }

    fillRawGroups(medicamentToSubmit: any) {
        if (this.eForm.getRawValue().medicament.group) {
            if (this.eForm.getRawValue().medicament.group.value == 'VIT') {
                medicamentToSubmit.vitale = 1;
                medicamentToSubmit.esentiale = 0;
                medicamentToSubmit.nonesentiale = 0;
            } else if (this.eForm.getRawValue().medicament.group.value == 'ES') {
                medicamentToSubmit.vitale = 0;
                medicamentToSubmit.esentiale = 1;
                medicamentToSubmit.nonesentiale = 0;
            } else if (this.eForm.getRawValue().medicament.group.value == 'NES') {
                medicamentToSubmit.vitale = 0;
                medicamentToSubmit.esentiale = 0;
                medicamentToSubmit.nonesentiale = 1;
            }
        }
    }

    manufacturesStr(substance: any) {
        if (substance && substance.manufactures) {
            let s = Array.prototype.map.call(substance.manufactures, s => s.manufacture.description + ' ' + (s.manufacture.country ? s.manufacture.country.description : '') + ' ' + s.manufacture.address + 'NRQW').toString();
            s = s.replace(/NRQW/gi, ';');
            return s.replace(';,', '; ');
        }
        return '';
    }

    checkClasificareMedicament(value: any) {
        this.eForm.get('medicament.originale').setValue(value.checked);
    }

    checkOrphanMedicament(value: any) {
        this.eForm.get('medicament.orphan').setValue(value.checked);
    }

    removeInstr(event) {
        for (let div of this.divisions) {
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
        for (let div of this.divisions) {
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
}

