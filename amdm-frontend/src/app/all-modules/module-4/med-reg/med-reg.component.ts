import {Cerere} from './../../../models/cerere';
import {FormArray, Validators} from '@angular/forms';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {AdministrationService} from "../../../shared/service/administration.service";
// import {debounceTime, distinctUntilChanged, filter, map, startWith, tap} from "rxjs/operators";
import {debounceTime, distinctUntilChanged, filter, flatMap, tap} from "rxjs/operators";
import {ConfirmationDialogComponent} from "../../../dialog/confirmation-dialog.component";
import {saveAs} from 'file-saver';
import {Document} from "../../../models/document";
import {RequestService} from "../../../shared/service/request.service";
import {Subject} from "rxjs/index";
import {LoaderService} from "../../../shared/service/loader.service";
import {AuthService} from "../../../shared/service/authetication.service";
import {MedicamentService} from "../../../shared/service/medicament.service";
import {Utils} from "angular-bootstrap-md/angular-bootstrap-md/utils/utils.class";
import {MedInstInvestigatorsDialogComponent} from "../../module-9/dialog/med-inst-investigators-dialog/med-inst-investigators-dialog.component";
import {ImportMedDialog} from "../dialog/import-med-dialog";
import {PriceService} from "../../../shared/service/prices.service";

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
export class MedRegComponent implements OnInit {
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
    exchengeCurrencies: any[] = [];

    protected manufacturersRfPr: Observable<any[]>;
    protected loadingManufacturerRfPr: boolean = false;
    protected manufacturerInputsRfPr = new Subject<string>();

    importer: Observable<any[]>;
    loadingCompany: boolean = false;
    protected companyInputs = new Subject<string>();

    sellerAddress: any;
    importerAddress: any;
    producerAddress: any;
    codeAmed: any;

    solicitantCompanyList: Observable<any[]>;
    unitSumm: any;

    formModel: any;
    valutaList: any[];

    importData : any;
    medicamentData : any;

    atcCodes: Observable<any[]>;
    loadingAtcCodes: boolean = false;
    atcCodesInputs = new Subject<string>();

    customsCodes: Observable<any[]>;
    loadingcustomsCodes: boolean = false;
    customsCodesInputs = new Subject<string>();

    pharmaceuticalForm: Observable<any[]>;
    loadingpharmaceuticalForm: boolean = false;
    pharmaceuticalFormInputs = new Subject<string>();

    unitsOfMeasurement: Observable<any[]>;

    medicaments: Observable<any[]>;
    loadingmedicaments: boolean = false;
    medicamentsInputs = new Subject<string>();

    internationalMedicamentNames: Observable<any[]>;
    loadinginternationalMedicamentName: boolean = false;
    internationalMedicamentNameInputs = new Subject<string>();

