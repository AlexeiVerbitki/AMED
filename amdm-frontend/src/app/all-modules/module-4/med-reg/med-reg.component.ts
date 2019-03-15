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
                private errorHandlerService: SuccessOrErrorHandlerService) {
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
                    internationalMedicamentName: [null, Validators.required]
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
                        }
                    }

                    if (data.importAuthorizationEntity.medType === 2) {
                        if (data.importAuthorizationEntity.medType) {
                            // this.evaluateImportForm.get('type.id').setValue(16);
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
                // console.log('medicament value', val);
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
                        priceInContractCurrency = this.medicamentPrice.priceMdl / exchangeCurrency.value;
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
        // console.log(this.evaluateImportForm.get('importAuthorizationEntity.unitspliceOfImportTable.customsCode'));
        if (invalidMedicament || invalidQty || invalidPrice || invalidCustomsCode || this.invalidPrice || this.invalidCurrency) {
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
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').reset();


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
                        // console.log('addImportRequest(modelToSubmit).subscribe(data) ', data);
                        this.loadingService.hide();
                        if (submitForm) {
                            this.router.navigate(['dashboard/']);
                        }
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
