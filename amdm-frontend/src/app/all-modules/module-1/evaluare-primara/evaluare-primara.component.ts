import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {DocumentService} from "../../../shared/service/document.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {RequestAdditionalDataDialogComponent} from "../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {LoaderService} from "../../../shared/service/loader.service";

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara.component.html',
    styleUrls: ['./evaluare-primara.component.css']
})
export class EvaluarePrimaraComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document [] = [];
    company: any;
    formSubmitted: boolean;
    isAddSubstancePressed: boolean;
    paymentTotal: number;

    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstances: any[];
    activeSubstancesTable: any[] = [];
    unitsOfMeasurement: any[];
    internationalNames: any[];
    medicamentTypes: any[];
    manufactures: any[];
    manufactureAuthorizations: any[];
    docTypes: any[];
    docTypesInitial: any[];
    paymentOrdersList: PaymentOrder[] = [];
    receiptsList: Receipt[] = [];
    outDocuments: any[] = [];
    isResponseReceived: boolean = true;
    isNonAttachedDocuments: boolean = false;
    initialData: any;
    docNrOrder: any;
    docNrAuthCert: any;
    // filteredFormTypes: Observable<any[]>;
    // filteredForms: Observable<any[]>;
    // filteredActiveSubstances: Observable<any[]>;


    constructor(public dialog: MatDialog,
                private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private documentService: DocumentService,
                private taskService: TaskService,
                private errorHandlerService: ErrorHandlerService,
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
            //  'dataToSaveInStartDateRequestHistory': [''],
            'currentStep': ['X'],
            'medicament':
                fb.group({
                    'id': [],
                    'name': ['', Validators.required],
                    'company': ['', Validators.required],
                    'registrationDate': [],
                    'companyValue': [''],
                    'pharmaceuticalForm': [null, Validators.required],
                    'pharmaceuticalFormType': [null, Validators.required],
                    'dose': [null, Validators.required],
                    'unitsOfMeasurement': [null, Validators.required],
                    'internationalMedicamentName': [null, Validators.required],
                    'volume': [null],
                    'termsOfValidity': [null, Validators.required],
                    'code': [null, Validators.required],
                    'medicamentType': [null, Validators.required],
                    'storageQuantityMeasurement': [null, Validators.required],
                    'storageQuantity': [null, Validators.required],
                    'unitsQuantityMeasurement': [null, Validators.required],
                    'unitsQuantity': [null, Validators.required],
                    'prescription': [null, Validators.required],
                    'authorizationHolder': [null, Validators.required],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'manufacture': [null],
                    'manufactureMedCountry': [null],
                    'manufactureMedAddress': [null],
                    'documents': [],
                    'status': ['P'],
                    'group':
                        fb.group({
                                'code': [null, Validators.required]
                            }
                        )
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'activeSubstance': [null],
            'activeSubstanceCode': [''],
            'activeSubstanceQuantity': [null],
            'activeSubstanceUnit': [null],
            'manufactureSA': [null],
            'manufactureCountrySA': [null],
            'manufactureAddressSA': [null],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': [],
        });
    }

    ngOnInit() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.initialData.medicament = Object.assign({}, data.medicament);
                        this.initialData.medicament.activeSubstances = Object.assign([], data.medicament.activeSubstances);
                        this.eForm.get('medicament.id').setValue(data.medicament.id);
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('startDate').setValue(data.startDate);
                        this.eForm.get('requestNumber').setValue(data.requestNumber);
                        this.eForm.get('medicament.company').setValue(data.medicament.company);
                        this.eForm.get('medicament.companyValue').setValue(data.medicament.company.name);
                        this.eForm.get('company').setValue(data.medicament.company);
                        this.eForm.get('medicament.name').setValue(data.medicament.name);
                        this.eForm.get('medicament.documents').setValue(data.medicament.documents);
                        this.eForm.get('medicament.registrationDate').setValue(data.medicament.registrationDate);
                        this.eForm.get('type').setValue(data.type);
                        this.eForm.get('requestHistories').setValue(data.requestHistories);
                        this.eForm.get('typeValue').setValue(data.type.code);
                        this.eForm.get('medicament.dose').setValue(data.medicament.dose);
                        this.eForm.get('medicament.code').setValue(data.medicament.code);
                        this.eForm.get('medicament.termsOfValidity').setValue(data.medicament.termsOfValidity);
                        this.eForm.get('medicament.unitsQuantity').setValue(data.medicament.unitsQuantity);
                        this.eForm.get('medicament.storageQuantity').setValue(data.medicament.storageQuantity);
                        this.eForm.get('medicament.volume').setValue(data.medicament.volume);
                        if (data.medicament.group) {
                            this.eForm.get('medicament.group.code').setValue(data.medicament.group.code);
                        }
                        if (data.medicament.prescription) {
                            this.eForm.get('medicament.prescription').setValue(data.medicament.prescription.toString());
                        }
                        this.activeSubstancesTable = data.medicament.activeSubstances;
                        this.company = data.medicament.company;
                        this.documents = data.medicament.documents;
                        this.outDocuments = data.medicament.outputDocuments;
                        this.receiptsList = data.medicament.receipts;
                        this.paymentOrdersList = data.medicament.paymentOrders;
                        this.checkOutputDocumentsStatus();
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        let xs2 = this.receiptsList;
                        xs2 = xs2.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        let xs3 = this.paymentOrdersList;
                        xs3 = xs3.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        this.loadAllQuickSearches(data);
                    })
                );
            })
        );

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.docNrOrder = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.generateDocNr().subscribe(data => {
                    this.docNrAuthCert = data;
                },
                error => console.log(error)
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
        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                    if (dataDB.medicament.pharmaceuticalForm) {
                        this.eForm.get('medicament.pharmaceuticalFormType').setValue(this.pharmaceuticalFormTypes.find(r => r.id === dataDB.medicament.pharmaceuticalForm.type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllActiveSubstances().subscribe(data => {
                    this.activeSubstances = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                    if (dataDB.medicament.unitsOfMeasurement) {
                        this.eForm.get('medicament.unitsOfMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === dataDB.medicament.unitsOfMeasurement.id));
                    }
                    if (dataDB.medicament.unitsQuantityMeasurement) {
                        this.eForm.get('medicament.unitsQuantityMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === dataDB.medicament.unitsQuantityMeasurement.id));
                    }
                    if (dataDB.medicament.storageQuantityMeasurement) {
                        this.eForm.get('medicament.storageQuantityMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === dataDB.medicament.storageQuantityMeasurement.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllInternationalNames().subscribe(data => {
                    this.internationalNames = data;
                    if (dataDB.medicament.internationalMedicamentName) {
                        this.eForm.get('medicament.internationalMedicamentName').setValue(this.internationalNames.find(r => r.id === dataDB.medicament.internationalMedicamentName.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    this.medicamentTypes = data;
                    this.medicamentTypes = this.medicamentTypes.filter(r => r.category === 'M');
                    if (dataDB.medicament.medicamentType) {
                        this.eForm.get('medicament.medicamentType').setValue(this.medicamentTypes.find(r => r.id === dataDB.medicament.medicamentType.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactures = data;
                    this.manufactureAuthorizations = this.manufactures.filter(r => r.authorizationHolder == 1);
                    if (dataDB.medicament.authorizationHolder) {
                        this.eForm.get('medicament.authorizationHolder').setValue(this.manufactureAuthorizations.find(r => r.id === dataDB.medicament.authorizationHolder.id));
                    }
                    if (dataDB.medicament.manufacture) {
                        this.eForm.get('medicament.manufacture').setValue(this.manufactures.find(r => r.id === dataDB.medicament.manufacture.id));
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
    }

    checkPharmaceuticalFormTypeValue() {

        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalForm').setValue('');
                    this.pharmaceuticalForms = data;
                    if (this.initialData.medicament.pharmaceuticalForm) {
                        this.eForm.get('medicament.pharmaceuticalForm').setValue(this.pharmaceuticalForms.find(r => r.id === this.initialData.medicament.pharmaceuticalForm.id));
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

    checkActiveSubstanceValue() {
        if (this.eForm.get('activeSubstance').value == null) {
            return;
        }

        this.eForm.get('activeSubstanceCode').setValue(this.eForm.get('activeSubstance').value.code);
        this.eForm.get('manufactureSA').setValue(this.eForm.get('activeSubstance').value.manufacture.description);
        this.eForm.get('manufactureCountrySA').setValue(this.eForm.get('activeSubstance').value.manufacture.country.description);
        this.eForm.get('manufactureAddressSA').setValue(this.eForm.get('activeSubstance').value.manufacture.address);
    }

    nextStep() {
        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;
        if (this.eForm.invalid || this.activeSubstancesTable.length == 0 || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        for (let entry of this.outDocuments) {
            if (!entry.responseReceived && entry.docType.category != 'DD') {
                this.isResponseReceived = false;
                isOutputDocInvalid = true;
            }
            if (entry.status == 'Nu este atasat') {
                this.isNonAttachedDocuments = true;
                isOutputDocInvalid = true;
            }
        }

        if (!isOutputDocInvalid) {
            this.isResponseReceived = true;
            this.isNonAttachedDocuments = false;
        }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        } else if (!this.isResponseReceived) {
            this.errorHandlerService.showError('Exista documente fara raspuns primit.');
        } else if (this.isNonAttachedDocuments) {
            this.errorHandlerService.showError('Exista documente care nu au fost atasate.');
        }

        if (isOutputDocInvalid || isFormInvalid) {
            return;
        }

        this.isResponseReceived = true;
        this.formSubmitted = false;

        this.loadingService.show();
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.medicament.activeSubstances = this.activeSubstancesTable;

        modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
        modelToSubmit.medicament.receipts = this.receiptsList;
        modelToSubmit.medicament.documents = this.documents;
        modelToSubmit.medicament.outputDocuments = this.outDocuments;

        modelToSubmit.medicament.outputDocuments.push({
            name: 'Ordinul de autorizare a medicamentului',
            docType: this.docTypesInitial.find(r => r.category == 'OA'),
            number: this.docNrOrder,
            date: new Date()
        });
        modelToSubmit.medicament.outputDocuments.push({
            name: 'Certificatul de autorizare al medicamentului',
            docType: this.docTypesInitial.find(r => r.category == 'CA'),
            number: this.docNrAuthCert,
            date: new Date()
        });

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/medicament-registration/expert/' + data.body.id]);
            }, error1 => this.hideModal(modelToSubmit))
        );
    }

    hideModal(modelToSubmit : any)
    {
        this.loadingService.hide();
        this.outDocuments = modelToSubmit.medicament.outputDocuments;
    }

    addActiveSubstance() {
        this.isAddSubstancePressed = true;

        if (this.eForm.get('activeSubstance').value == null || this.eForm.get('activeSubstance').value.toString().length == 0
            || this.eForm.get('activeSubstanceQuantity').value == null || this.eForm.get('activeSubstanceQuantity').value.toString().length == 0
            || this.eForm.get('activeSubstanceUnit').value == null || this.eForm.get('activeSubstanceUnit').value.toString().length == 0) {
            return;
        }
        this.isAddSubstancePressed = false;

        this.activeSubstancesTable.push({
            activeSubstance: this.eForm.get('activeSubstance').value,
            quantity: this.eForm.get('activeSubstanceQuantity').value,
            unitsOfMeasurement: this.eForm.get('activeSubstanceUnit').value,
            manufacture: this.eForm.get('activeSubstance').value.manufacture
        });

        this.eForm.get('activeSubstance').setValue(null);
        this.eForm.get('activeSubstanceQuantity').setValue(null);
        this.eForm.get('activeSubstanceUnit').setValue(null);
        this.eForm.get('activeSubstanceCode').setValue(null);
        this.eForm.get('manufactureSA').setValue(null);
        this.eForm.get('manufactureCountrySA').setValue(null);
        this.eForm.get('manufactureAddressSA').setValue(null);
    }

    removeSubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.activeSubstancesTable.splice(index, 1);
            }
        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

    documentAdded(event) {
        this.formSubmitted = false;
        this.checkOutputDocumentsStatus();
    }

    requestLaboratoryAnalysis() {
        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'LABORATORY_ANALYSIS',
                startDate: this.eForm.get('data').value
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.initialData.medicament.outputDocuments = this.outDocuments;
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.medicament.outputDocuments;
                        this.checkOutputDocumentsStatus();
                    }, error => console.log(error))
                );
            }
        });
    }

    requestAdditionalData() {
        const dialogRef2 = this.dialogConfirmation.open(RequestAdditionalDataDialogComponent, {
            data: {
                requestNumber: this.eForm.get('requestNumber').value,
                requestId: this.eForm.get('id').value,
                modalType: 'REQUEST_ADDITIONAL_DATA',
                startDate: this.eForm.get('data').value
            },
            hasBackdrop: false
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result.success) {
                this.outDocuments.push(result);
                this.initialData.medicament.outputDocuments = this.outDocuments;
                console.log(this.initialData);
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.medicament.outputDocuments;
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
                var modelToSubmit = {requestHistories: [], currentStep: 'I', id: this.eForm.get('id').value};
                modelToSubmit.requestHistories.push({
                    startDate: this.eForm.get('data').value, endDate: new Date(),
                    username: this.authService.getUserName(), step: 'E'
                });

                this.subscriptions.push(this.requestService.addMedicamentHistory(modelToSubmit).subscribe(data => {
                        this.loadingService.hide();
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.eForm.get('id').value]);
                    }, error => this.loadingService.hide())
                );
            }
        });
    }

    viewDoc(document: any) {
        this.loadingService.show();
        if (document.docType.category == 'RA' || document.docType.category == 'LA') {
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
                this.initialData.medicament.outputDocuments = this.outDocuments;

                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                        this.outDocuments = data.body.medicament.outputDocuments;
                        this.checkOutputDocumentsStatus();
                        this.loadingService.hide();
                    }, error =>   this.loadingService.hide())
                );
            }
        });
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
    }

    save() {
        this.loadingService.show();
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.medicament.documents = this.documents;
        modelToSubmit.medicament.outputDocuments = this.outDocuments;
        modelToSubmit.currentStep = 'E';

        modelToSubmit.medicament.activeSubstances = this.activeSubstancesTable;
        modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
        modelToSubmit.medicament.receipts = this.receiptsList;

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module']);
            }, error =>   this.loadingService.hide())
        );
    }

}