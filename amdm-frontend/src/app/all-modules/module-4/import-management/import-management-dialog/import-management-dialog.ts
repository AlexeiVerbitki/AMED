import {Cerere} from './../../../../models/cerere';
import {FormArray, Validators} from '@angular/forms';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Component, Inject, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AdministrationService} from '../../../../shared/service/administration.service';
// import {debounceTime, distinctUntilChanged, filter, map, startWith, tap} from "rxjs/operators";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../../../../dialog/confirmation-dialog.component';
import {saveAs} from 'file-saver';
import {Document} from '../../../../models/document';
import {RequestService} from '../../../../shared/service/request.service';
import {Subject} from 'rxjs/index';
import {LoaderService} from '../../../../shared/service/loader.service';
import {AuthService} from '../../../../shared/service/authetication.service';
import {MedicamentService} from '../../../../shared/service/medicament.service';
import {Utils} from 'angular-bootstrap-md/angular-bootstrap-md/utils/utils.class';
import {forEach} from '@angular/router/src/utils/collection';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}


@Component({
    selector: 'app-import-med-dialog',
    templateUrl: './import-management-dialog.html',
    styleUrls: ['./import-management-dialog.css']
})
export class ImportManagementDialog implements OnInit {


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
    private subscriptions: Subscription[] = [];
    docs: Document [] = [];

    unitOfImportTable: any[] = [];

    protected manufacturersRfPr: Observable<any[]>;
    protected loadingManufacturerRfPr = false;
    protected manufacturerInputsRfPr = new Subject<string>();

    importer: Observable<any[]>;
    loadingCompany = false;
    protected companyInputs = new Subject<string>();

    sellerAddress: any;
    importerAddress: any;
    producerAddress: any;
    codeAmed: any;

    solicitantCompanyList: Observable<any[]>;
    unitSumm: any;

    formModel: any;
    valutaList: any[];

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

    authorizations: Observable<any[]>;
    loadingAuthorizations = false;
    authorizationsInputs = new Subject<string>();

    internationalMedicamentNames: Observable<any[]>;
    loadinginternationalMedicamentName = false;
    internationalMedicamentNameInputs = new Subject<string>();

    checked: boolean;
    medType: any;

    invalidPrice: boolean;
    invalidQuantity: boolean;
    approvedPrice: any;
    approvedQuantity: any;

    invoiceDetailAdded: boolean  = false;
    importReachedLimit: boolean = false;
    addedUnits: number ;
    remainingUnits: number ;
    importedUnits: number ;


    constructor(private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public dialogData: any,
                private requestService: RequestService,
                public dialog: MatDialogRef<ImportManagementDialog>,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                public dialogConfirmation: MatDialog,
                public medicamentService: MedicamentService,
                private administrationService: AdministrationService) {


    }

