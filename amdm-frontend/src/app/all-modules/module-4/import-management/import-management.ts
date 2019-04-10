import {Cerere} from './../../../models/cerere';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {ImportManagementDialog} from './import-management-dialog/import-management-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SuccessOrErrorHandlerService} from '../../../shared/service/success-or-error-handler.service';
import * as XLSX from "xlsx";

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
export class ImportManagement implements OnInit, OnDestroy {
    cereri: Cerere[] = [];
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
    // customsPointsList: Observable<any[]>;
    customsPointsList: any[] = [];
    generatedDocNrSeq: number;
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
    expirationDate: any[] = [];
    expirationDatePicker: any;
    checked: boolean;
    activeLicenses: any;
    importDetailsList: any = [];
    authorizationSumm: any;
    authorizationCurrency: any;
    dialogResult: any;
    invoice: any = {};
    invoiceDetails: any = [];
    requestData: any;
    maxDate = new Date();
    private subscriptions: Subscription[] = [];
    validRows: any[] = [];
    @ViewChild('parseInput')
    incarcaFisierVariable: ElementRef;
    invalidCurrency = false;
    userPrice: any;
    medicamentPrice: any;
    exchangeCurrenciesForPeriod: any[] = [];
    addedUnits: number ;
    remainingUnits: number ;
    importedUnits: number ;
    approvedQuantity: any;

    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                public dialog: MatDialog,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                public medicamentService: MedicamentService,
                private successOrErrorHandlerService: SuccessOrErrorHandlerService,
                private errorHandlerService: SuccessOrErrorHandlerService,
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

            'requestHistories': [] = [],
            'medicaments': [],

            'importAuthorizationEntity': this.fb.group({
                'id': [Validators.required],
                'applicationDate': [new Date()],
                'applicant': ['', Validators.required],

                'seller': [{value: null, disabled: true}, Validators.required], // Tara si adresa lui e deja in baza
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
                'expirationDatePicker': [],
                'customsNumber': [{value: null, disabled: true}],
                'customsDeclarationDate': [{value: null, disabled: true}],
                'authorizationsNumber': [], // inca nu exista la pasul acesta
                'medType': [''],
                'importAuthorizationDetailsEntityList': [],
                'sgeapNumber': [null],
                'sgeapDate': [null],
                'processVerbalNumber': [null],
                'processVerbalDate': [null],
                'revisionDate': [null],
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
        });

        this.authorizationSumm = 0;

