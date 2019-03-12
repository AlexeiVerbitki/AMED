// import {Cerere} from './../../../models/cerere';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
// import {AdministrationService} from '../../../shared/service/administration.service';
// import {debounceTime, distinctUntilChanged, filter, map, startWith, tap} from "rxjs/operators";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
// import {ConfirmationDialogComponent} from '../../../dialog/confirmation-dialog.component';
import {saveAs} from 'file-saver';
// import {Document} from '../../../models/document';
// import {RequestService} from '../../../shared/service/request.service';
import {Subject} from 'rxjs/index';
import {Cerere} from "../../../../models/cerere";
import {ConfirmationDialogComponent} from "../../../../dialog/confirmation-dialog.component";
import {RequestService} from "../../../../shared/service/request.service";
import {LoaderService} from "../../../../shared/service/loader.service";
import {MedicamentService} from "../../../../shared/service/medicament.service";
import {NavbarTitleService} from "../../../../shared/service/navbar-title.service";
import {AdministrationService} from "../../../../shared/service/administration.service";
import {AuthService} from "../../../../shared/service/authetication.service";
import {ImportMedDialogComponent} from "../../dialog/import-med-dialog.component";
import {ViewAuthorizationDialog} from "../view-authorization-dialog/view-authorization-dialog";
// import {LoaderService} from '../../../shared/service/loader.service';
// import {AuthService} from '../../../shared/service/authetication.service';
// import {MedicamentService} from '../../../shared/service/medicament.service';
// import {ViewAuthorizationDialog} from '../dialog/import-med-dialog.component';
// import {NavbarTitleService} from '../../../shared/service/navbar-title.service';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}


