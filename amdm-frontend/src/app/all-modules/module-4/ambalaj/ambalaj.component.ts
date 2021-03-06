import {Cerere} from './../../../models/cerere';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../shared/service/administration.service';
// import {debounceTime, distinctUntilChanged, filter, map, startWith, tap} from "rxjs/operators";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {saveAs} from 'file-saver';
import {Document} from '../../../models/document';
import {RequestService} from '../../../shared/service/request.service';
import {Subject} from 'rxjs/index';
import {LoaderService} from '../../../shared/service/loader.service';
import {AuthService} from '../../../shared/service/authetication.service';
import {ImportMedDialogComponent} from '../dialog/import-med-dialog.component';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}


@Component({
    selector: 'app-ambalaj',
    templateUrl: './ambalaj.component.html',
    styleUrls: ['./ambalaj.component.css']
})
export class AmbalajComponent implements OnInit,OnDestroy {
    cereri: Cerere[] = [];
    // importer: any[];
    evaluateImportForm: FormGroup;
    // importTypeForm: FormGroup;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    docs: Document [] = [];
    unitOfImportTable: any[] = [];
    manufacturersRfPr: Observable<any[]>;
    loadingManufacturerRfPr = false;
    manufacturerInputsRfPr = new Subject<string>();
    importer: Observable<any[]>;
    loadingCompany = false;
    companyInputs = new Subject<string>();
    sellerAddress: any;
    importerAddress: any;
    producerAddress: any;
    solicitantCompanyList: Observable<any[]>;
    unitSumm: any;
    unitOfImportPressed: boolean;
    invalidCurrency = false;
    formModel: any;
    valutaList: Observable<any[]>;
    contractValutaList: any[];
    importData: any;
    atcCodes: Observable<any[]>;
    loadingAtcCodes = false;
    atcCodesInputs = new Subject<string>();
    customsCodes: Observable<any[]>;
    loadingcustomsCodes = false;
    customsCodesInputs = new Subject<string>();
    authorizationSumm: any;
    authorizationCurrency: any;
    currentCurrency: any;
    isUnitOfImportValid = false;
    maxDate = new Date();
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                public dialog: MatDialog,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                private administrationService: AdministrationService) {

        this.evaluateImportForm = fb.group({
            'id': [''],
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['E'],
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

            'importAuthorizationEntity': fb.group({
                'id': [],
                'applicationDate': [new Date()],
                'applicant': ['', Validators.required],
                'seller': [null, Validators.required],
                'basisForImport': [null, Validators.required],
                'importer': [null, Validators.required],
                'contract': [null],
                'contractDate': [null],
                'anexa': [null],
                'anexaDate': [null],
                'specification': [null, Validators.required],
                'specificationDate': [null, Validators.required],
                'conditionsAndSpecification': [''],
                'quantity': [null, Validators.required],
                'price': [null, Validators.required],
                'currency': [Validators.required],
                'summ': [],
                'producer_id': [null],
                'stuff_type_id': [null],
                'expiration_date': [null],

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
                    currency: [{value: null, disabled: true}],
                    summ: [null, Validators.required],
                    producer: [null, Validators.required],
                    expirationDate: [null],
                    atcCode: [null, Validators.required],
                }),
            }),
        });


    }

    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable') as FormArray;
    }

    ngOnInit() {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                    console.log('Import data', data);
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
                    if (this.importData.importAuthorizationEntity.medType === 4) {

                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setErrors(null);
                    }
                    if (data.importAuthorizationEntity.sgeapNumber) {
                        this.evaluateImportForm.get('importAuthorizationEntity.sgeapNumber').setValue(data.importAuthorizationEntity.sgeapNumber);
                    }
                    if (data.importAuthorizationEntity.sgeapDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.sgeapDate').setValue(new Date(data.importAuthorizationEntity.sgeapDate));
                    }


                },
                error => console.log(error)
            ));
        }));

        this.currentDate = new Date();
        this.sellerAddress = '';
        this.producerAddress = '';
        this.importerAddress = '';
        this.formSubmitted = false;
        this.loadEconomicAgents();
        this.loadManufacturersRfPr();
        this.onChanges();
        this.loadCurrenciesShort();
        this.loadCustomsCodes();
        this.loadATCCodes();
        this.authorizationSumm = 0;
    }

    onChanges(): void {

        this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.currency').valueChanges.subscribe(value => {
            if (value) {
                this.invalidCurrency = false;
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(value);
            } else {
                this.invalidCurrency = true;
            }

            // if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value == undefined) {
            //     this.invalidCurrency = true;
            // } else this.invalidCurrency = false;
        }));


        if (this.evaluateImportForm.get('importAuthorizationEntity')) {
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.seller').valueChanges.subscribe(val => {
                if (val && val.address !== null && val.country !== null) {
                    this.sellerAddress = val.address + ', ' + val.country.description;
                } else {
                    this.sellerAddress = '';
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').valueChanges.subscribe(val => {
                // console.log("val",val)
                if (val && val.address !== null && val.country !== null) {
                    this.producerAddress = val.address + ', ' + val.country.description;
                    // console.log("producerAddress",this.producerAddress)
                } else {
                    this.producerAddress = '';
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
                if (val && val.address !== null && val.country !== null) {
                    this.importerAddress = val.legalAddress /*+ ", " + val.country.description*/;
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').valueChanges.subscribe(val => {
                if (val) {
                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm.toFixed(2));
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').valueChanges.subscribe(val => {
                if (val) {

                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm.toFixed(2));
                }
            }));
        }
    }

    showConfirm() {
        let showPopUp = false;
//         if (this.evaluateImportForm.get('importAuthorizationEntity.currency').touched) {
//             showPopUp = true;
//         } else
//             if (this.importData.importAuthorizationEntity.currency) {
//             showPopUp = true;
//         } else if (this.unitOfImportTable.length > 0) {
//             showPopUp = true;
// }
        if (this.unitOfImportTable.length > 0 && this.evaluateImportForm.get('importAuthorizationEntity.currency').touched) {
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
        this.unitOfImportPressed = true;

        if (this.importData.importAuthorizationEntity.medType === 4) {
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setErrors(null);
        }

        if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value == undefined) {
            this.invalidCurrency = true;
        } else {
            this.invalidCurrency = false;
        }

        console.log('unitOfImportTable', this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable'));
        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid && this.evaluateImportForm.get('importAuthorizationEntity.currency').value) {
            this.unitOfImportPressed = false;

            if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').invalid || this.invalidCurrency) {
                console.log('unitOfImportTable', this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').invalid);
                console.log('this.invalidCurrency: ', this.invalidCurrency);
                return;
            }

            this.unitOfImportTable.push({

                customsCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').value,
                name: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').value,
                quantity: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value,
                price: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
                currency: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').value,
                summ: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
                producer: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').value,
                atcCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').value,
                expirationDate: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').value
            });

            this.authorizationSumm = this.authorizationSumm + this.unitSumm;
            this.authorizationCurrency = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').value;

            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').reset();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').reset();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').reset();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').reset();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').reset();
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').reset();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').reset();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').reset();
            this.producerAddress = null;
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').reset();
            if (this.importData.importAuthorizationEntity.medType === 3) {
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').reset();
                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setErrors(null);
            }


            console.log('this.unitOfImportTable', this.unitOfImportTable);
        }
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
            console.log('result', result);
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
                },
                error => console.log(error)
            )
        );
    }

    getCurrentCurrency() {
        this.currentCurrency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value;
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
            this.evaluateImportForm.get('importAuthorizationEntity.specification').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').valid &&
            this.evaluateImportForm.get('importAuthorizationEntity.currency').value &&
            this.isUnitOfImportValid;
    }

    nextStep(submitForm: boolean) {

        this.formSubmitted = true;

        if (this.validateForm(submitForm)) {

            let currentStep = this.importData.currentStep;
            if (submitForm) {
                currentStep = 'AP';
            }

            let modelToSubmit: any = {};

            modelToSubmit = this.evaluateImportForm.value;
            if (this.importData.importAuthorizationEntity.id) {
                modelToSubmit.importAuthorizationEntity.id = this.importData.importAuthorizationEntity.id;
            }

            modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.unitOfImportTable;
            // modelToSubmit.endDate = new Date();

            modelToSubmit.documents = this.docs;
            modelToSubmit.currentStep = currentStep;

            modelToSubmit.requestHistories.push({
                startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: currentStep
            });

            console.log('this.evaluateImportForm.value', this.evaluateImportForm.value);
            modelToSubmit.importAuthorizationEntity.summ = this.authorizationSumm;
            modelToSubmit.importAuthorizationEntity.currency = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').value;

            console.log('modelToSubmit', modelToSubmit);
            if (/*&& this.evaluateImportForm.valid && */ this.docs !== null) {
                this.loadingService.show();
                this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                        console.log('saved Registration Request', data);
                        this.loadingService.hide();
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
                    }, error => {
                        alert('Something went wrong while sending the model');
                        console.log('error: ', error);
                        this.loadingService.hide();
                    }
                ));

                this.formSubmitted = false;
            }
        } else {
            console.log('this.evaluateImportForm.valid', this.evaluateImportForm.valid);
            console.log('this.evaluateImportForm', this.evaluateImportForm);
            let element: any;

            if (!this.evaluateImportForm.get('importAuthorizationEntity.currency').value) {
                element = document.getElementById('contractCurrency');
            } else if (this.unitOfImportTable.length == 0) {
                element = document.getElementById('unitOfImportTable');
            } else {
                element = document.getElementById('importAuthorizationEntity');
            }

            element.scrollIntoView();
            // let element = document.getElementById("importAuthorizationEntity");
            // element.scrollIntoView();

        }
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
