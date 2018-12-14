import {Component, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {DocumentService} from "../../../shared/service/document.service";
import {RequestAdditionalDataDialogComponent} from "../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {ActiveSubstanceDialogComponent} from "../../../dialog/active-substance-dialog/active-substance-dialog.component";
import {NavbarTitleService} from "../../../shared/service/navbar-title.service";
import {MedicamentDetailsDialogComponent} from "../../../dialog/medicament-details-dialog/medicament-details-dialog.component";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {AuxiliarySubstanceDialogComponent} from "../../../dialog/auxiliary-substance-dialog/auxiliary-substance-dialog.component";
import {UploadFileService} from "../../../shared/service/upload/upload-file.service";

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara-modify.component.html',
    styleUrls: ['./evaluare-primara-modify.component.css']
})
export class EvaluarePrimaraModifyComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document [] = [];
    formSubmitted: boolean;
    auxiliarySubstancesTable: any[] = [];
    isAddDivision: boolean;
    isAddManufacture: boolean;
    paymentTotal: number;
    customsCodes: any[] = [];
    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstancesTable: any[] = [];
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    unitsOfMeasurement: any[];
    volumeUnitsOfMeasurement: any[];
    unitsQuantityMeasurement: any[];
    storageUnitsOfMeasurement: any[];
    activeSubstanceUnitsOfMeasurement: any[];
    groups: any[];
    prescriptions: any[] = [];
    internationalNames: any[];
    medicamentTypes: any[];
    manufactures: any[];
    manufactureAuthorizations: any[];
    docTypes: any[];
    docTypesInitial: any[];
    outDocuments: any[] = [];
    isResponseReceived: boolean = true;
    isNonAttachedDocuments: boolean = false;
    initialData: any;
    wasFoundDivision: boolean;
    wasFoundManufacture: boolean;
    medicamentsDetails: any[];
    instructions: any[] = [];
    machets: any[] = [];

    protected atcCodes: Observable<any[]>;
    protected loadingAtcCodes: boolean = false;
    protected atcCodesInputs = new Subject<string>();

    constructor(public dialog: MatDialog,
                private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private uploadService: UploadFileService,
                private documentService: DocumentService,
                private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService,
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
            'medicaments': [[]],
            'medicamentPostauthorizationRegisterNr': [''],
            'division': [null],
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
                    'unitsOfMeasurementTo': [null],
                    'internationalMedicamentNameTo': [null, Validators.required],
                    'volumeTo': [null],
                    'customsCodeTo': [null, Validators.required],
                    'volumeQuantityMeasurementTo': [null],
                    'termsOfValidityTo': [null, Validators.required],
                    'medicamentTypeTo': [null, Validators.required],
                    'prescriptionTo': [null, Validators.required],
                    'authorizationHolderTo': [null, Validators.required],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'status': ['P'],
                    'groupTo': [null, Validators.required]
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'manufacture': [null],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': [],
        });
        this.eForm.get('division').valueChanges.subscribe(
            r => {
                this.isAddDivision = false;
                this.wasFoundDivision = false;
            }
        );
        this.eForm.get('manufacture').valueChanges.subscribe(
            r => {
                this.isAddManufacture = false;
                this.wasFoundManufacture = false;
            }
        );
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Aprobarea modificarilor postautorizate / Evaluare primara');

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentHistory(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.initialData.medicamentHistory = Object.assign([], data.medicamentHistory);
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('initiator').setValue(data.initiator);
                        this.eForm.get('startDate').setValue(data.startDate);
                        this.eForm.get('requestNumber').setValue(data.requestNumber);
                        this.eForm.get('type').setValue(data.type);
                        this.eForm.get('requestHistories').setValue(data.requestHistories);
                        this.eForm.get('typeValue').setValue(data.type.description);
                        this.eForm.get('company').setValue(data.company);
                        this.eForm.get('companyValue').setValue(data.company.name);
                        this.eForm.get('medicament.id').setValue(data.medicamentHistory[0].id);
                        this.eForm.get('medicament.commercialNameTo').setValue(data.medicamentHistory[0].commercialNameTo);
                        this.eForm.get('medicamentName').setValue(data.medicamentHistory[0].commercialNameTo);
                        this.eForm.get('medicament.registrationNumber').setValue(data.medicamentHistory[0].registrationNumber);
                        this.eForm.get('medicamentPostauthorizationRegisterNr').setValue(data.medicamentHistory[0].registrationNumber);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        if (data.medicamentHistory && data.medicamentHistory.length != 0) {
                            this.initialData.medicamentHistory.activeSubstancesHistory = Object.assign([], data.medicamentHistory[0].activeSubstancesHistory);
                            this.initialData.medicamentHistory.auxiliarySubstancesHistory = Object.assign([], data.medicamentHistory[0].auxiliarySubstancesHistory);
                            for (let entry of data.medicamentHistory[0].divisionHistory) {
                                this.divisions.push({
                                    description: entry.description,
                                    old: entry.old
                                });
                            }
                            this.eForm.get('medicament.atcCodeTo').setValue(data.medicamentHistory[0].atcCodeTo);

                            this.eForm.get('medicament.doseTo').setValue(data.medicamentHistory[0].doseTo);
                            this.eForm.get('medicament.termsOfValidityTo').setValue(data.medicamentHistory[0].termsOfValidityTo);
                            this.eForm.get('medicament.volumeTo').setValue(data.medicamentHistory[0].volumeTo);
                            this.activeSubstancesTable = data.medicamentHistory[0].activeSubstancesHistory;
                            this.auxiliarySubstancesTable = data.medicamentHistory[0].auxiliarySubstancesHistory;
                            this.manufacturesTable = data.medicamentHistory[0].manufacturesHistory;
                            this.fillInstructions(data.medicamentHistory[0]);
                            this.fillMachets(data.medicamentHistory[0]);
                        }
                        this.checkOutputDocumentsStatus();
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        this.loadAllQuickSearches(data);

                        this.subscriptions.push(
                            this.medicamentService.getMedicamentsByFilter({registerNumber: data.medicamentHistory[0].registrationNumber}
                            ).subscribe(request => {
                                    this.medicamentsDetails = request.body;
                                },
                                error => console.log(error)
                            ));
                    })
                );
            })
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

    loadAllQuickSearches(dataDB: any) {

        this.loadATCCodes();

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].pharmaceuticalFormTo) {
                        this.eForm.get('medicament.pharmaceuticalFormType').setValue(this.pharmaceuticalFormTypes.find(r => r.id === dataDB.medicamentHistory[0].pharmaceuticalFormTo.type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                    this.volumeUnitsOfMeasurement = data;
                    this.activeSubstanceUnitsOfMeasurement = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].volumeQuantityMeasurementTo) {
                        this.eForm.get('medicament.volumeQuantityMeasurementTo').setValue(this.volumeUnitsOfMeasurement.find(r => r.id === dataDB.medicamentHistory[0].volumeQuantityMeasurementTo.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentForms().subscribe(data => {
                    this.storageUnitsOfMeasurement = data;
                    this.unitsQuantityMeasurement = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllInternationalNames().subscribe(data => {
                    this.internationalNames = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].internationalMedicamentNameTo) {
                        this.eForm.get('medicament.internationalMedicamentNameTo').setValue(this.internationalNames.find(r => r.id === dataDB.medicamentHistory[0].internationalMedicamentNameTo.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    this.medicamentTypes = data;
                    this.medicamentTypes = this.medicamentTypes.filter(r => r.category === 'M');
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].medicamentTypeTo) {
                        this.eForm.get('medicament.medicamentTypeTo').setValue(this.medicamentTypes.find(r => r.id === dataDB.medicamentHistory[0].medicamentTypeTo.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactures = data;
                    this.manufactureAuthorizations = this.manufactures.filter(r => r.authorizationHolder == 1);
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].authorizationHolderTo) {
                        this.eForm.get('medicament.authorizationHolderTo').setValue(this.manufactureAuthorizations.find(r => r.id === dataDB.medicamentHistory[0].authorizationHolderTo.id));
                    }
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].manufacture) {
                        this.eForm.get('medicament.manufacture').setValue(this.manufactures.find(r => r.id === dataDB.medicamentHistory[0].manufacture.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.taskService.getRequestStepByIdAndCode('21', 'E').subscribe(step => {
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
        this.subscriptions.push(
            this.administrationService.getAllMedicamentGroups().subscribe(data => {
                    this.groups = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].groupTo) {
                        this.eForm.get('medicament.groupTo').setValue(this.groups.find(r => r.id === dataDB.medicamentHistory[0].groupTo.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllCustomsCodes().subscribe(data => {
                    this.customsCodes = data;
                    if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].customsCodeTo) {
                        this.eForm.get('medicament.customsCodeTo').setValue(this.customsCodes.find(r => r.id === dataDB.medicamentHistory[0].customsCodeTo.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.prescriptions = [...this.prescriptions, {value: 1, description: 'Cu prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 0, description: 'Fără prescripţie'}];
        if (dataDB.medicamentHistory && dataDB.medicamentHistory.length != 0 && dataDB.medicamentHistory[0].prescriptionTo != undefined && dataDB.medicamentHistory[0].prescriptionTo != null) {
            if (dataDB.medicamentHistory[0].prescriptionTo == 1) {
                this.eForm.get('medicament.prescriptionTo').setValue({value: 1, description: "Cu prescripţie"});
            } else {
                this.eForm.get('medicament.prescriptionTo').setValue({value: 0, description: "Fără prescripţie"});
            }
        }

        // if(dataDB.medicamentHistory && dataDB.medicamentHistory.length!=0 && dataDB.medicamentHistory[0].atcCode!=undefined && dataDB.medicamentHistory[0].atcCode!=null)
        // {
        //     let code = dataDB.medicamentHistory[0].atcCode;
        // }
    }

    checkPharmaceuticalFormTypeValue() {

        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalFormTo').setValue(null);
                    this.pharmaceuticalForms = data;
                    if (this.initialData.medicamentHistory && this.initialData.medicamentHistory.length != 0 && this.initialData.medicamentHistory[0] && this.initialData.medicamentHistory[0].pharmaceuticalFormTo) {
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
        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;
        if (this.eForm.invalid || this.divisions.length == 0 || this.manufacturesTable.length == 0 || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }

        if (isOutputDocInvalid || isFormInvalid) {
            return;
        }

        let test = this.manufacturesTable.find(r => r.producatorProdusFinitTo == true);
        if (!test) {
            this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
            return;
        }

        this.isResponseReceived = true;
        this.formSubmitted = false;

        this.loadingService.show();
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.currentStep = 'X';

        this.fillMedicamentDetails(modelToSubmit);

        modelToSubmit.outputDocuments.push({
            name: 'Ordinul de aprobare a modificărilor postautorizare',
            docType: this.docTypesInitial.find(r => r.category == 'OM'),
            number: 'OM-' + this.eForm.get('requestNumber').value,
            date: new Date()
        });
        modelToSubmit.outputDocuments.push({
            name: 'Modificarea la Certificatul de autorizare a medicamentului',
            docType: this.docTypesInitial.find(r => r.category == 'MP'),
            number: 'MP-' + this.eForm.get('requestNumber').value,
            date: new Date()
        });

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
        this.isAddDivision = true;

        if (!this.eForm.get('division').value || this.eForm.get('division').value.toString().length == 0) {
            return;
        }

        this.wasFoundDivision = false;
        let test = this.divisions.find(r => r.description == this.eForm.get('division').value);
        if (test) {
            this.wasFoundDivision = true;
            return;
        }


        this.isAddDivision = false;

        this.divisions.push({
            description: this.eForm.get('division').value,
            old: 0
        });

        this.eForm.get('division').setValue(null);
    }

    addManufacture() {
        this.isAddManufacture = true;

        if (!this.eForm.get('manufacture').value || this.eForm.get('manufacture').value.toString().length == 0) {
            return;
        }

        this.wasFoundManufacture = false;
        let test = this.manufacturesTable.find(r => r.id == this.eForm.get('manufacture').value.id);
        if (test) {
            this.wasFoundManufacture = true;
            return;
        }

        this.isAddManufacture = false;

        this.manufacturesTable.push({manufacture: this.eForm.get('manufacture').value, producatorProdusFinit: false});

        this.eForm.get('manufacture').setValue(null);
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

    removeDivision(index: number,division : any) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { message: 'Sunteti sigur ca doriti sa stergeti aceasta divizare? Instructiunile si machetele atasate acestei diviziuni vor fi sterese.', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeDivisionFromInstructions(division);
                this.removeDivisionFromMachets(division);
                this.divisions.splice(index, 1);
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
                this.eForm.get('medicament.doseTo').setValue(null);
                for (let as of this.activeSubstancesTable) {
                    if (this.eForm.get('medicament.doseTo').value == null || this.eForm.get('medicament.doseTo').value.length == 0) {
                        this.eForm.get('medicament.doseTo').setValue(as.quantityTo + ' ' + as.unitsOfMeasurementTo.description);
                    } else {
                        this.eForm.get('medicament.doseTo').setValue(this.eForm.get('medicament.doseTo').value + ' + ' + as.quantityTo + ' ' + as.unitsOfMeasurementTo.description);
                    }
                }
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

        var lenOutDoc = this.outDocuments.filter(r => r.docType.category === 'LA').length;

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'LABORATORY_ANALYSIS',
                startDate: this.eForm.get('data').value,
                nrOrdDoc: lenOutDoc + 1
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.initialData.outputDocuments = this.outDocuments;
                this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                    }, error => console.log(error))
                );
            }
        });
    }

    requestAdditionalData() {

        var lenOutDoc = this.outDocuments.filter(r => r.docType.category === 'SL').length;

        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.eForm.get('data').value,
                nrOrdDoc: lenOutDoc + 1
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.initialData.outputDocuments = this.outDocuments;
                this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                    }, error => console.log(error))
                );
            }
        });
    }

    interruptProcess() {
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
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
                modelToSubmit.medicamentHistory.push(medicamentToSubmit);

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
            this.subscriptions.push(this.documentService.viewRequest(document.number,
                document.content,
                document.title,
                document.docType.category).subscribe(data => {
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

                this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
    }

    checkProducatorProdusFinit(manufacture: any, value: any) {
        for (let m of this.manufacturesTable) {
            m.producatorProdusFinitTo = false;
        }
        manufacture.producatorProdusFinitTo = value.checked;
    }

    save() {

        this.loadingService.show();
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.currentStep = 'E';

        this.fillMedicamentDetails(modelToSubmit);

        this.subscriptions.push(this.requestService.addMedicamentHistoryRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module']);
            }, error => this.loadingService.hide())
        );
    }

    fillMedicamentDetails(modelToSubmit : any)
    {
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.assignedUser = this.authService.getUserName();

        let medicamentToSubmit: any;
        medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
        medicamentToSubmit.activeSubstancesHistory = this.activeSubstancesTable;
        medicamentToSubmit.auxiliarySubstancesHistory = this.auxiliarySubstancesTable;
        medicamentToSubmit.divisionHistory = this.divisions;
        medicamentToSubmit.manufacturesHistory = this.manufacturesTable;
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
        modelToSubmit.medicamentHistory.push(medicamentToSubmit);

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });


        medicamentToSubmit.instructionsHistory = [];
        for (let x of this.instructions) {
            x.id = null;
            x.type = 'I';
            for(let y of x.divisions)
            {
                let z = Object.assign({}, x);
                z.division = y.description;
                // let div = this.divisions.find(t=> t.description==z.division);
                // if(div && div.old==0)
                // {
                //     z.status='N';
                // }
                medicamentToSubmit.instructionsHistory.push(z);
            }
        }

        for (let x of this.machets) {
            x.id = null;
            x.type = 'M';
            for(let y of x.divisions)
            {
                let z = Object.assign({}, x);
                z.division = y.description;
                // let div = this.divisions.find(t=> t.description==z.division);
                // if(div && div.old==0)
                // {
                //     z.status='N';
                // }
                medicamentToSubmit.instructionsHistory.push(z);
            }
        }

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

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result.response) {
                this.activeSubstancesTable.push({
                    activeSubstance: result.activeSubstance,
                    quantityTo: result.activeSubstanceQuantity,
                    unitsOfMeasurementTo: result.activeSubstanceUnit,
                    manufactureTo: result.manufactureSA,
                    status: result.status
                });

                if (this.eForm.get('medicament.doseTo').value == null || this.eForm.get('medicament.doseTo').value.length == 0) {
                    this.eForm.get('medicament.doseTo').setValue(result.activeSubstanceQuantity + ' ' + result.activeSubstanceUnit.description);
                } else {
                    this.eForm.get('medicament.doseTo').setValue(this.eForm.get('medicament.doseTo').value + ' + ' + result.activeSubstanceQuantity + ' ' + result.activeSubstanceUnit.description);
                }
            }
        });
    }

    editSubstance(substance: any, index: number) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '650px';
        dialogConfig2.width = '600px';
        dialogConfig2.data = {
            activeSubstance: substance.activeSubstance,
            quantity: substance.quantityTo,
            unitsOfMeasurement: substance.unitsOfMeasurementTo,
            manufacture: substance.manufactureTo,
            status: substance.status
        };
        dialogConfig2.data.disableSubstance = (substance.status && substance.status == 'O');

        let dialogRef = this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.activeSubstancesTable[index] = {
                    activeSubstance: result.activeSubstance,
                    quantityTo: result.activeSubstanceQuantity,
                    unitsOfMeasurementTo: result.activeSubstanceUnit,
                    manufactureTo: result.manufactureSA,
                    status: result.status,
                };

                this.eForm.get('medicament.doseTo').setValue(null);
                for (let as of this.activeSubstancesTable) {
                    if (this.eForm.get('medicament.doseTo').value == null || this.eForm.get('medicament.doseTo').value.length == 0) {
                        this.eForm.get('medicament.doseTo').setValue(as.quantityTo + ' ' + as.unitsOfMeasurementTo.description);
                    } else {
                        this.eForm.get('medicament.doseTo').setValue(this.eForm.get('medicament.doseTo').value + ' + ' + as.quantityTo + ' ' + as.unitsOfMeasurementTo.description);
                    }
                }
            }
        });
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

        dialogConfig2.data = {
            value: this.medicamentsDetails[0].code
        };

        this.dialog.open(MedicamentDetailsDialogComponent, dialogConfig2);
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

        dialogConfig2.width = '600px';

        let dialogRef = this.dialog.open(AuxiliarySubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.response) {
                this.auxiliarySubstancesTable.push({
                    auxSubstance: result.auxSubstance
                });
            }
        });
    }

    fillInstructions(medicamentHist: any) {
        for (let medInstruction of medicamentHist.instructionsHistory) {
            if (medInstruction.type == 'I') {
                let pageInstrction = this.instructions.find(value => value.path == medInstruction.path);
                if (pageInstrction) {
                    pageInstrction.divisions.push({description: medInstruction.division});
                } else {
                    medInstruction.divisions = [];
                    medInstruction.divisions.push({description: medInstruction.division});
                    this.instructions.push(medInstruction);
                }
            }
        }
    }

    fillMachets(medicamentHist: any) {
        for (let medInstruction of medicamentHist.instructionsHistory) {
            if (medInstruction.type == 'M') {
                let pageInstrction = this.machets.find(value => value.path == medInstruction.path);
                if (pageInstrction) {
                    pageInstrction.divisions.push({description: medInstruction.division});
                } else {
                    medInstruction.divisions = [];
                    medInstruction.divisions.push({description: medInstruction.division});
                    this.machets.push(medInstruction);
                }
            }
        }
    }

    removeDivisionFromInstructions(division: any) {
        for (let instruction of this.instructions) {
            instruction.divisions.forEach((item, index) => {
                if (item.description == division.description) {
                    instruction.divisions.splice(index, 1);
                }
            });
            if (instruction.divisions.length == 0) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(instruction.path).subscribe(data => {
                        this.instructions.forEach((item, index) => {
                            if (item.path === instruction.path) this.instructions.splice(index, 1);
                        });
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        }
    }

    removeDivisionFromMachets(division: any) {
        for (let macheta of this.machets) {
            macheta.divisions.forEach((item, index) => {
                if (item.description == division.description) {
                    macheta.divisions.splice(index, 1);
                }
            });
            if (macheta.divisions.length == 0) {
                this.subscriptions.push(this.uploadService.removeFileFromStorage(macheta.path).subscribe(data => {
                        this.machets.forEach((item, index) => {
                            if (item.path === macheta.path) this.machets.splice(index, 1);
                        });
                    },
                    error => {
                        console.log(error);
                    }
                    )
                );
            }
        }
    }

}