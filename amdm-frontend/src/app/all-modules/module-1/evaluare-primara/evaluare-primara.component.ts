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
    paymentOrdersList: PaymentOrder[] = [];
    receiptsList: Receipt[] = [];
    outDocuments: any[] = [];
    initialData: any;
    isResponseReceived: boolean = false;
    // filteredFormTypes: Observable<any[]>;
    // filteredForms: Observable<any[]>;
    // filteredActiveSubstances: Observable<any[]>;


    constructor(public dialog: MatDialog,
                private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private documentService: DocumentService,
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
                        this.initialData = data;
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
                        if(data.medicament.prescription) {
                            this.eForm.get('medicament.prescription').setValue(data.medicament.prescription.toString());
                        }
                        this.activeSubstancesTable = data.medicament.activeSubstances;
                        this.company = data.medicament.company;
                        this.documents = data.medicament.documents;
                        this.outDocuments = data.medicament.outputDocuments;
                        this.receiptsList = data.medicament.receipts;
                        this.paymentOrdersList = data.medicament.paymentOrders;
                        for (let entry of this.outDocuments) {
                            var isMatch = this.documents.some(elem => {
                                return elem.docType.category == entry.docType ? true : false;
                            });
                            if (isMatch) {
                                entry.status = 'Atasat';
                            } else {
                                entry.status = 'Nu este atasat';
                            }
                        }
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
                    if (this.initialData.medicament.unitsOfMeasurement) {
                        this.eForm.get('medicament.unitsOfMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === this.initialData.medicament.unitsOfMeasurement.id));
                    }
                    if (this.initialData.medicament.unitsQuantityMeasurement) {
                        this.eForm.get('medicament.unitsQuantityMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === this.initialData.medicament.unitsQuantityMeasurement.id));
                    }
                    if (this.initialData.medicament.storageQuantityMeasurement) {
                        this.eForm.get('medicament.storageQuantityMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === this.initialData.medicament.storageQuantityMeasurement.id));
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
            this.administrationService.getAllDocTypes().subscribe(data => {
                    this.docTypes = data;
                    this.docTypes = this.docTypes.filter(r => r.category === 'DD');
                },
                error => console.log(error)
            )
        );
    }

    // ngAfterViewInit(): void {
    //     this.modalService.data.asObservable().subscribe(value => {
    //         if (value != '' && (value.action == 'CLOSE_MODAL' || value.action == 'CLOSE_WAITING_MODAL')) {
    //             this.eForm.get('data').setValue(new Date());
    //             this.subscriptions.push(this.requestService.getMedicamentRequest(this.eForm.get('id').value).subscribe(data => {
    //                 this.documents = data.medicament.documents;
    //                 this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    //                 let xs = this.documents;
    //                 xs = xs.map(x => {
    //                     x.isOld = true;
    //                     return x;
    //                 });
    //                 if (data.currentStep == 'S') {
    //                     this.modalService.data.next({
    //                         modalType: 'WAITING',
    //                         requestId: this.eForm.get('id').value,
    //                         requestNumber: this.eForm.get('requestNumber').value
    //                     });
    //                 }
    //                 if (data.currentStep == 'L') {
    //                     this.modalService.data.next({
    //                         modalType: 'WAITING_ANALYSIS',
    //                         requestId: this.eForm.get('id').value,
    //                         requestNumber: this.eForm.get('requestNumber').value
    //                     });
    //                 }
    //             }));
    //         }
    //     })
    // }

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

        if (this.eForm.invalid || this.activeSubstancesTable.length == 0 || this.paymentTotal < 0) {
            return;
        }

        for (let entry of this.outDocuments) {
            if (!entry.responseReceived) {
                this.isResponseReceived = false;
                return;
            }
        }
        this.isResponseReceived = true;
        this.formSubmitted = false;

        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.medicament.activeSubstances = [];
        for (let as of this.activeSubstancesTable) {
            modelToSubmit.medicament.activeSubstances.push({
                activeSubstance: as.activeSubstance,
                quantity: as.quantity,
                unitsOfMeasurement: as.unitsOfMeasurement
            });
        }

        modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
        modelToSubmit.medicament.receipts = this.receiptsList;

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.router.navigate(['dashboard/module/medicament-registration/expert/' + data.body]);
            }, error => console.log(error))
        );
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
                this.initialData.medicament.outputDocuments.push(result);
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
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
                this.initialData.medicament.outputDocuments.push(result);
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
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
                var modelToSubmit = {requestHistories: [], currentStep: 'I', id: this.eForm.get('id').value};
                modelToSubmit.requestHistories.push({
                    startDate: this.eForm.get('data').value, endDate: new Date(),
                    username: this.authService.getUserName(), step: 'E'
                });

                this.subscriptions.push(this.requestService.addMedicamentHistory(modelToSubmit).subscribe(data => {
                        this.router.navigate(['dashboard/module/medicament-registration/interrupt/' + this.eForm.get('id').value]);
                    }, error => console.log(error))
                );
            }
        });
    }

    viewDoc(document: any) {
        if (document.docType.category == 'RA' || document.docType.category == 'LA') {
            this.subscriptions.push(this.documentService.viewRequest(document.number,
                document.content,
                document.title,
                document.docType.category).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, error => {
                    console.log('error ', error);
                }
                )
            );
        } else {
            this.subscriptions.push(this.documentService.viewDD(document.number).subscribe(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }, error => {
                    console.log('error ', error);
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

                this.initialData.medicament.outputDocuments.forEach((item, index) => {
                    if (item === doc) this.initialData.medicament.outputDocuments.splice(index, 1);
                });

                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
                    }, error => console.log(error))
                );
            }
        });
    }

    checkResponseReceived(doc: any, value: any) {
        doc.responseReceived = value.checked;
    }

    save() {
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.medicament.outputDocuments = this.initialData.medicament.outputDocuments;
        modelToSubmit.currentStep = 'E';

        modelToSubmit.medicament.activeSubstances = this.activeSubstancesTable;
        modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
        modelToSubmit.medicament.receipts = this.receiptsList;

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.router.navigate(['dashboard/module']);
            }, error => console.log(error))
        );
    }

}