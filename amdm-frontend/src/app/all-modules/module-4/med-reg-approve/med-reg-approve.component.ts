import {Cerere} from './../../../models/cerere';
import {FormArray, Validators} from '@angular/forms';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
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
import {MedicamentService} from '../../../shared/service/medicament.service';
import {Utils} from 'angular-bootstrap-md/angular-bootstrap-md/utils/utils.class';
import {forEach} from '@angular/router/src/utils/collection';
import {ImportMedDialog} from '../dialog/import-med-dialog';
import {Timestamp} from 'rxjs/internal/operators/timestamp';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}


@Component({
    selector: 'app-MedRegApproveComponent',
    templateUrl: './med-reg-approve.component.html',
    styleUrls: ['./med-reg-approve.component.css']
})
export class MedRegApproveComponent implements OnInit {
    cereri: Cerere[]                      = [];
    // importer: any[];
    evaluateImportForm: FormGroup;
    // importTypeForm: FormGroup;
    currentDate: Date;
    futureDate: Date;
    file: any;
    generatedDocNrSeq: number;
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
    valutaList: any[];
    contractValutaList: any[];

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

    customsPointsList: any[]  = [];
    exchangeCurrencies: any[] = [];

    expirationDate: any[] = [];

    checked: boolean;

    activeLicenses: any;

    importDetailsList: any = [];

    authorizationSumm: any;
    // authorizationCurrency: any;


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
            'startDate': [{value: new Date(), disabled: true}],
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
                'seller': [null, Validators.required], // Tara si adresa lui e deja in baza
                'basisForImport': [],
                'importer': [null, Validators.required], // Tara si adresa lui e deja in baza
                'contract': [null, Validators.required],
                'contractDate': [null, Validators.required],
                'anexa': [null, Validators.required],
                'anexaDate': [null, Validators.required],
                'specification': [null, Validators.required],
                'specificationDate': [null, Validators.required],
                'conditionsAndSpecification': [''],
                'quantity': [Validators.required],
                'price': [Validators.required],
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
                'authorized': [],
                'customsPoints': [],
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

        this.authorizationSumm = 0;

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                    console.log('this.requestService.getImportRequest(params[\'id\'])', data);
                    this.importData = data;
                    this.docs       = data.documents;


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
                    this.evaluateImportForm.get('importAuthorizationEntity.importer').setValue(data.importAuthorizationEntity.importer);
                    this.evaluateImportForm.get('importAuthorizationEntity.basisForImport').setValue(data.importAuthorizationEntity.basisForImport);
                    this.evaluateImportForm.get('importAuthorizationEntity.conditionsAndSpecification').setValue(data.importAuthorizationEntity.conditionsAndSpecification);
                    this.evaluateImportForm.get('importAuthorizationEntity.authorizationsNumber').setValue(data.id + '/' + new Date().getFullYear() + '-AM');
                    this.evaluateImportForm.get('importAuthorizationEntity.customsNumber').setValue(data.importAuthorizationEntity.customsNumber);
                    this.evaluateImportForm.get('importAuthorizationEntity.customsDeclarationDate').setValue(new Date(data.importAuthorizationEntity.customsDeclarationDate));
                    this.evaluateImportForm.get('importAuthorizationEntity.contract').setValue(data.importAuthorizationEntity.contract);
                    this.evaluateImportForm.get('importAuthorizationEntity.currency').setValue(data.importAuthorizationEntity.currency);
                    this.evaluateImportForm.get('importAuthorizationEntity.contractDate').setValue(new Date(data.importAuthorizationEntity.contractDate));
                    this.evaluateImportForm.get('importAuthorizationEntity.anexa').setValue(data.importAuthorizationEntity.anexa);
                    this.evaluateImportForm.get('importAuthorizationEntity.anexaDate').setValue(new Date(data.importAuthorizationEntity.anexaDate));
                    this.evaluateImportForm.get('importAuthorizationEntity.specification').setValue(data.importAuthorizationEntity.specification);
                    this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').setValue(new Date(data.importAuthorizationEntity.specificationDate));