        this.subscriptions.push(this.activatedRoute.params.subscribe(params2 => {
            this.subscriptions.push(this.requestService.getImportRequest(params2.id).subscribe(requestData => {
                    this.requestData = requestData;
                    console.log('this.requestData', this.requestData);
                    this.subscriptions.push(this.requestService.getInvoiceItems('', this.requestData.invoiceEntity.id, 'false').subscribe(data => {
                        this.invoiceDetails = data;
                        console.log('this.invoiceDetails', this.invoiceDetails);
                    }));
                if (this.requestData.id) {
                    this.evaluateImportForm.get('id').setValue(this.requestData.id);
                }
                if (this.requestData.requestNumber) {
                    this.evaluateImportForm.get('requestNumber').setValue(this.requestData.requestNumber);
                }
                if (this.requestData.startDate) {
                    this.evaluateImportForm.get('startDate').setValue(new Date(this.requestData.startDate));
                }
                if (this.requestData.initiator) {
                    this.evaluateImportForm.get('initiator').setValue(this.requestData.initiator);
                }
                if (this.requestData.assignedUser) {
                    this.evaluateImportForm.get('assignedUser').setValue(this.requestData.assignedUser);
                }
                if (this.requestData.company) {
                    this.evaluateImportForm.get('company').setValue(this.requestData.company);
                }
                if (this.requestData.importAuthorizationEntity && this.requestData.importAuthorizationEntity.medType) {
                    this.evaluateImportForm.get('importAuthorizationEntity.medType').setValue(this.requestData.importAuthorizationEntity.medType);
                }
                if (this.requestData.company) {
                    this.evaluateImportForm.get('importAuthorizationEntity.applicant').setValue(this.requestData.company);
                }
                if (this.requestData.type && this.requestData.type.id) {
                    this.evaluateImportForm.get('type.id').setValue(this.requestData.type.id);
                }
                if (this.requestData.requestHistories) {
                    this.evaluateImportForm.get('requestHistories').setValue(this.requestData.requestHistories);
                }
                this.docs = requestData.documents;
                    this.importData = this.requestData;
                    this.customsPointsList = this.requestData.importAuthorizationEntity.nmCustomsPointsList;

                    this.importDetailsList = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList;

                    if (this.requestData.importAuthorizationEntity.importAuthorizationEntity && this.requestData.importAuthorizationEntity.applicant && this.requestData.importAuthorizationEntity.applicant.idno) {
                        this.requestService.getActiveLicenses(this.requestData.importAuthorizationEntity.applicant.idno).subscribe(data1 => {
                            console.log('this.requestService.getActiveLicenses(data.applicant.idno).subscribe', data1);
                            this.activeLicenses = data1;
                            console.log('this.activeLicenses', this.activeLicenses);
                            this.expirationDate.push(this.activeLicenses.expirationDate);
                        });
                    }

                    this.importDetailsList.forEach(item => {
                        item.approved == null ? item.approved = false : (item.approved = item.approved);
                        if (item.approved == true) {
                            this.authorizationSumm = this.authorizationSumm + item.summ;
                        }
                    });


                    if (this.requestData.importAuthorizationEntity.seller) {
                        this.evaluateImportForm.get('importAuthorizationEntity.seller').setValue(this.requestData.importAuthorizationEntity.seller);
                    }
                    if (this.requestData.importAuthorizationEntity.seller && this.requestData.importAuthorizationEntity.seller.address && this.requestData.importAuthorizationEntity.seller.country.description) {
                        this.sellerAddress = (this.requestData.importAuthorizationEntity.seller.address + ', ' + this.requestData.importAuthorizationEntity.seller.country.description);
                    }
                    if (this.requestData.importAuthorizationEntity.importer) {
                        this.evaluateImportForm.get('importAuthorizationEntity.importer').setValue(this.requestData.importAuthorizationEntity.importer);
                    }
                    if (this.requestData.importAuthorizationEntity.importer && this.requestData.importAuthorizationEntity.importer.legalAddress) {
                        this.importerAddress = this.requestData.importAuthorizationEntity.importer.legalAddress + ', Moldova';
                    }
                    if (this.requestData.importAuthorizationEntity.basisForImport) {
                        this.evaluateImportForm.get('importAuthorizationEntity.basisForImport').setValue(this.requestData.importAuthorizationEntity.basisForImport);
                    }
                    if (this.requestData.importAuthorizationEntity.conditionsAndSpecification) {
                        this.evaluateImportForm.get('importAuthorizationEntity.conditionsAndSpecification').setValue(this.requestData.importAuthorizationEntity.conditionsAndSpecification);
                    }
                    if (this.requestData.importAuthorizationEntity.customsNumber) {
                        this.evaluateImportForm.get('importAuthorizationEntity.customsNumber').setValue(this.requestData.importAuthorizationEntity.customsNumber);
                    }
                    if (this.requestData.importAuthorizationEntity.customsDeclarationDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.customsDeclarationDate').setValue(new Date(this.requestData.importAuthorizationEntity.customsDeclarationDate));
                    }
                    if (this.requestData.importAuthorizationEntity.contract) {
                        this.evaluateImportForm.get('importAuthorizationEntity.contract').setValue(this.requestData.importAuthorizationEntity.contract);
                    }
                    if (this.requestData.importAuthorizationEntity.contractDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.contractDate').setValue(new Date(this.requestData.importAuthorizationEntity.contractDate));
                    }
                    if (this.requestData.importAuthorizationEntity.anexa) {
                        this.evaluateImportForm.get('importAuthorizationEntity.anexa').setValue(this.requestData.importAuthorizationEntity.anexa);
                    }
                    if (this.requestData.importAuthorizationEntity.anexaDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.anexaDate').setValue(new Date(this.requestData.importAuthorizationEntity.anexaDate));
                    }
                    if (this.requestData.importAuthorizationEntity.specification) {
                        this.evaluateImportForm.get('importAuthorizationEntity.specification').setValue(this.requestData.importAuthorizationEntity.specification);
                    }
                    if (this.requestData.importAuthorizationEntity.specificationDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.specificationDate').setValue(new Date(this.requestData.importAuthorizationEntity.specificationDate));
                    }
                    if (this.requestData.invoiceEntity && this.requestData.invoiceEntity.invoiceNumber) {
                        this.evaluateImportForm.get('importAuthorizationEntity.invoiceNumber').setValue(this.requestData.invoiceEntity.invoiceNumber);
                    }
                    if (this.requestData.invoiceEntity && this.requestData.invoiceEntity.invoiceDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.invoiceDate').setValue(new Date(this.requestData.invoiceEntity.invoiceDate));
                    }
                    if (this.requestData.invoiceEntity && this.requestData.invoiceEntity.basisForInvoice) {
                        this.evaluateImportForm.get('importAuthorizationEntity.invoiceBasis').setValue(this.requestData.invoiceEntity.basisForInvoice);
                    }
                    if (this.requestData.invoiceEntity && this.requestData.invoiceEntity.customsDeclarationDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsDate').setValue(new Date(this.requestData.invoiceEntity.customsDeclarationDate));
                    }
                    if (this.requestData.invoiceEntity && this.requestData.invoiceEntity.customsDeclarationNumber) {
                        this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsNumber').setValue(this.requestData.invoiceEntity.customsDeclarationNumber);
                    }
                    if (this.requestData.invoiceEntity && this.requestData.invoiceEntity.specification) {
                        this.evaluateImportForm.get('importAuthorizationEntity.invoiceSpecificatie').setValue(this.requestData.invoiceEntity.specification);
                    }
                    if (this.requestData.invoiceEntity && this.requestData.invoiceEntity.customsPointsEntity) {
                        this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').setValue(this.requestData.invoiceEntity.customsPointsEntity);
                    }
                    if (this.requestData.importAuthorizationEntity.sgeapNumber) {
                        this.evaluateImportForm.get('importAuthorizationEntity.sgeapNumber').setValue(this.requestData.importAuthorizationEntity.sgeapNumber);
                    }
                    if (this.requestData.importAuthorizationEntity.sgeapDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.sgeapDate').setValue(new Date(this.requestData.importAuthorizationEntity.sgeapDate));
                    }
                    if (this.requestData.importAuthorizationEntity.expirationDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.expirationDatePicker').setValue(new Date(this.requestData.importAuthorizationEntity.expirationDate));
                    }
                    if (this.requestData.importAuthorizationEntity.revisionDate) {
                        this.evaluateImportForm.get('importAuthorizationEntity.revisionDate').setValue(new Date(this.requestData.importAuthorizationEntity.revisionDate));
                    }


                    this.evaluateImportForm.get('importAuthorizationEntity.authorizationsNumber').setValue(this.requestData.importAuthorizationEntity.id + '/' + new Date().getFullYear() + '-AM');

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
                    this.evaluateImportForm.get('importAuthorizationEntity.expirationDatePicker').disable();
                    this.evaluateImportForm.get('importAuthorizationEntity.revisionDate').disable();


                    if (this.requestData.importAuthorizationEntity.medType === 2) {
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setErrors(null);
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setErrors(null);
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setErrors(null);
                    }
                    if (this.requestData.importAuthorizationEntity.medType === 2 || this.requestData.importAuthorizationEntity.medType === 3){
                        if (this.requestData.importAuthorizationEntity.processVerbalNumber) {
                            this.evaluateImportForm.get('importAuthorizationEntity.processVerbalNumber').setValue(this.requestData.importAuthorizationEntity.processVerbalNumber);
                            this.evaluateImportForm.get('importAuthorizationEntity.processVerbalNumber').disable();
                        }
                        if (this.requestData.importAuthorizationEntity.processVerbalDate) {
                            this.evaluateImportForm.get('importAuthorizationEntity.processVerbalDate').setValue(new Date(this.requestData.importAuthorizationEntity.processVerbalDate));
                            this.evaluateImportForm.get('importAuthorizationEntity.processVerbalDate').disable();
                        }
                    }
                },
                error => console.log(error)
            ));
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
        this.expirationDatePicker = '';
        this.addedUnits = 0;
        this.remainingUnits = 0;
        this.importedUnits = 0;
        // this.loadCustomsPoints();
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

            if (excelSheet.Sheets && excelSheet.Sheets["Medicamente Rom_RUS"] && (excelSheet.Sheets["Medicamente Rom_RUS"].D13)){
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

            let columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"];
            let sheet = excelSheet.Sheets["Medicamente Rom_RUS"];
            var range = XLSX.utils.decode_range(sheet['!ref']); // get the range
            for ( let R: number  = range.s.r+12; R <= range.e.r; R++) {
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
                            case 12: {rowToBeParsed.authorizationsNumber =        cell.v; /*if(!rowToBeParsed.registrationNumber || rowToBeParsed.registrationNumber == undefined)                   {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 13: {rowToBeParsed.customsDeclarationNumber =    cell.v; /*if(!rowToBeParsed.registrationDate || rowToBeParsed.registrationDate == undefined)                       {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 14: {rowToBeParsed.serie =                       cell.v; /*if(!rowToBeParsed.atcCode || rowToBeParsed.atcCode == undefined)                                         {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 15: {rowToBeParsed.expirationDate =              cell.v; break;}
                            case 16: {rowToBeParsed.receivedAmount =              cell.v; /*if(!rowToBeParsed.internationalMedicamentName || rowToBeParsed.internationalMedicamentName == undefined) {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            case 17: {rowToBeParsed.returnedAmount =              cell.v; /*if(!rowToBeParsed.internationalMedicamentName || rowToBeParsed.internationalMedicamentName == undefined) {console.log(columns[C] + cellNumber +": contine greseli")}*/; break;}
                            // case  :  {rowToBeParsed.currency =                    cell.v; break;}

                        }
                    }
                };
                let unitOfImportForPush: any ={};

//===================================================================================================
                if( rowToBeParsed.name &&
                    rowToBeParsed.quantity &&
                    rowToBeParsed.price &&
                    rowToBeParsed.authorizationsNumber == nn.requestData.importAuthorizationEntity.authorizationsNumber
                    // && rowToBeParsed.codeAmed &&
                    // rowToBeParsed.customsCode &&
                    // rowToBeParsed.pharmaceuticalForm &&
                    // rowToBeParsed.dose &&
                    // rowToBeParsed.unitsOfMeasurement &&
                    // rowToBeParsed.summ &&
                    // rowToBeParsed.producer &&
                    // rowToBeParsed.registrationNumber &&
                    // rowToBeParsed.registrationDate &&
                    // rowToBeParsed.atcCode &&
                    // rowToBeParsed.internationalMedicamentName
                ){
                    nn.validRows.push(rowToBeParsed);
                }
            }

            console.log('validRows',nn.validRows)
            if(nn.validRows.length<=0){
                nn.errorHandlerService.showError("Documentul nu contine date valide");
            }

                nn.parseRowWithAmed();
            // if(nn.importData.importAuthorizationEntity.medType === 2){
            //     nn.parseRowNoAmed();
            // }
        };

    }


    async parseRowWithAmed() {

        this.validRows.forEach(row => {
            console.log('row', row);

            let unitOfImportWithCodeAmed: any = {};
            let val: any = {};
            if (row.codeAmed) {
                // this.subscriptions.push(this.medicamentService.getMedicamentByNameWithPrice(row.codeAmed).subscribe(medicament => {
                // this.subscriptions.push(this.requestService.getInvoiceQuota(row.name, row.authorizationsNumber, "true").subscribe(position => {
                this.subscriptions.push(this.requestService.getAuthorizationDetailsByNameOrCode(row.name, String(this.requestData.importAuthorizationEntity.id)).subscribe(position => {

                    val = position[0];
                    console.log('val', position);

                    if(val) {

                        this.subscriptions.push(this.requestService.getInvoiceQuota(val.name, this.importData.authorizationsNumber, "true").subscribe(data => {
                            console.log('getInvoiceQuota()', data);
                            this.importedUnits = data;
                            // this.remainingUnits = val.approvedQuantity - this.importedUnits - this.addedUnits;

                            // row = this.row;

                            if (row.quantity) {

                                if (this.invoiceDetails.find(x => (x.codeAmed && x.codeAmed == row.codeAmed))) {
                                    this.addedUnits = this.invoiceDetails.filter(x => x.codeAmed == val.codeAmed).map(x => x.quantity).reduce((a, b) => a + b);
                                    this.remainingUnits = val.approvedQuantity - this.addedUnits - this.importedUnits;
                                    console.log('remainingUnits:', this.addedUnits);
                                    const invoiceDetails: any = {};

                                    if (row.quantity <= this.remainingUnits && row.price <= val.price) {
                                        const invoiceDetails: any = {};

                                        invoiceDetails.quantity = row.quantity;

                                        invoiceDetails.price = row.price;

                                        invoiceDetails.sum = row.quantity * row.price;

                                        if (val.medicament && val.medicament.id) {
                                            invoiceDetails.medicament = row.val.medicament.id;
                                        }

                                        invoiceDetails.name = row.name;



                                        invoiceDetails.authorizationsNumber = row.authorizationsNumber;
                                        this.invoiceDetails.push(invoiceDetails);
                                    }

                                } else if (this.invoiceDetails.find(x => x.name == row.name)) {
                                    this.addedUnits = this.invoiceDetails.filter(x => x.name == val.name).map(x => x.quantity).reduce((a, b) => a + b);
                                    this.remainingUnits = val.approvedQuantity - this.addedUnits - this.importedUnits;
                                    console.log('remainingUnits:', this.addedUnits);

                                    if (row.quantity <= this.remainingUnits && row.price <= val.price) {
                                        const invoiceDetails: any = {};

                                        invoiceDetails.quantity = row.quantity;

                                        invoiceDetails.price = row.price;

                                        invoiceDetails.sum = row.quantity * row.price;

                                        if (val.medicament && val.medicament.id) {
                                            invoiceDetails.medicament = row.val.medicament.id;
                                        }

                                        invoiceDetails.name = row.name;


                                        invoiceDetails.authorizationsNumber = row.authorizationsNumber;
                                        this.invoiceDetails.push(invoiceDetails);
                                    }

                                } else {
                                    this.remainingUnits = val.approvedQuantity - this.importedUnits;
                                    console.log('remainingUnits:', this.remainingUnits);

                                    if (row.quantity <= this.remainingUnits && row.price <= val.price) {
                                        const invoiceDetails: any = {};

                                        invoiceDetails.quantity = row.quantity;

                                        invoiceDetails.price = row.price;

                                        invoiceDetails.sum = row.quantity * row.price;

                                        if (val.medicament && val.medicament.id) {
                                            invoiceDetails.medicament = row.val.medicament.id;
                                        }

                                        invoiceDetails.name = row.name;


                                        invoiceDetails.authorizationsNumber = row.authorizationsNumber;
                                        this.invoiceDetails.push(invoiceDetails);
                                    }
                                }


                            }


                        }));


                        //========================================

                        // if (row.price) {
                        //     let contractCurrency: any;
                        //     let priceInContractCurrency: any;
                        //     unitOfImportWithCodeAmed.price = row.price;
                        //
                        //     if (this.evaluateImportForm.get('importAuthorizationEntity.currency').value) {
                        //         contractCurrency = this.evaluateImportForm.get('importAuthorizationEntity.currency').value;
                        //     }
                        //
                        //     if (contractCurrency.shortDescription == 'MDL') {
                        //         priceInContractCurrency = this.medicamentPrice.priceMdl;
                        //
                        //         if (this.userPrice > priceInContractCurrency) {
                        //             // this.invalidPrice = true;
                        //             console.log('price is higher than the contract price', priceInContractCurrency);
                        //         } else {
                        //             this.unitOfImportTable.push(unitOfImportWithCodeAmed);
                        //             console.log('unitOfImportWithCodeAmed', unitOfImportWithCodeAmed);
                        //         }
                        //     } else {
                        //
                        //         let medicamentPrice: any;
                        //
                        //         this.subscriptions.push(this.medicamentService.getMedPrice(val.id).subscribe(priceEntity => {
                        //             if (priceEntity) {
                        //                 medicamentPrice = priceEntity;
                        //                 const exchangeDate = new Date(priceEntity.orderApprovDate);
                        //
                        //                 if (priceEntity.currency) {
                        //                     this.valutaList = [/*this.valutaList.find(i=> i.shortDescription === "MDL"), */ priceEntity.currency];
                        //                     console.log('this.valutaList', this.valutaList);
                        //
                        //                 }
                        //                 this.pushToTableOrNot(exchangeDate, contractCurrency, priceInContractCurrency, medicamentPrice,unitOfImportWithCodeAmed);
                        //             }
                        //         }            ));
                        //     }
                        //
                        //
                        // } else if (val) {
                        //     // this.invalidPrice = false;
                        //     console.log('couldnt verify the price or the row doesnt contain the price');
                        // }


                        // } else {
                        //     // let el = document.getElementById("contractCurrency");
                        //     // el.scrollIntoView();
                        // }

                    }}));
            }
            //=============================================================

        })
        this.loadingService.hide();

    }

    async parseRowNoAmed() {

        if (this.validRows.length <= 0) {
            this.loadingService.hide();
            this.errorHandlerService.showError("Documentul contine medicamente cu greseli");
            return;
        }
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
                    unitOfImportWithCodeAmed.name = rowValues.name;
                } else {
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue('');
                }
                if (rowValues.commercialName) {
                    unitOfImportWithCodeAmed.commercialName = rowValues.name;
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

                unitOfImportWithCodeAmed.registrationDate = new Date(rowValues.registrationDate);

                // unitOfImportWithCodeAmed.importSources = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.importSources').value;


                if (rowValues.pharmaceuticalForm) {
                    // unitOfImportWithCodeAmed.pharmaceuticalForm = rowValues.pharmaceuticalForm;
                    if (rowValues.pharmaceuticalForm) {
                        this.subscriptions.push(this.administrationService.getAllPharamceuticalFormsByName(rowValues.pharmaceuticalForm).subscribe(val => {
                            console.log('pharmaceuticalForm', val[0]);
                            unitOfImportWithCodeAmed.pharmaceuticalForm = val[0];
//=============================================================
                            if (rowValues.internationalMedicamentName) {
                                // unitOfImportWithCodeAmed.internationalMedicamentName = rowValues.internationalMedicamentName;
                                let nameNoPlus = rowValues.internationalMedicamentName.replace('+', '%2B');
                                this.subscriptions.push(this.administrationService.getAllInternationalNamesByName(nameNoPlus).subscribe(val => {
                                    console.log('rowValues.internationalMedicamentName', val[0]);
                                    unitOfImportWithCodeAmed.internationalMedicamentName = val[0];
//=============================================================
                                    if (rowValues.producer) {
                                        // unitOfImportWithCodeAmed.producer = rowValues.producer;
                                        this.subscriptions.push(this.administrationService.getManufacturersByName(rowValues.producer).subscribe(val => {
                                            unitOfImportWithCodeAmed.producer = val[0];
                                            console.log('rowValues.producer', val[0]);
//=============================================================
                                            if (rowValues.atcCode) {
                                                (this.subscriptions.push(this.administrationService.getAllAtcCodesByCode(rowValues.atcCode).subscribe(atcCode => {
                                                    unitOfImportWithCodeAmed.atcCode = atcCode[0];
                                                    console.log('rowValues.atcCode', atcCode[0]);
//=============================================================
                                                    this.administrationService.getAllCustomsCodesByDescription(rowValues.customsCode).subscribe(customsCode =>{
                                                        unitOfImportWithCodeAmed.customsCode = customsCode[0];
                                                        console.log('rowValues.customsCode', customsCode[0]);
                                                    })
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
                this.loadingService.hide();
                // let el = document.getElementById("contractCurrency");
                // el.scrollIntoView();
            }

            //=============================================================

        });
        console.log('this.unitOfImportTable', this.unitOfImportTable)

    }

    reset() {
        this.incarcaFisierVariable.nativeElement.value = '';
        this.validRows = [];
    }

    loadInvoiceDetails(name, auth, saved){
        this.subscriptions.push(this.requestService.getInvoiceQuota(name,auth, saved).subscribe(data => {
            console.log('loadInvoiceDetails()', data);
            this.invoiceDetails = data;
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



    viewDoc(document: any) {
        this.loadingService.show();

        let observable: Observable<any> = null;


        console.log('this.evaluateImportForm.getRawValue', this.evaluateImportForm.getRawValue());

        const authorizationModel = this.evaluateImportForm.getRawValue();
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

        this.subscriptions.push(observable.subscribe(data => {
                console.log('observable.subscribe(data =>', data);
                const file = new Blob([data], {type: 'application/pdf'});
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

        // this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved
        // ? this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false
        // : this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
        if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved == false) {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
            this.authorizationSumm = this.authorizationSumm + this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ;
            this.authorizationCurrency = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
            console.log('this.authorizationSumm', this.authorizationSumm);
        } else {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false;
            this.authorizationSumm = this.authorizationSumm - this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ;
            console.log('this.authorizationSumm', this.authorizationSumm);
        }

        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']',
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
    }

    dialogSetApproved(i: any, approvedQuantity: any) {
        // if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved === false) {

        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approvedQuantity = approvedQuantity;
        // this.authorizationSumm = this.authorizationSumm + this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ
            = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        this.authorizationCurrency = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].currency;
        // console.log("this.authorizationSumm", this.authorizationSumm)
        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']',
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i]);
        // }
    }

    dialogSetReject(i: any, approvedQuantity: any) {
        // if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved === true) {
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approvedQuantity = 0;
        this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].summ = 0;
        // this.authorizationSumm = this.authorizationSumm - this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].price * approvedQuantity;
        // console.log("this.authorizationSumm", this.authorizationSumm)
        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']',
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
        // }
    }

    onChanges(): void {
        if (this.evaluateImportForm.get('importAuthorizationEntity')) {

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').valueChanges.subscribe(val => {
                if (val) {
                    this.medicamentData = val;
                    this.codeAmed = val.code;
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
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        // dialogConfig2.height = '900px';
        dialogConfig2.width = '850px';

        dialogConfig2.data = this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[0];
        dialogConfig2.data.medtType = this.importData.importAuthorizationEntity.medType;
        dialogConfig2.data.currentStep = this.importData.currentStep;
        dialogConfig2.data.invoiceDetails = this.invoiceDetails;
        dialogConfig2.data.importAuthorizationID = this.importData.importAuthorizationEntity.id;
        dialogConfig2.data.authorizationsNumber = this.importData.importAuthorizationEntity.authorizationsNumber;

        const dialogRef = this.dialog.open(ImportManagementDialog, dialogConfig2);

        dialogRef.afterClosed().subscribe(dialogResult => {
            this.dialogResult = dialogResult;

            const invoiceDetails: any = {};

            if (this.dialogResult) {
                invoiceDetails.quantity = this.dialogResult.importAuthorizationEntity.unitOfImportTable.quantity;

                invoiceDetails.price = this.dialogResult.importAuthorizationEntity.unitOfImportTable.price;

                invoiceDetails.sum = this.dialogResult.importAuthorizationEntity.unitOfImportTable.unitSumm;

                invoiceDetails.codeAmed = this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.codeAmed;

                invoiceDetails.name = this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.name;

                invoiceDetails.medicament = this.dialogResult.importAuthorizationEntity.unitOfImportTable.pozitie.medicament;

                invoiceDetails.authorizationsNumber = this.importData.importAuthorizationEntity.authorizationsNumber;
                this.invoiceDetails.push(invoiceDetails);
            }


            console.log('invoiceDetails', this.invoiceDetails);
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

    cancel() {
        let modelToSubmit: any = {};
        modelToSubmit = this.requestData;

        modelToSubmit.currentStep = 'C';
        modelToSubmit.endDate = new Date();
        modelToSubmit.medicaments = [];

        // console.log('modelToSubmit.requestHistories', modelToSubmit.requestHistories);
        // console.log('this.importData', this.importData);
        // console.log('this.requestDate', this.requestData);
        modelToSubmit.requestHistories.push({

            startDate: new Date(),
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'C'

        });
        console.log('modelToSubmit', modelToSubmit);
        this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
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
    }

    save(){
        {

            let modelToSubmit: any = {};
            this.loadingService.show();

            let invoiceDetailsEntity: any[] = [];
            let invoiceEntity: any = {};
            if (this.importData && this.importData.invoiceEntity) {
                invoiceEntity = this.importData.invoiceEntity;
                invoiceEntity.authorizationsNumber = this.importData.importAuthorizationEntity.authorizationsNumber;
            }

            // this.invoiceDetails.forEach
            invoiceDetailsEntity = this.invoiceDetails;
            invoiceDetailsEntity.forEach(item => item.saved = false);

            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceNumber').value) {
                invoiceEntity.invoiceNumber = this.evaluateImportForm.get('importAuthorizationEntity.invoiceNumber').value;
            
            } else {
                invoiceEntity.invoiceNumber = null;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceDate').value) {
                invoiceEntity.invoiceDate = new Date(this.evaluateImportForm.get('importAuthorizationEntity.invoiceDate').value);
            
            } else {
                invoiceEntity.invoiceDate = null;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceBasis').value) {
                invoiceEntity.basisForInvoice = this.evaluateImportForm.get('importAuthorizationEntity.invoiceBasis').value;
            
            } else {
                invoiceEntity.basisForInvoice = null;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsDate').value) {
                invoiceEntity.customsDeclarationDate = new Date(this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsDate').value);
            
            } else {
                invoiceEntity.customsDeclarationDate = null;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsNumber').value) {
                invoiceEntity.customsDeclarationNumber = this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsNumber').value;
            
            } else {
                invoiceEntity.customsDeclarationNumber = null;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceSpecificatie').value) {
                invoiceEntity.specification = this.evaluateImportForm.get('importAuthorizationEntity.invoiceSpecificatie').value;
            
            } else {
                invoiceEntity.specification = null;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value) {
                invoiceEntity.customsPointsEntity = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
            
            } else {
                invoiceEntity.customsPointsEntity = null;
            }
            if (invoiceDetailsEntity.length > 0) {
                invoiceEntity.invoiceDetailsEntitySet = invoiceDetailsEntity;

            } else {
                invoiceEntity.invoiceDetailsEntitySet = [];
            }

            modelToSubmit = this.requestData;
            modelToSubmit.invoiceEntity = invoiceEntity;

            modelToSubmit.currentStep = 'E';
            // modelToSubmit.endDate = new Date();
            modelToSubmit.medicaments = [];

            // console.log('modelToSubmit.requestHistories', modelToSubmit.requestHistories);
            // console.log('this.importData', this.importData);
            // console.log('this.requestDate', this.requestData);
            modelToSubmit.requestHistories.push({

                startDate: new Date(),
                endDate: new Date(),
                username: this.authService.getUserName(),
                step: 'E'
            });


            console.log('modelToSubmit', modelToSubmit);
            this.subscriptions.push(this.requestService.addInvoiceRequest(modelToSubmit).subscribe(data => {
                    // alert('after addInvoiceRequest(modelToSubmit)');
                    console.log('addInvoiceRequest(modelToSubmit).subscribe(data) ', data);
                    this.loadingService.hide();
                this.successOrErrorHandlerService.showSuccess('Autorizatia salvata');
                }, error => {
                    // alert('Something went wrong while sending the model');
                    console.log('error: ', error);
                    this.loadingService.hide();
                }
            ));

            this.formSubmitted = false;
        }
    }

    nextStep() {

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

            let invoiceDetailsEntity: any[] = [];
            let invoiceEntity: any = {};
            if (this.importData && this.importData.invoiceEntity) {
                invoiceEntity = this.importData.invoiceEntity;
                invoiceEntity.authorizationsNumber = this.importData.importAuthorizationEntity.authorizationsNumber;
            }

            // this.invoiceDetails.forEach
            invoiceDetailsEntity = this.invoiceDetails;
            invoiceDetailsEntity.forEach(item => item.saved = true);

            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceNumber').value) {
                invoiceEntity.invoiceNumber = this.evaluateImportForm.get('importAuthorizationEntity.invoiceNumber').value;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceDate').value) {
                invoiceEntity.invoiceDate = new Date(this.evaluateImportForm.get('importAuthorizationEntity.invoiceDate').value);
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceBasis').value) {
                invoiceEntity.basisForInvoice = this.evaluateImportForm.get('importAuthorizationEntity.invoiceBasis').value;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsDate').value) {
                invoiceEntity.customsDeclarationDate = new Date(this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsDate').value);
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsNumber').value) {
                invoiceEntity.customsDeclarationNumber = this.evaluateImportForm.get('importAuthorizationEntity.invoiceCustomsNumber').value;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.invoiceSpecificatie').value) {
                invoiceEntity.specification = this.evaluateImportForm.get('importAuthorizationEntity.invoiceSpecificatie').value;
            }
            if (this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value) {
                invoiceEntity.customsPointsEntity = this.evaluateImportForm.get('importAuthorizationEntity.customsPoints').value;
            }
            if (invoiceDetailsEntity) {
                invoiceEntity.invoiceDetailsEntitySet = invoiceDetailsEntity;
            }

            modelToSubmit = this.requestData;
            modelToSubmit.invoiceEntity = invoiceEntity;

            modelToSubmit.currentStep = 'F';
            modelToSubmit.endDate = new Date();
            modelToSubmit.medicaments = [];

            // console.log('modelToSubmit.requestHistories', modelToSubmit.requestHistories);
            // console.log('this.importData', this.importData);
            // console.log('this.requestDate', this.requestData);
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
        } else {
            const element = document.getElementById('invoiceInfo');
            element.scrollIntoView();
        }
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
