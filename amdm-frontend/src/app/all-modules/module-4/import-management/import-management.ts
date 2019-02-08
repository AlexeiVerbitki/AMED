import {Cerere} from './../../../models/cerere';
import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {saveAs} from 'file-saver';
import {Document} from '../../../models/document';
import {RequestService} from '../../../shared/service/request.service';
import {Subject} from 'rxjs/index';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {Utils} from 'angular-bootstrap-md/angular-bootstrap-md/utils/utils.class';
import {forEach} from '@angular/router/src/utils/collection';
import {ImportMedDialog} from '../dialog/import-med-dialog';
import {Timestamp} from 'rxjs/internal/operators/timestamp';
import {ImportManagementDialog} from './import-management-dialog/import-management-dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}


@Component({
    selector: 'app-import-management',
    templateUrl: './import-management.html',
    styleUrls: ['./import-management.css']
})
export class ImportManagement implements OnInit {
    cereri: Cerere[]                      = [];
    // importer: any[];
    evaluateImportForm: FormGroup;
    // importTypeForm: FormGroup;
    currentDate: Date;
    futureDate: Date;
    file: any;
    requestNumber: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    addMedicamentClicked: boolean;
    private subscriptions: Subscription[] = [];
    docs: Document []                     = [];

    unitOfImportTable: any[] = [];

    protected manufacturersRfPr: Observable<any[]>;
    protected loadingManufacturerRfPr = false;
    protected manufacturerInputsRfPr  = new Subject<string>();

    importer: Observable<any[]>;
    loadingCompany          = false;
    protected companyInputs = new Subject<string>();

    sellerAddress: any;
    importerAddress: any;
    producerAddress: any;
    codeAmed: any;

    solicitantCompanyList: Observable<any[]>;
    unitSumm: any;

    formModel: any;
    valutaList: Observable<any[]>;

    // customsPointsList: Observable<any[]>;
    customsPointsList: any[] = [];

    generatedDocNrSeq: number;

    importData: any;
    medicamentData: any;

    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    atcCodesInputs  = new Subject<string>();

    customsCodes: Observable<any[]>;
    loadingcustomsCodes = false;
    customsCodesInputs  = new Subject<string>();

    pharmaceuticalForm: Observable<any[]>;
    loadingpharmaceuticalForm = false;
    pharmaceuticalFormInputs  = new Subject<string>();

    unitsOfMeasurement: Observable<any[]>;

    medicaments: Observable<any[]>;
    loadingmedicaments = false;
    medicamentsInputs  = new Subject<string>();

    internationalMedicamentNames: Observable<any[]>;
    loadinginternationalMedicamentName = false;
    internationalMedicamentNameInputs  = new Subject<string>();

    expirationDate: any[] = [];

    checked: boolean;

    activeLicenses: any;

    importDetailsList: any = [];