@Component({
    selector: 'app-view-authorization',
    templateUrl: './view-authorization.component.html',
    styleUrls: ['./view-authorization.component.css']
})
export class ViewAuthorizationComponent implements OnInit, OnDestroy {
    cereri: Cerere[] = [];
    evaluateImportForm: FormGroup;
    currentDate: Date;
    futureDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    addMedicamentClicked: boolean;
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
    codeAmed: any;
    solicitantCompanyList: Observable<any[]>;
    unitSumm: any;
    formModel: any;
    valutaList: any[];
    contractValutaList: any[];
    importData: any = {};
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
    customsPointsList: any[] = [];
    exchangeCurrencies: any[] = [];
    expirationDate: any[] = [];
    checked: boolean;
    activeLicenses: any;
    importDetailsList: any = [];
    authorizationSumm: any;
    authorizationNumber: string;
    authorizationClicked = false;
    showClickAuthorizationError = false;
    atLeastOneApproved: boolean;
    private subscriptions: Subscription[] = [];
    requestData: any;

    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                public dialog: MatDialog,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                public medicamentService: MedicamentService,
                private administrationService: AdministrationService,
                private navbarTitleService: NavbarTitleService) {
    }

    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable') as FormArray;
    }

    ngOnInit() {
        this.navbarTitleService.showTitleMsg('Aprobare autorizației');
        this.evaluateImportForm = this.fb.group({
            'id': [{value: '', disabled: true}],
            'requestNumber': [{value: null, disabled: true}],
            'startDate': [{value: new Date(), disabled: true}],
            'currentStep': ['AP'],
            // 'company': [''],
            'company': [''],
            'initiator': [{value: null, disabled: true}],
            'assignedUser': [{value: null, disabled: true}],
            'data': {disabled: true, value: null},
            'importType': [{value: null, disabled: true}],
            'authExpirationDate': [{value: null, disabled: true}],
            'type':
                this.fb.group({
                    'id': ['']
                }),

            'requestHistories': [],
            'medicaments': [],

            'importAuthorizationEntity': this.fb.group({
                'id': [{value: null, disabled: true}],
                'applicationDate': [new Date()],
                'applicant': [{value: '', disabled: true}],
                'seller': [{value: null, disabled: true}], // Tara si adresa lui e deja in baza
                'basisForImport': [],
                'importer': [{value: null, disabled: true}], // Tara si adresa lui e deja in baza
                'contract': [{value: null, disabled: true}],
                'contractDate': [{value: null, disabled: true}],
                'anexa': [{value: null, disabled: true}],
                'anexaDate': [{value: null, disabled: true}],
                'specification': [{value: null, disabled: true}],
                'specificationDate': [{value: null, disabled: true}],
                'conditionsAndSpecification': [{value: null, disabled: true}],
                'quantity': [{value: null, disabled: true}],
                'price': [{value: null, disabled: true}],
                'currency': [{value: null, disabled: true}],
                'summ': [{value: null, disabled: true}],
                'producer_id': [{value: null, disabled: true}], // to be deleted
                'stuff_type_id': [{value: null, disabled: true}], // to delete
                'expiration_date': [{value: null, disabled: true}],
                'customsNumber': [{value: null, disabled: true}],
                'customsDeclarationDate': [{value: null, disabled: true}],
                'authorizationsNumber': [{value: null, disabled: true}], // inca nu exista la pasul acesta
                'medType': [{value: '', disabled: true}],
                'importAuthorizationDetailsEntityList': [{value: null, disabled: true}],
                'authorized': [{value: null, disabled: true}],
                'customsPoints': [{value: null, disabled: true}],
                'unitOfImportTable': this.fb.group({
                    customsCode: [{value: null, disabled: true}],
                    name: [{value: '', disabled: true}],
                    quantity: [{value: null, disabled: true}],
                    price: [{value: null, disabled: true}],
                    currency: [{value: null, disabled: true}],
                    summ: [{value: null, disabled: true}],
                    producer: [{value: null, disabled: true}],
                    expirationDate: [{value: null, disabled: true}],
                    atcCode: [{value: null, disabled: true}],
                    medicament: [{value: null, disabled: true}],
                    pharmaceuticalForm: [{value: null, disabled: true}],
                    dose: [{value: null, disabled: true}],
                    registrationRmNumber: [{value: null, disabled: true}],
                    unitsOfMeasurement: [{value: null, disabled: true}],
                    registrationRmDate: [{value: null, disabled: true}],
                    internationalMedicamentName: [{value: null, disabled: true}]
                }),
            }),
        });

        this.authorizationSumm = 0;

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.requestService.getAuthorizationByAuth(params['id']).subscribe(importData => {
                console.log('importAuthData', importData);

                this.requestService.getRequestByImportId(importData.id).subscribe(requestData => {
                    console.log("this.requestService.getImportRequest(importData.id)", requestData)
                    this.requestData = requestData;


        //         }, error => {
        //             console.log("this.requestService.getImportRequest(rowDetails.id) errro");
        //         });
        //
        //     })
        // }));


        // this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
        //     this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(requestData => {
        //             console.log('this.requestService.getImportRequest(params[\'id\'])', requestData);
                    if (requestData) {
                        this.importData = requestData;
                    }
                    this.importData.importAuthorizationEntity = importData;
                    for (let item of this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList ){
                        if (item.medicament){
                            item.name = item.medicament.name;

                            if (item.medicament.atcCode) {
                                item.atcCode = {};
                                item.atcCode.code = item.medicament.atcCode;
                            }

                            item.dose = item.medicament.dose;
                            item.unitsOfMeasurement = item.medicament.division;
                            item.producer = item.medicament.manufactures[0].manufacture;
                            item.expirationDate = item.medicament.expirationDate;

                            if (item.medicament.customsCode) {
                                item.customsCode = {};
                                item.customsCode = item.medicament.customsCode;
                            }

                            if (item.medicament.currency) {
                                item.currency = {};
                                item.currency = item.medicament.currency;
                            }


                        }
                    }
                    // this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList.forEach(item -> {
                    //     // if (item.medicament){
                    //     //     item.name = item.medicament.name;
                    //     //     item.atcCode = item.medicament.atcCode;
                    //     //     item.dose = item.medicament.dose;
                    //     //     item.producer = item.medicament.manufactures[0];
                    //     // }
                    //     console.log('', item)
                    // });
                    console.log('this.importData',this.importData);

        //         }, error => {
        //             console.log("this.requestService.getImportRequest(rowDetails.id) errro");
        //         });
        //
        //     })
        // }));
                    this.docs = this.importData.documents;

                    this.importDetailsList = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList;

                    if (this.importData.importAuthorizationEntity.importer && this.importData.importAuthorizationEntity.importer.idno) {
                        this.requestService.getActiveLicenses(this.importData.importAuthorizationEntity.importer.idno).subscribe(data1 => {
                            // console.log('this.requestService.getActiveLicenses(this.importData.applicant.idno).subscribe', data1);
                            this.activeLicenses = data1;
                            // console.log('this.activeLicenses', this.activeLicenses);
                        });
                    }

                    this.importDetailsList.forEach(item => {
                        item.approved == null ? item.approved = false : (item.approved = item.approved);
                        // this.expirationDate.push(item.expirationDate);
                        if (item.approved == true) {
                            this.authorizationSumm = this.authorizationSumm + item.summ;
                        }
                    });

                    if (this.importData)
                        {
                        if (this.importData.id)                                                    {this.evaluateImportForm.get('id').setValue(this.importData.id);}
                        if (this.importData.requestNumber)                                         {this.evaluateImportForm.get('requestNumber').setValue(this.importData.requestNumber);}
                        if (this.importData.startDate)                                             {this.evaluateImportForm.get('startDate').setValue(new Date(this.importData.startDate));}
                        if (this.importData.initiator)                                             {this.evaluateImportForm.get('initiator').setValue(this.importData.initiator);}
                        if (this.importData.assignedUser)                                          {this.evaluateImportForm.get('assignedUser').setValue(this.importData.assignedUser);}
                        if (this.importData.company)                                               {this.evaluateImportForm.get('company').setValue(this.importData.company);}
                        if (this.importData.type && this.importData.type.id)                       {this.evaluateImportForm.get('type.id').setValue(this.importData.type.id);}
                        if (this.importData.requestHistories)                                      {this.evaluateImportForm.get('requestHistories').setValue(this.importData.requestHistories);}
                        if (this.importData.company)                                               {this.evaluateImportForm.get('importAuthorizationEntity.applicant').setValue(this.importData.company);}


                        if(this.importData.importAuthorizationEntity)
                        {
                            if (this.importData.importAuthorizationEntity.expirationDate)              {this.evaluateImportForm.get('authExpirationDate').setValue(new Date (this.importData.importAuthorizationEntity.expirationDate));}
                            if (this.importData.importAuthorizationEntity.medType)                     {this.evaluateImportForm.get('importAuthorizationEntity.medType').setValue(this.importData.importAuthorizationEntity.medType);}
                            if (this.importData.importAuthorizationEntity.seller)                      {this.evaluateImportForm.get('importAuthorizationEntity.seller').setValue(this.importData.importAuthorizationEntity.seller);}
                            if (this.importData.importAuthorizationEntity.importer)                    {this.evaluateImportForm.get('importAuthorizationEntity.importer').setValue(this.importData.importAuthorizationEntity.importer);}
                            if (this.importData.importAuthorizationEntity.basisForImport)              {this.evaluateImportForm.get('importAuthorizationEntity.basisForImport').setValue(this.importData.importAuthorizationEntity.basisForImport);}
                            if (this.importData.importAuthorizationEntity.conditionsAndSpecification)  {this.evaluateImportForm.get('importAuthorizationEntity.conditionsAndSpecification').setValue(this.importData.importAuthorizationEntity.conditionsAndSpecification);}
                            if (this.importData.importAuthorizationEntity.authorizationsNumber)        {this.evaluateImportForm.get('importAuthorizationEntity.authorizationsNumber').setValue(this.importData.importAuthorizationEntity.authorizationsNumber);}
                            if (this.importData.importAuthorizationEntity.customsNumber)               {this.evaluateImportForm.get('importAuthorizationEntity.customsNumber').setValue(this.importData.importAuthorizationEntity.customsNumber);}
                            if (this.importData.importAuthorizationEntity.customsDeclarationDate)      {this.evaluateImportForm.get('importAuthorizationEntity.customsDeclarationDate').setValue(new Date(this.importData.importAuthorizationEntity.customsDeclarationDate));}
                            if (this.importData.importAuthorizationEntity.contract)                    {this.evaluateImportForm.get('importAuthorizationEntity.contract').setValue(this.importData.importAuthorizationEntity.contract);}
                            if (this.importData.importAuthorizationEntity.currency)                    {this.evaluateImportForm.get('importAuthorizationEntity.currency').setValue(this.importData.importAuthorizationEntity.currency);}
                            if (this.importData.importAuthorizationEntity.contractDate)                {this.evaluateImportForm.get('importAuthorizationEntity.contractDate').setValue(new Date(this.importData.importAuthorizationEntity.contractDate));}
                            if (this.importData.importAuthorizationEntity.anexa)                       {this.evaluateImportForm.get('importAuthorizationEntity.anexa').setValue(this.importData.importAuthorizationEntity.anexa);}
                            if (this.importData.importAuthorizationEntity.anexaDate)                   {this.evaluateImportForm.get('importAuthorizationEntity.anexaDate').setValue(new Date(this.importData.importAuthorizationEntity.anexaDate));}
                            if (this.importData.importAuthorizationEntity.specification)               {this.evaluateImportForm.get('importAuthorizationEntity.specification').setValue(this.importData.importAuthorizationEntity.specification);}
                            if (this.importData.importAuthorizationEntity.specificationDate)           {this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').setValue(new Date(this.importData.importAuthorizationEntity.specificationDate));}

                        let arr = [];
                        for (const c of this.importData.importAuthorizationEntity.nmCustomsPointsList) {
                            c.descrCode = c.description + ' - ' + c.code;
                            arr = [...arr, c];
                        }
                        this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').setValue(arr);
                        }
                    }


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

                    if (this.importData.importAuthorizationEntity.medType === 2) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setErrors(null);
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setErrors(null);
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setErrors(null);
                    }

                    this.authorizationNumber = this.importData.importAuthorizationEntity.id + '/' + new Date().getFullYear() + '-AM';
                }, error => {
                    console.log("this.requestService.getImportRequest(rowDetails.id) errro");
                });

            })
        }));


        this.checked = false;
        this.currentDate = new Date();
        this.futureDate = new Date();
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
        this.loadCustomsPoints();

    }

    customsPointsPreviouslySelected() {
        const points: any[] = [];
        this.importData.importAuthorizationEntity.nmCustomsPointsList.forEach(item => points.push(item.description));
        // console.log('points', points);
        return points;
    }

    calculateExpirationDate() {
        const authorizationModel = this.importData;
        let expirationDate: any;
        if (this.activeLicenses && this.activeLicenses.expirationDate) {
            this.expirationDate.push(this.activeLicenses.expirationDate);
        }
        this.importDetailsList.forEach(item => {
            if (item.approved === true && item.expirationDate) {
                this.expirationDate.push(item.expirationDate);
                authorizationModel.importAuthorizationEntity.summ = authorizationModel.importAuthorizationEntity.summ + item.summ;
            }
        });

        if (this.expirationDate != null && this.expirationDate.length > 0) {

            const closestExpirationDate = this.expirationDate.reduce(function (a, b) {
                return a < b ? a : b;
            });
            expirationDate = closestExpirationDate;

            const datePlusYear = new Date();
            datePlusYear.setFullYear(datePlusYear.getFullYear() + 1);

            if (this.importData.importAuthorizationEntity.medType === 2 && new Date(closestExpirationDate) > datePlusYear) {
                expirationDate = datePlusYear;
            }
        }
        return expirationDate;
    }

    viewDoc(document: string) {
        this.authorizationClicked = true;
        this.showClickAuthorizationError = false;
        this.loadingService.show();
        this.expirationDate = [];

        let observable: Observable<any> = null;

        const authorizationModel = this.importData;
        authorizationModel.importAuthorizationEntity.nmCustomsPointsList = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;

        authorizationModel.importAuthorizationEntity.expirationDate = this.calculateExpirationDate();

        authorizationModel.importAuthorizationEntity.authorizationsNumber = this.importData.importAuthorizationEntity.id + '/' + new Date().getFullYear() + '-AM';
        authorizationModel.importAuthorizationEntity.nmCustomsPointsList = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
        // console.log('authorizationModel', authorizationModel);

        observable = this.requestService.viewImportAuthorization(authorizationModel);
        if (document == 'specification') {
            observable = this.requestService.viewImportAuthorizationSpecification(authorizationModel);
        }

        this.subscriptions.push(observable.subscribe(data => {
                console.log('observable.subscribe(data =>', data);
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                this.loadingService.hide();
            }, error => {
                console.log('window.open(fileURL) ERROR');
                this.loadingService.hide();
            })
        );
    }

    setApproved(i: any) {

        if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved == false) {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
            this.authorizationSumm = this.authorizationSumm + this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ;
            // this.authorizationCurrency  = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
            // console.log('this.authorizationSumm', this.authorizationSumm);
        } else {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false;
            this.authorizationSumm = this.authorizationSumm - this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ;
            // console.log('this.authorizationSumm', this.authorizationSumm);
        }

        // console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']',
        // this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
    }

    dialogSetApproved(i: any, approvedQuantity: any) {
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approvedQuantity = approvedQuantity;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ =
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        // this.authorizationCurrency
        // = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
        // console.log("this.authorizationSumm", this.authorizationSumm)
        // console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']',
        // this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i]);
        // }
    }

    dialogSetReject(i: any, approvedQuantity: any) {
        // if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved === true) {
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approvedQuantity = 0;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ = 0;
        // this.authorizationSumm = this.authorizationSumm - this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        // console.log("this.authorizationSumm", this.authorizationSumm)
        // console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']',
        // this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
        // }
    }

    onChanges(): void {
        if (this.evaluateImportForm.get('importAuthorizationEntity')) {

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').valueChanges.subscribe(val => {
                if (val) {
                    this.medicamentData = val;
                    this.codeAmed = val.code;
                    // console.log('importAuthorizationEntity.unitOfImportTable.medicament', this.medicamentData);

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
                    // console.log('val.registrationDate', val.registrationDate);
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


    showunitOfImport(unitOfImport: any, i: any) {
        const dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        // dialogConfig2.height = '900px';
        dialogConfig2.width = '850px';

        dialogConfig2.data = unitOfImport;
        dialogConfig2.data.medtType = this.importData.importAuthorizationEntity.medType;
        dialogConfig2.data.currentStep = this.importData.currentStep;

        const dialogRef = this.dialog.open(ViewAuthorizationDialog, dialogConfig2);

        dialogRef.afterClosed().subscribe(result => {
            // console.log('result', result);
            if (result && result[0] === true) {
                this.dialogSetApproved(i, result[1]);
                this.atLeastOneApproved = true;
                console.log('dialog result:', result);
            }
            if (result && result[0] === false) {
                this.dialogSetReject(i, result[1]);
                this.expirationDate = [];
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
                    this.valutaList = data;
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
                    // console.log(data);

                },
                error => console.log(error)
            )
        );
    }

    interruptProcess() {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(ă) că doriți să intrerupeți procesul ?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            // console.log('result', result);
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
                // modelToSubmit.documents = this.docs;
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
        console.log('customsPoints.value: ', this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value);
        console.log('customsPoints.valid: ', this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').valid);
    }


    denyAuthorization() {
        const dialogRef2 = this.dialogConfirmation.open(ConfirmationDialogComponent, {
            data: {
                message: 'Sunteti sigur(ă) că respingeți autorizația?',
                confirm: false
            }
        });

        dialogRef2.afterClosed().subscribe(result => {
            if (result) {
                this.nextStep(false, true);
            }
        });
    }

    approveAll() {
        this.expirationDate = [];
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList.forEach(item => {
            item.approved = true;
            item.approvedQuantity = item.quantity;
            this.atLeastOneApproved = true;
        });
    }

    nextStep(aprrovedOrNot: boolean, submitForm: boolean) {

        this.atLeastOneApproved = this.importDetailsList.filter(x => x.approved).length > 0;

        // console.log('unitOfImportTable', this.unitOfImportTable);
        let currentStep = this.importData.currentStep;
        if (submitForm) {
            currentStep = 'F';

        }

        this.formSubmitted = submitForm;
        const customsPoints = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
        if (submitForm && (customsPoints.length == 0 || !this.authorizationClicked)) {
            this.showClickAuthorizationError = true;
            return;
        }

        let modelToSubmit: any = {};
        this.loadingService.show();

        modelToSubmit = this.importData;
        modelToSubmit.endDate = submitForm ? new Date() : null;
        modelToSubmit.importAuthorizationEntity.authorized = aprrovedOrNot;
        modelToSubmit.importAuthorizationEntity.nmCustomsPointsList = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
        modelToSubmit.currentStep = currentStep;

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

        modelToSubmit.importAuthorizationEntity.expirationDate = this.calculateExpirationDate();
        this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                // console.log('addImportRequest(modelToSubmit).subscribe(data) ', data);
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

    ngOnDestroy(): void {
        this.navbarTitleService.showTitleMsg('');
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
