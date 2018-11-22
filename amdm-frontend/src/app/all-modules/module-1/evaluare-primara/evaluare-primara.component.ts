import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {AdministrationService} from "../../../shared/service/administration.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {DocumentService} from "../../../shared/service/document.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {RequestAdditionalDataDialogComponent} from "../../../dialog/request-additional-data-dialog/request-additional-data-dialog.component";
import {TaskService} from "../../../shared/service/task.service";
import {ErrorHandlerService} from "../../../shared/service/error-handler.service";
import {LoaderService} from "../../../shared/service/loader.service";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {ActiveSubstanceDialogComponent} from "../../../dialog/active-substance-dialog/active-substance-dialog.component";

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara.component.html',
    styleUrls: ['./evaluare-primara.component.css']
})
export class EvaluarePrimaraComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document [] = [];
    formSubmitted: boolean;
    isAddDivision: boolean;
    isAddManufacture: boolean;
    paymentTotal: number;

    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstancesTable: any[] = [];
    divisions: any[] = [];
    manufacturesTable: any[] = [];
    unitsOfMeasurement: any[];
    volumeUnitsOfMeasurement: any[];
    unitsQuantityMeasurement: any[];
    storageUnitsOfMeasurement: any[];
    groups : any[];
    prescriptions :  any[] = [];
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
    wasFoundDivision : boolean;
    wasFoundManufacture: boolean;

    protected atcCodes: Observable<any[]>;
    protected loadingAtcCodes: boolean = false;
    protected atcCodesInputs = new Subject<string>();

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
            'currentStep': ['X'],
            'documents': [],
            'companyValue': [],
            'initiator': [''],
            'assignedUser': [''],
            'medicamentName' : [],
            'medicaments': [[]],
            'division': [null],
            'medicament':
                fb.group({
                    'id': [],
                    'name': ['', Validators.required],
                    'atcCode': [null, Validators.required],
                    'registrationDate': [],
                    'pharmaceuticalForm': [null, Validators.required],
                    'pharmaceuticalFormType': [null, Validators.required],
                    'dose': [null],
                    'unitsOfMeasurement': [null],
                    'internationalMedicamentName': [null, Validators.required],
                    'volume': [null],
                    'volumeQuantityMeasurement': [null],
                    'termsOfValidity': [null, Validators.required],
                    'medicamentType': [null, Validators.required],
                    'storageQuantityMeasurement': [null],
                    'storageQuantity': [null],
                    'unitsQuantityMeasurement': [null],
                    'unitsQuantity': [null],
                    'prescription': [null, Validators.required],
                    'authorizationHolder': [null, Validators.required],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'status': ['P'],
                    'group':[null, Validators.required]
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
            r => {this.isAddDivision=false; this.wasFoundDivision=false;}
        );
        this.eForm.get('manufacture').valueChanges.subscribe(
            r => {this.isAddManufacture=false; this.wasFoundManufacture=false;}
        );
    }

    ngOnInit() {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.initialData = Object.assign({}, data);
                        this.initialData.medicaments = Object.assign([], data.medicaments);
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('initiator').setValue(data.initiator);
                        this.eForm.get('startDate').setValue(data.startDate);
                        this.eForm.get('requestNumber').setValue(data.requestNumber);
                        this.eForm.get('type').setValue(data.type);
                        this.eForm.get('requestHistories').setValue(data.requestHistories);
                        this.eForm.get('typeValue').setValue(data.type.description);
                        this.eForm.get('company').setValue(data.company);
                        this.eForm.get('companyValue').setValue(data.company.name);
                        this.eForm.get('medicament.name').setValue(data.medicamentName);
                        this.eForm.get('medicamentName').setValue(data.medicamentName);
                        this.documents = data.documents;
                        this.outDocuments = data.outputDocuments;
                        if (data.medicaments && data.medicaments.length!=0) {
                            this.initialData.medicaments.activeSubstances = Object.assign([], data.medicaments[0].activeSubstances);

                            for (let entry of data.medicaments) {
                                if(entry.division && entry.division.length!=0) {
                                    this.divisions.push({
                                        description: entry.division
                                    });
                                }
                            }
                            this.eForm.get('medicament.atcCode').setValue(data.medicaments[0].atcCode);
                            this.eForm.get('medicament.dose').setValue(data.medicaments[0].dose);
                            this.eForm.get('medicament.termsOfValidity').setValue(data.medicaments[0].termsOfValidity);
                            this.eForm.get('medicament.volume').setValue(data.medicaments[0].volume);
                            this.activeSubstancesTable = data.medicaments[0].activeSubstances;
                            this.manufacturesTable = data.medicaments[0].manufactures;
                        }
                        this.receiptsList = data.receipts;
                        this.paymentOrdersList = data.paymentOrders;
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
                        this.checkOutputDocumentsStatus();
                        this.documents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                        this.loadAllQuickSearches(data);
                    })
                );
            })
        );
    }

    loadATCCodes(){
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
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].pharmaceuticalForm) {
                        this.eForm.get('medicament.pharmaceuticalFormType').setValue(this.pharmaceuticalFormTypes.find(r => r.id === dataDB.medicaments[0].pharmaceuticalForm.type.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                    this.volumeUnitsOfMeasurement = data;
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].unitsOfMeasurement) {
                        this.eForm.get('medicament.unitsOfMeasurement').setValue(this.unitsOfMeasurement.find(r => r.id === dataDB.medicaments[0].unitsOfMeasurement.id));
                    }
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].volumeQuantityMeasurement) {
                        this.eForm.get('medicament.volumeQuantityMeasurement').setValue(this.volumeUnitsOfMeasurement.find(r => r.id === dataDB.medicaments[0].volumeQuantityMeasurement.id));
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
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].internationalMedicamentName) {
                        this.eForm.get('medicament.internationalMedicamentName').setValue(this.internationalNames.find(r => r.id === dataDB.medicaments[0].internationalMedicamentName.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    this.medicamentTypes = data;
                    this.medicamentTypes = this.medicamentTypes.filter(r => r.category === 'M');
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].medicamentType) {
                        this.eForm.get('medicament.medicamentType').setValue(this.medicamentTypes.find(r => r.id === dataDB.medicaments[0].medicamentType.id));
                    }
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactures = data;
                    this.manufactureAuthorizations = this.manufactures.filter(r => r.authorizationHolder == 1);
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].authorizationHolder) {
                        this.eForm.get('medicament.authorizationHolder').setValue(this.manufactureAuthorizations.find(r => r.id === dataDB.medicaments[0].authorizationHolder.id));
                    }
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].manufacture) {
                        this.eForm.get('medicament.manufacture').setValue(this.manufactures.find(r => r.id === dataDB.medicaments[0].manufacture.id));
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

        this.subscriptions.push(
            this.administrationService.getAllMedicamentGroups().subscribe(data => {
                    this.groups = data;
                    if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].group) {
                        this.eForm.get('medicament.group').setValue(this.groups.find(r => r.id === dataDB.medicaments[0].group.id));
                    }
                },
                error => console.log(error)
            )
        );


        this.prescriptions = [...this.prescriptions, {value: 1, description : 'Cu prescripţie'}];
        this.prescriptions = [...this.prescriptions, {value: 0, description : 'Fără prescripţie'}];
        if (dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].prescription!=undefined && dataDB.medicaments[0].prescription!=null) {
            if(dataDB.medicaments[0].prescription==1) {
                this.eForm.get('medicament.prescription').setValue({value: 1, description : "Cu prescripţie"});
            }
            else {
                this.eForm.get('medicament.prescription').setValue({value: 0, description : "Fără prescripţie"});
            }
        }

        // if(dataDB.medicaments && dataDB.medicaments.length!=0 && dataDB.medicaments[0].atcCode!=undefined && dataDB.medicaments[0].atcCode!=null)
        // {
        //     let code = dataDB.medicaments[0].atcCode;
        // }
    }

    checkPharmaceuticalFormTypeValue() {

        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalForm').setValue('');
                    this.pharmaceuticalForms = data;
                    if (this.initialData.medicaments && this.initialData.medicaments.length!=0 && this.initialData.medicaments[0] && this.initialData.medicaments[0].pharmaceuticalForm) {
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

        this.formSubmitted = true;

        let isFormInvalid = false;
        let isOutputDocInvalid = false;
        if (this.eForm.invalid || this.divisions.length == 0 || this.manufacturesTable.length == 0 || this.paymentTotal < 0) {
            isFormInvalid = true;
        }

        // for (let entry of this.outDocuments) {
        //     if (!entry.responseReceived && entry.docType.category != 'DD') {
        //         this.isResponseReceived = false;
        //         isOutputDocInvalid = true;
        //     }
        //     if (entry.status == 'Nu este atasat') {
        //         this.isNonAttachedDocuments = true;
        //         isOutputDocInvalid = true;
        //     }
        // }

        // if (!isOutputDocInvalid) {
        //     this.isResponseReceived = true;
        //     this.isNonAttachedDocuments = false;
        // }

        if (isFormInvalid) {
            this.errorHandlerService.showError('Exista cimpuri obligatorii necompletate.');
        }

        // else if (!this.isResponseReceived) {
        //     this.errorHandlerService.showError('Exista documente fara raspuns primit.');
        // } else if (this.isNonAttachedDocuments) {
        //     this.errorHandlerService.showError('Exista documente care nu au fost atasate.');
        // }

        if (isOutputDocInvalid || isFormInvalid) {
            return;
        }

        let test = this.manufacturesTable.find(r=> r.producatorProdusFinit==true);
        if(!test)
        {
            this.errorHandlerService.showError('Nu a fost selectat producatorul produsului finit');
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

        for(let subst of this.activeSubstancesTable)
        {
            subst.id = null;
        }

        for (let division of this.divisions) {
            let medicamentToSubmit: any;
            medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            medicamentToSubmit.division = division.description;
            if(this.eForm.get('medicament.atcCode').value) {
                medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
            }
            if(this.eForm.get('medicament.prescription').value) {
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
            }
            medicamentToSubmit.manufactures = [];
            for(let x of this.manufacturesTable)
            {
                x.id = null;
                medicamentToSubmit.manufactures.push(x);
            }
            modelToSubmit.medicaments.push(medicamentToSubmit);
            modelToSubmit.medicaments.push(medicamentToSubmit);
        }

        if(this.divisions.length==0)
        {
            let medicamentToSubmit: any;
            medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            if(this.eForm.get('medicament.atcCode').value) {
                medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
            }
            if(this.eForm.get('medicament.prescription').value) {
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
            }
            medicamentToSubmit.manufactures = this.manufacturesTable;
            modelToSubmit.medicaments.push(medicamentToSubmit);
        }

        modelToSubmit.paymentOrders = this.paymentOrdersList;
        modelToSubmit.receipts = this.receiptsList;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;

        modelToSubmit.outputDocuments.push({
            name: 'Ordinul de autorizare a medicamentului',
            docType: this.docTypesInitial.find(r => r.category == 'OA'),
            number: 'OA-' + this.eForm.get('requestNumber').value,
            date: new Date()
        });
        modelToSubmit.outputDocuments.push({
            name: 'Certificatul de autorizare al medicamentului',
            docType: this.docTypesInitial.find(r => r.category == 'CA'),
            number: 'CA-' + this.eForm.get('requestNumber').value,
            date: new Date()
        });

        modelToSubmit.assignedUser = this.authService.getUserName();

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
        this.isAddDivision = true;

        if (!this.eForm.get('division').value || this.eForm.get('division').value.toString().length == 0) {
            return;
        }

        this.wasFoundDivision = false;
        let test = this.divisions.find(r=> r.description==this.eForm.get('division').value);
        if(test)
        {
            this.wasFoundDivision = true;
            return;
        }


        this.isAddDivision = false;

        this.divisions.push({
            description: this.eForm.get('division').value
        });

        this.eForm.get('division').setValue(null);
    }

    addManufacture() {
        this.isAddManufacture = true;

        if (!this.eForm.get('manufacture').value || this.eForm.get('manufacture').value.toString().length == 0) {
            return;
        }

        this.wasFoundManufacture = false;
        let test = this.manufacturesTable.find(r=> r.id==this.eForm.get('manufacture').value.id);
        if(test)
        {
            this.wasFoundManufacture = true;
            return;
        }

        this.isAddManufacture = false;

        this.manufacturesTable.push({manufacture : this.eForm.get('manufacture').value, producatorProdusFinit : false});

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

    removeDivision(index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta divizare?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
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
                this.eForm.get('medicament.dose').setValue(null);
                for(let as of this.activeSubstancesTable) {
                    if (this.eForm.get('medicament.dose').value == null || this.eForm.get('medicament.dose').value.length == 0) {
                        this.eForm.get('medicament.dose').setValue(as.quantity + ' ' + as.unitsOfMeasurement.description);
                    } else {
                        this.eForm.get('medicament.dose').setValue(this.eForm.get('medicament.dose').value + ' / ' + as.quantity + ' ' + as.unitsOfMeasurement.description);
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
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
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
                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
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
                var modelToSubmit = {requestHistories: [], currentStep: 'I', id: this.eForm.get('id').value, assignedUser : usernameDB, initiator : this.initialData.initiator};
                modelToSubmit.requestHistories.push({
                    startDate: this.eForm.get('data').value, endDate: new Date(),
                    username: usernameDB, step: 'E'
                });

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

                this.subscriptions.push(this.requestService.addMedicamentRequest(this.initialData).subscribe(data => {
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
        for (let m of this.manufacturesTable)
        {
            m.producatorProdusFinit = false;
        }
        manufacture.producatorProdusFinit = value.checked;
    }

    save() {

        this.loadingService.show();
        var modelToSubmit: any = this.eForm.value;
        modelToSubmit.documents = this.documents;
        modelToSubmit.outputDocuments = this.outDocuments;
        modelToSubmit.currentStep = 'E';
        modelToSubmit.assignedUser = this.authService.getUserName();

        for(let subst of this.activeSubstancesTable)
        {
            subst.id = null;
        }

        for (let division of this.divisions) {
            let medicamentToSubmit: any;
            medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            medicamentToSubmit.division = division.description;
            if(this.eForm.get('medicament.atcCode').value) {
                medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
            }
            if(this.eForm.get('medicament.prescription').value) {
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
            }
            medicamentToSubmit.manufactures = [];
            for(let x of this.manufacturesTable)
            {
                x.id = null;
                medicamentToSubmit.manufactures.push(x);
            }
            modelToSubmit.medicaments.push(medicamentToSubmit);
        }

        if(this.divisions.length==0)
        {
            let medicamentToSubmit: any;
            medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
            medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
            if(this.eForm.get('medicament.atcCode').value) {
                medicamentToSubmit.atcCode = this.eForm.get('medicament.atcCode').value.code;
            }
            if(this.eForm.get('medicament.prescription').value) {
                medicamentToSubmit.prescription = this.eForm.get('medicament.prescription').value.value;
            }
            medicamentToSubmit.manufactures = this.manufacturesTable;
            modelToSubmit.medicaments.push(medicamentToSubmit);
        }

        modelToSubmit.paymentOrders = this.paymentOrdersList;
        modelToSubmit.receipts = this.receiptsList;

        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        console.log(modelToSubmit);

        this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                this.loadingService.hide();
                this.router.navigate(['dashboard/module']);
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

        dialogConfig2.height='650px';
        dialogConfig2.width='600px';

        let dialogRef =  this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result.response) {
                this.activeSubstancesTable.push({
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactureSA
                });

                if(this.eForm.get('medicament.dose').value==null || this.eForm.get('medicament.dose').value.length==0)
                {
                    this.eForm.get('medicament.dose').setValue(result.activeSubstanceQuantity+' '+result.activeSubstanceUnit.description);
                }
                else
                {
                    this.eForm.get('medicament.dose').setValue(this.eForm.get('medicament.dose').value+' / '+result.activeSubstanceQuantity+' '+result.activeSubstanceUnit.description);
                }
            }
        });
    }

    editSubstance(substance : any,index : number)
    {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height='650px';
        dialogConfig2.width='600px';
        dialogConfig2.data=substance;

        let dialogRef =  this.dialog.open(ActiveSubstanceDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            if (result.response) {
                this.activeSubstancesTable[index] = {
                    activeSubstance: result.activeSubstance,
                    quantity: result.activeSubstanceQuantity,
                    unitsOfMeasurement: result.activeSubstanceUnit,
                    manufacture: result.manufactureSA
                };

                this.eForm.get('medicament.dose').setValue(null);
                for(let as of this.activeSubstancesTable) {
                    if (this.eForm.get('medicament.dose').value == null || this.eForm.get('medicament.dose').value.length == 0) {
                        this.eForm.get('medicament.dose').setValue(as.quantity + ' ' + as.unitsOfMeasurement.description);
                    } else {
                        this.eForm.get('medicament.dose').setValue(this.eForm.get('medicament.dose').value + ' / ' + as.quantity + ' ' + as.unitsOfMeasurement.description);
                    }
                }
            }
        });
    }

}