    medicamentPrice: any;
    medicamentMAXPrice: any[] = [];
    medicamentCurrencyExchangeRate: any;
    medicamnetMaxPriceValuta:any;
    medicamnetMaxPriceMDL:any;
    invalidPrice: boolean = false;


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
                private administrationService: AdministrationService) {




    }

    ngOnInit() {
        this.evaluateImportForm = this.fb.group({
            'id':              [''],
            'requestNumber':   [null],
            'startDate':       [new Date()],
            'currentStep':     ['R'],
            'company':         ['', Validators.required],
            'initiator':       [null],
            'assignedUser':    [null],
            'data':            {disabled: true, value: null},
            'importType':      [null, Validators.required],
            'type':
                this.fb.group({
                    'id': ['']
                }),

            'requestHistories': [],

            'importAuthorizationEntity': this.fb.group({
                'id':                                    [Validators.required],
                'applicationDate':                       [new Date()],
                'applicant':                             ['', Validators.required],
                'seller':                                [null, Validators.required], // Tara si adresa lui e deja in baza
                'basisForImport':                        [],
                'importer':                              [null, Validators.required], // Tara si adresa lui e deja in baza
                'conditionsAndSpecification':            [''],
                'quantity':                              [Validators.required],
                'price':                                 [Validators.required],
                'currency':                              [Validators.required],
                'summ':                                  [Validators.required],
                'producer_id':                           [Validators.required], // to be deleted
                'stuff_type_id':                         [Validators.required], // to delete
                'expiration_date':                       [Validators.required],
                'customsNumber':                         [],
                'customsDeclarationDate':                [],
                'authorizationsNumber':                  [], // inca nu exista la pasul acesta
                'medType':                               [''],
                'importAuthorizationDetailsEntityList' : [],
                'unitOfImportTable': this.fb.group({

                    customsCode:                 [null, Validators.required],
                    name:                        [null, Validators.required],
                    quantity:                    [null, Validators.required],
                    price:                       [null, Validators.required],
                    currency:                    [null, Validators.required],
                    summ:                        [null, Validators.required],
                    producer:                    [null, Validators.required],
                    expirationDate:              [null, Validators.required],
                    atcCode:                     [null, Validators.required],
                    medicament:                  [null, Validators.required],
                    pharmaceuticalForm:          [null, Validators.required],
                    dose:                        [null, Validators.required],
                    registrationRmNumber:        [null, Validators.required],
                    unitsOfMeasurement:          [null, Validators.required],
                    registrationRmDate:          [null, Validators.required],
                    internationalMedicamentName: [null, Validators.required]

                }),



            }),

        });

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                    console.log('this.requestService.getImportRequest(params[\'id\'])', data);
                    this.importData = data;

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

                    //If it's a registered medicament, disable the following fields

                    // if (data.importAuthorizationEntity.medType===1) {
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').disable();
                    //     // this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producerAddress').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').disable();
                    //     this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').disable();
                    //
                    // }

                    // if (data.importAuthorizationEntity.medType === 2) {
                    if (data.importAuthorizationEntity.medType) {
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setErrors(null);
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setErrors(null);
                            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setErrors(null);
                    }
                },
                error => console.log(error)
            ))
        }))

        this.currentDate = new Date();
        this.sellerAddress = '';
        this.producerAddress = '';
        this.importerAddress='';
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
        console.log("importTypeForms.value",this.importTypeForms.value)
        console.log("currencies", this.exchengeCurrencies)
    }

    onChanges(): void {
        if (this.evaluateImportForm.get('importAuthorizationEntity')) {

            this.subscriptions.push( this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').valueChanges.subscribe(val => {
                if (val) {
                    this.medicamentData = val;
                    this.codeAmed = val.code;
                    console.log("importAuthorizationEntity.unitOfImportTable.medicament", this.medicamentData)

                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(val.customsCode);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(val.pharmaceuticalForm);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(val.dose);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(val.division);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(val.internationalMedicamentName);
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(val.commercialName);

                    if (val.customsCode!==null) {
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

                    this.medicamentService.getMedPrice(val.id).subscribe(priceEntity=>{
                        this.medicamentPrice = priceEntity;
                        this.valutaList = [this.valutaList.find(i=> i.shortDescription === "MDL"), priceEntity.currency];
                        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(this.valutaList.find(r => r === priceEntity.currency));

                        // this.medicamentMAXPrice.push(inMDL = this.medicamentPrice.priceMdl);
                        // this.medicamentMAXPrice.inCurrency = this.medicamentPrice.price;

                        console.log("this.medicamentPrice", this.medicamentPrice)
                        console.log("medicamentValutaList", this.valutaList)
                        console.log("priceEntity.currency.shortDescription", priceEntity.currency.shortDescription)
                    })

                }
            }));
            /*================================================*/
            this.subscriptions.push( this.evaluateImportForm.get('importAuthorizationEntity.seller').valueChanges.subscribe(val => {
                if (val) {
                    this.sellerAddress = val.address + ", " + val.country.description;
                }
            }));
            this.subscriptions.push( this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').valueChanges.subscribe(val => {
                if (this.medicamentData==null && val) {
                    this.producerAddress = val.address + ", " + val.country.description;
                    // console.log("producerAddress",this.producerAddress)
                }
            }));
            this.subscriptions.push(  this.evaluateImportForm.get('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
                if (val) {
                    this.importerAddress = val.legalAddress /*+ ", " + val.country.description*/;
                }
            }));
            this.subscriptions.push( this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').valueChanges.subscribe(val => {
                if (val) {
                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm);
                }
            }));
            this.subscriptions.push(  this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').valueChanges.subscribe(val => {
                if (val) {
                    this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                        * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;
                    this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(this.unitSumm);
                }

                if (val){
                    this.medicamnetMaxPriceValuta = val* this.medicamentCurrencyExchangeRate;
                    this.medicamnetMaxPriceMDL = this.medicamentPrice.priceMdl;
                    console.log(" this.medicamnetMaxPriceValuta", this.medicamnetMaxPriceValuta)
                    console.log(" this.medicamnetMaxPriceMDL", this.medicamnetMaxPriceMDL)

                    if (this.medicamnetMaxPriceMDL < (this.medicamnetMaxPriceValuta || val)){
                        this.invalidPrice=true;
                    }
                }

            }));

            this.subscriptions.push(  this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').valueChanges.subscribe(val => {
                if (val) {
                    console.log("importAuthorizationEntity.unitOfImportTable.currency",val)
                    console.log("this.exchengeCurrencies",this.exchengeCurrencies)
                    this.maxPriceForCurrency(val);

                }
            }));
        }
    }

    maxPriceForCurrency(valuta: any) {
            this.medicamentCurrencyExchangeRate = this.exchengeCurrencies.find(i => i.currency.shortDescription == valuta.shortDescription).value;
            // *  this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value;

            // console.log("medicamentCurrencyExchangeRate",this.medicamentCurrencyExchangeRate)
            // console.log("this.medicamentMAXPrice", this.medicamentMAXPrice),
            // console.log("exchangeCurrencies", 10 * this.exchengeCurrencies[1].value);
    }

    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable') as FormArray
    }

    currencyChanged($event){
        this.exchengeCurrencies = $event;
        // console.log("exchengeCurrencies", this.exchengeCurrencies)
    }

    addUnitOfImport() {
        this.addMedicamentClicked=true;
        //     alert(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid),
        // console.log("this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable'",(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid),


        if (this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').valid) {
        this.unitOfImportTable.push({

            codeAmed:                      this.codeAmed,
            approved:                      false,

            customsCode:                   this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').value,
            name:                          this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').value,
            quantity:                      this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value,
            price:                         this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
            currency:                      this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').value,
            summ:                          this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').value
                                           * this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').value,
            producer:                      this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').value,
            expirationDate:                this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').value,

            pharmaceuticalForm:            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').value,
            dose:                          this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').value,
            unitsOfMeasurement:            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').value,
            internationalMedicamentName:   this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').value,
            atcCode:                       this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').value,
            registrationNumber:            this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').value,
            registrationDate:              this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').value,


        });

        console.log("this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable'",(this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable').value)),

        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.customsCode').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.name').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.quantity').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.price').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.currency').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.summ').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.producer').setValue(null);
        this.producerAddress=null;
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.expirationDate').setValue(null);

        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.pharmaceuticalForm').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.dose').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.unitsOfMeasurement').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.internationalMedicamentName').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.atcCode').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmNumber').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.registrationRmDate').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.unitOfImportTable.medicament').setValue(null);

        // this.addMedicamentClicked = false;

            this.addMedicamentClicked = false;
        }
        console.log("this.unitOfImportTable", this.unitOfImportTable)
    }

    removeunitOfImport(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti ?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.unitOfImportTable.splice(index, 1);
            }
        });
    }



    showunitOfImport(unitOfImport: any) {
        let dialogConfig2 = new MatDialogConfig();

        dialogConfig2.disableClose = false;
        dialogConfig2.autoFocus = true;
        dialogConfig2.hasBackdrop = true;

        dialogConfig2.height = '900px';
        dialogConfig2.width = '850px';

        dialogConfig2.data = unitOfImport;
        dialogConfig2.data.medtType = this.importData.importAuthorizationEntity.medType;

        let dialogRef = this.dialog.open(ImportMedDialog, dialogConfig2);

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

    loadATCCodes(){
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

    loadInternationalMedicamentName(){
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

    loadPharmaceuticalForm(){
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

    loadMedicaments(){
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
        )
    }

    loadCustomsCodes(){
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
                    if (result && result.length > 0) return true;
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


    loadManufacturersRfPr(){
        this.manufacturersRfPr =
            this.manufacturerInputsRfPr.pipe(
                filter((result: string) => {
                    if (result && result.length > 0) return true;
                }),
                debounceTime(400),
                distinctUntilChanged(),
                tap((val: string) => {
                    this.loadingManufacturerRfPr = true;

                }),
                flatMap (term =>
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
                    console.log(this.valutaList)

                },
                error => console.log(error)
            )
        )
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
                let modelToSubmit = this.evaluateImportForm.getRawValue();
                modelToSubmit.currentStep = 'I';
                // modelToSubmit.requestHistories.sort((one, two) => (one.id > two.id ? 1 : -1));
                modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.unitOfImportTable;
                modelToSubmit.endDate = new Date();
                modelToSubmit.documents = this.docs;
                modelToSubmit.requestHistories.push({
                    startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
                    endDate: new Date(),
                    username: this.authService.getUserName(),
                    step: 'E'
                });
                modelToSubmit.documents = this.docs;
                this.subscriptions.push(
                    this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                        this.router.navigate(['/dashboard/homepage']);
                        this.loadingService.hide();
                    }, error => {
                        this.loadingService.hide();
                        console.log(error)
                    })
                )
            }
        });
    }



    nextStep() {

        this.formSubmitted = true;
        let modelToSubmit: any ={};
        this.loadingService.show();

        modelToSubmit = this.evaluateImportForm.value;
        if (this.importData.importAuthorizationEntity.id){
            modelToSubmit.importAuthorizationEntity.id =  this.importData.importAuthorizationEntity.id;
        }


        modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.unitOfImportTable;
        modelToSubmit.endDate = new Date();

        modelToSubmit.documents = this.docs;

        modelToSubmit.requestHistories.push({
            startDate: modelToSubmit.requestHistories[modelToSubmit.requestHistories.length - 1].endDate,
            endDate: new Date(),
            username: this.authService.getUserName(),
            step: 'E'
        });

        console.log("this.evaluateImportForm.value", this.evaluateImportForm.value);
        //=============

        modelToSubmit.medicaments = [];
        console.log("modelToSubmit", modelToSubmit);
        alert("before addImportRequest(modelToSubmit)")
        // this.subscriptions.push(this.requestService.addImportRequest(this.importData).subscribe(data => {
        this.subscriptions.push(this.requestService.addImportRequest(modelToSubmit).subscribe(data => {
                alert("after addImportRequest(modelToSubmit)")
                console.log("addImportRequest(modelToSubmit).subscribe(data) ",data)
                this.loadingService.hide();
                this.router.navigate(['dashboard/module/import-authorization/registered-medicament-approve/'+data.body.id]);
            }, error => {
                alert("Something went wrong while sending the model")
                console.log("error: ",error)
                this.loadingService.hide()}
        ));

        this.formSubmitted = false;
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }



}
