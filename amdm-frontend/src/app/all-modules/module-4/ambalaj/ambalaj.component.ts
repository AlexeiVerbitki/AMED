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
    companii: any[];
    primRep: string;
    evaluateImportForm: FormGroup;
    // importTypeForm: FormGroup;
    testForm: FormGroup;
    sysDate: string;
    currentDate: Date;
    file: any;
    generatedDocNrSeq: number;
    filteredOptions: Observable<any[]>;
    formSubmitted: boolean;
    isWrongValueCompany: boolean;
    private subscriptions: Subscription[] = [];
    docs: Document [] = [];

    protected manufacturersRfPr: Observable<any[]>;
    protected loadingManufacturerRfPr: boolean = false;
    protected manufacturerInputsRfPr = new Subject<string>();

    sellerAddress: any;

    solicitantCompanyList: Observable<any[]>;
    summ: any;


    constructor(private fb: FormBuilder,
                private requestService: RequestService,
                public dialog: MatDialog,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private administrationService: AdministrationService) {

        this.evaluateImportForm = fb.group({
            'id': [''],
            'requestNumber': [null],
            'startDate': [new Date()],
            'company': ['', Validators.required],
            'currentStep': ['R'],
            'initiator': [null],
            'assignedUser': [null],
            'type':
                this.fb.group({
                    'id': ['']
                }),
            'importAuthorizationEntity': fb.group({
                // 'requestNumber': {value: '', disabled: true},
                // 'startDate': {value: '', disabled: true},
                // 'company': {value: '', disabled: true},
                'id;': [],
                'importType': [null, Validators.required],
                'applicationRegistrationNumber': [],
                'applicationDate': [new Date()],
                'applicant': ['', Validators.required],
                'seller': ['', Validators.required], // Tara si adresa lui e deja in baza
                'basisForImport': [],
                'importer': ['', Validators.required], // Tara si adresa lui e deja in baza
                'conditionsAndSpecification': [''],
                'medType': [],

                'importAuthorizationDetailsEntityList': this.fb.array([]),

                'authorizationsNumber': [], // inca nu exista la pasul acesta

            }),

        });


    }

    ngOnInit() {
        this.currentDate = new Date();
        this.sellerAddress='';
        this.loadSolicitantCompanyList();
        this.loadManufacturersRfPr();
        this.onChanges();


        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.subscriptions.push(this.requestService.getImportRequest(params['id']).subscribe(data => {
                    console.log('Import data', data);
                    // alert(params['id'])
                    // alert(data.startDate)
                    // alert(data.company)

                    this.evaluateImportForm.get('id').setValue(data.id);
                    this.evaluateImportForm.get('initiator').setValue(data.initiator);
                    this.evaluateImportForm.get('assignedUser').setValue(data.assignedUser);
                    this.evaluateImportForm.get('requestNumber').setValue(data.requestNumber);
                    this.evaluateImportForm.get('startDate').setValue(new Date(data.startDate));
                    this.evaluateImportForm.get('company').setValue(data.company);

                },
                error => console.log(error)
            ))
        }))


    }

    onChanges(): void {
        this.evaluateImportForm.get('importAuthorizationEntity.seller').valueChanges.subscribe(val=>{
            if(val){
                this.sellerAddress=val.address;
                // this.evaluateImportForm.get('importAuthorizationEntity.adresa').setValue("test")
            }
        })
    }

    get importTypeForms() {
        return this.evaluateImportForm.get('importAuthorizationEntity.importAuthorizationDetailsEntityList') as FormArray
    }

    addImportTypeForm() {
        console.log("before");

        const importTypeForm = this.fb.group({
            customsCode: [],
            name: [],
            quantity: [],
            price: [''],
            currency: [],
            summ: [],

            producer: [],
            expirationDate: [],

        })

        // alert(importTypeForm.value)
        this.importTypeForms.push(importTypeForm);
        console.log("after")
        console.log(importTypeForm.value)
        console.log(this.importTypeForms.value)

    }


    deleteImportTypeForm(i) {
        this.importTypeForms.removeAt(i)
    }

    //=============================

    loadSolicitantCompanyList() {
        this.subscriptions.push(
            this.administrationService.getAllCompanies().subscribe(data => {
                    this.solicitantCompanyList = data;
                },
                error => console.log(error)
            )
        )
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


    nextStep() {
        let formModel = this.evaluateImportForm.getRawValue();
        console.log(formModel);
    }


}
