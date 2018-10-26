import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {RequestService} from "../../../shared/service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Document} from "../../../models/document";
import {AdministrationService} from "../../../shared/service/administration.service";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";
import {AuthService} from "../../../shared/service/authetication.service";
import {DocumentService} from "../../../shared/service/document.service";
import {PaymentOrder} from "../../../models/paymentOrder";
import {Receipt} from "../../../models/receipt";
import {ModalService} from "../../../shared/service/modal.service";

@Component({
    selector: 'app-evaluare-primara',
    templateUrl: './evaluare-primara.component.html',
    styleUrls: ['./evaluare-primara.component.css']
})
export class EvaluarePrimaraComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    eForm: FormGroup;
    documents: Document [] = [];
    company: any;
    // isWrongValuePharmaceuticalFormType: boolean;
    // isWrongValuePharmaceuticalForm: boolean;
    // isWrongValueActiveSubstance: boolean;
    formSubmitted: boolean;
    isAddSubstancePressed: boolean;
    paymentTotal : number;

    pharmaceuticalForms: any[];
    pharmaceuticalFormTypes: any[];
    activeSubstances: any[];
    activeSubstancesTable: any[] = [];
    unitsOfMeasurement: any[];
    internationalNames: any[];
    medicamentTypes: any[];
    manufactures: any[];
    manufactureAuthorizations: any[];
    docTypes: any[];
    paymentOrdersList: PaymentOrder[] = [];
    receiptsList: Receipt[] = [];
    // filteredFormTypes: Observable<any[]>;
    // filteredForms: Observable<any[]>;
    // filteredActiveSubstances: Observable<any[]>;


    constructor(public dialog: MatDialog,
                private fb: FormBuilder,
                private requestService: RequestService,
                private administrationService: AdministrationService,
                private documentService: DocumentService,
                private authService: AuthService,
                private modalService: ModalService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.eForm = fb.group({
            'id': [],
            'data': {disabled: true, value: new Date()},
            'requestNumber': [null],
            'startDate': [],
          //  'dataToSaveInStartDateRequestHistory': [''],
            'currentStep': ['A'],
            'medicament':
                fb.group({
                    'id': [],
                    'name': ['', Validators.required],
                    'company': ['', Validators.required],
                    'registrationDate': [],
                    'companyValue': [''],
                    'pharmaceuticalForm': [null, Validators.required],
                    'pharmaceuticalFormType': [null, Validators.required],
                    'dose': [null, Validators.required],
                    'unitsOfMeasurement': [null, Validators.required],
                    'internationalMedicamentName': [null, Validators.required],
                    'volume': [null],
                    'termsOfValidity': [null, Validators.required],
                    'code': [null, Validators.required],
                    'medicamentType': [null, Validators.required],
                    'storageQuantityMeasurement': [null, Validators.required],
                    'storageQuantity': [null, Validators.required],
                    'unitsQuantityMeasurement': [null, Validators.required],
                    'unitsQuantity': [null, Validators.required],
                    'prescription': [null, Validators.required],
                    'authorizationHolder': [null, Validators.required],
                    'authorizationHolderCountry': [null],
                    'authorizationHolderAddress': [null],
                    'manufacture': [null],
                    'manufactureMedCountry': [null],
                    'manufactureMedAddress': [null],
                    'documents': [],
                    'status': ['P'],
                    'group':
                        fb.group({
                                'code': ['', Validators.required]
                            }
                        )
                }),
            'company': [''],
            'recetaType': [''],
            'medicamentGroup': [''],
            'activeSubstance': [null],
            'activeSubstanceCode': [''],
            'activeSubstanceQuantity': [null],
            'activeSubstanceUnit': [null],
            'manufactureSA': [null],
            'manufactureCountrySA': [null],
            'manufactureAddressSA': [null],
            'type': [],
            'typeValue': {disabled: true, value: null},
            'requestHistories': [],
        });
    }

    ngOnInit() {
        this.modalService.data.next('');
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
                this.subscriptions.push(this.requestService.getMedicamentRequest(params['id']).subscribe(data => {
                        this.eForm.get('medicament.id').setValue(data.medicament.id);
                        this.eForm.get('id').setValue(data.id);
                        this.eForm.get('startDate').setValue(data.startDate);
                        this.eForm.get('requestNumber').setValue(data.requestNumber);
                        this.eForm.get('medicament.company').setValue(data.medicament.company);
                        this.eForm.get('medicament.companyValue').setValue(data.medicament.company.name);
                        this.eForm.get('company').setValue(data.medicament.company);
                        this.eForm.get('medicament.name').setValue(data.medicament.name);
                        this.eForm.get('medicament.documents').setValue(data.medicament.documents);
                        this.eForm.get('medicament.registrationDate').setValue(data.medicament.registrationDate);
                        this.eForm.get('type').setValue(data.type);
                        this.eForm.get('requestHistories').setValue(data.requestHistories);
                        this.eForm.get('typeValue').setValue(data.type.code);
                        // var reqHist = data.requestHistories.reduce((p, n) => p.id < n.id ? p : n);
                        // this.eForm.get('dataToSaveInStartDateRequestHistory').setValue(reqHist.endDate);
                        this.company = data.medicament.company;
                        this.documents = data.medicament.documents;
                        this.documents.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
                        let xs = this.documents;
                        xs = xs.map(x => {
                            x.isOld = true;
                            return x;
                        });
                    })
                );
            })
        );

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormTypes().subscribe(data => {
                    this.pharmaceuticalFormTypes = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllActiveSubstances().subscribe(data => {
                    this.activeSubstances = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllUnitsOfMeasurement().subscribe(data => {
                    this.unitsOfMeasurement = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllInternationalNames().subscribe(data => {
                    this.internationalNames = data;
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllMedicamentTypes().subscribe(data => {
                    this.medicamentTypes = data;
                    this.medicamentTypes = this.medicamentTypes.filter(r => r.category === 'M');
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllManufactures().subscribe(data => {
                    this.manufactures = data;
                    this.manufactureAuthorizations = this.manufactures.filter(r => r.authorizationHolder == 1);
                },
                error => console.log(error)
            )
        );

        this.subscriptions.push(
            this.administrationService.getAllDocTypes().subscribe(data => {
                    this.docTypes = data;
                    this.docTypes = this.docTypes.filter(r => r.category === 'DD');
                },
                error => console.log(error)
            )
        );
    }

    // private _filter(name: string, values: any[]): any[] {
    //     const filterValue = name.toLowerCase();
    //     return values.filter(option => option.description.toLowerCase().includes(filterValue));
    // }

    checkPharmaceuticalFormTypeValue() {

        if (this.eForm.get('medicament.pharmaceuticalFormType').value == null) {
            return;
        }

        this.subscriptions.push(
            this.administrationService.getAllPharamceuticalFormsByTypeId(this.eForm.get('medicament.pharmaceuticalFormType').value.id).subscribe(data => {
                    this.eForm.get('medicament.pharmaceuticalForm').setValue('');
                    this.pharmaceuticalForms = data;
                },
                error => console.log(error)
            )
        );
    }

    fillAutorizationHolderDetails() {
        if (this.eForm.get('medicament.authorizationHolder').value == null) {
            return;
        }

        this.eForm.get('medicament.authorizationHolderCountry').setValue(this.eForm.get('medicament.authorizationHolder').value.country.description);
        this.eForm.get('medicament.authorizationHolderAddress').setValue(this.eForm.get('medicament.authorizationHolder').value.address);
    }

    fillManufactureDetails() {
        if (this.eForm.get('medicament.manufacture').value == null) {
            return;
        }

        this.eForm.get('medicament.manufactureMedCountry').setValue(this.eForm.get('medicament.manufacture').value.country.description);
        this.eForm.get('medicament.manufactureMedAddress').setValue(this.eForm.get('medicament.manufacture').value.address);
    }

    checkActiveSubstanceValue() {
        if (this.eForm.get('activeSubstance').value == null) {
            return;
        }

        this.eForm.get('activeSubstanceCode').setValue(this.eForm.get('activeSubstance').value.code);
        this.eForm.get('manufactureSA').setValue(this.eForm.get('activeSubstance').value.manufacture.description);
        this.eForm.get('manufactureCountrySA').setValue(this.eForm.get('activeSubstance').value.manufacture.country.description);
        this.eForm.get('manufactureAddressSA').setValue(this.eForm.get('activeSubstance').value.manufacture.address);
    }

    nextStep() {
        this.formSubmitted = true;

        if (this.eForm.invalid || this.activeSubstancesTable.length == 0 || this.paymentTotal<0) {
            return;
        }

        this.formSubmitted = false;

        let modelToSubmit: any = this.eForm.value;
        modelToSubmit.requestHistories.push({
            startDate: this.eForm.get('data').value, endDate: new Date(),
            username: this.authService.getUserName(), step: 'E'
        });

        modelToSubmit.medicament.activeSubstances = [];
        for (let as of this.activeSubstancesTable) {
            modelToSubmit.medicament.activeSubstances.push({
                activeSubstance: as.activeSubstance,
                quantity: as.quantity,
                unitsOfMeasurement: as.unitsOfMeasurement
            });
        }

        modelToSubmit.medicament.paymentOrders = this.paymentOrdersList;
        modelToSubmit.medicament.receipts = this.receiptsList;

        this.subscriptions.push(this.documentService.generateDistributionDisposition(this.eForm.get('requestNumber').value).subscribe(res => {
                modelToSubmit.medicament.documents.push({
                    name: res.substring(res.lastIndexOf('/') + 1),
                    docType : this.docTypes[0],
                    date: new Date(),
                    path: res
                });

                this.subscriptions.push(this.requestService.addMedicamentRequest(modelToSubmit).subscribe(data => {
                        console.log("succes");
                        this.router.navigate(['dashboard/module/medicament-registration/samsa/' + data.body]);
                    }, error => console.log(error))
                );
            }, error => console.log(error))
        );

    }

    addActiveSubstance() {
        this.isAddSubstancePressed = true;

        if (this.eForm.get('activeSubstance').value == null || this.eForm.get('activeSubstance').value.toString().length == 0
            || this.eForm.get('activeSubstanceQuantity').value == null || this.eForm.get('activeSubstanceQuantity').value.toString().length == 0
            || this.eForm.get('activeSubstanceUnit').value == null || this.eForm.get('activeSubstanceUnit').value.toString().length == 0) {
            return;
        }
        this.isAddSubstancePressed = false;

        this.activeSubstancesTable.push({
            activeSubstance: this.eForm.get('activeSubstance').value,
            quantity: this.eForm.get('activeSubstanceQuantity').value,
            unitsOfMeasurement: this.eForm.get('activeSubstanceUnit').value,
            manufacture: this.eForm.get('activeSubstance').value.manufacture
        });

        this.eForm.get('activeSubstance').setValue(null);
        this.eForm.get('activeSubstanceQuantity').setValue(null);
        this.eForm.get('activeSubstanceUnit').setValue(null);
        this.eForm.get('activeSubstanceCode').setValue(null);
        this.eForm.get('manufactureSA').setValue(null);
        this.eForm.get('manufactureCountrySA').setValue(null);
        this.eForm.get('manufactureAddressSA').setValue(null);
    }

    removeSubstance(index: number) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'Sunteti sigur ca doriti sa stergeti aceasta substanta?', confirm: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.activeSubstancesTable.splice(index, 1);
            }
        });
    }

    paymentTotalUpdate(event) {
        this.paymentTotal = event.valueOf();
    }

}