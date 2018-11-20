import {Cerere} from './../../../models/cerere';
import {FormArray, Validators} from '@angular/forms';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {MatDialog} from "@angular/material";
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
export class AmbalajComponent implements OnInit {
    cereri: Cerere[] = [];
    // importer: any[];
    evaluateImportForm: FormGroup;
    // importTypeForm: FormGroup;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    private subscriptions: Subscription[] = [];
    docs: Document [] = [];

    unitOfImportTable: any[] = [];

    protected manufacturersRfPr: Observable<any[]>;
    protected loadingManufacturerRfPr: boolean = false;
    protected manufacturerInputsRfPr = new Subject<string>();

    importer: Observable<any[]>;
    loadingCompany: boolean = false;
    protected companyInputs = new Subject<string>();

    sellerAddress: any;
    importerAddress: any;
    producerAddress: any;

    solicitantCompanyList: Observable<any[]>;
    unitSumm: any;
    private unitOfImportPressed : boolean;

    formModel: any;
    valutaList: Observable<any[]>;

    importData : any;

    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                public dialog: MatDialog,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoaderService,
                private authService: AuthService,
                private administrationService: AdministrationService) {

        this.evaluateImportForm = fb.group({
            'id': [''],
            'requestNumber': [null],
            'startDate': [new Date()],
            'currentStep': ['R'],
            'company': ['', Validators.required],
            'initiator': [null],
            'assignedUser': [null],
            'data': {disabled: true, value: null},
            'importType': [null, Validators.required],
            'type':
                this.fb.group({
                    'id': ['']
                }),
            'importAuthorizationEntity': fb.group({
                // 'requestNumber': {value: '', disabled: true},
                // 'startDate': {value: '', disabled: true},
                // 'importer': {value: '', disabled: true},
                'id;': [''],
                'importType': [null, Validators.required],
                'applicationRegistrationNumber': [''],
                'applicationDate': [new Date()],
                'applicant': ['', Validators.required],
                'seller': [null, Validators.required], // Tara si adresa lui e deja in baza
                'basisForImport': [],
                'importer': [null, Validators.required], // Tara si adresa lui e deja in baza
                'conditionsAndSpecification': [''],
                'medType': [''],
                'importAuthorizationDetailsEntityList': this.fb.group({

                    customsCode: [],
                    name: [],
                    quantity: [],
                    price: [],
                    currency: [],
                    summ: [],
                    producer: [],
                    expirationDate: [],

                }),

                'authorizationsNumber': [''], // inca nu exista la pasul acesta

            }),

        });


    }

    ngOnInit() {
        this.currentDate = new Date();
        this.sellerAddress='';
        this.producerAddress='';
        this.importerAddress='';
        this.formSubmitted = false;
        // this.producerAddress='';
        // this.importTypeForms[0].producer.address='';
        // this.loadSolicitantCompanyList();
        this.loadEconomicAgents();
        this.loadManufacturersRfPr();
        // this.addImportTypeForm();
        this.onChanges();
        this.loadCurrenciesShort();



        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                    console.log('Import data', data);
                    this.importData = data;
                    // alert(params['id'])
                    // alert(data.startDate)
                    // alert(data.importer)

                    this.evaluateImportForm.get('id').setValue(data.id);
                    this.evaluateImportForm.get('initiator').setValue(data.initiator);
                    this.evaluateImportForm.get('assignedUser').setValue(data.assignedUser);
                    this.evaluateImportForm.get('requestNumber').setValue(data.requestNumber);
                    this.evaluateImportForm.get('startDate').setValue(new Date(data.startDate));
                    this.evaluateImportForm.get('company').setValue(data.company);
                    // this.evaluateImportForm.get('data').setValue(data.data);
                    // this.evaluateImportForm.get('importType').setValue(data.importType);

                },
                error => console.log(error)
            ))
        }))

        console.log("importTypeForms.value",this.importTypeForms.value)
    }

    onChanges(): void {
        this.evaluateImportForm.get('importAuthorizationEntity.seller').valueChanges.subscribe(val => {
            if (val) {
                this.sellerAddress = val.address + ", " + val.country.description;
            }
        });
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.producer').valueChanges.subscribe(val => {
            if (val) {
                this.producerAddress = val.address + ", " + val.country.description;
            }
        });
        this.evaluateImportForm.get('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
            if (val) {
                this.importerAddress = val.legalAddress /*+ ", " + val.country.description*/;
            }
        });
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.quantity').valueChanges.subscribe(val => {
            if (val) {
                this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.quantity').value
                    * this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.price').value;
                this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.summ').setValue(this.unitSumm);
            }
        });
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.price').valueChanges.subscribe(val => {
            if (val) {
                this.unitSumm = this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.quantity').value
                    * this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.price').value;
                this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.summ').setValue(this.unitSumm);
            }
        });
        // this.evaluateImportForm.getthis.addImportTypeForm('importAuthorizationEntity.importer').valueChanges.subscribe(val => {
        //     if (val) {
        //         this.importerAddress = val.legalAddress + ", Moldova";
        //         // this.evaluateImportForm.get('importAuthorizationEntity.adresa').setValue("test")
        //     }
        // });
    }

    // getProducerAddress(index: number){
    //     this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList').valueChanges.subscribe(val => {
    //         console.log("val:", val)
    //         console.log("index: ",index)
    //         if (val) {
    //             this.producerAddress = val[index].producer.address + ", " + val[index].producer.country.description;
    //             console.log("producerAddress =",  this.producerAddress)               // this.evaluateImportForm.get('importAuthorizationEntity.adresa').setValue("test")
    //         }
    //     });
    //
    // }

    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList') as FormArray
    }

    addUnitOfImport() {
        this.unitOfImportPressed = true;

        // if (this.evaluateImportForm.get('activeSubstance').value == null || this.evaluateImportForm.get('activeSubstance').value.toString().length == 0
        //     || this.evaluateImportForm.get('activeSubstanceQuantity').value == null || this.evaluateImportForm.get('activeSubstanceQuantity').value.toString().length == 0
        //     || this.evaluateImportForm.get('activeSubstanceUnit').value == null || this.evaluateImportForm.get('activeSubstanceUnit').value.toString().length == 0
        //     || this.evaluateImportForm.get('manufactureSA').value == null || this.evaluateImportForm.get('manufactureSA').value.toString().length == 0) {
        //     return;
        // }
        this.unitOfImportPressed = false;

        this.unitOfImportTable.push({

             customsCode:       this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.customsCode').value,
             name:              this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.name').value,
             quantity:          this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.quantity').value,
             price:             this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.price').value,
             currency:          this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.currency').value,
             summ:              this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.quantity').value
                              * this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.price').value,
             producer:          this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.producer').value.description,
             producerAddress:   this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.producer').value.address
                              + ", "
                              + this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.producer').value.country.description ,
            expirationDate:     this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.expirationDate').value
        });

        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.customsCode').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.name').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.quantity').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.price').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.currency').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.summ').setValue(null);
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.producer').setValue(null);
        this.producerAddress=null;
        this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList.expirationDate').setValue(null);
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

    // loadSolicitantCompanyList() {
    //     this.subscriptions.push(
    //         this.administrationService.getAllCompanies().subscribe(data => {
    //                 this.solicitantCompanyList = data;
    //             },
    //             error => console.log(error)
    //         )
    //     )
    // }

    loadEconomicAgents() {
        this.importer =
            this.companyInputs.pipe(
                filter((result: string) => {
                    if (result && result.length > 2) return true;
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
                    if (result && result.length > 2) return true;
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
                },
                error => console.log(error)
            )
        )
    }


    nextStep() {
        this.formSubmitted = true;
        let modelToSubmit = this.evaluateImportForm.getRawValue();
       // let modelToSubmit;
        // let modelToSubmit: any ={};
        this.loadingService.show();
        // this.formModel.importAuthorizationDetailsEntityList = this.unitOfImportTable;

        // var modelToSubmit: any = this.evaluateImportForm.value;
        // let modelToSubmit: any = {};
        // let modelToSubmit = Object.assign({} );
        // modelToSubmit.requestNumber  = this.evaluateImportForm.get('requestNumber');

        // let importAuthorizationEntity: any = {};
        // importAuthorizationEntity.importAuthorizationEntityList = this.unitOfImportTable;
        // console.log("importAuthorizationEntity.importAuthorizationEntityList",importAuthorizationEntity.importAuthorizationEntityList);
        // modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = importAuthorizationEntity;


        // modelToSubmit.requestHistories.push({
        //     startDate: this.evaluateImportForm.get('data').value, endDate: new Date(),
        //     username: this.authService.getUserName(), step: 'E'
        // });

        // for(let subst of this.unitOfImportTable)
        // {
        //     subst.id = null;
        // }

//         for (let division of this.unitOfImportTable) {
//             let medicamentToSubmit: any;
//             medicamentToSubmit = Object.assign({}, this.eForm.get('medicament').value);
//             medicamentToSubmit.activeSubstances = this.activeSubstancesTable;
//             medicamentToSubmit.unitsQuantity = division.unitsQuantity;
//             medicamentToSubmit.unitsQuantityMeasurement = division.unitsQuantityMeasurement;
//             medicamentToSubmit.storageQuantity = division.storageQuantity;
//             medicamentToSubmit.storageQuantityMeasurement = division.storageQuantityMeasurement;
//             modelToSubmit.medicaments.push(medicamentToSubmit);
//             /* customsCode:
//  name:
//  quantity:
//  price:
//  currency:
//  summ:
//
//  producer:
//  producerAddress:
//
//
// expirationDate:  */
//         }

        // modelToSubmit.importAuthorizationEntity.importAuthorizationDetailsEntityList = this.unitOfImportTable;
        // console.log("modelToSubmit", modelToSubmit);
        console.log("modelToSubmit", this.importData);
        // console.log("modelToSubmit", modelToSubmit);
        this.subscriptions.push(this.requestService.addImportRequest(this.importData).subscribe(data => {
            console.log("addImportRequest(modelToSubmit).subscribe: ",data)
                this.loadingService.hide();
                this.router.navigate(['dashboard/module']);
            }, error => this.loadingService.hide())
        );

        this.formSubmitted = false;
    }


}