    authorizationSumm: any;
    authorizationCurrency: any;
    dialogResult: any;
    invoice: any        = {};
    invoiceDetails: any = [];


    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                public dialog: MatDialog,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                public medicamentService: MedicamentService,
                private administrationService: AdministrationService) {


    }

    ngOnInit() {
        this.evaluateImportForm = this.fb.group({
            'id': [''],
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['AP'],
            'company': ['', Validators.required],
            'initiator': [null],
            'assignedUser': [null],
            'data': {disabled: true, value: null},
            'importType': [null, Validators.required],
            'type':
                this.fb.group({
                    'id': ['']
                }),

            'requestHistories': [],
            'medicaments': [],

            'importAuthorizationEntity': this.fb.group({
                'id': [Validators.required],
                'applicationDate': [new Date()],
                'applicant': ['', Validators.required],

                'seller': [{value: null, disabled: true}, Validators.required, ], // Tara si adresa lui e deja in baza
                'basisForImport': [{value: null, disabled: true}],

                'importer': [{value: null, disabled: true}, Validators.required], // Tara si adresa lui e deja in baza
                'contract': [{value: null, disabled: true}, Validators.required],
                'contractDate': [{value: null, disabled: true}, Validators.required],
                'anexa': [{value: null, disabled: true}, Validators.required],
                'anexaDate': [{value: null, disabled: true}, Validators.required],
                'specification': [{value: null, disabled: true}, Validators.required],
                'specificationDate': [{value: null, disabled: true}, Validators.required],
                'conditionsAndSpecification': [{value: '', disabled: true}],
                'quantity': [Validators.required],
                'price': [Validators.required],
                'currency': [Validators.required],
                'summ': [Validators.required],
                'producer_id': [Validators.required], // to be deleted
                'stuff_type_id': [Validators.required], // to delete
                'expiration_date': [Validators.required],
                'customsNumber': [{value: null, disabled: true}],
                'customsDeclarationDate': [],
                'authorizationsNumber': [], // inca nu exista la pasul acesta
                'medType': [''],
                'importAuthorizationDetailsEntityList': [],
                'authorized': [],

                'invoiceNumber': [null, Validators.required],
                'invoiceDate': [null, Validators.required],
                'invoiceBasis': [null, Validators.required],
                'invoiceSpecificatie': [null, Validators.required],
                // 'invoiceCustomsCode': [null, Validators.required],
                'invoiceCustomsNumber': [null, Validators.required],
                'invoiceCustomsDate': [null, Validators.required],
                'customsPoints': [null, Validators.required],

                'unitOfImportTable': this.fb.group({

                    customsCode: [null, Validators.required],
                    name: [null, Validators.required],
                    quantity: [null, Validators.required],
                    price: [null, Validators.required],
                    currency: [null, Validators.required],
                    summ: [null, Validators.required],
                    producer: [null, Validators.required],
                    expirationDate: [null, Validators.required],
                    atcCode: [null, Validators.required],
                    medicament: [null, Validators.required],
                    pharmaceuticalForm: [null, Validators.required],
                    dose: [null, Validators.required],
                    registrationRmNumber: [null, Validators.required],
                    unitsOfMeasurement: [null, Validators.required],
                    registrationRmDate: [null, Validators.required],
                    internationalMedicamentName: [null, Validators.required]

                }),


            }),

        });

        this.invoice = this.fb.group({
            invoiceDetails: []
        })

        this.authorizationSumm = 0;

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                    console.log('this.requestService.getImportRequest(params[\'id\'])', data);
                    this.importData = data;
                    
                    this.customsPointsList = data.importAuthorizationEntity.nmCustomsPointsList;
                    console.log("this.importData:", this.importData)

                    this.docs = data.documents;

                    this.evaluateImportForm = this.fb.group({
                        'id': [''],
                        'requestNumber': [null],
                        'startDate': [new Date()],
                        'currentStep': ['AP'],
                        'company': ['', Validators.required],
                        'initiator': [null],
                        'assignedUser': [null],
                        'data': {disabled: true, value: null},
                        'importType': [null, Validators.required],
                        'type':
                            this.fb.group({
                                'id': ['']
                            }),

                        'requestHistories': [],
                        'medicaments': [],

                        'importAuthorizationEntity': this.fb.group({
                            'id': [Validators.required],
                            'applicationDate': [new Date()],
                            'applicant': ['', Validators.required],
                            
                            'seller': [{value: null, disabled: true}, Validators.required], // Tara si adresa lui e deja in baza
                            'basisForImport': [{value: null, disabled: true}],
                            
                            'importer': [{value: null, disabled: true}, Validators.required], // Tara si adresa lui e deja in baza
                            'contract': [{value: null, disabled: true}, Validators.required],
                            'contractDate': [null, Validators.required],
                            'anexa': [{value: null, disabled: true}, Validators.required],
                            'anexaDate': [{value: null, disabled: true}, Validators.required],
                            'specification': [{value: null, disabled: true}, Validators.required],
                            'specificationDate': [{value: null, disabled: true}, Validators.required],
                            'conditionsAndSpecification': [{value: '', disabled: true}],
                            'quantity': [Validators.required],
                            'price': [Validators.required],
                            'currency': [Validators.required],
                            'summ': [Validators.required],
                            'producer_id': [Validators.required], // to be deleted
                            'stuff_type_id': [Validators.required], // to delete
                            'expiration_date': [Validators.required],
                            'customsNumber': [],
                            'customsDeclarationDate': [{value: null, disabled: true}],
                            'authorizationsNumber': [], // inca nu exista la pasul acesta
                            'medType': [''],
                            'importAuthorizationDetailsEntityList': [],
                            'authorized': [],

                            'invoiceNumber': [null, Validators.required],
                            'invoiceDate': [null, Validators.required],
                            'invoiceBasis': [null, Validators.required],
                            'invoiceSpecificatie': [null, Validators.required],
                            // 'invoiceCustomsCode': [null, Validators.required],
                            'invoiceCustomsNumber': [null, Validators.required],
                            'invoiceCustomsDate': [null, Validators.required],
                            'customsPoints': [null, Validators.required],

                            'unitOfImportTable': this.fb.group({

                                customsCode: [null, Validators.required],
                                name: [null, Validators.required],
                                quantity: [null, Validators.required],
                                price: [null, Validators.required],
                                currency: [null, Validators.required],
                                summ: [null, Validators.required],
                                producer: [null, Validators.required],
                                expirationDate: [null, Validators.required],
                                atcCode: [null, Validators.required],
                                medicament: [null, Validators.required],
                                pharmaceuticalForm: [null, Validators.required],
                                dose: [null, Validators.required],
                                registrationRmNumber: [null, Validators.required],
                                unitsOfMeasurement: [null, Validators.required],
                                registrationRmDate: [null, Validators.required],
                                internationalMedicamentName: [null, Validators.required]

                            }),


                        }),

                    });


                    this.importDetailsList = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList;

                    this.requestService.getActiveLicenses(data.importAuthorizationEntity.applicant.idno).subscribe(data => {
                        console.log('this.requestService.getActiveLicenses(data.applicant.idno).subscribe', data);
                        this.activeLicenses = data;
                        console.log('this.activeLicenses', this.activeLicenses);
                        this.expirationDate.push(this.activeLicenses.expirationDate);

                    });


                    this.importDetailsList.forEach(item => {
                        item.approved == null ? item.approved = false : (item.approved = item.approved);
                        // this.expirationDate.push(item.expirationDate);
                        if (item.approved == true) {
                            this.authorizationSumm = this.authorizationSumm + item.summ;
                        }
                    });


                    this.evaluateImportForm.get('id').setValue(data.id);
                    this.evaluateImportForm.get('requestNumber').setValue(data.requestNumber);
                    this.evaluateImportForm.get('startDate').setValue(new Date(data.startDate));
                    this.evaluateImportForm.get('initiator').setValue(data.initiator);
                    this.evaluateImportForm.get('assignedUser').setValue(data.assignedUser);
                    this.evaluateImportForm.get('company').setValue(data.company);
                    this.evaluateImportForm.get('importAuthorizationEntity.medType').setValue(data.importAuthorizationEntity.medType);
                    this.evaluateImportForm.get('importAuthorizationEntity.applicant').setValue(data.company);
                    this.evaluateImportForm.get('type.id').setValue(data.type.id);
                    this.evaluateImportForm.get('requestHistories').setValue(data.requestHistories);

                    this.evaluateImportForm.get('importAuthorizationEntity.seller').setValue(data.importAuthorizationEntity.seller);
                    this.sellerAddress = (data.importAuthorizationEntity.seller.address + ', ' + data.importAuthorizationEntity.seller.country.description);
                    this.evaluateImportForm.get('importAuthorizationEntity.importer').setValue(data.importAuthorizationEntity.importer);
                    this.importerAddress = data.importAuthorizationEntity.importer.legalAddress + ', Moldova';
                    this.evaluateImportForm.get('importAuthorizationEntity.basisForImport').setValue(data.importAuthorizationEntity.basisForImport);
                    this.evaluateImportForm.get('importAuthorizationEntity.conditionsAndSpecification').setValue(data.importAuthorizationEntity.conditionsAndSpecification);
                    this.evaluateImportForm.get('importAuthorizationEntity.authorizationsNumber').setValue(data.id + '/' + new Date().getFullYear() + '-AM');
                    this.evaluateImportForm.get('importAuthorizationEntity.customsNumber').setValue(data.importAuthorizationEntity.customsNumber);
                    this.evaluateImportForm.get('importAuthorizationEntity.customsDeclarationDate').setValue(new Date(data.importAuthorizationEntity.customsDeclarationDate));
                    this.evaluateImportForm.get('importAuthorizationEntity.contract').setValue(data.importAuthorizationEntity.contract);
                    this.evaluateImportForm.get('importAuthorizationEntity.contractDate').setValue(new Date(data.importAuthorizationEntity.contractDate));
                    this.evaluateImportForm.get('importAuthorizationEntity.anexa').setValue(data.importAuthorizationEntity.anexa);
                    this.evaluateImportForm.get('importAuthorizationEntity.anexaDate').setValue(new Date(data.importAuthorizationEntity.anexaDate));
                    this.evaluateImportForm.get('importAuthorizationEntity.specification').setValue(data.importAuthorizationEntity.specification);
                    this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').setValue(new Date(data.importAuthorizationEntity.specificationDate));
                    // this.evaluateImportForm.get('importAuthorizationEntity.approvedQuantity').setValue(data.importAuthorizationEntity.approvedQuantity);

                    // this.evaluateImportForm.disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.seller').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.contract').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.contractDate').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.anexa').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.anexaDate').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.specification').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.importer').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.basisForImport').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.conditionsAndSpecification').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.authorizationsNumber').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.customsNumber').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.customsDeclarationDate').disable();


                    if (data.importAuthorizationEntity.medType === 2) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setErrors(null);
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setErrors(null);
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setErrors(null);
                    }
                },
                error => console.log(error)
            ));
        }));

        this.checked              = false;
        this.currentDate          = new Date();
        this.futureDate           = new Date();
        this.sellerAddress        = '';
        this.producerAddress      = '';
        this.importerAddress      = '';
        this.formSubmitted        = false;
        this.addMedicamentClicked = false;
        this.loadEconomicAgents();
        this.loadManufacturersRfPr();
        this.onChanges();
        this.loadCurrenciesShort();
        this.loadCustomsCodes();
        this.loadATCCodes();
        this.loadPharmaceuticalForm();
        this.loadUnitsOfMeasurement();
        this.loadMedicaments();
        this.loadInternationalMedicamentName();
        // this.loadCustomsPoints();
        // this.generateDocNr();

    }


    viewDoc(document: any) {
        this.loadingService.show();

        let observable: Observable<any> = null;


        console.log('this.evaluateImportForm.getRawValue', this.evaluateImportForm.getRawValue());

        const authorizationModel                                                          = this.evaluateImportForm.getRawValue();
        authorizationModel.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.importDetailsList;

        this.importDetailsList.forEach(item => {
            if (item.approved === true) {
                this.expirationDate.push(item.expirationDate);
                authorizationModel.importAuthorizationEntity.summ = authorizationModel.importAuthorizationEntity.summ + item.summ;
                console.log('modelToSubmit.importAuthorizationEntity.summ');
            }
        });


        authorizationModel.importAuthorizationEntity.expirationDate = new Date(this.expirationDate.reduce(function (a, b) {
            return a < b ? a : b;
        }));

        console.log('authorizationModel', authorizationModel);
        observable = this.requestService.viewImportAuthorization(authorizationModel);
        // observable = this.requestService.viewImportAuthorization(this.evaluateImportForm.getRawValue())

        // }
        // else if (document.category === 'LI')
        // {
        //     observable = this.licenseService.viewLicenta(this.composeModel('A', 'A'));
        // }

        this.subscriptions.push(observable.subscribe(data => {
                console.log('observable.subscribe(data =>', data);
                const file    = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                console.log('window.open(fileURL) ERROR');
                this.loadingService.hide();
            }
            )
        );
    }


    setApproved(i: any) {

        // this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved ? this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false : this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
        if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved == false) {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
            this.authorizationSumm                                                                     = this.authorizationSumm + this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ;
            this.authorizationCurrency                                                                 = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
            console.log('this.authorizationSumm', this.authorizationSumm);
        } else {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false;
            this.authorizationSumm                                                                     = this.authorizationSumm - this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ;
            console.log('this.authorizationSumm', this.authorizationSumm);
        }

        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']', this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
    }

    dialogSetApproved(i: any, approvedQuantity: any) {
        // if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved === false) {

        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved         = true;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approvedQuantity = approvedQuantity;
        // this.authorizationSumm = this.authorizationSumm + this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ             = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        this.authorizationCurrency                                                                         = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
        // console.log("this.authorizationSumm", this.authorizationSumm)
        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']', this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i]);
        // }
    }

    dialogSetReject(i: any, approvedQuantity: any) {
        // if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved === true) {
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved         = false;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approvedQuantity = 0;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ             = 0;
        // this.authorizationSumm = this.authorizationSumm - this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        // console.log("this.authorizationSumm", this.authorizationSumm)
        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']', this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
        // }
    }

    onChanges(): void {
        if (this.evaluateImportForm.get('importAuthorizationEntity')) {

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').valueChanges.subscribe(val => {
                if (val) {
                    this.medicamentData = val;
                    this.codeAmed       = val.code;
                    console.log('importAuthorizationEntity.unitOfImportTable.medicament', this.medicamentData);

                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(val.customsCode);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(val.pharmaceuticalForm);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(val.dose);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(val.division);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(val.internationalMedicamentName);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(val.commercialName);

                    if (val.customsCode !== null) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(val.customsCode);
                    }

                    if (val.manufactures[0]) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(val.manufactures[0].manufacture);
                        this.producerAddress = val.manufactures[0].manufacture.address;
                    }
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(val.atcCode);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(val.registrationNumber);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(val.registrationDate));
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(val.expirationDate);
                    console.log('val.registrationDate', val.registrationDate);
                }
            }));
            /*================================================*/
            // this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.seller').valueChanges.subscribe(val => {
            //     if (val) {
            //         this.sellerAddress = val.address + ', ' + val.country.description;
            //     }
            // }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').valueChanges.subscribe(val => {
                if (this.medicamentData == null && val) {
                    this.producerAddress = val.address + ', ' + val.country.description;
                    // console.log("producerAddress",this.producerAddress)
                }
            }));
            // this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
            //     if (val) {
            //         this.importerAddress = val.legalAddress /*+ ", " + val.country.description*/;
            //     }
            // }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').valueChanges.subscribe(val => {
                if (val) {
                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm);
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').valueChanges.subscribe(val => {
                if (val) {
                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm);
                }
            }));
        }
    }

    // generateDocNr() {
    //     this.subscriptions.push(
    //         this.administrationService.generateDocNr().subscribe(data => {
    //                 this.requestNumber = data;
    //                 this.evaluateImportForm.get('requestNumber').setValue(this.requestNumber);
    //             },
    //             error => console.log(error)
    //         )
    //     );
    // }


    // addUnitOfImport() {
    //     this.addMedicamentClicked = true;
    //
    //
    //     if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid) {
    //         this.unitOfImportTable.push({
    //
    //             codeAmed: this.codeAmed,
    //             // codeAmed:                      Utils.generateMedicamentCode(),
    //
    //             customsCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').value,
    //             name: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').value,
    //             quantity: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value,
    //             price: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
    //             currency: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').value,
    //             summ: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
    //             * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
    //             producer: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').value,
    //             expirationDate: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').value,
    //
    //             pharmaceuticalForm: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').value,
    //             dose: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').value,
    //             unitsOfMeasurement: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').value,
    //             internationalMedicamentName: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').value,
    //             atcCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').value,
    //             registrationNumber: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').value,
    //             registrationDate: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').value,
    //
    //
    //         });
    //
    //         console.log("this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable'", (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').value)),
    //
    //             this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(null);
    //         this.producerAddress = null;
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(null);
    //
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(null);
    //         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(null);
    //
    //
    //         this.addMedicamentClicked = false;
    //     }
    //     console.log("this.unitOfImportTable", this.unitOfImportTable)
    // }

    removeunitOfImport(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti ?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.invoiceDetails.splice(index, 1);
            }
        });
    }

    showunitOfImport() {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus    = true;
        dialogConfig2.hasBackdrop  = true;

        // dialogConfig2.height = '900px';
        dialogConfig2.width = '850px';

        dialogConfig2.data                       = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[0];
        dialogConfig2.data.medtType              = this.importData.importAuthorizationEntity.medType;
        dialogConfig2.data.currentStep           = this.importData.currentStep;
        dialogConfig2.data.invoiceDetails        = this.invoiceDetails;
        dialogConfig2.data.importAuthorizationID = this.importData.importAuthorizationEntity.id;
        dialogConfig2.data.authorizationsNumber  = this.importData.importAuthorizationEntity.authorizationsNumber;

        const dialogRef = this.dialog.open(ImportManagementDialog, dialogConfig2);

        dialogRef.afterClosed().subscribe(dialogResult => {
            this.dialogResult = dialogResult;
            console.log("this.dialogResult:", this.dialogResult);

            let invoiceDetails: any = {};

            if (this.dialogResult.importAuthorizationEntity.unitOfImportTable.quantity) {
                invoiceDetails.quantity = this.dialogResult.importAuthorizationEntity.unitOfImportTable.quantity;
            }
            if (this.dialogResult.importAuthorizationEntity.unitOfImportTable.price) {
                invoiceDetails.price = this.dialogResult.importAuthorizationEntity.unitOfImportTable.price;
            }
            if (this.dialogResult.importAuthorizationEntity.unitOfImportTable.unitSumm) {
                invoiceDetails.sum = this.dialogResult.importAuthorizationEntity.unitOfImportTable.unitSumm;
            }
            if (this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.codeAmed) {
                invoiceDetails.codeAmed = this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.codeAmed;
            }
            if (this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.name) {
                invoiceDetails.name = this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.name;
            }


            invoiceDetails.medicament           = this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.medicament;
            invoiceDetails.authorizationsNumber = this.importData.importAuthorizationEntity.authorizationsNumber;


            this.invoiceDetails.push(invoiceDetails);
            console.log('invoiceDetails', this.invoiceDetails);

            // if (dialogResult && dialogResult[0] === true) {
            //     this.dialogSetApproved(i, dialogResult[1]);
            //     console.log('dialog dialogResult:', dialogResult);
            // }
            // if (dialogResult && dialogResult[0] === false) {
            //     this.dialogSetReject(i, dialogResult[1]);
            // }
        });
    }

    loadATCCodes() {
        this.customsCodes =
            this.customsCodesInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingcustomsCodes = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllCustomsCodesByDescription(term).pipe(
                        tap(() => this.loadingcustomsCodes = false)
                    )
                )
            );
    }

    loadInternationalMedicamentName() {
        this.internationalMedicamentNames =
            this.internationalMedicamentNameInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadinginternationalMedicamentName = true;

                }),
                flatMap(term =>

                    this.administrationService.getAllInternationalNamesByName(term).pipe(
                        // this.administrationService.getAllInternationalNames().pipe(
                        tap(() => this.loadinginternationalMedicamentName = false)
                    )
                )
            );
    }

    loadPharmaceuticalForm() {
        this.pharmaceuticalForm =
            this.pharmaceuticalFormInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingpharmaceuticalForm = true;

                }),
                flatMap(term =>
                    this.administrationService.getAllPharamceuticalFormsByName(term).pipe(
                        tap(() => this.loadingpharmaceuticalForm = false)
                    )
                )
            );
    }

    loadMedicaments() {
        this.medicaments =
            this.medicamentsInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingmedicaments = true;

                }),
                flatMap(term =>
                    this.medicamentService.getMedicamentByName(term).pipe(
                        tap(() => this.loadingmedicaments = false)
                    )
                )
            );
    }


    loadUnitsOfMeasurement() {
        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                },
                error => console.log(error)
            )
        );
    }

    loadCustomsCodes() {
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


    loadEconomicAgents() {
        this.importer =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingCompany = true;

                }),
                flatMap(term =>

                    this.administrationService.getCompanyNamesAndIdnoList(term).pipe(
                        tap(() => this.loadingCompany = false)
                    )
                )
            );
    }


    loadManufacturersRfPr() {
        this.manufacturersRfPr =
            this.manufacturerInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingManufacturerRfPr = true;

                }),
                flatMap(term =>
                    this.administrationService.getManufacturersByName(term).pipe(
                        tap(() => this.loadingManufacturerRfPr = false)
                    )
                )
            );
    }

    loadCurrenciesShort() {
        this.subscriptions.push(
            this.administrationService.getCurrenciesShort().subscribe(data => {
                    this.valutaList = data;

                },
                error => console.log(error)
            )
        );
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
                let modelToSubmit: any = {};
                modelToSubmit                                                                = this.importData;
                modelToSubmit.currentStep                                                    = 'C';
                modelToSubmit.endDate                                                        = new Date();
                modelToSubmit.documents                                                      = this.docs;
                modelToSubmit.medicaments = [];
                modelToSubmit.requestHistories.push({
                    startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
                    endDate: new Date(),
                    username: this.authService.getUserName(),
                    step: 'C'
                });
                modelToSubmit.documents = this.docs;
                this.subscriptions.push(
                    this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                        this.router.navigate(['/dashboard/homepage']);
                        this.loadingService.hide();
                    }, error => {
                        this.loadingService.hide();
                        console.log(error);
                    })
                );
            }
        });
    }


    
    nextStep(aprrovedOrNot: boolean, submitForm: boolean) {

        this.formSubmitted = true;
        if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceNumber').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.invoiceDate').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.invoiceBasis').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsDate').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsNumber').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.invoiceSpecificatie').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').valid &&
            this.invoiceDetails.length > 0) {

            let modelToSubmit: any = {};
            this.loadingService.show();

            modelToSubmit.requestHistories = [];

            let invoiceDetailsEntity: any[] = [];
            let invoiceEntity: any          = {};

            invoiceDetailsEntity = this.invoiceDetails;

            invoiceEntity.invoiceNumber            = this.evaluateImportForm.get('importAuthorizationEntity.invoiceNumber').value;
            invoiceEntity.invoiceDate              = new Date(this.evaluateImportForm.get('importAuthorizationEntity.invoiceDate').value);
            invoiceEntity.basisForInvoice          = this.evaluateImportForm.get('importAuthorizationEntity.invoiceBasis').value;
            invoiceEntity.customsDeclarationDate   = new Date(this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsDate').value);
            invoiceEntity.customsDeclarationNumber = this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsNumber').value;
            invoiceEntity.specification            = this.evaluateImportForm.get('importAuthorizationEntity.invoiceSpecificatie').value;
            invoiceEntity.customsPointsEntity      = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
            invoiceEntity.invoiceDetailsEntitySet  = invoiceDetailsEntity;

            modelToSubmit               = this.importData;
            modelToSubmit.invoiceEntity = invoiceEntity;

            modelToSubmit.currentStep = "F";
            modelToSubmit.medicaments = [];

            modelToSubmit.requestHistories.push({

                startDate: new Date(),
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: 'F'
            });


            console.log('modelToSubmit', modelToSubmit);
            this.subscriptions.push(this.requestService.addInvoiceRequest(modelToSubmit).subscribe(data => {
                    // alert('after addInvoiceRequest(modelToSubmit)');
                    console.log('addInvoiceRequest(modelToSubmit).subscribe(data) ', data);
                    this.loadingService.hide();
                    this.router.navigate(['dashboard/homepage']);
                    // alert("Saved")
                }, error => {
                    // alert('Something went wrong while sending the model');
                    console.log('error: ', error);
                    this.loadingService.hide();
                }
            ));

            this.formSubmitted = false;
        }
        else {
            console.log("this.evaluateImportForm.valid", this.evaluateImportForm.valid)
            console.log("this.evaluateImportForm", this.evaluateImportForm)

            let element = document.getElementById("invoiceInfo");
            element.scrollIntoView();
        }
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