                    // this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').setValue(this.customsPointsPreviouslySelected());
                    var arr = [];
                    for (let c of this.importData.importAuthorizationEntity.nmCustomsPointsList) {
                        c.descrCode = c.description + ' - ' + c.code;
                        arr         = [...arr, c];
                    }
                    this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').setValue(arr);
                    console.log('this.importData.importAuthorizationEntity.nmCustomsPointsList', arr);

                    this.evaluateImportForm.get('startDate').disable();
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
                    this.evaluateImportForm.get('importAuthorizationEntity.currency').disable();
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
        this.loadCustomsPoints();

        console.log('importTypeForms.value', this.importTypeForms.value);
    }

    customsPointsPreviouslySelected() {
        let points: any[] = [];
        this.importData.importAuthorizationEntity.nmCustomsPointsList.forEach(item => points.push(item.description));
        console.log("points", points)
        return points;
    }


    viewDoc(document: any) {
        this.loadingService.show();

        let observable: Observable<any> = null;


        console.log('this.evaluateImportForm.getRawValue', this.evaluateImportForm.getRawValue());

        // let authorizationModel = this.evaluateImportForm.getRawValue();
        const authorizationModel = this.importData;
        // authorizationModel.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.importDetailsList;

        this.importDetailsList.forEach(item => {
            if (item.approved === true) {
                this.expirationDate.push(item.expirationDate);
                authorizationModel.importAuthorizationEntity.summ = authorizationModel.importAuthorizationEntity.summ + item.summ;
                console.log('modelToSubmit.importAuthorizationEntity.summ', authorizationModel.importAuthorizationEntity.summ);
            }
        });

        if (this.expirationDate.length > 0 && this.expirationDate.length !== null) {

            authorizationModel.importAuthorizationEntity.expirationDate = new Date(this.expirationDate.reduce(function (a, b) {
                return a < b ? a : b;
            }));

            if (this.importData.importAuthorizationEntity.medType === 2 && authorizationModel.importAuthorizationEntity.expirationDate > (new Date(this.currentDate.getDate() + 365))) {
                authorizationModel.importAuthorizationEntity.expirationDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 1));
            }
        }

        authorizationModel.importAuthorizationEntity.authorizationsNumber = this.importData.importAuthorizationEntity.id + '/' + new Date().getFullYear() + '-AM';
        authorizationModel.importAuthorizationEntity.nmCustomsPointsList  = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
        console.log('authorizationModel', authorizationModel);

        observable = this.requestService.viewImportAuthorization(authorizationModel);
        console.log('observable = this.requestService.viewImportAuthorization(authorizationModel) PASSED', observable);
        // observable = this.requestService.viewImportAuthorization(this.evaluateImportForm.getRawValue())


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

        if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved == false) {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
            this.authorizationSumm                                                                     = this.authorizationSumm + this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ;
            // this.authorizationCurrency                                                                 = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
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
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ             = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        // this.authorizationCurrency                                                                         = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
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
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.seller').valueChanges.subscribe(val => {
                if (val) {
                    this.sellerAddress = val.address + ', ' + val.country.description;
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').valueChanges.subscribe(val => {
                if (this.medicamentData == null && val) {
                    this.producerAddress = val.address + ', ' + val.country.description;
                    // console.log("producerAddress",this.producerAddress)
                }
            }));
            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
                if (val) {
                    this.importerAddress = val.legalAddress /*+ ", " + val.country.description*/;
                }
            }));
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


    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable') as FormArray;
    }


    showunitOfImport(unitOfImport: any, i: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus    = true;
        dialogConfig2.hasBackdrop  = true;

        // dialogConfig2.height = '900px';
        dialogConfig2.width = '850px';

        dialogConfig2.data             = unitOfImport;
        dialogConfig2.data.medtType    = this.importData.importAuthorizationEntity.medType;
        dialogConfig2.data.currentStep = this.importData.currentStep;

        const dialogRef = this.dialog.open(ImportMedDialog, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if (result && result[0] === true) {
                this.dialogSetApproved(i, result[1]);
                console.log('dialog result:', result);
            }
            if (result && result[0] === false) {
                this.dialogSetReject(i, result[1]);
            }
        });
    }

    currencyChanged($event) {
        this.exchangeCurrencies = $event;
        // console.log("exchangeCurrencies", this.exchangeCurrencies)
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
                    this.valutaList         = data;
                    this.contractValutaList = data;

                },
                error => console.log(error)
            )
        );
    }

    loadCustomsPoints() {
        this.subscriptions.push(
            this.administrationService.getCustomsPoints().subscribe(data => {
                    this.customsPointsList = data;
                    this.customsPointsList.forEach(e => e.descrCode = e.description + ' - ' + e.code);
                    console.log(data);

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
            // console.log('result', result);
            if (result) {
                this.loadingService.show();
                const modelToSubmit                                                          = this.evaluateImportForm.getRawValue();
                modelToSubmit.currentStep                                                    = 'C';
                modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.unitOfImportTable;
                modelToSubmit.endDate                                                        = new Date();
                modelToSubmit.documents                                                      = this.docs;
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

    showCustomsPoints() {
        console.log("customsPoints.value: ",this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value);
        console.log("customsPoints.valid: ", this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').valid)
    }


    nextStep(aprrovedOrNot: boolean, submitForm: boolean) {

        let currentStep = this.importData.currentStep;
        if (submitForm) {
            currentStep = 'F';
        }
        this.formSubmitted = true;
        let customsPoints = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
        if (customsPoints.length > 0) {


            let modelToSubmit: any = {};
            this.loadingService.show();

            modelToSubmit                                               = this.importData;
            modelToSubmit.endDate                                       = new Date();
            modelToSubmit.importAuthorizationEntity.authorized          = aprrovedOrNot;
            modelToSubmit.importAuthorizationEntity.nmCustomsPointsList = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
            modelToSubmit.currentStep                                   = currentStep;


            modelToSubmit.importAuthorizationEntity.authorizationsNumber = this.importData.importAuthorizationEntity.id + '/' + new Date().getFullYear() + '-AM';
            modelToSubmit.requestHistories.push({
                startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: currentStep
            });


            // modelToSubmit.importAuthorizationEntity.currency = this.authorizationCurrency;
            console.log('this.evaluateImportForm.value', this.evaluateImportForm.value);
            //=============


            modelToSubmit.medicaments = [];

            //=============
            modelToSubmit.importAuthorizationEntity.summ = 0;
            this.importDetailsList.forEach(item => {
                if (item.approved === true) {
                    this.expirationDate.push(item.expirationDate);
                    modelToSubmit.importAuthorizationEntity.summ = modelToSubmit.importAuthorizationEntity.summ + item.summ;
                    console.log('modelToSubmit.importAuthorizationEntity.summ');
                }
            });

            modelToSubmit.importAuthorizationEntity.expirationDate = new Date(this.expirationDate.reduce(function (a, b) {
                return a < b ? a : b;
            }));
            if (this.importData.importAuthorizationEntity.medType === 2 && modelToSubmit.importAuthorizationEntity.expirationDate > (new Date(this.currentDate.getDate() + 365))) {
                modelToSubmit.importAuthorizationEntity.expirationDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 1));
            }

            // if (this.importData.importAuthorizationEntity.medType === 3 || this.importData.importAuthorizationEntity.medType === 4) {
            //     modelToSubmit.importAuthorizationEntity.expirationDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() + 1));
            // }

            console.log('modelToSubmit', modelToSubmit);
            // this.subscriptions.push(this.requestService.addImportRequest(this.importData).subscribe(data => {
            this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                    console.log('addImportRequest(modelToSubmit).subscribe(data) ', data);
                    this.loadingService.hide();
                    if (submitForm) {
                        this.router.navigate(['dashboard/homepage']);
                    }
                }, error => {
                    alert('Something went wrong while sending the model');
                    if (submitForm) {
                        this.router.navigate(['dashboard/homepage']);
                    }
                    console.log('error: ', error);
                    this.loadingService.hide();
                }
            ));

            this.formSubmitted = false;
        }
        else {console.log("customsPoints", this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').valid)}
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