    ngOnInit() {
        console.log('dialogData: ', this.dialogData);
        this.importData = this.dialogData;
        this.medType = this.dialogData.medtType;
        this.valutaList = [];
        this.checked = false;
        this.currentDate = new Date();
        this.sellerAddress = '';
        this.producerAddress = '';
        this.importerAddress = '';
        this.formSubmitted = false;
        this.addMedicamentClicked = false;
        this.unitSumm = 0;
        this.approvedPrice = '';
        this.approvedQuantity = '';
        this.invalidPrice = false;
        this.invoiceDetailAdded = false;
        this.addedUnits = 0;
        this.remainingUnits = 0;
        this.importedUnits = 0;
        this.loadEconomicAgents();
        this.loadManufacturersRfPr();

        this.loadCurrenciesShort();
        this.loadCustomsCodes();
        this.loadATCCodes();
        this.loadPharmaceuticalForm();
        this.loadUnitsOfMeasurement();
        this.loadMedicaments();
        this.loadInternationalMedicamentName();
        this.loadAuthorizationDetails();

        this.evaluateImportForm = this.fb.group({
            // 'id':              [''],
            // 'requestNumber':   [null],
            // 'startDate':       [new Date()],
            // 'currentStep':     ['R'],
            // 'company':         ['', Validators.required],
            // 'initiator':       [null],
            // 'assignedUser':    [null],
            // 'data':            {disabled: true, value: null},
            // 'importType':      [null, Validators.required],
            // 'type':
            //     this.fb.group({
            //         'id': ['']
            //     }),
            //
            // 'requestHistories': [],
            // 'medicaments': [],

            'importAuthorizationEntity': this.fb.group({
                // 'id':                                    [Validators.required],
                // 'applicationDate':                       [new Date()],
                // 'applicant':                             ['', Validators.required],
                // 'seller':                                [null, Validators.required], // Tara si adresa lui e deja in baza
                // 'basisForImport':                        [],
                // 'importer':                              [null, Validators.required], // Tara si adresa lui e deja in baza
                // 'conditionsAndSpecification':            [''],
                // 'quantity':                              [Validators.required],
                // 'price':                                 [Validators.required],
                // 'currency':                              [Validators.required],
                // 'summ':                                  [Validators.required],
                // 'producer_id':                           [Validators.required], // to be deleted
                // 'stuff_type_id':                         [Validators.required], // to delete
                // 'expiration_date':                       [Validators.required],
                // 'customsNumber':                         [],
                // 'customsDeclarationDate':                [],
                // 'authorizationsNumber':                  [], // inca nu exista la pasul acesta
                // 'medType':                               [''],
                // 'importAuthorizationDetailsEntityList' : [],
                'unitOfImportTable': this.fb.group({

                    customsCode: [null, Validators.required],
                    name: [null, Validators.required],
                    quantity: [null, Validators.required],
                    approvedQuantity: [null, Validators.required],
                    price: [null, Validators.required],
                    approvedPrice: [null, Validators.required],
                    currency: [null, Validators.required],
                    summ: [null, Validators.required],
                    importSumm: [null, Validators.required],
                    producer: [null, Validators.required],
                    expirationDate: [null, Validators.required],
                    atcCode: [null, Validators.required],
                    medicament: [null, Validators.required],
                    pharmaceuticalForm: [null, Validators.required],
                    dose: [null, Validators.required],
                    registrationRmNumber: [null, Validators.required],
                    unitsOfMeasurement: [null, Validators.required],
                    registrationRmDate: [null, Validators.required],
                    internationalMedicamentName: [null, Validators.required],
                    pozitie : [null],
                    remainingQuantity: [null]

                }),


            }),

        });


        this.codeAmed;

        // if (this.dialogData.medicament !== null) {
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(this.dialogData.medicament.code);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(this.dialogData.medicament.customsCode);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(this.dialogData.medicament.name);
            // // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(this.dialogData.medicament.quantity);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(this.dialogData.approvedQuantity);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedPrice').setValue(this.dialogData.price);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.dialogData.summ);
            // // this.unitSumm = this.dialogData.medicament.summ;
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(this.dialogData.currency.shortDescription);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(this.dialogData.medicament.manufactures[0].manufacture);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(new Date(this.dialogData.medicament.expirationDate));
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(this.dialogData.medicament.pharmaceuticalForm);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(this.dialogData.medicament.dose);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(this.dialogData.medicament.division);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(this.dialogData.medicament.internationalMedicamentName);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(this.dialogData.medicament.atcCode);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(this.dialogData.medicament.registrationNumber);
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(this.dialogData.medicament.registrationDate));
        //     this.producerAddress = this.dialogData.medicament.manufactures[0].manufacture.address + ', ' + this.dialogData.medicament.manufactures[0].manufacture.country.description;
        // } else {

        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(this.dialogData.codeAmed);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(this.dialogData.customsCode);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(this.dialogData.name);
        // // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(this.dialogData.quantity);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(this.dialogData.approvedQuantity);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedPrice').setValue(this.dialogData.price);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.dialogData.summ);
        // // this.unitSumm = this.dialogData.summ;
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(this.dialogData.currency.shortDescription);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(this.dialogData.producer);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(new Date(this.dialogData.expirationDate));
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(this.dialogData.pharmaceuticalForm);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(this.dialogData.dose);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(this.dialogData.unitsOfMeasurement);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(this.dialogData.internationalMedicamentName);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(this.dialogData.atcCode);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(this.dialogData.registrationNumber);
        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(this.dialogData.registrationDate));
        // this.producerAddress = this.dialogData.producer.address + ', ' + this.dialogData.producer.country.description;
    // }
        console.log('this.dialogData.producer.address', this.dialogData.producer.address);
        console.log('this.dialogData.producer.country.description', this.dialogData.producer.country.description);


        // if (this.importData.currentStep == "AP") {
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').disable();
            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedPrice').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').disable();
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').disable();
        // }


        this.onChanges();

    }


    setApproved(i: any) {

        // this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved ? this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false : this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
        if (this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved == false) {
            this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = true;
        } else { this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved = false; }

        console.log('this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[' + i + ']', this.importData.importAuthorizationEntity.importAuthorizationDetailsEntityList[i].approved);
    }

    cancel(): void {
        this.dialog.close();
    }

    reject(): void {
        this.dialog.close([false]);
    }

    confirm(): void {
        const validPrice = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').valid;
        const validQuantity = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').valid;
        let dialogValues = this.evaluateImportForm.getRawValue();
        dialogValues.importAuthorizationEntity.unitOfImportTable.unitSumm  = this.unitSumm;
            if (validPrice && validQuantity && this.invalidPrice === false && this.invalidQuantity === false /*&& this.invoiceDetailAdded === false*/) {
                // this.dialog.close([true,
                //                                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value,
                //                                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
                //                                this.unitSumm,
                // ]);
                this.dialog.close(dialogValues);
                this.addMedicamentClicked = false;
            } else {
                console.log('INVALID PRICE, invalidPrice = ', this.invalidPrice);
            }
        }
    // }

    onChanges(): void {
        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity')) {
        // this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').valueChanges.subscribe(val => {alert("Quantity has changed")}));

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').valueChanges.subscribe(val => {
                if (val) {
                    console.log('unitOfImportTable.quantity:', val);
                    this.unitSumm = val * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    console.log('this.unitSumm', this.unitSumm);
                }




                if (val + this.addedUnits > this.remainingUnits) {
                    this.invalidQuantity = true;
                    console.log('invalidQuantity', this.invalidQuantity);
                } else {
                    this.invalidQuantity = false;
                    console.log('invalidQuantity', this.invalidQuantity);
                }

            }));
        }

        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price')) {

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').valueChanges.subscribe(val => {
                if (val) {
                    console.log('unitOfImportTable.quantity:', val);

                    this.unitSumm = val * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value;
                    console.log('this.unitSumm', this.unitSumm);
                    console.log('approvedPrice', this.approvedPrice);
                }

                if (val > this.approvedPrice) {
                    this.invalidPrice = true;
                    console.log('invalidPrice', this.invalidPrice);
                } else {
                    this.invalidPrice = false;
                    console.log('invalidPrice', this.invalidPrice);
                }
            }));


        }

        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pozitie')) {

            this.subscriptions.push(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pozitie').valueChanges.subscribe(val => {
                if (val) {
                    console.log('pozitie:', val);

                    if (val.medicament) {

                        // if (this.dialogData.invoiceDetails.find(x => x.codeAmed == val.medicament.codeAmed)) {
                        //     this.invoiceDetailAdded = true
                        //
                        //     this.addedUnits = this.dialogData.invoiceDetails.filter(x => x.codeAmed == val.medicament.codeAmed).map(x => x.quantity).reduce((a,b) => a+b );
                        //
                        //     if (this.addedUnits!==0) {
                        //         this.remainingUnits = this.approvedQuantity - this.addedUnits;
                        //     } else{
                        //         this.remainingUnits = this.approvedQuantity;
                        //     }
                        //     console.log("addedUnits:", this.addedUnits)
                        //
                        // } else {
                        //     this.invoiceDetailAdded = false
                        //     console.log("addedUnits:", this.addedUnits)
                        // }

                        this.subscriptions.push(this.requestService.getInvoiceQuota(val.medicament.id, this.importData.authorizationsNumber).subscribe(data => {
                            console.log("getInvoiceQuota()", data)
                            this.importedUnits = data;
                            this.remainingUnits = this.approvedQuantity - this.importedUnits - this.addedUnits;
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.remainingQuantity').setValue(this.remainingUnits);
                        }));


                        if (val.medicament.code) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(val.medicament.code);
                        }
                        if (val.medicament.customsCode) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(val.medicament.customsCode);
                        }
                        if (val.medicament.name) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(val.medicament.name);
                        }
                        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(val.quantity);
                        if (val.approvedQuantity) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(val.approvedQuantity);
                        }
                        if (val.price) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedPrice').setValue(val.price);
                        }
                        this.approvedQuantity = val.approvedQuantity;
                        this.approvedPrice = val.price;
                        if (val.summ) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(val.summ);
                        }
                        // this.unitSumm = val.summ;
                        if (val.currency.shortDescription) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(val.currency.shortDescription);
                        }
                        if (val.medicament.manufactures[0].manufacture) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(val.medicament.manufactures[0].manufacture);
                        }
                        if (val.medicament.expirationDate) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(new Date(val.medicament.expirationDate));
                        }
                        if (val.medicament.pharmaceuticalForm) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(val.medicament.pharmaceuticalForm);
                        }
                        if (val.medicament.dose) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(val.medicament.dose);
                        }
                        if (val.medicament.division) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(val.medicament.division);
                        }
                        if (val.medicament.internationalMedicamentName) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(val.medicament.internationalMedicamentName);
                        }
                        if (val.medicament.atcCode) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(val.medicament.atcCode);
                        }
                        if (val.medicament.registrationNumber) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(val.medicament.registrationNumber);
                        }
                        if (val.medicament.registrationDate) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(val.medicament.registrationDate));
                        }
                        this.producerAddress = val.medicament.manufactures[0].manufacture.address + ', ' + val.medicament.manufactures[0].manufacture.country.description;




                        if (this.dialogData.invoiceDetails.find(x => (x.codeAmed == val.medicament.code))) {
                            this.invoiceDetailAdded = true

                            this.addedUnits = this.dialogData.invoiceDetails.filter(x => x.codeAmed == val.medicament.code).map(x => x.quantity).reduce((a,b) => a+b );



                            this.remainingUnits = this.approvedQuantity - this.addedUnits - this.importedUnits;



                            console.log("remainingUnits:", this.remainingUnits)

                        } else {
                            this.invoiceDetailAdded = false
                            this.remainingUnits = this.approvedQuantity - this.importedUnits;
                            console.log("remainingUnits:", this.remainingUnits)
                        }

                    } else {


                        this.subscriptions.push(this.requestService.getInvoiceQuota(val.name,this.importData.authorizationsNumber).subscribe(data => {
                            console.log("getInvoiceQuota()", data)
                            this.importedUnits = data;
                            this.remainingUnits = this.approvedQuantity - this.importedUnits - this.addedUnits;
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.remainingQuantity').setValue(this.remainingUnits);
                            // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.remainingQuantity').setValue(this.importedUnits);
                        }));


                        if (val) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(val);
                        }
                        if (val.customsCode) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(val.customsCode);
                        }
                        if (val.name) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(val.name);
                        }
                        // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(val.quantity);
                        if (val.approvedQuantity) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(val.approvedQuantity);
                        }
                        if (val.price) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedPrice').setValue(val.price);
                        }
                        this.approvedQuantity = val.approvedQuantity;
                        this.approvedPrice = val.price;
                        if (val.summ) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(val.summ);
                        }
                        // this.unitSumm = val.summ;
                        if (val.currency.shortDescription) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(val.currency.shortDescription);
                        }
                        if (val.producer) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(val.producer);
                        }
                        if (val.expirationDate) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(new Date(val.expirationDate));
                        }
                        if (val.pharmaceuticalForm) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(val.pharmaceuticalForm);
                        }
                        if (val.dose) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(val.dose);
                        }
                        if (val.unitsOfMeasurement) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(val.unitsOfMeasurement);
                        }
                        if (val.internationalMedicamentName) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(val.internationalMedicamentName);
                        }
                        if (val.atcCode) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(val.atcCode);
                        }
                        if (val.registrationNumber) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(val.registrationNumber);
                        }
                        if (val.registrationDate) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(new Date(val.registrationDate));
                        }
                        this.producerAddress = val.producer.address + ', ' + val.producer.country.description;




                        if (this.dialogData.invoiceDetails.find(x => x.codeAmed == val.codeAmed)) {
                            this.invoiceDetailAdded = true

                            this.addedUnits = this.dialogData.invoiceDetails.filter(x => x.codeAmed == val.codeAmed).map(x => x.quantity).reduce((a,b) => a+b );


                            this.remainingUnits = this.approvedQuantity - this.addedUnits - this.importedUnits;



                            console.log("remainingUnits:", this.addedUnits)

                        } else {
                            this.invoiceDetailAdded = false
                            this.remainingUnits = this.approvedQuantity - this.importedUnits;
                            console.log("remainingUnits:", this.remainingUnits)
                        }


                    }


                }


            }));


        }

    }


    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable') as FormArray;
    }


    addUnitOfImport() {
        this.addMedicamentClicked = true;
        //     alert(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid),
        // console.log("this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable'",(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid),


        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid) {
            this.unitOfImportTable.push({

                codeAmed: this.codeAmed,
                // codeAmed:                      Utils.generateMedicamentCode(),

                customsCode: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').value,
                name: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').value,
                quantity: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value,
                approvedQuantity: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').value,
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
                registrationDate: this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').value,


            });

            console.log('this.evaluateImportForm.get(\'importAuthorizationEntity.unitOfImportTable\'', (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').value)),

            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.approvedQuantity').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(null);
            this.producerAddress = null;
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(null);

            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(null);
            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(null);


            this.addMedicamentClicked = false;
        }
        console.log('this.unitOfImportTable', this.unitOfImportTable);
    }

    loadAuthorizationDetails() {
        this.authorizations =
            this.authorizationsInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) {
                        return true;
                    }
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingAuthorizations = true;

                }),
                flatMap(term =>
                    // this.medicamentService.getMedicamentByName(term).pipe(
                    this.requestService.getAuthorizationDetailsByNameOrCode(term, String(this.importData.importAuthorizationID)).pipe(
                        tap(() => this.loadingAuthorizations = false)
                    )
                )


            );



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
                    if (result && result.length > 0) { return true; }
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
                    if (result && result.length > 0) { return true; }
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
        this.administrationService.getCurrenciesShort().subscribe(data => {
                this.valutaList = data;

            },
            error => console.log('loadCurrenciesShort() ERROR', error)
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
                const modelToSubmit = this.evaluateImportForm.getRawValue();
                modelToSubmit.currentStep = 'I';
                // modelToSubmit.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.unitOfImportTable;
                modelToSubmit.endDate = new Date();
                modelToSubmit.documents = this.docs;
                modelToSubmit.requestHistories.push({
                    startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
                    endDate: new Date(),
                    username: this.authService.getUserName(),
                    step: 'I'
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


    nextStep() {

        this.formSubmitted = true;
        let modelToSubmit: any = {};
        this.loadingService.show();


        modelToSubmit.endDate = new Date();


        modelToSubmit = this.importData;

        modelToSubmit.requestHistories.push({
            startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        });

        console.log('this.evaluateImportForm.value', this.evaluateImportForm.value);
        //=============


        modelToSubmit.medicaments = [];
        console.log('modelToSubmit', modelToSubmit);
        this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                alert('after addImportRequest(modelToSubmit)');
                console.log('addImportRequest(modelToSubmit).subscribe(data) ', data);
                this.loadingService.hide();
                // this.router.navigate(['dashboard/module']); for now to post multiple times
            }, error => {
                alert('Something went wrong while sending the model');
                console.log('error: ', error);
                this.loadingService.hide();
            }
        ));

        this.formSubmitted = false;
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
