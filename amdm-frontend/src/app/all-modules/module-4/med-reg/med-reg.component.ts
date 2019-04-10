import {Cerere} from './../../../models/cerere';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {Document} from '../../../models/document';
import {RequestService} from '../../../shared/service/request.service';
import {Subject} from 'rxjs/index';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {MedicamentService} from '../../../shared/service/medicament.service';
import {ImportMedDialogComponent} from '../dialog/import-med-dialog.component';
import {PriceService} from '../../../shared/service/prices.service';
import {NavbarTitleService} from '../../../shared/service/navbar-title.service';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import {UploadFileService} from "../../../shared/service/upload/upload-file.service";
import {HttpEvent} from "@angular/common/http";
import * as XLSX from 'xlsx';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}


@Component({
    selector: 'app-med-reg',
    templateUrl: './med-reg.component.html',
    styleUrls: ['./med-reg.component.css']
})
export class MedRegComponent implements OnInit, OnDestroy {
    cereri: Cerere[] = [];
    // importer: any[];
    evaluateImportForm: FormGroup;
    // importTypeForm: FormGroup;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    addMedicamentClicked: boolean;
    docs: Document [] = [];
    unitOfImportTable: any[] = [];
    exchangeCurrencies: any[] = [];
    exchangeCurrenciesForPeriod: any[] = [];
    manufacturersRfPr: Observable<any[]>;
    loadingManufacturerRfPr = false;
    manufacturerInputsRfPr = new Subject<string>();
    importer: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    sellerAddress: any;
    importerAddress: any;
    producerAddress: any;
    codeAmed: any;
    solicitantCompanyList: Observable<any[]>;
    unitSumm: number;
    formModel: any;
    valutaList: any[];
    contractValutaList: any[];
    importData: any;
    medicamentData: any;
    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    atcCodesInputs = new Subject<string>();
    customsCodes: Observable<any[]>;
    loadingcustomsCodes = false;
    customsCodesInputs = new Subject<string>();
    pharmaceuticalForm: Observable<any[]>;
    loadingpharmaceuticalForm = false;
    pharmaceuticalFormInputs = new Subject<string>();
    unitsOfMeasurement: Observable<any[]>;
    medicaments: Observable<any[]>;
    loadingmedicaments = false;
    medicamentsInputs = new Subject<string>();
    internationalMedicamentNames: Observable<any[]>;
    loadinginternationalMedicamentName = false;
    internationalMedicamentNameInputs = new Subject<string>();
    medicamentPrice: any;
    medicamentMAXPrice: any[] = [];
    userPrice: any;
    medicamentCurrencyExchangeRate: any;
    medicamnetMaxPriceValuta: any;
    medicamnetMaxPriceMDL: any;
    invalidPrice: boolean;
    activeLicenses: any;
    authorizationSumm: any;
    authorizationCurrency: any;
    medicamentSelected = false;
    invalidCurrency = false;
    changeCurrency = true;
    currentCurrency: any;
    isUnitOfImportValid = false;
    registrationDate: any;
    maxDate = new Date();
    importSources: any[] = [];
    validRows: any[] = [];
    // excelSheet: any;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                public dialog: MatDialog,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                public medicamentService: MedicamentService,
                public priceServise: PriceService,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService,
                private errorHandlerService: SuccessOrErrorHandlerService,
                private uploadService: UploadFileService) {
    }

    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable') as FormArray;
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Inroducere date');
        // console.log('activeRows', this.activatedRoute.params);
        this.evaluateImportForm = this.fb.group({
            'id': [''],
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['F'],
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
            'registrationRequestMandatedContacts': [],
            'regSubject': [],

            'importAuthorizationEntity': this.fb.group({
                'id': [Validators.required],
                'applicationDate': [new Date()],
                'applicant': ['', Validators.required],
                'seller': [null, Validators.required], // Tara si adresa lui e deja in baza
                'basisForImport': [null, Validators.required],
                'importer': [null, Validators.required], // Tara si adresa lui e deja in baza
                'contract': [null],
                'contractDate': [null],
                'anexa': [null],
                'anexaDate': [null],
                'specification': [null, Validators.required],
                'specificationDate': [null, Validators.required],
                'conditionsAndSpecification': [''],
                'quantity': [Validators.required],
                'price': [Validators.required],
                // 'contractCurrency': [Validators.required],
                'currency': [Validators.required],
                'summ': [Validators.required],
                'producer_id': [Validators.required], // to be deleted
                'stuff_type_id': [Validators.required], // to delete
                'expiration_date': [Validators.required],
                'customsNumber': [],
                'customsDeclarationDate': [],
                'authorizationsNumber': [], // inca nu exista la pasul acesta
                'medType': [''],
                'importAuthorizationDetailsEntityList': [],
                'sgeapNumber': [null],
                'sgeapDate': [null],
                'processVerbalNumber': [null],
                'processVerbalDate': [null],
                'unitOfImportTable': this.fb.group({
                    customsCode: [null, Validators.required],
                    name: [null, Validators.required],
                    quantity: [null, [Validators.required, Validators.min(0.01)]],
                    price: [null, [Validators.required, Validators.min(0.01)]],
                    currency: [{value: null, disabled: true}, Validators.required],
                    summ: [null, Validators.required],
                    producer: [null, Validators.required],
                    expirationDate: [null],
                    atcCode: [null, Validators.required],
                    medicament: [null, Validators.required],
                    pharmaceuticalForm: [null, Validators.required],
                    dose: [null, Validators.required],
                    registrationRmNumber: [null, Validators.required],
                    unitsOfMeasurement: [null, Validators.required],
                    registrationRmDate: [null, Validators.required],
                    internationalMedicamentName: [null, Validators.required],
                    importSources: [null, Validators.required]
                }),
            }),
        });

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                    console.log('this.requestService.getImportRequest(params[\'id\'])', data);
                    console.log('regSubject', data.regSubject);
                    this.importData = data;
                    this.docs = data.documents;

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
                    this.evaluateImportForm.get('registrationRequestMandatedContacts').setValue(data.registrationRequestMandatedContacts);
                    this.evaluateImportForm.get('regSubject').setValue(data.regSubject);

                    this.evaluateImportForm.get('importAuthorizationEntity.seller').setValue(data.importAuthorizationEntity.seller);
                    this.evaluateImportForm.get('importAuthorizationEntity.importer').setValue(data.importAuthorizationEntity.importer);
                    this.evaluateImportForm.get('importAuthorizationEntity.basisForImport').setValue(data.importAuthorizationEntity.basisForImport);
                    this.evaluateImportForm.get('importAuthorizationEntity.conditionsAndSpecification').setValue(data.importAuthorizationEntity.conditionsAndSpecification);
                    this.evaluateImportForm.get('importAuthorizationEntity.authorizationsNumber').setValue(data.importAuthorizationEntity.authorizationsNumber);
                    this.evaluateImportForm.get('importAuthorizationEntity.currency').setValue(data.importAuthorizationEntity.currency);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(data.importAuthorizationEntity.currency);
                    this.evaluateImportForm.get('importAuthorizationEntity.customsNumber').setValue(data.importAuthorizationEntity.customsNumber);

                    if (data.importAuthorizationEntity.customsDeclarationDate !== null) {
                        this.evaluateImportForm.get('importAuthorizationEntity.customsDeclarationDate').setValue(new Date(data.importAuthorizationEntity.customsDeclarationDate));
                    }
                    this.evaluateImportForm.get('importAuthorizationEntity.contract').setValue(data.importAuthorizationEntity.contract);
                    if (data.importAuthorizationEntity.contractDate !== null) {
                        this.evaluateImportForm.get('importAuthorizationEntity.contractDate').setValue(new Date(data.importAuthorizationEntity.contractDate));
                    }
                    this.evaluateImportForm.get('importAuthorizationEntity.anexa').setValue(data.importAuthorizationEntity.anexa);
                    if (data.importAuthorizationEntity.anexaDate !== null) {
                        this.evaluateImportForm.get('importAuthorizationEntity.anexaDate').setValue(new Date(data.importAuthorizationEntity.anexaDate));
                    }
                    this.evaluateImportForm.get('importAuthorizationEntity.specification').setValue(data.importAuthorizationEntity.specification);
                    if (data.importAuthorizationEntity.specificationDate !== null) {
                        this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').setValue(new Date(data.importAuthorizationEntity.specificationDate));
                    }
                    this.unitOfImportTable = data.importAuthorizationEntity.importAuthorizationDetailsEntityList;

                    if (data.importAuthorizationEntity.sgeapNumber) {
                        this.evaluateImportForm.get('importAuthorizationEntity.sgeapNumber').setValue(data.importAuthorizationEntity.sgeapNumber);
                    }
                    if (data.importAuthorizationEntity.sgeapDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.sgeapDate').setValue(new Date(data.importAuthorizationEntity.sgeapDate));
                    }
                    // if (data.importAuthorizationEntity.unitOfImportTable.importSources)
                    // {
                    //     this.evaluateImportForm.get('data.importAuthorizationEntity.unitOfImportTable.importSources').setValue(new Date(data.importAuthorizationEntity.unitOfImportTable.importSources));
                    // }

                    //If it's a registered medicament, disable the following fields

                    if (data.importAuthorizationEntity.medType === 1) {
                        if (data.importAuthorizationEntity.medType) {
                            // this.evaluateImportForm.get('type.id').setValue(15);
                            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').disable();
                            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producerAddress').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').disable();
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').disable();

                            // this.evaluateImportForm.get('data.importAuthorizationEntity.unitOfImportTable.importSources').setErrors(null);
                        }
                    }

                    if (data.importAuthorizationEntity.medType === 2) {
                        if (data.importAuthorizationEntity.medType) {
                            // this.evaluateImportForm.get('type.id').setValue(16);

                            if (data.importAuthorizationEntity.processVerbalNumber) {
                                this.evaluateImportForm.get('importAuthorizationEntity.processVerbalNumber').setValue(data.importAuthorizationEntity.processVerbalNumber);
                            }
                            if (data.importAuthorizationEntity.processVerbalDate) {
                                this.evaluateImportForm.get('importAuthorizationEntity.processVerbalDate').setValue(new Date(data.importAuthorizationEntity.processVerbalDate));
                            }
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setErrors(null);
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setErrors(null);
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setErrors(null);
                        }
                    }
                },
                error => console.log(error)
            ));
        }));

        this.activeLicenses = false;
        this.currentDate = new Date();
        this.sellerAddress = '';
        this.producerAddress = '';
        this.importerAddress = '';
        this.formSubmitted = false;
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
        this.invalidPrice = false;
        this.authorizationSumm = 0;
        this.loadImportSources();

        // console.log('specificationDate', this.evaluateImportForm.get('importAuthorizationEntity.specificationDate'));
    }

    onChanges(): void {

        if (this.evaluateImportForm.get('importAuthorizationEntity')) {

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.currency').valueChanges.subscribe(value => {
                if (value) {
                    this.invalidCurrency = false;
                    if (this.importData.importAuthorizationEntity.medType === 1) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').reset();
                    }
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(value);


                } else {
                    this.invalidCurrency = false;
                }
            }));

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').valueChanges.subscribe(val => {
                console.log('medicament value', val);
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').reset();
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').markAsUntouched();
                if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').dirty) {
                    this.medicamentSelected = true;
                }

                if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value == undefined) {
                    this.invalidCurrency = true;
                } else {
                    this.invalidCurrency = false;
                }

                if (this.invalidCurrency == false && val) {
                    this.medicamentData = val;
                    this.codeAmed = val.code;
                    // console.log('importAuthorizationEntity.unitOfImportTable.medicament', this.medicamentData);
                    // console.log('this.evaluateImportForm.get(\'importAuthorizationEntity.currency\').invalid',
                    // this.evaluateImportForm.get('importAuthorizationEntity.currency').invalid);

                    // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(val);

                    // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(val.customsCode);
                    if (val.pharmaceuticalForm) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(val.pharmaceuticalForm);
                    }
                    if (val.dose) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(val.dose);
                    }
                    if (val.division) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(val.division);
                    }
                    if (val.internationalMedicamentName) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(val.internationalMedicamentName);
                    }
                    if (val.commercialName) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(val.commercialName);
                    } else {this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue('');}
                    if (val.registrationNumber) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(val.registrationNumber);
                    }
                    if (val.registrationDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(val.registrationDate));
                    }
                    if (val.expirationDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(val.expirationDate);
                    }

                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').setValue('');
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue('');


                    if (val.customsCode) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(val.customsCode);
                    }

                    // console.log('val.manufactures', val.manufactures);
                    if (val.manufactures.length > 0 && val.manufactures[0].manufacture && val.manufactures[0].manufacture.address) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(val.manufactures[0].manufacture);
                        this.producerAddress = val.manufactures[0].manufacture.address;
                    } else {
                        // console.log('this.evaluateImportForm.get(\'importAuthorizationEntity.producer\')', this.evaluateImportForm.get('importAuthorizationEntity'));
                        // this.evaluateImportForm.get('importAuthorizationEntity.producer').reset();
                    }
                    (this.subscriptions.push(this.administrationService.getAllAtcCodesByCode(val.atcCode).subscribe(atcCode => {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(atcCode[0]);
                    })));

                    if (val.registrationDate) {
                        // console.log('registrationDate', val.registrationDate);
                        this.registrationDate = val.registrationDate;
                    }


                    // console.log('this.administrationService.getAllAtcCodesByCode( val.atcCode)', this.administrationService.getAllAtcCodesByCode(val.atcCode));

                    this.medicamentService.getMedPrice(val.id).subscribe(priceEntity => {
                        if (priceEntity) {
                            this.medicamentPrice = priceEntity;
                            const exchangeDate = new Date(priceEntity.orderApprovDate);
                            this.loadExchangeRateForPeriod(exchangeDate);
                            if (priceEntity.currency) {
                                this.valutaList = [/*this.valutaList.find(i=> i.shortDescription === "MDL"), */ priceEntity.currency];

                            }
                            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(this.valutaList.find(r => r === priceEntity.currency));
                            // console.log('this.medicamentPrice', this.medicamentPrice);
                            // console.log('medicamentValutaList', this.valutaList);
                            // console.log('priceEntity.currency.shortDescription', priceEntity.currency.shortDescription);
                        }
                    });


                } else {
                    // let el = document.getElementById("contractCurrency");
                    // el.scrollIntoView();
                }
            }));
            /*================================================*/
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.seller').valueChanges.subscribe(val => {
                if (val && val.address && val.country) {
                    this.sellerAddress = val.address + ', ' + val.country.description;
                } else {
                    // console.log('empty sellerAddress address');
                    this.sellerAddress = '';
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').valueChanges.subscribe(val => {
                if (val && val.address && val.country) {
                    this.producerAddress = val.address + ', ' + val.country.description;
                    // console.log("producerAddress",this.producerAddress)
                } else {
                    this.producerAddress = '';
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
                if (val && val.legalAddress) {
                    this.importerAddress = val.legalAddress /*+ ", " + val.country.description*/;
                } else {
                    // console.log('empty importerAddress address');
                    this.importerAddress = '';
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').valueChanges.subscribe(val => {
                if (val) {
                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm.toFixed(2));
                    // console.log('this.unitSumm.toFixed(2)', this.unitSumm.toFixed(2));
                }
            }));

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').valueChanges.subscribe(val => {
                if (val) {
                    this.userPrice = val;
                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm.toFixed(2));

                }

                //========================================
                if (val && this.importData.importAuthorizationEntity.medType === 1) {
                    let contractCurrency: any;
                    let priceInContractCurrency: any;

                    if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value) {
                        contractCurrency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value;
                    }

                    if (contractCurrency.shortDescription == 'MDL') {
                        priceInContractCurrency = this.medicamentPrice.priceMdl;
                    } else {
                        const exchangeCurrency = this.exchangeCurrenciesForPeriod.find(x => x.currency.shortDescription == contractCurrency.shortDescription);
                        if (this.medicamentPrice && this.medicamentPrice.priceMdl && exchangeCurrency && exchangeCurrency.value) {
                            priceInContractCurrency = this.medicamentPrice.priceMdl / exchangeCurrency.value;
                        }
                    }

                    if (this.userPrice > priceInContractCurrency) {
                        this.invalidPrice = true;
                        // console.log('invalidPrice', this.invalidPrice);
                    } else {
                        this.invalidPrice = false;
                        // console.log('invalidPrice', this.invalidPrice);
                    }

                } else if (val) {
                    this.invalidPrice = false;
                }
                //========================================

            }));

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
                if (val) {
                    // console.log('company has changed to: ', val);
                    this.requestService.getActiveLicenses(val.idno).subscribe(data => {
                        // console.log('this.requestService.getActiveLicenses(val.idno).subscribe', data);
                        this.activeLicenses = data;
                    });
                }
            }));

        }
    }

    maxPriceForCurrency(valuta: any) {
        if (valuta.shortDescription === 'MDL') {
            this.medicamentCurrencyExchangeRate = 1;
        } else {
            this.medicamentCurrencyExchangeRate = this.exchangeCurrencies.find(i => i.currency.shortDescription == valuta.shortDescription).value;
            // *  this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;

            // console.log("medicamentCurrencyExchangeRate",this.medicamentCurrencyExchangeRate)
            // console.log("this.medicamentMAXPrice", this.medicamentMAXPrice),
            // console.log("exchangeCurrencies", 10 * this.exchangeCurrencies[1].value);
        }
    }

    currencyChanged($event) {
        this.exchangeCurrencies = $event;
        // console.log("exchangeCurrencies", this.exchangeCurrencies)
    }

    getCurrentCurrency() {
        this.currentCurrency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value;
    }

    showConfirm() {
        let showPopUp = false;
//         if (this.evaluateImportForm.get('importAuthorizationEntity.currency').touched) {
//             showPopUp = true;
//         } else
//             if (this.importData.importAuthorizationEntity.currency) {
//             showPopUp = true;
//         } else if e;
//         } else if (this.unitOfImportTable.length > 0) {
//             showPopUp = true;
// }
        if (this.unitOfImportTable.length > 0 &&
            this.evaluateImportForm.get('importAuthorizationEntity.currency').touched) {
            showPopUp = true;
        }

        // if (this.evaluateImportForm.get('importAuthorizationEntity.currency').touched && this.invalidCurrency/*|| this.importData.importAuthorizationEntity.currency*/) {
        if (showPopUp) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    message: 'Sunteti sigur(ă) ca doriți sa schimbați valuta ? ' +
                    'Aceasta va aduce la stergerea pozișiilor deja adaugate', confirm: false
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (this.unitOfImportTable) {
                        this.unitOfImportTable = [];
                    }
                    // this.changeCurrency = true;
                } else {
                    this.evaluateImportForm.get('importAuthorizationEntity.currency').setValue(this.currentCurrency);
                }
                // this.changeCurrency = false;

            });
        }

    }

    parseSpecification(files: FileList){

        this.loadingService.show();

        var documents: FileList = files;
        let cellsWithErrors = [];

        let cellExists: boolean;
        console.log('documents', documents);

        var nn = this;


        if (!files || files.length == 0) return;
        var file = files[0];


        let reader = new FileReader();
        reader.readAsArrayBuffer(file);


        let excelSheet: any;

        reader.onload = function (e) {
            var data = new Uint8Array(reader.result);
            excelSheet = XLSX.read(data, {type: 'array'});

            if (excelSheet.Sheets && excelSheet.Sheets.Medicamente_Rom_Engl && (excelSheet.Sheets.Medicamente_Rom_Engl.B10 || excelSheet.Sheets.Medicamente_Rom_Engl.P10)){
                cellExists = true;
            } else{
                cellExists = false;
                nn.errorHandlerService.showError("Documentul nu contine date valide");
                nn.loadingService.hide();
                return;
            }
            console.log('excelSheet', excelSheet);

            //=====================
            /* loop through every cell manually */

            let columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
            let sheet = excelSheet.Sheets.Medicamente_Rom_Engl;
            var range = XLSX.utils.decode_range(sheet['!ref']); // get the range
            for ( let R: number  = range.s.r+8; R <= range.e.r; R++) {
                // for (var C = range.s.c; C <= range.e.c; ++C) {
                let rowToBeParsed: any ={};

                //Go through cells in a  row
                for (let C = 1; C < columns.length; C++) {
                    /* find the cell object */
                    // console.log('Row : ' + R);
                    // console.log('Column : ' + C);
                    var cellref = XLSX.utils.encode_cell({c: C, r: R}); // construct A1 reference for cell
                    if (!sheet[cellref]) {
                        let cellNumber: number = R+1;
                        cellsWithErrors.push(cellref);
                        // console.log(columns[C] + cellNumber + ": empty cell")
                        // break; // if cell doesn't exist, move on
                    } else {

                        var cell = sheet[cellref];
                        let cellNumber: number = R+1;
                        console.log(columns[C] + cellNumber +": " +cell.v);

                        switch (C) {
                            case  1: { cell.v ? rowToBeParsed.codeAmed =  cell.v : rowToBeParsed.codeAmed= null; /*if(!rowToBeParsed.codeAmed || rowToBeParsed.codeAmed == undefined)                {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  2: {rowToBeParsed.customsCode =                 cell.v; /*if(!rowToBeParsed.customsCode || rowToBeParsed.customsCode == undefined)                                 {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  3: {rowToBeParsed.name =                        cell.v; /*if(!rowToBeParsed.name || rowToBeParsed.name == undefined)                                               {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  4: {rowToBeParsed.pharmaceuticalForm =          cell.v; /*if(!rowToBeParsed.pharmaceuticalForm || rowToBeParsed.pharmaceuticalForm == undefined)                   {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  5: {rowToBeParsed.dose =                        cell.v; /*if(!rowToBeParsed.dose || rowToBeParsed.dose == undefined)                                               {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  6: {rowToBeParsed.unitsOfMeasurement =          cell.v; /*if(!rowToBeParsed.unitsOfMeasurement || rowToBeParsed.unitsOfMeasurement == undefined)                   {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  7: {rowToBeParsed.quantity =                    cell.v; /*if(!rowToBeParsed.quantity || rowToBeParsed.quantity == undefined)                                       {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  8: {rowToBeParsed.price =                       cell.v; /*if(!rowToBeParsed.price || rowToBeParsed.price == undefined)                                             {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case  9: {rowToBeParsed.summ =                        cell.v; /*if(!rowToBeParsed.summ || rowToBeParsed.summ == undefined)                                               {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 11: {rowToBeParsed.producer =                    cell.v; /*if(!rowToBeParsed.producer || rowToBeParsed.producer == undefined)                                       {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 12: {rowToBeParsed.registrationNumber =          cell.v; /*if(!rowToBeParsed.registrationNumber || rowToBeParsed.registrationNumber == undefined)                   {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 13: {rowToBeParsed.registrationDate =            cell.v; /*if(!rowToBeParsed.registrationDate || rowToBeParsed.registrationDate == undefined)                       {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 14: {rowToBeParsed.atcCode =                     cell.v; /*if(!rowToBeParsed.atcCode || rowToBeParsed.atcCode == undefined)                                         {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 15: {rowToBeParsed.internationalMedicamentName = cell.v; /*if(!rowToBeParsed.internationalMedicamentName || rowToBeParsed.internationalMedicamentName == undefined) {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            // case  :  {rowToBeParsed.currency =                    cell.v; break;}
                            // case  :  {rowToBeParsed.expirationDate =              cell.v; break;}

                        }
                    }
                };
                let unitOfImportForPush: any ={};

//===================================================================================================
                if(nn.importData.importAuthorizationEntity.medType === 1 &&
                    rowToBeParsed.codeAmed &&
                   rowToBeParsed.customsCode &&
                   rowToBeParsed.name &&
                   rowToBeParsed.pharmaceuticalForm &&
                   rowToBeParsed.dose &&
                   rowToBeParsed.unitsOfMeasurement &&
                   rowToBeParsed.quantity &&
                   rowToBeParsed.price &&
                   rowToBeParsed.summ &&
                   rowToBeParsed.producer &&
                   rowToBeParsed.registrationNumber &&
                   rowToBeParsed.registrationDate &&
                   rowToBeParsed.atcCode &&
                   rowToBeParsed.internationalMedicamentName
                   ){
                    nn.validRows.push(rowToBeParsed);
                }

                if(nn.importData.importAuthorizationEntity.medType === 2 &&
                    rowToBeParsed.customsCode &&
                    rowToBeParsed.name &&
                    rowToBeParsed.pharmaceuticalForm &&
                    rowToBeParsed.dose &&
                    rowToBeParsed.unitsOfMeasurement &&
                    rowToBeParsed.quantity &&
                    rowToBeParsed.price &&
                    rowToBeParsed.summ &&
                    rowToBeParsed.producer &&
                    // rowToBeParsed.registrationNumber &&
                    // rowToBeParsed.registrationDate &&
                    rowToBeParsed.atcCode &&
                    rowToBeParsed.internationalMedicamentName
                ){
                    nn.validRows.push(rowToBeParsed);
                }


            }

            console.log('validRows',nn.validRows)

            if(nn.importData.importAuthorizationEntity.medType === 1){
                nn.parseRowWithAmed();
            }
            if(nn.importData.importAuthorizationEntity.medType === 2){
                nn.parseRowNoAmed();
            }
        };

    }

    async parseRowWithAmed() {

        this.validRows.forEach(row => {
            console.log('row', row);

            let unitOfImportWithCodeAmed: any = {};
            let val: any = {};
            if (row.codeAmed) {
                this.subscriptions.push(this.medicamentService.getMedicamentByNameWithPrice(row.codeAmed).subscribe(medicament => {
                    val = medicament[0];
                    console.log('val', medicament);

                    if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value == undefined) {
                        this.invalidCurrency = true;
                        this.loadingService.hide();
                        this.errorHandlerService.showError("Valuta specificatiei trebuie selectată");
                    } else {
                        this.invalidCurrency = false;
                        unitOfImportWithCodeAmed.currency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value;


                    }

                    if (this.invalidCurrency == false && val) {
                        unitOfImportWithCodeAmed.codeAmed = val.code;
                        unitOfImportWithCodeAmed.approved = false;
                        if(val){
                            unitOfImportWithCodeAmed.medicament  = val;
                        }
                        if (val.pharmaceuticalForm) {
                            unitOfImportWithCodeAmed.pharmaceuticalForm = val.pharmaceuticalForm;
                        }
                        if (val.dose) {
                            unitOfImportWithCodeAmed.dose = val.dose;
                        }
                        if (val.division) {
                            unitOfImportWithCodeAmed.unitsOfMeasurement = val.division;
                        }
                        if (val.name) {
                            unitOfImportWithCodeAmed.name = val.name;
                        }else {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue('');
                        }
                        if (val.commercialName) {
                            unitOfImportWithCodeAmed.commercialName = val.commercialName;
                        }
                        if (val.internationalMedicamentName) {
                            unitOfImportWithCodeAmed.internationalMedicamentName = val.internationalMedicamentName;
                        }
                        if (val.registrationNumber) {
                            unitOfImportWithCodeAmed.registrationNumber = val.registrationNumber;
                        }
                        if (val.registrationDate) {
                            unitOfImportWithCodeAmed.registrationDate = new Date(val.registrationDate);
                        }
                        if (val.expirationDate) {
                            unitOfImportWithCodeAmed.expirationDate = new Date(val.expirationDate);
                        }

                        if (row.quantity) {
                            unitOfImportWithCodeAmed.quantity = row.quantity;
                        }


                        if (val.customsCode) {
                            unitOfImportWithCodeAmed.customsCode = val.customsCode;
                        }

                        // console.log('val.manufactures', val.manufactures);
                        if (val.manufactures && val.manufactures.length > 0 && val.manufactures[0].manufacture) {
                            unitOfImportWithCodeAmed.producer = val.manufactures[0].manufacture;
                        } else {
                            // console.log('this.evaluateImportForm.get(\'importAuthorizationEntity.producer\')', this.evaluateImportForm.get('importAuthorizationEntity'));
                            // this.evaluateImportForm.get('importAuthorizationEntity.producer').reset();
                        }
                        (this.subscriptions.push(this.administrationService.getAllAtcCodesByCode(val.atcCode).subscribe(atcCode => {
                            unitOfImportWithCodeAmed.atcCode = atcCode[0];
                        })));

                        unitOfImportWithCodeAmed.importSources = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').value;
                        //=============================================================


                        if (row.price) {
                            this.userPrice = row.price;
                            unitOfImportWithCodeAmed.summ = row.price * row.quantity;

                        }

                        //========================================

                        if (row.price) {
                            let contractCurrency: any;
                            let priceInContractCurrency: any;
                            unitOfImportWithCodeAmed.price = row.price;

                            if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value) {
                                contractCurrency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value;
                            }

                            if (contractCurrency.shortDescription == 'MDL') {
                                priceInContractCurrency = this.medicamentPrice.priceMdl;

                                if (this.userPrice > priceInContractCurrency) {
                                    // this.invalidPrice = true;
                                    console.log('price is higher than the contract price', priceInContractCurrency);
                                } else {
                                    this.unitOfImportTable.push(unitOfImportWithCodeAmed);
                                    console.log('unitOfImportWithCodeAmed', unitOfImportWithCodeAmed);
                                }
                            } else {

                                let medicamentPrice: any;

                                this.subscriptions.push(this.medicamentService.getMedPrice(val.id).subscribe(priceEntity => {
                                    if (priceEntity) {
                                        medicamentPrice = priceEntity;
                                        const exchangeDate = new Date(priceEntity.orderApprovDate);

                                        if (priceEntity.currency) {
                                            this.valutaList = [/*this.valutaList.find(i=> i.shortDescription === "MDL"), */ priceEntity.currency];
                                            console.log('this.valutaList', this.valutaList);

                                        }
                                        this.pushToTableOrNot(exchangeDate, contractCurrency, priceInContractCurrency, medicamentPrice,unitOfImportWithCodeAmed);
                                    }
                                }            ));
                            }


                        } else if (val) {
                            // this.invalidPrice = false;
                            console.log('couldnt verify the price or the row doesnt contain the price');
                        }


                    } else {
                        // let el = document.getElementById("contractCurrency");
                        // el.scrollIntoView();
                    }

                }));
            }
            //=============================================================

        })
        this.loadingService.hide();

    }

    async parseRowNoAmed() {

        this.validRows.forEach(row => {
            console.log('row', row);

            let unitOfImportWithCodeAmed: any = {};
            let rowValues: any = {};

            rowValues = row;
            // console.log('rowValues', row);

            if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value == undefined) {
                this.invalidCurrency = true;
                this.loadingService.hide();
                this.errorHandlerService.showError("Valuta specificatiei trebuie selectată");
            } else {
                this.invalidCurrency = false;
                unitOfImportWithCodeAmed.currency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value;


            }

            if (this.invalidCurrency == false && rowValues) {
                unitOfImportWithCodeAmed.approved = false;
                // if(rowValues){
                //     unitOfImportWithCodeAmed.medicament  = rowValues;
                // }

                if (rowValues.dose) {
                    unitOfImportWithCodeAmed.dose = rowValues.dose;
                }
                if (rowValues.unitsOfMeasurement) {
                    unitOfImportWithCodeAmed.unitsOfMeasurement = rowValues.unitsOfMeasurement;
                }
                if (rowValues.name) {
                    unitOfImportWithCodeAmed.name = rowValues.commercialName;
                } else {
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue('');
                }
                if (rowValues.commercialName) {
                    unitOfImportWithCodeAmed.commercialName = rowValues.commercialName;
                }
                if (row.price) {
                    this.userPrice = row.price;
                    unitOfImportWithCodeAmed.price = row.price;
                }
                if (row.price && row.quantity) {
                    this.userPrice = row.price;
                    unitOfImportWithCodeAmed.summ = row.price * row.quantity;
                }
                if (row.quantity) {
                    unitOfImportWithCodeAmed.quantity = row.quantity;
                }
                if (rowValues.customsCode) {
                    unitOfImportWithCodeAmed.customsCode = rowValues.customsCode;
                }

                unitOfImportWithCodeAmed.importSources = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').value;


                if (rowValues.pharmaceuticalForm) {
                    // unitOfImportWithCodeAmed.pharmaceuticalForm = rowValues.pharmaceuticalForm;
                    if (rowValues.pharmaceuticalForm) {
                        this.subscriptions.push(this.administrationService.getAllPharamceuticalFormsByName(rowValues.pharmaceuticalForm).subscribe(val => {
                            console.log('pharmaceuticalForm', val[0]);
                            unitOfImportWithCodeAmed.pharmaceuticalForm = val[0];
//=============================================================
                            if (rowValues.internationalMedicamentName) {
                                // unitOfImportWithCodeAmed.internationalMedicamentName = rowValues.internationalMedicamentName;
                                this.subscriptions.push(this.administrationService.getAllInternationalNamesByName(rowValues.internationalMedicamentName).subscribe(val => {
                                    console.log('rowValues.internationalMedicamentName', val);
                                    unitOfImportWithCodeAmed.internationalMedicamentName = val.internationalMedicamentName;
//=============================================================
                                    if (rowValues.producer) {
                                        // unitOfImportWithCodeAmed.producer = rowValues.producer;
                                        this.subscriptions.push(this.administrationService.getCompanyNamesAndIdnoList(rowValues.producer).subscribe(val => {
                                            unitOfImportWithCodeAmed.producer = val;
                                            console.log('rowValues.producer', val);
//=============================================================
                                            if (rowValues.atcCode) {
                                                (this.subscriptions.push(this.administrationService.getAllAtcCodesByCode(rowValues.atcCode).subscribe(atcCode => {
                                                    unitOfImportWithCodeAmed.atcCode = atcCode[0];
                                                    console.log('rowValues.atcCode', atcCode[0]);

//=============================================================
                                                    this.unitOfImportTable.push(unitOfImportWithCodeAmed);
                                                    console.log('unitOfImportWithCodeAmed', unitOfImportWithCodeAmed);
                                                    this.loadingService.hide();
                                                })));
                                            }
                                        }));

                                    }
                                }));

                            }
                        }))
                    }
                }

                // if (rowValues.registrationNumber) {
                //     unitOfImportWithCodeAmed.registrationNumber = rowValues.registrationNumber;
                // }
                // if (rowValues.registrationDate) {
                //     unitOfImportWithCodeAmed.registrationDate = new Date(rowValues.registrationDate);
                // }
                // if (rowValues.expirationDate) {
                //     unitOfImportWithCodeAmed.expirationDate = new Date(rowValues.expirationDate);
                // }



                // console.log('rowValues.manufactures', rowValues.manufactures);
                // if (rowValues.producer) {
                //     // unitOfImportWithCodeAmed.producer = rowValues.producer;
                //     this.subscriptions.push(this.administrationService.getCompanyNamesAndIdnoList(rowValues.producer).subscribe(val => {
                //         unitOfImportWithCodeAmed.producer = val;
                //     }));
                //
                // }

                // if (rowValues.atcCode) {
                //     (this.subscriptions.push(this.administrationService.getAllAtcCodesByCode(rowValues.atcCode).subscribe(atcCode => {
                //         unitOfImportWithCodeAmed.atcCode = atcCode[0];
                //     })));
                // }



                //========================================
                // this.unitOfImportTable.push(unitOfImportWithCodeAmed);

            } else {
                // let el = document.getElementById("contractCurrency");
                // el.scrollIntoView();
            }

            //=============================================================

        });


    }


    async getMedicamentPrice(id: any) {
        let priceEntity = await this.medicamentService.getMedPrice(id).toPromise();
        if (priceEntity) {
            this.medicamentPrice = priceEntity;
            const exchangeDate = new Date(priceEntity.orderApprovDate);
            this.loadExchangeRateForPeriod(exchangeDate);
            if (priceEntity.currency) {
                this.valutaList = [/*this.valutaList.find(i=> i.shortDescription === "MDL"), */ priceEntity.currency];
                console.log('this.valutaList', this.valutaList);

            }
        }
        return priceEntity;

    }
    pushToUnitOfImportTable2(unitOfImport: any) {
        this.unitOfImportTable.push(unitOfImport);
        console.log('this.unitOfImportTable',this.unitOfImportTable);
    }

     pushToUnitOfImportTable(excelSheet: any) {

        this.unitOfImportTable.push({
            codeAmed: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            customsCode: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            name: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            quantity: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            price: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            currency: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            summ: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            producer: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            expirationDate: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            pharmaceuticalForm: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            dose: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            unitsOfMeasurement: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            internationalMedicamentName: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            atcCode: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            registrationNumber: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            registrationDate: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            medicament: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v,
            importSources: excelSheet.Sheets.Medicamente_Rom_Engl.A10.v
        });
        console.log('unitOfImportTable', this.unitOfImportTable);

    }


    addUnitOfImport() {
        this.isUnitOfImportValid = true;
        this.addMedicamentClicked = true;
        // console.log('specificationDate', this.evaluateImportForm.get('importAuthorizationEntity.specificationDate'));

        // console.log('asdgsdg', this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate'));
        if (this.importData.importAuthorizationEntity.medType && this.importData.importAuthorizationEntity.medType == 2) {
            // if (this.importData.medType === 2) {
            // this.evaluateImportForm.get('type.id').setValue(16);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setErrors(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setErrors(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setErrors(null);
            // registrationDate = new Date();
            this.registrationDate = new Date();
        }
        if (this.importData.importAuthorizationEntity.medType && this.importData.importAuthorizationEntity.medType == 1) {
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').setErrors(null);
        }

        // if (this.importData.importAuthorizationEntity.medType && this.importData.importAuthorizationEntity.medType == 1) {
        //
        //     registrationDate = this.medicamentData.registrationDate;
        // }
        // if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').invalid || this.invalidCurrency) {

        const invalidMedicament = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').invalid;
        const invalidQty = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').invalid;
        const invalidPrice = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').invalid;
        const invalidCustomsCode = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').invalid;
        this.invalidCurrency = this.evaluateImportForm.get('importAuthorizationEntity.currency').invalid;
        const importSources = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').invalid;
        // console.log(this.evaluateImportForm.get('importAuthorizationEntity.unitspliceOfImportTable.customsCode'));
        if (invalidMedicament || invalidQty || invalidPrice || invalidCustomsCode || importSources || this.invalidPrice || this.invalidCurrency) {
            this.errorHandlerService.showError('Medicamentul contine date invalide');
            return;
        }
	       
        if (!this.invalidPrice) {
        }
        this.unitOfImportTable.push({
            codeAmed: this.codeAmed,
            approved: false,

            customsCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').value,
            name: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').value,
            quantity: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value,
            price: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
            currency: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').value,
            summ: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
            * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
            producer: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').value,
            expirationDate: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').value,

            pharmaceuticalForm: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').value,
            dose: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').value,
            unitsOfMeasurement: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').value,
            internationalMedicamentName: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').value,
            atcCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').value,
            registrationNumber: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').value,
            registrationDate: this.registrationDate,
            medicament: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').value,
            importSources: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').value,
        });

        this.authorizationSumm = this.authorizationSumm + this.unitSumm;
        // console.log('this.authorizationSumm', this.authorizationSumm);
        // console.log('this.evaluateImportForm.get(\'importAuthorizationEntity.unitOfImportTable\'',
        // (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').value));

        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').reset();
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').reset();
        this.producerAddress = null;
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').reset();

        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').reset();
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').reset();


        // this.addMedicamentClicked = false;

        this.addMedicamentClicked = false;
        // }
        // console.log('this.unitOfImportTable', this.unitOfImportTable);
    }

    removeunitOfImport(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti ?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.authorizationSumm = this.authorizationSumm - this.unitOfImportTable[index].summ;
                this.unitOfImportTable.splice(index, 1);
            }
        });

        this.isUnitOfImportValid = this.unitOfImportTable.length > 0;
    }


    showunitOfImport(unitOfImport: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        // dialogConfig2.height = '900px';
        dialogConfig2.width = '850px';

        dialogConfig2.data = unitOfImport;
        dialogConfig2.data.medtType = this.importData.importAuthorizationEntity.medType;

        const dialogRef = this.dialog.open(ImportMedDialogComponent, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            // console.log('result', result);
            if (result == null || result == undefined || result.success === false) {
                return;
            }

            // let medInst = this.addMediacalInstitutionForm.get('medicalInstitution').value;
            // medInst.investigators = result.investigators;
            // console.log('result.investigators', result.investigators);
            // this.mediacalInstitutionsList.push(medInst);
            // let intdexToDelete = this.allMediacalInstitutionsList.indexOf(this.addMediacalInstitutionForm.get('medicalInstitution').value);
            // this.allMediacalInstitutionsList.splice(intdexToDelete, 1);
            // this.allMediacalInstitutionsList = this.allMediacalInstitutionsList.splice(0);
            // this.addMediacalInstitutionForm.get('medicalInstitution').setValue('');
        });
    }

    loadExchangeRateForPeriod(date: any) {
        this.subscriptions.push(this.administrationService.getCurrencyByPeriod(date).subscribe(data => {
            this.exchangeCurrenciesForPeriod = data;
            // console.log('Exchange rate for ' + date + '\n' + JSON.stringify(this.exchangeCurrenciesForPeriod));
            // console.log('Exchange rate for 1' + this.exchangeCurrenciesForPeriod.toString());
        }));

    }

    pushToTableOrNot(date: any, contractCurrency: any, priceInContractCurrency: any, medicamentPrice: any, unitOfImportWithCodeAmed: any) {
        this.subscriptions.push(this.administrationService.getCurrencyByPeriod(date).subscribe(data => {
            this.exchangeCurrenciesForPeriod = data;
            // console.log('Exchange rate for ' + date + '\n' + JSON.stringify(this.exchangeCurrenciesForPeriod));
            // console.log('Exchange rate for 1' + this.exchangeCurrenciesForPeriod.toString());

            const exchangeCurrency = this.exchangeCurrenciesForPeriod.find(x => x.currency.shortDescription == contractCurrency.shortDescription);
            if (medicamentPrice && medicamentPrice.priceMdl && exchangeCurrency && exchangeCurrency.value) {
                priceInContractCurrency = medicamentPrice.priceMdl / exchangeCurrency.value;
            }
            if (this.userPrice > priceInContractCurrency) {
                // this.invalidPrice = true;
                console.log(unitOfImportWithCodeAmed.name + ' price is higher than the contract price', priceInContractCurrency);
            } else {
                this.unitOfImportTable.push(unitOfImportWithCodeAmed);
                console.log('unitOfImportWithCodeAmed', unitOfImportWithCodeAmed);
            }

        }));

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
            )
        ;
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
                    this.medicamentService.getMedicamentByNameWithPrice(term).pipe(
                        // this.medicamentService.getMedicamentByName(term).pipe(
                        tap(() => this.loadingmedicaments = false)
                    )
                )
            );
        // console.log('medicaments', this.medicaments);
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
                    this.contractValutaList = data;
                    // console.log('contractValutaList', data);

                },
                error => console.log(error)
            )
        );
    }

    loadImportSources() {
        this.subscriptions.push(
            this.administrationService.getImportSources().subscribe(data => {
                    this.importSources = data;
                    console.log('importSources', data);

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
                modelToSubmit = this.importData;
                modelToSubmit.currentStep = 'C';
                modelToSubmit.endDate = new Date();
                modelToSubmit.documents = this.docs;
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

    validateForm(submitForm: boolean) {
        this.formSubmitted = submitForm;
        if (submitForm) {
            this.isUnitOfImportValid = (this.unitOfImportTable.length == 0) ? false : true;
            this.invalidCurrency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value == undefined ? true : false;
        } else {
            return true;
        }
        return this.evaluateImportForm.get('importAuthorizationEntity.seller').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.basisForImport').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.importer').valid &&
            // this.evaluateImportForm.get('importAuthorizationEntity.contract').valid &&
            // this.evaluateImportForm.get('importAuthorizationEntity.contractDate').valid &&
            // this.evaluateImportForm.get('importAuthorizationEntity.anexa').valid &&
            // this.evaluateImportForm.get('importAuthorizationEntity.anexaDate').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.specification').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.currency').value &&
            this.isUnitOfImportValid;
    }

    nextStep(submitForm: boolean) {
        // console.log('submitForm', submitForm);
        // console.log('this.evaluateImportForm.get(\'importAuthorizationEntity.currency\').value', this.evaluateImportForm.get('importAuthorizationEntity.currency').value);
        //
        // console.log('validateForm', this.validateForm(submitForm));
        // console.log('currency', this.evaluateImportForm.get('importAuthorizationEntity.currency').value);
        if (this.validateForm(submitForm)) {

            let currentStep = this.importData.currentStep;
            if (submitForm) {
                currentStep = 'AP';
            }

            // this.validateUnitOfTable(submitForm);

            let modelToSubmit: any = {};


            modelToSubmit = this.evaluateImportForm.value;
            if (this.importData.importAuthorizationEntity.id) {
                modelToSubmit.importAuthorizationEntity.id = this.importData.importAuthorizationEntity.id;
            }

            modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.unitOfImportTable;
            modelToSubmit.documents = this.docs;
            modelToSubmit.currentStep = currentStep;

            modelToSubmit.requestHistories.push({
                startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: currentStep
            });

            modelToSubmit.medicaments = [];
            modelToSubmit.importAuthorizationEntity.summ = this.authorizationSumm;

            // this.authorizationCurrency = this.evaluateImportForm.get('importAuthorizationEntity.contractCurrency').value;
            // console.log('this.authorizationCurrency', this.authorizationCurrency);
            // modelToSubmit.importAuthorizationEntity.currency = this.authorizationCurrency;
            // console.log('modelToSubmit', modelToSubmit);
            //
            // console.log('this.evaluateImportForm.valid', this.evaluateImportForm.valid);
            // console.log('this.activeLicenses', this.activeLicenses);

            console.log('modelToSubmit', modelToSubmit);
            if (this.activeLicenses !== null /*&& this.evaluateImportForm.valid*/ && this.docs !== null) {
                this.loadingService.show();

                this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                        console.log('addImportRequest(modelToSubmit).subscribe(data) ', data);
                        if (submitForm) {
                            this.router.navigate(['dashboard/']);
                        } else {
                            this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                                console.log('this.requestService.getImportRequest(params[\'id\'])', data);
                                console.log('regSubject', data.regSubject);
                                this.importData = data;
                                this.unitOfImportTable = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList;
                            }))}));
                        }
                        this.loadingService.hide();
                    }, error => {
                        // alert('Something went wrong while sending the model');
                        console.log('error: ', error);
                        this.loadingService.hide();
                    }
                ));

                this.formSubmitted = false;
            }
        } else {
            // console.log('this.evaluateImportForm.valid', this.evaluateImportForm.valid);
            // console.log('this.evaluateImportForm', this.evaluateImportForm);
            let element: any;

            if (this.unitOfImportTable.length == 0) {
                element = document.getElementById('codulMedicamentului');
            } else {
                element = document.getElementById('importAuthorizationEntity');
            }
            element.scrollIntoView();
        }
    }

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
